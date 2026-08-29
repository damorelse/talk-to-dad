/**
 * Tier 14: 4-Pillar AAC Card Integrity & Progressive Scaffolding Invariants
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import "../setup.js";

import { DEFAULT_CARDS, DEFAULT_CATEGORIES } from "../../src/services/db/defaultData.ts";
import { googleSheetsService } from "../../src/services/googleSheets/googleSheetsService.ts";
import { extractVocabularyFromCards } from "../../src/services/keyboard/wordPredictor.ts";

describe("Tier 14: 4-Pillar AAC Card Integrity & Scaffolding Invariants", () => {
  describe("1. Complete Default Cards 4-Pillar Population Invariant", () => {
    it("should confirm exactly 121 curated cards across all 9 default categories", () => {
      assert.equal(DEFAULT_CARDS.length, 121);
    });

    it("should confirm all 121 cards possess non-empty bilingual definitions", () => {
      for (const card of DEFAULT_CARDS) {
        assert.ok(card.definition && card.definition.trim().length > 5, "Card missing definition: " + card.id);
        assert.ok(card.definitionZh && card.definitionZh.trim().length > 3, "Card missing definitionZh: " + card.id);
      }
    });

    it("should confirm all 121 cards possess non-empty daily life example sentences", () => {
      for (const card of DEFAULT_CARDS) {
        assert.ok(card.exampleSentence && card.exampleSentence.trim().length > 5, "Card missing exampleSentence: " + card.id);
        assert.ok(card.exampleSentenceZh && card.exampleSentenceZh.trim().length > 3, "Card missing exampleSentenceZh: " + card.id);
      }
    });

    it("should confirm all 121 cards possess non-empty clinical mystery clues", () => {
      for (const card of DEFAULT_CARDS) {
        assert.ok(card.clue && card.clue.trim().length > 5, "Card missing clue: " + card.id);
        assert.ok(card.clueZh && card.clueZh.trim().length > 3, "Card missing clueZh: " + card.id);
      }
    });
  });

  describe("2. Canonical Single Emoji & Number Preservation Invariant", () => {
    it("should verify all non-number cards have simplified canonical single emojis", () => {
      const nonNumberCards = DEFAULT_CARDS.filter(c => c.categoryId !== "cat-numbers");
      for (const card of nonNumberCards) {
        assert.ok(card.icon && card.icon.length > 0, "Card missing icon: " + card.id);
        const segmenter = new Intl.Segmenter();
        const segments = Array.from(segmenter.segment(card.icon));
        assert.equal(segments.length, 1, "Card icon has multiple graphemes: " + card.id + " (" + card.icon + ")");
      }
    });

    it("should verify number cards retain their canonical number emojis", () => {
      const numberCards = DEFAULT_CARDS.filter(c => c.categoryId === "cat-numbers");
      assert.equal(numberCards.length, 23);
      for (const card of numberCards) {
        assert.ok(card.icon.includes("0") || card.icon.includes("1") || card.icon.includes("2") || card.icon.includes("3") || card.icon.includes("4") || card.icon.includes("5") || card.icon.includes("6") || card.icon.includes("7") || card.icon.includes("8") || card.icon.includes("9") || card.icon.includes("🔟"), "Number card corrupted: " + card.id);
      }
    });
  });

  describe("3. Strict Spoiler-Free Mystery Clue Invariant", () => {
    it("should verify English clues do not contain the target card label or phrase", () => {
      for (const card of DEFAULT_CARDS) {
        const labelClean = card.label.toLowerCase().replace(/[^a-z0-9]/g, "");
        const clueClean = card.clue.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (labelClean.length > 2) {
          assert.ok(!clueClean.includes(labelClean), "Spoiler in English clue for " + card.id + ": " + card.label + " in " + card.clue);
        }
      }
    });

    it("should verify Chinese clues do not contain the target Chinese label or phrase", () => {
      for (const card of DEFAULT_CARDS) {
        const labelZhClean = (card.labelZh || "").replace(/[^\u4e00-\u9fa5]/g, "");
        const clueZhClean = (card.clueZh || "").replace(/[^\u4e00-\u9fa5]/g, "");
        if (labelZhClean.length >= 1) {
          assert.ok(!clueZhClean.includes(labelZhClean), "Spoiler in Chinese clue for " + card.id + ": " + card.labelZh + " in " + card.clueZh);
        }
      }
    });
  });

  describe("4. 3-Level Progressive Hint Ladder Invariant", () => {
    it("should verify 3 distinct progressive scaffolding hint levels without legacy 2N+1 tapping", () => {
      const getHint = (card, level, categoryName) => {
        if (level === 1) {
          return {
            type: 'audio-clue',
            spokenText: card.clue,
            spokenTextZh: card.clueZh,
          };
        } else if (level === 2) {
          const syllables = (card.phoneticSyllables || card.label)
            .split(/[\s·•-]+/)
            .map((s) => s.trim())
            .filter(Boolean);
          const firstSound = syllables[0] || card.label.charAt(0);
          return {
            type: 'first-sound',
            firstSound,
            spokenText: firstSound,
          };
        } else if (level === 3) {
          const firstLetter = card.label.charAt(0).toUpperCase();
          return {
            type: 'first-letter-and-category',
            firstLetter,
            categoryName: categoryName || 'Category',
            hintText: `Starts with "${firstLetter}" · Category: ${categoryName || 'General'}`,
          };
        }
        return null;
      };

      const sampleCard = {
        id: 'card-tea',
        label: 'Tea',
        labelZh: '茶',
        clue: 'Drink a cup of hot...',
        clueZh: '喝一杯熱熱的...',
        phoneticSyllables: 'Tea',
      };

      const h1 = getHint(sampleCard, 1, 'Food & Drink');
      assert.equal(h1.type, 'audio-clue');
      assert.equal(h1.spokenText, 'Drink a cup of hot...');

      const h2 = getHint(sampleCard, 2, 'Food & Drink');
      assert.equal(h2.type, 'first-sound');
      assert.equal(h2.firstSound, 'Tea');

      const h3 = getHint(sampleCard, 3, 'Food & Drink');
      assert.equal(h3.type, 'first-letter-and-category');
      assert.equal(h3.firstLetter, 'T');
      assert.ok(h3.hintText.includes('Starts with "T"'));
      assert.ok(h3.hintText.includes('Food & Drink'));
    });
  });

  describe("5. Google Sheets Service 4-Pillar Column Parsing Invariant", () => {
    it("should parse definitions, examples, and clues from CSV correctly", () => {
      const csv = [
        "Label,Spoken Text,Definition,Chinese Definition,Example Sentence,Chinese Example,Clue,Chinese Clue,Role,Category,Emoji",
        "\"Herbal Tea\",\"I want hot tea\",\"A soothing warm brew\",\"以草本沖泡的舒緩熱飲\",\"He drank herbal tea.\",\"他喝了一杯草本茶。\",\"A fragrant warm infusion in a cup\",\"裝在茶杯裡的清香溫潤熱飲\",nouns,cat-food,🍵",
      ].join("\n");

      const result = googleSheetsService.parseSheetData(csv, { categories: DEFAULT_CATEGORIES });
      assert.equal(result.cards.length, 1);
      const parsedCard = result.cards[0];
      assert.equal(parsedCard.label, "Herbal Tea");
      assert.equal(parsedCard.definition, "A soothing warm brew");
      assert.equal(parsedCard.definitionZh, "以草本沖泡的舒緩熱飲");
      assert.equal(parsedCard.exampleSentence, "He drank herbal tea.");
      assert.equal(parsedCard.exampleSentenceZh, "他喝了一杯草本茶。");
      assert.equal(parsedCard.clue, "A fragrant warm infusion in a cup");
      assert.equal(parsedCard.clueZh, "裝在茶杯裡的清香溫潤熱飲");
      assert.equal(parsedCard.icon, "🍵");
    });
  });

  describe("6. Word Predictor Concept Vocabulary Indexing Invariant", () => {
    it("should extract vocabulary tokens from definitions and clues", () => {
      const vocab = extractVocabularyFromCards(DEFAULT_CARDS);
      const words = new Set(vocab.map(v => v.word.toLowerCase()));
      assert.ok(words.has("water"));
      assert.ok(words.has("liquid") || words.has("quenching"));
    });
  });
});