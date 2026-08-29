# Project: Talk With Dad — Accessible Redesign

## Architecture
Talk With Dad is a React 18 + TypeScript + Vite + Tailwind CSS Progressive Web Application (PWA) designed for stroke survivors with aphasia, cognitive impairment, and low vision.
The accessible redesign optimizes the AAC grid, word finding therapy, orientation systems, and multi-device ergonomics across iPad 11" (primary), mobile phone (secondary), and desktop (tertiary).

```
Talk With Dad
├── AAC Grid System (R1)
│   ├── GridCard.tsx (100% surface touch speech, zero info badge mis-tap hazard)
│   ├── CardGrid.tsx (dynamic responsive 2-col mobile, 3-4 col iPad, 4-5 col desktop)
│   └── DebouncedTouchable.tsx / useMotorDebounce.ts (anti-tremor debounce 200-500ms)
├── Word Finding Therapy System (R2)
│   ├── defaultData.ts (121 SLP sentence-completion carrier cues with zero spoilers)
│   ├── TherapySessionView.tsx (auto-speak on mount, desktop keyboard shortcuts)
│   └── FlashcardDeck.tsx (3-level hint ladder, streamlined answer back face)
├── Today & Orientation Tab (R3)
│   ├── TodayOrientationView.tsx (visual Day-Phase anchors 🌅/☀️/🌆/🌙, composite speech)
│   ├── WeekdayBar.tsx (>=68px iPad / >=56px mobile touch targets, >=18px bold dates)
│   └── Location Orientation Card (country flag, bold city/state, 1-tap audio)
└── Multi-Device Ergonomics & Testing (R4 & Invariants)
    ├── MainContainer.tsx (responsive container margins, viewport padding)
    ├── tier14_card_4pillar_invariants.test.js (updated 3-level hint ladder invariant)
    └── tier15_accessible_redesign.test.js (complete R1-R4 automated test suite)
```

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Info Badge Removal & 100% Surface Speech | Strip 14px info icon (ℹ️) from patient card face; 100% of surface triggers voice | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Anti-Tremor Debouncing | Clamp touch debouncing (200-500ms) to prevent double speech on spastic tremors | M1 | ORIGINAL_REQUEST §R1 |
| 3 | Enlarged Canonical Emojis & Bilingual Text | Large canonical emojis (`text-5xl sm:text-6xl md:text-7xl`) and high contrast bilingual labels | M1 | ORIGINAL_REQUEST §R1 |
| 4 | Thickened Fitzgerald Category Borders | Color-coded 4px Fitzgerald category borders across 8 standard roles | M1 | ORIGINAL_REQUEST §R1 |
| 5 | Dynamic Responsive Grid Columns | 2 cols on mobile (<640px), 3–4 cols on iPad (640-1024px), 4–5 cols on desktop (>1024px) | M1 | ORIGINAL_REQUEST §R1 |
| 6 | SLP Carrier Cues Data Population | Rewrite 121 card clues to sentence completion cues ending in `...` (zero spoilers) | M2 | ORIGINAL_REQUEST §R2 |
| 7 | Auto-Speak Carrier Clue on Mount | Auto-speak carrier cue when card mounts/changes to bypass alexia reading barriers | M2 | ORIGINAL_REQUEST §R2 |
| 8 | 3-Level Progressive Hint Ladder | L1: 🔊 Hear Clue, L2: 🗣️ First Sound, L3: 💡 First Letter & category cue (no 2N+1 taps) | M2 | ORIGINAL_REQUEST §R2 |
| 9 | Streamlined Flipped Answer Card | Back face shows ONLY emoji, bold bilingual label, phonetic syllables, and 1-tap Speak | M2 | ORIGINAL_REQUEST §R2 |
| 10 | Desktop Keyboard Navigation | Space to flip, Enter for Got It Right, Arrow keys for Prev/Next | M2 | ORIGINAL_REQUEST §R2 |
| 11 | Visual Day-Phase Temporal Anchors | Active Day-Phase badge: 🌅 Morning / ☀️ Afternoon / 🌆 Evening / 🌙 Night | M3 | ORIGINAL_REQUEST §R3 |
| 12 | Enlarged Weekday Bar Touch Targets | Touch height >=68px on iPad, >=56px on mobile, bold date numbers >=18px, amber TODAY | M3 | ORIGINAL_REQUEST §R3 |
| 13 | Bold Location Orientation Card | Clean high-contrast card: country flag, prominent City & State, 1-tap audio speech | M3 | ORIGINAL_REQUEST §R3 |
| 14 | Composite Orientation Speech | Chained bilingual speech synthesis with card highlights and 1-tap stop | M3 | ORIGINAL_REQUEST §R3 |
| 15 | Multi-Device Layout Optimization | Ergonomics tuned for iPad 11" primary, mobile secondary, desktop tertiary | M4 | ORIGINAL_REQUEST §R4 |
| 16 | Accessible Redesign Test Suite | New `tier15_accessible_redesign.test.js` covering all R1-R4 requirements | M4 | ORIGINAL_REQUEST §Verification |
| 17 | Test Suite & Build Verification | 100% pass across all 16 test suites, invariant checks, fuzzer, and production build | M4 | ORIGINAL_REQUEST §Verification |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Patient-Accessible AAC Cards & Grid | `GridCard.tsx`, `CardGrid.tsx`, `types/index.ts` | none | DONE |
| M2 | Word Finding Therapy Redesign | `defaultData.ts`, `TherapySessionView.tsx`, `FlashcardDeck.tsx` | none | DONE |
| M3 | Today & Orientation Tab Simplification | `TodayOrientationView.tsx`, `WeekdayBar.tsx`, `WorldMapSvg.tsx` | none | DONE |
| M4 | Multi-Device Layout & Test Invariant Hardening | `tier14_card_4pillar_invariants.test.js`, `tier15_accessible_redesign.test.js`, `run_all_tests.js` | M1, M2, M3 | DONE |

## Interface Contracts
### GridCard ↔ CardGrid
- `GridCard` receives `card: AACCard`, `onSelect: (card: AACCard) => void`, `fontSize?: string`, `debounceMs?: number`.
- `GridCard` wraps 100% of its outer container in `DebouncedTouchable` calling `onSelect(card)`. No nested clickable buttons or info icons exist.

### TherapySessionView ↔ FlashcardDeck
- `FlashcardDeck` receives `card: AACCard`, `isFlipped: boolean`, `onFlip: () => void`, `hintLevel: number`, `onAdvanceHint: () => void`, `onSpeakCurrentHint: () => void`.
- Front face shows: "Clue" pill badge, "Tap to flip" badge, SLP carrier prompt (`card.clue` / `card.clueZh`), and 3-Level Hint Ladder buttons.
- Back face shows: "Answer" pill badge, "Tap to flip" badge, `card.icon`, `card.label`, `card.labelZh`, `card.phoneticSyllables`, and a full-width "Speak Word" button (`speakBilingual(card.label, card.labelZh)`).

### TodayOrientationView ↔ WeekdayBar & Location Card
- `WeekdayBar` receives `selectedDate: Date`, `onSelectDay: (date: Date) => void`. Each day button has `min-h-[58px] sm:min-h-[68px]`, date font `text-lg sm:text-xl font-black`.
- Location Card renders country flag (48px+), bold city and state, and 1-tap audio speech button calling `speakBilingual(locationSpeechEn, locationSpeechZh)`.

## Code Layout
- `src/components/grid/GridCard.tsx`: AAC card face component
- `src/components/grid/CardGrid.tsx`: AAC grid container component
- `src/services/db/defaultData.ts`: Default 121 AAC cards with SLP carrier cues
- `src/components/therapy/TherapySessionView.tsx`: Therapy container with auto-speak & keyboard shortcuts
- `src/components/therapy/FlashcardDeck.tsx`: Flashcard with 3-level hint ladder and streamlined back face
- `src/components/today/TodayOrientationView.tsx`: Orientation view with Day Phase badge & Location card
- `src/components/today/WeekdayBar.tsx`: 7-day strip with enlarged touch targets and >=18px dates
- `src/components/today/WorldMapSvg.tsx`: Streamlined Location Orientation component
- `tests/suites/tier14_card_4pillar_invariants.test.js`: Invariant tests (updated for 3-level hint ladder)
- `tests/suites/tier15_accessible_redesign.test.js`: Comprehensive automated test suite for R1-R4
- `tests/run_all_tests.js`: Master test suite runner registering all test suites
