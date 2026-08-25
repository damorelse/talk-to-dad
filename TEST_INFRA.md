# TEST_INFRA.md — E2E Requirement-Driven Test Infrastructure

## Overview
This document specifies the comprehensive test infrastructure, verification methodology, and test tier hierarchy for the **TalkWithDad AAC Progressive Web App (PWA)**, specifically covering:
- **R1: Bilingual Clue Data Model & Seed Population** (`AACCard.clue`, `AACCard.clueZh`, `DEFAULT_CARDS`, `AppDatabase` non-destructive backfill, `CardEditorModal`).
- **R2: Deterministic Weekly 5-Card Selection Engine** (`weeklyCardSelector.ts`, `getISOWeekKey`, `hashString`, `createMulberry32`, `getWeeklyCardsForCategory`, `selectWeeklyCards`).
- **R3: Category-Based Word Finding Therapy Session View** (`TherapySessionView.tsx`, 9 AAC category tabs, live category/card wiring, progress tracking, scoring).
- **R4: Bilingual Clue Front Face with Speak Button** (`FlashcardDeck.tsx` Front Face: Clue pill badge, Tap to flip badge, emoji, English clue, Chinese clue, bilingual speech synthesis).
- **R5: Streamlined Answer Back Face with Speak Button** (`FlashcardDeck.tsx` Back Face: Answer pill badge, Tap to flip badge, target word, Traditional Chinese target word, removed phonetic syllables, bilingual speech synthesis).

---

## Test Hierarchy & Multi-Tier Architecture

The test suite is structured into 5 rigorous testing tiers:

```
                  ┌─────────────────────────────────────────┐
                  │ Tier 5: Adversarial & Stress Hardening │
                  ├─────────────────────────────────────────┤
                  │ Tier 4: Real-World Clinical Workflows   │
                  ├─────────────────────────────────────────┤
                  │ Tier 3: Cross-Feature Pairwise Matrix   │
                  ├─────────────────────────────────────────┤
                  │ Tier 2: Boundary & Corner Cases         │
                  ├─────────────────────────────────────────┤
                  │ Tier 1: Feature Coverage (>=5 / feature)│
                  └─────────────────────────────────────────┘
```

---

## Tier 1: Feature Coverage Specifications (>=5 Test Cases per Feature)

### Feature 1.1: AACCard Bilingual Clues & Typing (R1)
- **T1.1.1**: Verify `AACCard` interface accepts optional `clue` (string) and `clueZh` (string) properties.
- **T1.1.2**: Verify all 102+ default cards across all 9 categories in `DEFAULT_CARDS` have non-empty English `clue` strings.
- **T1.1.3**: Verify all 102+ default cards across all 9 categories in `DEFAULT_CARDS` have non-empty Traditional Chinese `clueZh` strings.
- **T1.1.4**: Verify clinical clue quality: clues are descriptive, non-trivial sentences/phrases and do not merely repeat the label.
- **T1.1.5**: Verify card editor modal data structure retains custom user-edited `clue` and `clueZh`.

### Feature 1.2: AppDatabase Non-Destructive Seeding & Backfilling (R1)
- **T1.2.1**: Verify clean database initialization populates all 102+ cards with `clue` and `clueZh`.
- **T1.2.2**: Verify migration/backfill logic: pre-existing cards lacking `clue` or `clueZh` are backfilled from `DEFAULT_CARDS` by ID.
- **T1.2.3**: Verify non-destructive preservation: pre-existing user-customized card labels or custom fields are NOT overwritten during backfill.
- **T1.2.4**: Verify user custom cards (IDs not in `DEFAULT_CARDS`) are untouched during initialization.
- **T1.2.5**: Verify repeated calls to database initialization are idempotent and produce no duplicate records.

### Feature 1.3: ISO 8601 Calendar Week Key & PRNG Engine (R2)
- **T1.3.1**: Verify `getISOWeekKey()` computes correct `YYYY-Www` format (e.g. `2026-W35`).
- **T1.3.2**: Verify `hashString()` produces deterministic 32-bit unsigned integer hashes for string inputs.
- **T1.3.3**: Verify `createMulberry32()` generator produces uniform pseudo-random floats in `[0, 1)` for a given seed.
- **T1.3.4**: Verify `hashString` + `createMulberry32` is 100% deterministic across multiple runtime executions with identical seeds.
- **T1.3.5**: Verify distinct inputs produce distinct hash values and pseudo-random sequences (minimal collision rate).

### Feature 1.4: Deterministic Weekly 5-Card Selection Engine (R2)
- **T1.4.1**: Verify `getWeeklyCardsForCategory()` selects exactly 5 cards when category contains > 5 cards.
- **T1.4.2**: Verify determinism: calling `getWeeklyCardsForCategory()` repeatedly with the same category and week key returns identical cards in identical order.
- **T1.4.3**: Verify weekly stability: all 7 days of a calendar week (Monday through Sunday) generate the exact same 5-card selection.
- **T1.4.4**: Verify weekly rotation: transitioning from week `Www` to week `W(ww+1)` selects a different 5-card subset.
- **T1.4.5**: Verify small category handling: categories with <= 5 cards return all cards in that category without truncation.
- **T1.4.6**: Verify `selectWeeklyCards` alias is exported and behaves identically to `getWeeklyCardsForCategory`.

### Feature 1.5: Category-Based Word Finding Therapy Session View (R3)
- **T1.5.1**: Verify all 9 AAC categories can be selected as active therapy categories.
- **T1.5.2**: Verify switching category dynamically updates the active 5-card weekly therapy deck.
- **T1.5.3**: Verify progress tracking: counter advances from Card 1 of N to Card N of N.
- **T1.5.4**: Verify navigation controls: Previous, Next, and Restart correctly update deck position.
- **T1.5.5**: Verify score tracking ("Correct" / "Practice Again") and completion celebration fanfare trigger.

### Feature 1.6: Bilingual Clue Front Face with Speak Button (R4)
- **T1.6.1**: Verify Front Face renders `"Clue"` pill badge on top left and `"Tap to flip"` badge on top right.
- **T1.6.2**: Verify Front Face displays card emoji/icon, English clue (`card.clue`), and Chinese clue (`card.clueZh`).
- **T1.6.3**: Verify Front Face contains a dedicated "Speak" button.
- **T1.6.4**: Verify clicking "Speak" on Front Face triggers bilingual speech synthesis for clues via `speakBilingual(card.clue, card.clueZh)`.
- **T1.6.5**: Verify "Speak" button click triggers `e.stopPropagation()` preventing accidental card flip.

### Feature 1.7: Streamlined Answer Back Face with Speak Button (R5)
- **T1.7.1**: Verify Back Face renders `"Answer"` pill badge on top left and `"Tap to flip"` badge on top right.
- **T1.7.2**: Verify Back Face displays English target word (`card.label`) and Traditional Chinese target word (`card.labelZh`).
- **T1.7.3**: Verify phonetic syllable breakdown (`card.phoneticSyllables`) is completely REMOVED from the Back Face.
- **T1.7.4**: Verify Back Face contains a dedicated "Speak" button.
- **T1.7.5**: Verify clicking "Speak" on Back Face triggers bilingual speech synthesis for labels via `speakBilingual(card.label, card.labelZh)` with `e.stopPropagation()`.

### Feature 1.8: Caregiver Speech Settings & Bilingual Order Modes (R4, R5)
- **T1.8.1**: Verify `cardSpeechLanguage = 'en'` speaks only English text in `speakBilingual`.
- **T1.8.2**: Verify `cardSpeechLanguage = 'zh'` speaks only Traditional Chinese text in `speakBilingual`.
- **T1.8.3**: Verify `cardSpeechLanguage = 'en-then-zh'` speaks English first, pauses, then speaks Traditional Chinese.
- **T1.8.4**: Verify `cardSpeechLanguage = 'zh-then-en'` speaks Traditional Chinese first, pauses, then speaks English.
- **T1.8.5**: Verify speech engine switches voices to `selectedVoiceEnUS` for English and `selectedVoiceZhTW` for Chinese.

---

## Tier 2: Boundary & Corner Case Specifications (>=5 Test Cases per Feature)

### Boundary 2.1: Clue & Text Field Boundary Cases
- **B2.1.1**: Handle card with missing/undefined `clue` (falls back gracefully to `label` or spoken text).
- **B2.1.2**: Handle card with missing/undefined `clueZh` (falls back gracefully to English clue or `labelZh`).
- **B2.1.3**: Handle card with empty string `""` or whitespace-only clues without speech crashing.
- **B2.1.4**: Handle clues with punctuation, quotes, emojis, and special characters (e.g. `“Hot” soup / 湯!`).
- **B2.1.5**: Handle extremely long clue descriptions (>500 characters) without layout or speech errors.

### Boundary 2.2: Calendar Week Key Edge Cases & Year Rollovers
- **B2.2.1**: Handle Sunday vs Monday: verify Sunday belongs to the ISO week ending on that Sunday (e.g., 2026-08-30 is 2026-W35, 2026-08-31 is 2026-W36).
- **B2.2.2**: Handle year-end rollover where Jan 1 belongs to Week 52/53 of previous year (e.g., 2021-01-01 is 2020-W53).
- **B2.2.3**: Handle year-end rollover where Dec 31 belongs to Week 1 of next year (e.g., 2024-12-31 is 2025-W01).
- **B2.2.4**: Handle leap year February 29 dates (e.g., 2024-02-29 is 2024-W09; 2028-02-29 is 2028-W09).
- **B2.2.5**: Handle numeric timestamp, string ISO date, and Date object inputs interchangeably to `getISOWeekKey`.

### Boundary 2.3: Category Size Edge Cases in Weekly Selector
- **B2.3.1**: Empty category (0 cards matching categoryId) returns empty array `[]` without error.
- **B2.3.2**: Single-card category (1 card) returns array of 1 card without duplication.
- **B2.3.3**: Category with exactly 5 cards returns all 5 cards.
- **B2.3.4**: Category with 6 cards selects exactly 5 unique cards without repeats.
- **B2.3.5**: Category with 50+ cards selects exactly 5 unique cards without duplicates.

### Boundary 2.4: Seed & Input Corruption in Weekly Selector
- **B2.4.1**: Invalid / unrecognized category ID returns empty array.
- **B2.4.2**: Undefined or null `weekKeyOrDate` defaults to current system date's ISO week.
- **B2.4.3**: Unsorted / randomized input cards array produces the exact same deterministic selection (order-independent selector).
- **B2.4.4**: Cards with identical `order` values resolve deterministically via stable ID tie-breaking.
- **B2.4.5**: Negative or zero `count` parameter handles boundary gracefully.

### Boundary 2.5: Speech Synthesis Fallbacks & Edge Cases
- **B2.5.1**: Speech synthesis when no Traditional Chinese voice is installed in browser (falls back to available voice).
- **B2.5.2**: Rapid consecutive clicks on "Speak" button debounce or cancel prior utterance cleanly.
- **B2.5.3**: Missing English or Chinese voice selection in settings falls back to default locale voice.
- **B2.5.4**: Zero-duration speech rate or extreme speech rate (0.25x - 2.0x) clamped safely.
- **B2.5.5**: Concurrent speech requests from front and back face flip do not overlap or corrupt audio engine state.

### Boundary 2.6: Database Seeding & Schema Evolution
- **B2.6.1**: Database backfill with partial records (some cards have clue, some do not) only updates cards missing clues.
- **B2.6.2**: Database backfill preserves user-modified `clue` text if user previously changed it.
- **B2.6.3**: Database backfill handles missing `fitzgeraldCategory` or optional fields gracefully.
- **B2.6.4**: Database backup export includes `clue` and `clueZh` in exported JSON payload.
- **B2.6.5**: Database restore from legacy JSON (lacking `clue`/`clueZh`) automatically triggers clue backfilling.

---

## Tier 3: Cross-Feature Pairwise Interaction Matrix

Tier 3 tests combinatorial interactions between components:

| Dim 1: Category | Dim 2: Week Key | Dim 3: Speech Language Mode | Dim 4: Database State | Dim 5: Card Face |
|-----------------|-----------------|-----------------------------|-----------------------|------------------|
| Daily Needs (10+ cards) | Current Week (2026-W35) | `en` (English only) | Default Seed | Clue (Front) |
| Health (10+ cards) | Next Week (2026-W36) | `zh` (Chinese only) | Backfilled Legacy DB | Answer (Back) |
| Family (<=5 cards) | Boundary Week (2024-W52) | `en-then-zh` (Bilingual) | User-Customized Card | Flipped Back & Forth |
| Places (<=5 cards) | Rollover Week (2025-W01) | `zh-then-en` (Bilingual) | Newly Created Card | Rapid Interaction |

### Cross-Feature Combinations Tested:
- **Pairwise 3.1: Weekly Selector + FlashcardDeck + Bilingual Audio (`en-then-zh`)**
  - Select 5 cards for `cat-food` in `2026-W35` -> Load card 1 into FlashcardDeck -> Click Front "Speak" -> Verify speech queue speaks English clue then Chinese clue -> Flip card -> Click Back "Speak" -> Verify speech queue speaks English label then Chinese label with NO syllables.
- **Pairwise 3.2: Small Category (`cat-family`) + Weekly Selector + Score Tracker**
  - Select `cat-family` (<=5 cards) -> Verify all cards returned -> Step through each card -> Answer all -> Verify score is 100% and victory fanfare plays.
- **Pairwise 3.3: Caregiver Card Editor + Live Database + Therapy Session View**
  - Edit card clue in CardEditorModal -> Save to DB -> Switch to Therapy tab -> Verify updated clue immediately appears on Flashcard front face.
- **Pairwise 3.4: Week Rollover + Category Switch + Audio Synthesis Mode Switch**
  - Change active week from `2026-W35` to `2026-W36` -> Change category from `Daily Needs` to `Health` -> Change speech mode from `en` to `zh-then-en` -> Verify all selections, clues, and speech outputs update synchronously.
- **Pairwise 3.5: Legacy Backup Import + Clue Backfill + Therapy Deck Generation**
  - Import legacy JSON without clues -> Verify backfill populates clues -> Generate weekly therapy deck -> Verify FlashcardDeck displays populated clues without blank fields.

---

## Tier 4: Real-World Clinical Application Scenarios

### Scenario 4.1: Daily Morning Stroke Rehabilitation Routine
- **Clinical Context**: Stroke patient with Broca's aphasia uses TalkWithDad each morning (Monday to Friday) to practice Daily Needs vocabulary.
- **Verification**: Ensure that on Monday, Tuesday, Wednesday, Thursday, and Friday of the same week, the exact same 5 Daily Needs cards are presented in the same order, providing cognitive consistency for motor and cognitive relearning.

### Scenario 4.2: Sunday Night to Monday Morning Calendar Week Rollover
- **Clinical Context**: Patient practices on Sunday evening (Week 35), goes to sleep, and opens the app on Monday morning (Week 36).
- **Verification**: Verify that the system automatically detects the new ISO calendar week, cleanly rotates the deck to the new deterministic 5-card set for Week 36, resets session progress to Card 1, and maintains previous high scores in history.

### Scenario 4.3: Bilingual Caregiver Speech Mode Optimization
- **Clinical Context**: Patient is a bilingual immigrant practicing English word-finding with a Mandarin-speaking caregiver. The caregiver starts with `zh-then-en` (hearing Mandarin first to prompt English recall), then switches to `en-then-zh` for reinforcement.
- **Verification**: Toggling `cardSpeechLanguage` setting instantly updates speech sequence for both Clue front face and Answer back face without restarting the session or losing card position.

### Scenario 4.4: Caregiver Custom Vocabulary & Clue Customization
- **Clinical Context**: Speech-language pathologist (SLP) customizes the clue for "Glasses" to include a personal memory ("The red frames on your nightstand") and adds a custom Chinese clue ("床頭櫃上的紅色眼鏡").
- **Verification**: Custom clue is saved in Dexie, survives app restarts and database backfill passes, displays on Flashcard front face, and is spoken accurately by the speech engine.

### Scenario 4.5: Low-Vocabulary Category Therapy (Family & Places)
- **Clinical Context**: Patient practices Family category (`cat-family`) or Places category (`cat-places`), which contains 4-5 core cards.
- **Verification**: The weekly selector gracefully returns all available cards in the category without attempting to slice non-existent cards or dropping valid vocabulary, allowing full therapy session completion.

---

## Tier 5: Adversarial & Stress Hardening

- **A5.1: 10,000-Week Determinism & Uniformity Monte Carlo Simulation**
  - Runs 10,000 simulated weekly selections across all 9 categories to verify 0 duplicate cards in any 5-card set, 0 crashes, and uniform card rotation over multi-year periods.
- **A5.2: Memory & Execution Latency Benchmark**
  - 1,000 iterations of `getWeeklyCardsForCategory` execute in < 25ms total (sub-0.025ms per call).
- **A5.3: Corrupted Input Resilience**
  - Extreme dates (e.g. year 1970, year 2099), malformed date strings, negative years, non-ASCII category IDs produce stable fallbacks.

---

## Test Execution Infrastructure

### Transpiler (`scripts/transpile.js`)
- Transpiles all TypeScript source files (`src/**/*.ts`, `src/**/*.tsx`) and test files (`tests/**/*.ts`, `tests/**/*.tsx`, `tests/**/*.js`) using TypeScript Compiler API.
- Normalizes ES module import specifiers to `.js` for Node.js native ESM execution.
- Outputs runtime artifacts into `dist-test/`.

### Test Runner (`tests/run_all_tests.js`)
- Executes all test suites sequentially using Node.js built-in test runner (`node --test`).
- Provides unified pass/fail reporting and exit code signaling.

### Test Command
```bash
npm test
```
All suites must pass with 100% success rate (0 failures).
