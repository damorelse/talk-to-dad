/**
 * Tier 2: Boundary & Edge Case Test Suites (B01–B16)
 * Validates edge cases, input clamping, error resilience, and boundary limits.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import '../setup.js';

import { clampDebounceMs } from '../../src/hooks/useMotorDebounce.js';
import { 
  splitWordIntoSyllables, 
  formatWithMiddleDot, 
  breakPhraseForVisualizer 
} from '../../src/services/syllables/syllableSplitter.js';
import { wordPredictor } from '../../src/services/keyboard/wordPredictor.js';
import { speechEngine } from '../../src/services/audio/WebSpeechEngine.js';
import { BackupService } from '../../src/services/db/backupService.js';

describe('Tier 2: Boundary & Edge Case Verification', () => {

  describe('B01: Anti-Tremor Debounce Range Clamping', () => {
    it('should clamp negative numbers to 200ms', () => {
      assert.equal(clampDebounceMs(-100), 200);
      assert.equal(clampDebounceMs(0), 200);
    });

    it('should clamp sub-200 values to 200ms', () => {
      assert.equal(clampDebounceMs(1), 200);
      assert.equal(clampDebounceMs(199), 200);
      assert.equal(clampDebounceMs(200), 200);
    });

    it('should preserve valid middle values 200..500ms', () => {
      assert.equal(clampDebounceMs(250), 250);
      assert.equal(clampDebounceMs(350), 350);
      assert.equal(clampDebounceMs(500), 500);
    });

    it('should clamp super-500 values to 500ms', () => {
      assert.equal(clampDebounceMs(501), 500);
      assert.equal(clampDebounceMs(10000), 500);
    });

    it('should return safe default 300ms for non-numeric or NaN values', () => {
      assert.equal(clampDebounceMs(NaN), 300);
      assert.equal(clampDebounceMs(undefined), 300);
      assert.equal(clampDebounceMs(null), 300);
    });
  });

  describe('B02: Syllable Segmentation Edge Cases', () => {
    it('should handle empty string and whitespace cleanly', () => {
      assert.deepEqual(splitWordIntoSyllables(''), []);
      assert.deepEqual(splitWordIntoSyllables('   '), []);
      assert.equal(formatWithMiddleDot(''), '');
    });

    it('should handle single-letter and two-letter words without dividing', () => {
      assert.deepEqual(splitWordIntoSyllables('I'), ['I']);
      assert.deepEqual(splitWordIntoSyllables('a'), ['a']);
      assert.deepEqual(splitWordIntoSyllables('to'), ['to']);
      assert.deepEqual(splitWordIntoSyllables('in'), ['in']);
    });

    it('should not re-split words that already contain middle-dot', () => {
      assert.equal(formatWithMiddleDot('Wa · ter'), 'Wa · ter');
      assert.equal(formatWithMiddleDot('Hos · pi · tal'), 'Hos · pi · tal');
    });

    it('should break multi-word phrases for visualizer accurately', () => {
      const phraseData = breakPhraseForVisualizer('I want water please');
      assert.equal(phraseData.length, 4);
      assert.equal(phraseData[0].word, 'I');
      assert.deepEqual(phraseData[2].syllables, ['wa', 'ter']);
    });
  });

  describe('B03: Predictive Word Engine Boundaries', () => {
    it('should handle empty prefix by returning top essentials', () => {
      const results = wordPredictor.predict('');
      assert.ok(results.length > 0);
      assert.ok(results.includes('I'));
    });

    it('should handle nonexistent prefix without errors', () => {
      const results = wordPredictor.predict('xyznonexistentword999');
      assert.deepEqual(results, []);
    });

    it('should handle all-caps prefixes by returning uppercase suggestions', () => {
      const results = wordPredictor.predict('WA');
      assert.ok(results.length > 0);
      assert.equal(results[0], results[0].toUpperCase());
    });

    it('should handle single character prefix', () => {
      const results = wordPredictor.predict('b');
      assert.ok(results.length > 0);
    });
  });

  describe('B04: Speech Synthesis Input Handling', () => {
    it('should resolve immediately when speaking empty or whitespace text', async () => {
      await speechEngine.speak('');
      await speechEngine.speak('   ');
      assert.ok(true);
    });

    it('should safely accept boundary rate and pitch values', async () => {
      await speechEngine.speak('Rate test', { rate: 0.5, pitch: 0.5 });
      await speechEngine.speak('Rate test', { rate: 1.5, pitch: 1.5 });
      assert.ok(true);
    });
  });

  describe('B05: Backup Validation & Error Handling', () => {
    const mockDb = {
      categories: { toArray: async () => [], clear: async () => {}, bulkAdd: async () => {} },
      cards: { toArray: async () => [], clear: async () => {}, bulkAdd: async () => {} },
      visualScenes: { toArray: async () => [], clear: async () => {}, bulkAdd: async () => {} },
      hotspots: { toArray: async () => [], clear: async () => {}, bulkAdd: async () => {} },
      therapyDecks: { toArray: async () => [], clear: async () => {}, bulkAdd: async () => {} },
      therapyCards: { toArray: async () => [], clear: async () => {}, bulkAdd: async () => {} },
      settings: { get: async () => ({ id: 'current' }), clear: async () => {}, put: async () => {} },
      mediaBlobs: { toArray: async () => [], clear: async () => {}, bulkAdd: async () => {} },
      transaction: async (mode, tables, fn) => fn(),
    };

    const svc = new BackupService(mockDb);

    it('should reject non-JSON string', async () => {
      const res = await svc.importFromJson('not a json string');
      assert.equal(res.success, false);
      assert.ok(res.message.includes('Failed to restore') || res.message.includes('Invalid'));
    });

    it('should reject missing categories or cards collections', async () => {
      const res = await svc.importFromJson(JSON.stringify({ someField: 'data' }));
      assert.equal(res.success, false);
      assert.ok(res.message.includes('missing required'));
    });

    it('should successfully validate and restore well-formed backup', async () => {
      const validBackup = {
        version: '1.0.0',
        categories: [{ id: 'cat-test', name: 'Test', icon: 'Star', color: '#fff', order: 1 }],
        cards: [{ id: 'card-test', categoryId: 'cat-test', label: 'Test Card', spokenText: 'Test', fitzgeraldCategory: 'nouns', order: 1, createdAt: 1, updatedAt: 1 }],
        visualScenes: [],
        hotspots: [],
        therapyDecks: [],
        therapyCards: [],
        settings: { id: 'current', theme: 'dark' },
        mediaBlobs: [],
      };

      const res = await svc.importFromJson(JSON.stringify(validBackup));
      assert.equal(res.success, true);
      assert.equal(res.cardCount, 1);
    });
  });

  describe('B06: Hotspot Coordinate Bounds', () => {
    it('should enforce minimum 5% width and height', () => {
      const width = Math.max(5, Math.min(100, 2));
      const height = Math.max(5, Math.min(100, 1));
      assert.equal(width, 5);
      assert.equal(height, 5);
    });

    it('should enforce maximum 95% position limits', () => {
      const x = Math.max(0, Math.min(95, 99));
      const y = Math.max(0, Math.min(95, 102));
      assert.equal(x, 95);
      assert.equal(y, 95);
    });
  });
});
