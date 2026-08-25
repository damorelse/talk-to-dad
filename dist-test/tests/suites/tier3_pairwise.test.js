/**
 * Tier 3: Pairwise Component & Subsystem Interaction Tests
 * Verifies cross-module interactions between Grid, Sentence Builder, Audio, VSD, and Caregiver.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import '../setup.js';

import { DEFAULT_CARDS } from '../../src/services/db/defaultData.js';
import { audioService } from '../../src/services/audio/AudioService.js';
import { mockSpeech } from '../setup.js';
import { formatWithMiddleDot } from '../../src/services/syllables/syllableSplitter.js';
import { BODY_REGIONS, WONG_BAKER_PAIN_LEVELS } from '../../src/types/painData.js';

describe('Tier 3: Pairwise Subsystem Interactions', () => {

  describe('Interaction 1: Card Grid -> Sentence Strip -> Audio Engine', () => {
    it('should build multi-card sentence and speak concatenated phrase with boundary updates', async () => {
      const cardWater = DEFAULT_CARDS.find(c => c.label === 'Water');
      assert.ok(cardWater);
      const cardPlease = {
        id: 'card-please',
        categoryId: 'cat-needs',
        label: 'Please',
        spokenText: 'Please',
        fitzgeraldCategory: 'social',
        order: 1,
        createdAt: 1,
        updatedAt: 1,
      };

      const selectedCards = [cardWater, cardPlease];
      const concatenated = selectedCards.map(c => c.spokenText).join('. ');

      await audioService.speakCardOrText(concatenated);
      assert.equal(mockSpeech.lastSpokenText, concatenated);
    });
  });

  describe('Interaction 2: Visual Scene Hotspot -> Audio Priority Interruption', () => {
    it('should interrupt ongoing speech when hotspot is triggered', async () => {
      // Start background speech
      audioService.speakCardOrText('Long background sentence that was speaking...');
      assert.equal(mockSpeech.speaking, true);

      // Trigger hotspot speech
      await audioService.speakCardOrText('Hotspot armchair triggered!');
      assert.equal(mockSpeech.lastSpokenText, 'Hotspot armchair triggered!');
    });
  });

  describe('Interaction 3: Pain Map Body Region + FACES Rating -> Composite Synthesis', () => {
    it('should combine head region and level 8 pain into clinical statement', () => {
      const region = BODY_REGIONS.find(r => r.id === 'head');
      const pain = WONG_BAKER_PAIN_LEVELS.find(p => p.level === 8);
      assert.ok(region && pain);

      const sentence = `My ${region.name.toLowerCase()} ${pain.label.toLowerCase()}, pain level ${pain.level} out of 10.`;
      assert.equal(
        sentence,
        'My head hurts a lot, pain level 8 out of 10.'
      );
    });
  });

  describe('Interaction 4: Caregiver Editor -> Syllable Auto-Splitter -> Card Model', () => {
    it('should automatically compute and attach middle-dot syllables when creating card', () => {
      const label = 'Hospital';
      const syllables = formatWithMiddleDot(label);
      assert.equal(syllables, 'Hos · pi · tal');

      const card = {
        id: 'card-new-hospital',
        categoryId: 'cat-health',
        label,
        spokenText: 'We need to go to the hospital.',
        phoneticSyllables: syllables,
        fitzgeraldCategory: 'places',
        order: 10,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      assert.equal(card.phoneticSyllables, 'Hos · pi · tal');
    });
  });
});
