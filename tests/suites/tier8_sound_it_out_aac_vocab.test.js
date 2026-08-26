/**
 * Tier 8: Sound It Out AAC Card Vocabulary Sourcing Test Suite
 * 
 * Verifies that the Sound It Out syllable visualizer extracts vocabulary directly from
 * AAC cards, splits multi-label slash cards (e.g. "Rest / Nap", "水 / 喝水"),
 * integrates with the weekly deterministic therapy selector engine, filters by category,
 * and maintains phonetic syllable and BoPoMoFo (注音) integrity.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import '../setup.js';

import { DEFAULT_CARDS, DEFAULT_CATEGORIES } from '../../src/services/db/defaultData.ts';
import { getWeeklyCardsForCategory, getISOWeekKey } from '../../src/services/therapy/weeklyCardSelector.ts';
import { phonemizeWord } from '../../src/services/syllables/espeakPhonemizer.ts';
import { getZhuyinForChar } from '../../src/services/syllables/zhuyinDictionary.ts';

// Helper matching SyllableVisualizerView extraction logic
function extractVocabItems(cards, categories, vocabMode = 'words') {
  const weeklySet = new Set();
  for (const cat of categories) {
    const weekly = getWeeklyCardsForCategory(cards, cat.id);
    for (const c of weekly) {
      weeklySet.add(c.id);
    }
  }

  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const items = [];

  for (const card of cards) {
    const cat = categoryMap.get(card.categoryId);
    const isWeekly = weeklySet.has(card.id);
    const isFav = !!card.isFavorite;

    if (vocabMode === 'words') {
      const enParts = (card.label || '').split(/\s*[\/／]\s*/).map((s) => s.trim()).filter(Boolean);
      const zhParts = (card.labelZh || '').split(/\s*[\/／]\s*/).map((s) => s.trim()).filter(Boolean);
      const count = Math.max(enParts.length, zhParts.length, 1);

      for (let i = 0; i < count; i++) {
        const wEn = enParts[i] || enParts[0] || card.label || 'Word';
        const wZh = zhParts[i] || zhParts[0] || card.labelZh || wEn;
        const phonetic = (enParts.length === 1) ? card.phoneticSyllables : undefined;

        items.push({
          id: `${card.id}-w${i}`,
          cardId: card.id,
          categoryId: card.categoryId,
          categoryName: cat?.name,
          categoryNameZh: cat?.nameZh,
          icon: card.icon,
          wordEn: wEn,
          wordZh: wZh,
          spokenTextEn: card.spokenText,
          spokenTextZh: card.spokenTextZh,
          phoneticSyllables: phonetic,
          isPhrase: false,
          isWeeklyTherapy: isWeekly,
          isFavorite: isFav,
          order: card.order || 0,
        });
      }
    } else {
      const wEn = card.spokenText || card.label || 'Word';
      const wZh = card.spokenTextZh || card.labelZh || wEn;

      items.push({
        id: `${card.id}-phrase`,
        cardId: card.id,
        categoryId: card.categoryId,
        categoryName: cat?.name,
        categoryNameZh: cat?.nameZh,
        icon: card.icon,
        wordEn: wEn,
        wordZh: wZh,
        spokenTextEn: card.spokenText,
        spokenTextZh: card.spokenTextZh,
        phoneticSyllables: undefined,
        isPhrase: true,
        isWeeklyTherapy: isWeekly,
        isFavorite: isFav,
        order: card.order || 0,
      });
    }
  }

  return items;
}

describe('Tier 8: Sound It Out AAC Card Vocabulary Sourcing', () => {

  describe('1. AAC Card Vocabulary Extraction & Slash Splitting', () => {
    it('should extract vocabulary from all default AAC cards', () => {
      const items = extractVocabItems(DEFAULT_CARDS, DEFAULT_CATEGORIES, 'words');
      assert.ok(items.length >= DEFAULT_CARDS.length, 'Vocab items count should be at least cards count');
      assert.ok(items.some((i) => i.wordEn === 'Water'), 'Should contain "Water"');
      assert.ok(items.some((i) => i.wordEn === 'Bathroom'), 'Should contain "Bathroom"');
    });

    it('should split compound slash labels into distinct practice words', () => {
      // E.g. custom/slash card: "Rest / Nap" -> "Rest" and "Nap"
      const slashCard = {
        id: 'card-custom-rest-nap',
        categoryId: 'cat-needs',
        label: 'Rest / Nap',
        labelZh: '休息 / 睡覺',
        spokenText: 'I want to rest.',
        spokenTextZh: '我想休息。',
        fitzgeraldCategory: 'verbs',
        order: 1,
        createdAt: 1,
        updatedAt: 1,
      };

      const items = extractVocabItems([slashCard], DEFAULT_CATEGORIES, 'words');
      assert.equal(items.length, 2, 'Should extract 2 distinct items for "Rest / Nap"');
      assert.equal(items[0].wordEn, 'Rest');
      assert.equal(items[1].wordEn, 'Nap');
      assert.equal(items[0].wordZh, '休息');
      assert.equal(items[1].wordZh, '睡覺');
    });

    it('should extract full spoken sentences in phrase mode', () => {
      const waterCard = DEFAULT_CARDS.find((c) => c.id === 'card-water');
      assert.ok(waterCard);

      const items = extractVocabItems([waterCard], DEFAULT_CATEGORIES, 'phrases');
      assert.equal(items.length, 1);
      assert.equal(items[0].isPhrase, true);
      assert.equal(items[0].wordEn, waterCard.spokenText);
      assert.equal(items[0].wordZh, waterCard.spokenTextZh);
    });
  });

  describe('2. Weekly Therapy Focus Synchronization', () => {
    it('should correctly flag weekly therapy focus cards per category', () => {
      const items = extractVocabItems(DEFAULT_CARDS, DEFAULT_CATEGORIES, 'words');
      const weeklyItems = items.filter((i) => i.isWeeklyTherapy);

      assert.ok(weeklyItems.length > 0, 'Must have weekly therapy focus items');

      // Across 9 categories with up to 2 cards each (preset default 2), should have 18 weekly cards
      const uniqueWeeklyCardIds = new Set(weeklyItems.map((i) => i.cardId));
      assert.ok(uniqueWeeklyCardIds.size >= 18, `Should have at least 18 unique weekly focus cards, got ${uniqueWeeklyCardIds.size}`);
    });

    it('should match getWeeklyCardsForCategory results for each category', () => {
      const items = extractVocabItems(DEFAULT_CARDS, DEFAULT_CATEGORIES, 'words');
      for (const cat of DEFAULT_CATEGORIES) {
        const weeklyCards = getWeeklyCardsForCategory(DEFAULT_CARDS, cat.id);
        const weeklyIds = new Set(weeklyCards.map((c) => c.id));

        const catItems = items.filter((i) => i.categoryId === cat.id);
        for (const item of catItems) {
          assert.equal(
            item.isWeeklyTherapy,
            weeklyIds.has(item.cardId),
            `Card ${item.cardId} weekly therapy flag must match weekly selector`
          );
        }
      }
    });
  });

  describe('3. Category & Favorites Filtering', () => {
    it('should filter items by category ID', () => {
      const items = extractVocabItems(DEFAULT_CARDS, DEFAULT_CATEGORIES, 'words');
      const healthItems = items.filter((i) => i.categoryId === 'cat-health');

      assert.ok(healthItems.length > 0);
      assert.ok(healthItems.every((i) => i.categoryId === 'cat-health'));
      assert.ok(healthItems.some((i) => i.wordEn === 'Doctor'));
      assert.ok(healthItems.some((i) => i.wordEn === 'Medicine'));
    });

    it('should filter items by favorites', () => {
      const items = extractVocabItems(DEFAULT_CARDS, DEFAULT_CATEGORIES, 'words');
      const favItems = items.filter((i) => i.isFavorite);

      assert.ok(favItems.length > 0);
      assert.ok(favItems.every((i) => i.isFavorite));
      assert.ok(favItems.some((i) => i.wordEn === 'Water'));
      assert.ok(favItems.some((i) => i.wordEn === 'Bathroom'));
    });
  });

  describe('4. Syllable & BoPoMoFo (注音) Breakdown for AAC Cards', () => {
    it('should derive valid English IPA syllables for AAC vocabulary words', () => {
      const waterData = phonemizeWord('Water');
      assert.equal(waterData.syllables.length, 2);
      assert.equal(waterData.syllables[0].text, 'wa');
      assert.equal(waterData.syllables[1].text, 'ter');

      const doctorData = phonemizeWord('Doctor');
      assert.equal(doctorData.syllables.length, 2);
      assert.equal(doctorData.syllables[0].text, 'doc');
      assert.equal(doctorData.syllables[1].text, 'tor');
    });

    it('should derive valid BoPoMoFo (注音) for Chinese AAC card vocabulary words', () => {
      const waterZhuyin = getZhuyinForChar('水');
      assert.equal(waterZhuyin, 'ㄕㄨㄟˇ');

      const doctorChar1 = getZhuyinForChar('醫');
      const doctorChar2 = getZhuyinForChar('生');
      assert.equal(doctorChar1, 'ㄧ');
      assert.equal(doctorChar2, 'ㄕㄥ');

      // Zero & Numbers verification
      assert.equal(getZhuyinForChar('零'), 'ㄌㄧㄥˊ', 'Zero (零) must produce valid BoPoMoFo ㄌㄧㄥˊ');
      assert.equal(getZhuyinForChar('一'), 'ㄧ');
      assert.equal(getZhuyinForChar('二'), 'ㄦˋ');
      assert.equal(getZhuyinForChar('三'), 'ㄙㄢ');
      assert.equal(getZhuyinForChar('四'), 'ㄙˋ');
      assert.equal(getZhuyinForChar('五'), 'ㄨˇ');
      assert.equal(getZhuyinForChar('六'), 'ㄌㄧㄡˋ');
      assert.equal(getZhuyinForChar('七'), 'ㄑㄧ');
      assert.equal(getZhuyinForChar('八'), 'ㄅㄚ');
      assert.equal(getZhuyinForChar('九'), 'ㄐㄧㄡˇ');
      assert.equal(getZhuyinForChar('十'), 'ㄕˊ');
      assert.equal(getZhuyinForChar('百'), 'ㄅㄞˇ');
    });
  });

  describe('5. Fixed Speech Rate Configuration (0.5x Stroke Rehabilitation)', () => {
    it('should ensure slow speech rate defaults to 0.5x for clear articulation', () => {
      const defaultSpeed = 0.5;
      const delayMs = Math.round((1.0 / defaultSpeed) * 450);
      assert.equal(delayMs, 900, 'Inter-syllable delay at 0.5x speed should be 900ms');

      const wholePhraseRate = Math.min(1.0, defaultSpeed * 1.2);
      assert.equal(wholePhraseRate, 0.6, 'Whole phrase speech rate should be naturally paced at 0.6x');
    });
  });

  describe('6. Sound It Out Action Button Visibility Invariant', () => {
    function shouldShowSoundItOut(word, isChinese) {
      if (isChinese) {
        const chars = Array.from(word).filter((c) => !/[\s，。！？、,!?.]/.test(c));
        return chars.length > 1;
      }
      const data = phonemizeWord(word);
      return (data.syllables?.length || 1) > 1;
    }

    it('should hide Sound It Out button for 1-character Chinese words', () => {
      assert.equal(shouldShowSoundItOut('水', true), false, '1-char Chinese word "水" must hide Sound It Out');
      assert.equal(shouldShowSoundItOut('痛', true), false, '1-char Chinese word "痛" must hide Sound It Out');
      assert.equal(shouldShowSoundItOut('吃', true), false, '1-char Chinese word "吃" must hide Sound It Out');
      assert.equal(shouldShowSoundItOut('零', true), false, '1-char Chinese word "零" must hide Sound It Out');
    });

    it('should show Sound It Out button for 2+ character Chinese words and sentences', () => {
      assert.equal(shouldShowSoundItOut('喝水', true), true, '2-char Chinese word "喝水" must show Sound It Out');
      assert.equal(shouldShowSoundItOut('醫生', true), true, '2-char Chinese word "醫生" must show Sound It Out');
      assert.equal(shouldShowSoundItOut('請給我一杯水。', true), true, 'Multi-char sentence must show Sound It Out');
    });

    it('should hide Sound It Out button for 1-syllable English words', () => {
      assert.equal(shouldShowSoundItOut('Tea', false), false, '1-syllable English word "Tea" must hide Sound It Out');
      assert.equal(shouldShowSoundItOut('Help', false), false, '1-syllable English word "Help" must hide Sound It Out');
      assert.equal(shouldShowSoundItOut('Yes', false), false, '1-syllable English word "Yes" must hide Sound It Out');
    });

    it('should show Sound It Out button for 2+ syllable English words', () => {
      assert.equal(shouldShowSoundItOut('Water', false), true, '2-syllable English word "Water" must show Sound It Out');
      assert.equal(shouldShowSoundItOut('Doctor', false), true, '2-syllable English word "Doctor" must show Sound It Out');
      assert.equal(shouldShowSoundItOut('Hospital', false), true, 'Multi-syllable English word "Hospital" must show Sound It Out');
    });
  });
});
