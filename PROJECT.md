# Project: Talk to Dad AAC - Bilingual Clues & Deterministic Weekly Therapy

## Architecture
TalkWithDad is a React 18 + TypeScript + Dexie (IndexedDB) + Tailwind CSS AAC (Augmentative and Alternative Communication) and Speech Rehabilitation Progressive Web App.
The application architecture comprises:
- **Core Domain & Types (`src/types/index.ts`)**: Defines AACCard, AACCategory, AppSettings, SpeechLanguageMode, and therapy types.
- **Persistent Storage & Seeding (`src/services/db/`)**: Dexie-backed database (`AppDatabase.ts`) with default seed data (`defaultData.ts`) providing 9 categories and 102 default cards, non-destructive schema migrations/backfills, and backup export/import services (`backupService.ts`).
- **Therapy Engine (`src/services/therapy/`)**: Pure deterministic business logic (`weeklyCardSelector.ts`) that maps ISO 8601 calendar week keys (`YYYY-Www`) and category IDs to deterministic 5-card therapy selections using FNV-1a hashing, Mulberry32 PRNG, and Fisher-Yates shuffle.
- **Audio & Speech Synthesis (`src/services/audio/`, `src/hooks/useAudio.ts`)**: WebSpeechEngine and `useAudio` hooks providing bilingual speech synthesis (`speakBilingual`) in English (`en-US`) and Traditional Chinese (`zh-TW`), honoring Caregiver `cardSpeechLanguage` configuration.
- **UI Components (`src/components/`)**:
  - `src/components/therapy/TherapySessionView.tsx`: Category-based word finding therapy session across 9 AAC categories.
  - `src/components/therapy/FlashcardDeck.tsx`: 3D flipping flashcard with Clue Front Face (bilingual clue + Speak button) and Answer Back Face (target words + Speak button, removed phonetic syllables).
  - `src/components/caregiver/CardEditorModal.tsx`: Card editing modal with English and Chinese clue fields.
  - `src/App.tsx`: Top-level navigation connecting database state to therapy session view.
- **Testing & Build Infrastructure (`tests/`, `scripts/`)**: Transpiler (`scripts/transpile.js`), Node test runner (`tests/run_all_tests.js`), and production bundler (`scripts/build.js`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | `AACCard` Clue Extension | Add optional `clue` (en) and `clueZh` (zh-TW) fields to `AACCard` interface in `src/types/index.ts`. | M1 | survey |
| 2 | Default Seed Clues Population | Populate clinical descriptive clues in English and Traditional Chinese for all 102 default cards in `src/services/db/defaultData.ts`. | M1 | survey |
| 3 | Non-Destructive DB Backfill | In `AppDatabase.initializeDefaults()`, backfill `clue` and `clueZh` for existing database cards without overwriting user edits. | M1 | survey |
| 4 | Card Editor Modal Clue Fields | Add `clue` and `clueZh` state hooks and UI form fields in `src/components/caregiver/CardEditorModal.tsx`. | M1 | survey |
| 5 | ISO 8601 Week Key Calculation | Compute UTC-normalized calendar week key `YYYY-Www` with nearest-Thursday ISO logic in `weeklyCardSelector.ts`. | M2 | survey |
| 6 | Seeded Deterministic PRNG | Implement FNV-1a 32-bit string hash + Mulberry32 generator for zero-dependency deterministic randomness. | M2 | survey |
| 7 | Deterministic Weekly Card Selector | Implement `getWeeklyCardsForCategory` (and `selectWeeklyCards`) to deterministically select up to 5 cards per category per week. | M2 | survey |
| 8 | Small Category Edge Case Handling | If a category has <= 5 cards (e.g. `cat-family`, `cat-places`), return all category cards directly without truncation. | M2 | survey |
| 9 | Weekly Selector Unit Test Suite | Comprehensive unit tests in `tests/weeklyCardSelector.test.ts` verifying determinism, stability across days, rotation on week change, and <=5 cards. | M2 | survey |
| 10 | Transpiler & Test Runner Integration | Update `scripts/transpile.js` and `tests/run_all_tests.js` to compile and execute `.ts` test files. | M2 | survey |
| 11 | Category-Based Therapy Session View | Update `TherapySessionView.tsx` to support tab selection across all 9 AAC categories, progress counter, score tracking, and celebrations. | M3 | survey |
| 12 | App.tsx Therapy Connection | Pass live `categories` and `cards` props from `useDatabase()` to `TherapySessionView` in `src/App.tsx`. | M3 | survey |
| 13 | Front Face Clue & Speak Button | Update `FlashcardDeck.tsx` Front Face with Clue badge, Tap to flip badge, card emoji, bilingual clues, and bilingual Speak button with `e.stopPropagation()`. | M3 | survey |
| 14 | Back Face Answer & Speak Button | Update `FlashcardDeck.tsx` Back Face with Answer badge, Tap to flip badge, target words, removed phonetic syllables, and bilingual Speak button. | M3 | survey |
| 15 | Caregiver Speech Language Adherence | Ensure Clue and Answer Speak buttons adhere to Caregiver `cardSpeechLanguage` setting via `useAudio().speakBilingual`. | M3 | survey |
| 16 | E2E Opaque-Box Test Suite (Tiers 1-4) | Comprehensive requirement-driven opaque-box test suite across all 4 tiers published in `TEST_READY.md`. | E2E-Track | survey |
| 17 | Final E2E Verification & Adversarial Hardening (Tier 5) | Pass 100% of all tests (`npm test`), production build (`npm run build`), and execute Tier 5 adversarial stress testing. | M4 | survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Track | Design test infrastructure (`TEST_INFRA.md`), test cases across Tiers 1-4, and publish `TEST_READY.md`. | none | DONE |
| M1 | Data Model & Clue Population | R1: `AACCard` types (`src/types/index.ts`), 102+ card clues in `src/services/db/defaultData.ts`, DB migration in `src/services/db/AppDatabase.ts`, `CardEditorModal.tsx`. | none | DONE |
| M2 | Deterministic Weekly Selector Engine | R2: `src/services/therapy/weeklyCardSelector.ts`, unit tests in `tests/weeklyCardSelector.test.ts`, transpiler & runner updates. | M1 | DONE |
| M3 | Category Therapy View & FlashcardDeck UI | R3, R4, R5: `TherapySessionView.tsx`, `FlashcardDeck.tsx`, `App.tsx`, speech playback integration. | M1, M2 | DONE |
| M4 | Final E2E Pass & Adversarial Hardening | Verification of 100% test pass (`npm test`), build (`npm run build`), Tier 5 adversarial testing, and forensic integrity audit. | M1, M2, M3, E2E | DONE |

## Interface Contracts
### Data Model (`src/types/index.ts`)
```typescript
export interface AACCard {
  id: string;
  categoryId: string;
  label: string;
  labelZh?: string;
  spokenText: string;
  spokenTextZh?: string;
  phoneticSyllables?: string;
  clue?: string;     // Clinical descriptive clue in English
  clueZh?: string;   // Clinical descriptive clue in Traditional Chinese
  fitzgeraldCategory: FitzgeraldCategory;
  icon?: string;
  imageBlobId?: string;
  audioBlobId?: string;
  order: number;
  isFavorite?: boolean;
  createdAt: number;
  updatedAt: number;
}
```

### Weekly Selector (`src/services/therapy/weeklyCardSelector.ts`)
```typescript
export function getISOWeekKey(dateInput?: Date | string | number): string;
export function hashString(str: string): number;
export function createMulberry32(seed: number): () => number;
export function getWeeklyCardsForCategory(
  allCards: AACCard[],
  categoryId: string,
  weekKeyOrDate?: string | Date | number,
  count?: number
): AACCard[];
export const selectWeeklyCards = getWeeklyCardsForCategory;
```

### FlashcardDeck (`src/components/therapy/FlashcardDeck.tsx`)
```typescript
interface FlashcardDeckProps {
  card: AACCard;
  isFlipped: boolean;
  onFlip: () => void;
}
```

### TherapySessionView (`src/components/therapy/TherapySessionView.tsx`)
```typescript
interface TherapySessionViewProps {
  categories: AACCategory[];
  cards: AACCard[];
}
```

## Code Layout
- `src/types/index.ts`: Core type interfaces
- `src/services/db/defaultData.ts`: Default seed categories and 102 cards
- `src/services/db/AppDatabase.ts`: Dexie database schema and non-destructive initialization/sync
- `src/components/caregiver/CardEditorModal.tsx`: Caregiver card editor modal
- `src/services/therapy/weeklyCardSelector.ts`: Deterministic weekly 5-card selection engine
- `src/components/therapy/TherapySessionView.tsx`: Word finding category therapy session view
- `src/components/therapy/FlashcardDeck.tsx`: 3D flashcard component with clue/answer faces and speech buttons
- `src/App.tsx`: Root application view router and state wiring
- `tests/weeklyCardSelector.test.ts`: Dedicated unit tests for weekly card selector
- `scripts/transpile.js` & `tests/run_all_tests.js`: Test transpiler and test suite runner
