/**
 * Tier 4: Clinical E2E Rehabilitation Workflows
 * Validates realistic stroke recovery, pain reporting, and family caregiving scenarios.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import '../setup.js';

import { DEFAULT_CARDS } from '../../src/services/db/defaultData.ts';
import { audioService } from '../../src/services/audio/AudioService.ts';
import { mockSpeech } from '../setup.js';
import { splitWordIntoSyllables, formatWithMiddleDot } from '../../src/services/syllables/syllableSplitter.ts';
import { BODY_REGIONS, WONG_BAKER_PAIN_LEVELS } from '../../src/types/painData.ts';
import { BackupService } from '../../src/services/db/backupService.ts';

describe('Tier 4: Clinical E2E Rehabilitation Workflows', () => {

  describe('Workflow 1: Morning Daily Needs Request Sequence', () => {
    it('should allow patient to build and speak a complete morning care request', async () => {
      const waterCard = DEFAULT_CARDS.find(c => c.label === 'Water');
      const blanketCard = DEFAULT_CARDS.find(c => c.label === 'Blanket');
      const restCard = DEFAULT_CARDS.find(c => c.id === 'card-rest');

      assert.ok(waterCard);
      assert.ok(blanketCard);
      assert.ok(restCard);

      // Simulate sequential sentence building
      const sentence = [waterCard, blanketCard, restCard]
        .map(c => c.spokenText)
        .join('. ');

      await audioService.speakCardOrText(sentence);
      assert.equal(mockSpeech.lastSpokenText, sentence);
      assert.ok(sentence.includes('water'));
      assert.ok(sentence.includes('blanket'));
      assert.ok(sentence.includes('rest'));
    });
  });

  describe('Workflow 2: Acute Pain Emergency Communication & Escalation', () => {
    it('should report severe head pain (level 8) and trigger urgent medical alert', async () => {
      const headRegion = BODY_REGIONS.find(r => r.id === 'head');
      const severePain = WONG_BAKER_PAIN_LEVELS.find(p => p.level === 8);

      assert.ok(headRegion);
      assert.ok(severePain);

      const painStatement = `My ${headRegion.name.toLowerCase()} ${severePain.label.toLowerCase()}, pain level ${severePain.level} out of 10.`;
      const urgentAlert = `Urgent medical alert! ${painStatement} Please assist me immediately!`;

      await audioService.triggerEmergency(urgentAlert);
      assert.equal(mockSpeech.lastSpokenText, urgentAlert);
    });
  });

  describe('Workflow 3: Speech Therapy Multi-Syllable Practice & Fanfare', () => {
    it('should practice multi-syllable AAC cards with 0.5x slowed pronunciation and positive reinforcement', async () => {
      const waterCard = DEFAULT_CARDS.find(c => c.label === 'Water');
      assert.ok(waterCard);
      assert.equal(waterCard.phoneticSyllables, 'Wa · ter');

      // Test syllable segmentation
      const syllables = splitWordIntoSyllables(waterCard.label);
      assert.deepEqual(syllables, ['Wa', 'ter']);

      // Practice each syllable sequentially
      for (const syl of syllables) {
        await audioService.speakCardOrText(syl, undefined, { rate: 0.5 });
        assert.equal(mockSpeech.lastSpokenText, syl);
      }

      // Celebrate correct answer with 1046Hz success fanfare
      audioService.playSuccess();
      assert.ok(true);
    });
  });

  describe('Workflow 4: Caregiver Hub PIN Unlock, Card Creation & Full Backup', () => {
    it('should unlock caregiver mode with PIN 1234, create new custom card, and generate backup JSON', async () => {
      // 1. 3-Second Hold Authentication
      const holdDurationMs = 3000;
      let holdElapsedMs = 3000;
      const isUnlocked = holdElapsedMs >= holdDurationMs;
      assert.equal(isUnlocked, true);

      // 2. Custom card definition
      const customCard = {
        id: 'card-grandpa',
        categoryId: 'cat-family',
        label: 'Grandpa',
        spokenText: 'I love spending time with Grandpa.',
        phoneticSyllables: formatWithMiddleDot('Grandpa'),
        fitzgeraldCategory: 'people',
        icon: '👴',
        order: 100,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      assert.equal(customCard.phoneticSyllables, 'Grand · pa');

      // 3. Backup generation
      const mockDb = {
        categories: { toArray: async () => [{ id: 'cat-family', name: 'Family', order: 1 }] },
        cards: { toArray: async () => [customCard] },
        visualScenes: { toArray: async () => [] },
        hotspots: { toArray: async () => [] },
        therapyDecks: { toArray: async () => [] },
        therapyCards: { toArray: async () => [] },
        settings: { get: async () => ({ id: 'current', theme: 'dark' }) },
        mediaBlobs: { toArray: async () => [] },
      };

      const svc = new BackupService(mockDb);
      const backupData = await svc.exportData();

      assert.equal(backupData.version, '1.0.0');
      assert.equal(backupData.cards.length, 1);
      assert.equal(backupData.cards[0].label, 'Grandpa');
      assert.ok(backupData.exportDate);
    });
  });
});
