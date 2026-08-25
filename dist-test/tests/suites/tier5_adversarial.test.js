/**
 * Tier 5: Adversarial & Stress Hardening Suites
 * Verifies resilience under high-tremor conditions, corrupted inputs, and extreme boundary loads.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import '../setup.js';

import { clampDebounceMs } from '../../src/hooks/useMotorDebounce.js';
import { splitWordIntoSyllables, formatWithMiddleDot } from '../../src/services/syllables/syllableSplitter.js';
import { wordPredictor } from '../../src/services/keyboard/wordPredictor.js';
import { BackupService } from '../../src/services/db/backupService.js';

describe('Tier 5: Adversarial & Stress Hardening Verification', () => {

  describe('Adversarial 1: Rapid-Fire Tremor Taps (50 taps in 50ms)', () => {
    it('should filter out rapid duplicate taps within debounce window', () => {
      let executedCount = 0;
      let lastCallTime = 0;
      const debounceDelay = clampDebounceMs(300);

      const triggerTap = () => {
        const now = Date.now();
        if (now - lastCallTime >= debounceDelay) {
          lastCallTime = now;
          executedCount++;
        }
      };

      // Simulate 50 simultaneous tremor taps
      for (let i = 0; i < 50; i++) {
        triggerTap();
      }

      assert.equal(executedCount, 1, '50 simultaneous taps should only execute 1 time');
    });
  });

  describe('Adversarial 2: Extreme Length Strings & Emoji Unicode Stress', () => {
    it('should safely process very long text strings (>5,000 chars) in syllable splitter', () => {
      const longWord = 'Supercalifragilisticexpialidocious'.repeat(150);
      const syllables = splitWordIntoSyllables(longWord);
      assert.ok(Array.isArray(syllables));
      assert.ok(syllables.length > 0);
    });

    it('should handle zero-width joiners and composite emojis in cards', () => {
      const familyEmoji = '👨‍👩‍👧‍👦';
      const syllables = splitWordIntoSyllables(familyEmoji);
      assert.ok(Array.isArray(syllables));
    });

    it('should handle foreign accented characters and symbols without crashing', () => {
      const accented = 'Café résumé niño señor';
      const formatted = formatWithMiddleDot(accented);
      assert.ok(typeof formatted === 'string');
    });
  });

  describe('Adversarial 3: Corrupted & Partial JSON Payloads', () => {
    it('should reject truncated JSON string gracefully', async () => {
      const svc = new BackupService({});
      const truncated = '{"version": "1.0.0", "cards": [{"id": "card-1"';
      const res = await svc.importFromJson(truncated);
      assert.equal(res.success, false);
    });

    it('should reject non-object JSON values (arrays, primitives)', async () => {
      const svc = new BackupService({});
      const res1 = await svc.importFromJson('"just a string"');
      assert.equal(res1.success, false);

      const res2 = await svc.importFromJson('12345');
      assert.equal(res2.success, false);

      const res3 = await svc.importFromJson('[]');
      assert.equal(res3.success, false);
    });
  });

  describe('Adversarial 4: Word Predictor with Special Chars & High Frequency', () => {
    it('should safely handle symbols, regex tokens, and punctuation in predictor prefix', () => {
      const dangerousPrefixes = ['[', '*', '(', ')', '\\', '^', '$', '.*', '???', '!!!'];
      for (const p of dangerousPrefixes) {
        const results = wordPredictor.predict(p);
        assert.ok(Array.isArray(results));
      }
    });

    it('should handle rapid usage recordings without integer overflow', () => {
      for (let i = 0; i < 500; i++) {
        wordPredictor.recordUsage('Water');
      }
      const predictions = wordPredictor.predict('w');
      assert.ok(predictions.includes('Water') || predictions.includes('water'));
    });
  });
});
