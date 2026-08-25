/**
 * Unit Test Suite: Weekly Deterministic Card Selector (R2)
 * 
 * Verifies ISO 8601 calendar week key calculation, FNV-1a string hashing,
 * Mulberry32 PRNG, deterministic 5-card weekly selection, stability across
 * all 7 days of the calendar week, rotation across week boundaries, and
 * graceful handling of categories with <= 5 cards.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import './setup.js';

import type { AACCard } from '../src/types/index.ts';
import {
  getISOWeekKey,
  hashString,
  createMulberry32,
  getWeeklyCardsForCategory,
  selectWeeklyCards,
} from '../src/services/therapy/weeklyCardSelector.ts';

describe('Weekly Card Selector Engine (R2)', () => {

  // =========================================================================
  // 1. ISO 8601 Calendar Week Key Calculation
  // =========================================================================
  describe('1. ISO 8601 Calendar Week Calculation (getISOWeekKey)', () => {
    it('should compute the correct ISO week key for standard dates (e.g. 2026-08-25 -> 2026-W35)', () => {
      const key = getISOWeekKey('2026-08-25T12:00:00Z');
      assert.equal(key, '2026-W35');
    });

    it('should maintain the exact same week key for all 7 days of a calendar week (Monday to Sunday)', () => {
      // 2026 Week 35: Monday 2026-08-24 through Sunday 2026-08-30
      const days = [
        '2026-08-24T00:00:00Z', // Monday
        '2026-08-25T12:00:00Z', // Tuesday
        '2026-08-26T08:30:00Z', // Wednesday
        '2026-08-27T18:00:00Z', // Thursday
        '2026-08-28T23:59:59Z', // Friday
        '2026-08-29T10:00:00Z', // Saturday
        '2026-08-30T23:59:59Z', // Sunday
      ];

      for (const d of days) {
        const key = getISOWeekKey(d);
        assert.equal(key, '2026-W35', `Failed for day ${d}`);
      }
    });

    it('should roll over to the next week key on Monday of the following week', () => {
      const sundayKey = getISOWeekKey('2026-08-30T23:59:59Z');
      const mondayKey = getISOWeekKey('2026-08-31T00:00:01Z');
      assert.equal(sundayKey, '2026-W35');
      assert.equal(mondayKey, '2026-W36');
    });

    it('should correctly handle year-end boundary where Jan 1 belongs to Week 53 of prior year', () => {
      // 2021-01-01 was Friday; Week 1 of 2021 started Monday 2021-01-04. Jan 1 belongs to 2020-W53.
      const key = getISOWeekKey('2021-01-01T12:00:00Z');
      assert.equal(key, '2020-W53');
    });

    it('should correctly handle year-end boundary where Dec 31 belongs to Week 1 of next year', () => {
      // 2024-12-31 was Tuesday; Thursday of that week was 2025-01-02. Week is 2025-W01.
      const key = getISOWeekKey('2024-12-31T12:00:00Z');
      assert.equal(key, '2025-W01');
    });

    it('should correctly handle standard Jan 1 starting Week 1 (e.g. 2026-01-01 is Thursday -> 2026-W01)', () => {
      const key = getISOWeekKey('2026-01-01T12:00:00Z');
      assert.equal(key, '2026-W01');
    });

    it('should correctly handle leap year February 29 dates', () => {
      const key2024 = getISOWeekKey('2024-02-29T12:00:00Z');
      assert.equal(key2024, '2024-W09');

      const key2028 = getISOWeekKey('2028-02-29T12:00:00Z');
      assert.equal(key2028, '2028-W09');
    });

    it('should accept Date instances, timestamps, and string dates interchangeably', () => {
      const dateObj = new Date('2026-08-25T12:00:00Z');
      const timestamp = dateObj.getTime();
      const dateStr = '2026-08-25';

      const keyObj = getISOWeekKey(dateObj);
      const keyTs = getISOWeekKey(timestamp);
      const keyStr = getISOWeekKey(dateStr);

      assert.equal(keyObj, '2026-W35');
      assert.equal(keyTs, '2026-W35');
      assert.equal(keyStr, '2026-W35');
    });

    it('should safely default to current week when dateInput is omitted or invalid', () => {
      const keyDefault = getISOWeekKey();
      assert.ok(/^20\d{2}-W\d{2}$/.test(keyDefault), `Expected valid week key format, got ${keyDefault}`);

      const keyInvalid = getISOWeekKey('not-a-valid-date');
      assert.ok(/^20\d{2}-W\d{2}$/.test(keyInvalid), `Expected valid fallback week key, got ${keyInvalid}`);
    });
  });

  // =========================================================================
  // 2. Hash Function & PRNG Determinism
  // =========================================================================
  describe('2. Deterministic Hash & PRNG (hashString & createMulberry32)', () => {
    it('should produce identical 32-bit unsigned hashes for identical string inputs', () => {
      const hash1 = hashString('2026-W35:cat-needs');
      const hash2 = hashString('2026-W35:cat-needs');
      assert.equal(hash1, hash2);
      assert.ok(Number.isInteger(hash1));
      assert.ok(hash1 >= 0 && hash1 <= 4294967295);
    });

    it('should produce distinct hashes for different categories and weeks', () => {
      const hashNeeds = hashString('2026-W35:cat-needs');
      const hashFood = hashString('2026-W35:cat-food');
      const hashNextWeek = hashString('2026-W36:cat-needs');

      assert.notEqual(hashNeeds, hashFood);
      assert.notEqual(hashNeeds, hashNextWeek);
    });

    it('should generate identical pseudo-random sequences from identical seeds', () => {
      const prng1 = createMulberry32(123456789);
      const prng2 = createMulberry32(123456789);

      const seq1 = [prng1(), prng1(), prng1(), prng1(), prng1()];
      const seq2 = [prng2(), prng2(), prng2(), prng2(), prng2()];

      assert.deepEqual(seq1, seq2);
      for (const val of seq1) {
        assert.ok(val >= 0 && val < 1.0, `PRNG value out of [0, 1) range: ${val}`);
      }
    });

    it('should generate different pseudo-random sequences from different seeds', () => {
      const prngA = createMulberry32(100);
      const prngB = createMulberry32(200);

      const seqA = [prngA(), prngA(), prngA()];
      const seqB = [prngB(), prngB(), prngB()];

      assert.notDeepEqual(seqA, seqB);
    });
  });

  // =========================================================================
  // 3. Deterministic Weekly 5-Card Selection Engine
  // =========================================================================
  describe('3. Deterministic Weekly Card Selector (getWeeklyCardsForCategory)', () => {
    // Helper to generate a test deck of cards
    const createTestDeck = (categoryId: string, count: number): AACCard[] => {
      const cards: AACCard[] = [];
      for (let i = 1; i <= count; i++) {
        cards.push({
          id: `card-${categoryId}-${i}`,
          categoryId,
          label: `Card ${i}`,
          spokenText: `Speaking card ${i}`,
          clue: `Clue for card ${i}`,
          clueZh: `卡片 ${i} 的提示`,
          fitzgeraldCategory: 'nouns',
          order: i,
          createdAt: 1000 + i,
          updatedAt: 1000 + i,
        });
      }
      return cards;
    };

    it('should select exactly preset default 2 cards when category contains more than 2 cards', () => {
      const deck = createTestDeck('cat-needs', 15);
      const selection = getWeeklyCardsForCategory(deck, 'cat-needs', '2026-W35');

      assert.equal(selection.length, 2);
      // All cards must belong to cat-needs
      for (const card of selection) {
        assert.equal(card.categoryId, 'cat-needs');
      }
      // All cards must be unique
      const ids = new Set(selection.map(c => c.id));
      assert.equal(ids.size, 2);
    });

    it('should return identical 2-card sets across repeated calls with identical inputs (Determinism)', () => {
      const deck = createTestDeck('cat-needs', 20);
      const run1 = getWeeklyCardsForCategory(deck, 'cat-needs', '2026-W35');
      const run2 = getWeeklyCardsForCategory(deck, 'cat-needs', '2026-W35');

      assert.deepEqual(
        run1.map(c => c.id),
        run2.map(c => c.id)
      );
    });

    it('should maintain stable 2-card selection for all 7 days of the calendar week', () => {
      const deck = createTestDeck('cat-food', 18);
      const mondayCards = getWeeklyCardsForCategory(deck, 'cat-food', '2026-08-24T09:00:00Z');
      const wednesdayCards = getWeeklyCardsForCategory(deck, 'cat-food', '2026-08-26T14:30:00Z');
      const sundayCards = getWeeklyCardsForCategory(deck, 'cat-food', '2026-08-30T21:00:00Z');

      assert.deepEqual(
        mondayCards.map(c => c.id),
        wednesdayCards.map(c => c.id)
      );
      assert.deepEqual(
        wednesdayCards.map(c => c.id),
        sundayCards.map(c => c.id)
      );
    });

    it('should automatically rotate to a different 2-card set when the week rolls over', () => {
      const deck = createTestDeck('cat-needs', 25);
      const week35Cards = getWeeklyCardsForCategory(deck, 'cat-needs', '2026-W35');
      const week36Cards = getWeeklyCardsForCategory(deck, 'cat-needs', '2026-W36');

      assert.equal(week35Cards.length, 2);
      assert.equal(week36Cards.length, 2);

      const ids35 = week35Cards.map(c => c.id).join(',');
      const ids36 = week36Cards.map(c => c.id).join(',');
      assert.notEqual(ids35, ids36, 'Weekly selection must rotate when week key changes');
    });

    it('should return all cards without truncation when category has <= 2 cards', () => {
      // 1-card category
      const deck1 = createTestDeck('cat-single', 1);
      const res1 = getWeeklyCardsForCategory(deck1, 'cat-single', '2026-W35');
      assert.equal(res1.length, 1);
      assert.deepEqual(res1.map(c => c.id), ['card-cat-single-1']);

      // Exactly 2-card category
      const deck2 = createTestDeck('cat-pair', 2);
      const res2 = getWeeklyCardsForCategory(deck2, 'cat-pair', '2026-W35');
      assert.equal(res2.length, 2);
      assert.deepEqual(res2.map(c => c.id), ['card-cat-pair-1', 'card-cat-pair-2']);
    });

    it('should handle empty categories (0 cards) gracefully by returning an empty array', () => {
      const emptyDeck: AACCard[] = [];
      const res = getWeeklyCardsForCategory(emptyDeck, 'cat-empty', '2026-W35');
      assert.deepEqual(res, []);
    });

    it('should produce identical results regardless of input cards array permutation (Order Independence)', () => {
      const deck = createTestDeck('cat-health', 12);
      // Reverse deck
      const reversedDeck = [...deck].reverse();
      // Scramble deck
      const scrambledDeck = [...deck].sort(() => 0.5 - Math.random());

      const resOriginal = getWeeklyCardsForCategory(deck, 'cat-health', '2026-W35');
      const resReversed = getWeeklyCardsForCategory(reversedDeck, 'cat-health', '2026-W35');
      const resScrambled = getWeeklyCardsForCategory(scrambledDeck, 'cat-health', '2026-W35');

      assert.deepEqual(
        resOriginal.map(c => c.id),
        resReversed.map(c => c.id)
      );
      assert.deepEqual(
        resOriginal.map(c => c.id),
        resScrambled.map(c => c.id)
      );
    });

    it('should support custom card count parameter (e.g. count = 3, count = 8)', () => {
      const deck = createTestDeck('cat-activities', 20);
      const res3 = getWeeklyCardsForCategory(deck, 'cat-activities', '2026-W35', 3);
      const res8 = getWeeklyCardsForCategory(deck, 'cat-activities', '2026-W35', 8);

      assert.equal(res3.length, 3);
      assert.equal(res8.length, 8);
    });

    it('should export selectWeeklyCards as an exact alias of getWeeklyCardsForCategory', () => {
      assert.equal(typeof selectWeeklyCards, 'function');
      const deck = createTestDeck('cat-feelings', 10);
      const res1 = getWeeklyCardsForCategory(deck, 'cat-feelings', '2026-W35');
      const res2 = selectWeeklyCards(deck, 'cat-feelings', '2026-W35');
      assert.deepEqual(res1, res2);
    });
  });
});
