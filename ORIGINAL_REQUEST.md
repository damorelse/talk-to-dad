# Original User Request

## 2026-08-25T06:30:51Z

Implement bilingual (English and Chinese) clues for all AAC cards, and transition the Word Finding therapy module to practice a deterministic weekly selection of 5 cards per category with bilingual speech support following Caregiver settings.

Working directory: /usr/local/google/home/ginapai/talk-to-dad
Integrity mode: development

## Requirements

### R1. Bilingual Clue Data Model & Seed Population
- Add optional `clue` (English) and `clueZh` (Traditional Chinese) fields to the `AACCard` interface in `src/types/index.ts`.
- Populate clinical, descriptive clues in English and Traditional Chinese for all 102+ default AAC cards across all 9 categories in `src/services/db/defaultData.ts`.
- Ensure database seeding and synchronization logic in `src/services/db/AppDatabase.ts` populates `clue` and `clueZh` for existing database entries without breaking user customizations.
- Support editing `clue` and `clueZh` in the Caregiver card editor modal (`src/components/caregiver/CardEditorModal.tsx`).

### R2. Deterministic Weekly 5-Card Selection Engine
- Implement a deterministic selection function in `src/services/therapy/weeklyCardSelector.ts` that uses the calendar week (ISO 8601 `YYYY-Www`) and category ID as a seed.
- For any given category and calendar week, select up to 5 cards deterministically using a seeded PRNG.
- If a category contains 5 or fewer cards, return all cards in that category.
- The 5-card set must remain constant for every day in the same calendar week, and automatically rotate to a new deterministic 5-card set when the calendar week rolls over.

### R3. Category-Based Word Finding Therapy Session View
- Update `src/components/therapy/TherapySessionView.tsx` to let users choose between AAC Card Categories (`Daily Needs`, `Health`, `Food & Drink`, `Feelings`, `Family`, `Activities`, `Places`, `Date & Time`, `Numbers`) rather than separate static therapy decks.
- Connect `TherapySessionView` in `src/App.tsx` to receive live `categories` and `cards`.
- Display the active weekly cards count, progress counter, deck navigation (Previous / Next / Restart), score tracker, and celebration animations.

### R4. Bilingual Clue Front Face with Speak Button
- Update `src/components/therapy/FlashcardDeck.tsx` Front Face:
  - Header displays `"Clue"` pill badge (left) and consistent `"Tap to flip"` badge (right).
  - Center displays the card icon/emoji, English clue, and Chinese clue.
  - Footer contains a **"Speak"** button that speaks the English and Chinese clues using `speakBilingual(card.clue, card.clueZh)`.
  - Speech playback strictly adheres to the active Caregiver Setting's `cardSpeechLanguage` (`'en'`, `'zh'`, `'en-then-zh'`, `'zh-then-en'`).

### R5. Streamlined Answer Back Face with Speak Button
- Update `src/components/therapy/FlashcardDeck.tsx` Back Face:
  - Header displays `"Answer"` pill badge (left) and consistent `"Tap to flip"` badge (right).
  - Center displays the target word in English and Traditional Chinese.
  - **Remove the English phonetic syllables breakdown** (`phoneticSyllables`) from the Answer face.
  - Footer contains a **"Speak"** button that speaks the target word and Chinese using `speakBilingual(card.label, card.labelZh)` adhering to Caregiver `cardSpeechLanguage` settings.

## Acceptance Criteria

### Automated Verification
- [ ] New unit tests in `tests/weeklyCardSelector.test.ts` verify:
  - Deterministic card selection for identical category and week inputs.
  - Selection stability across different days in the same calendar week.
  - Automatic rotation to a distinct 5-card set when the week key changes.
  - Graceful handling of categories with <= 5 cards.
- [ ] All 27 existing automated test suites + deep empirical fuzzer pass with 100% success rate (`npm test`).
- [ ] Production build (`npm run build`) completes successfully, compiling TypeScript, Tailwind CSS, and distribution bundle in `dist/`.

### Manual & Functional Verification
- [ ] Clue side of flashcard displays both English and Chinese clues with a functional "Speak" button.
- [ ] Answer side of flashcard displays English and Chinese labels with no syllable breakdown and a functional "Speak" button.
- [ ] Both Clue and Answer Speak buttons adapt correctly when Caregiver Spoken Languages setting is toggled between English, Chinese, English -> Chinese, and Chinese -> English.
- [ ] Word Finding category tabs switch smoothly across all 9 categories.
