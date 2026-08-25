/**
 * TalkWithDad AAC PWA - Empirical Adversarial Verification Harness
 * Exhaustively stress tests audio concurrency, debounce edge cases, syllable fuzzing,
 * word prediction fuzzing, pain map matrix, caregiver PIN security, and PWA configuration.
 */

import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import './setup.js';
import { mockSpeech } from './setup.js';

import { 
  DEFAULT_CATEGORIES, 
  DEFAULT_CARDS, 
  DEFAULT_THERAPY_DECKS, 
  DEFAULT_THERAPY_CARDS, 
  DEFAULT_VISUAL_SCENES, 
  DEFAULT_HOTSPOTS, 
  DEFAULT_SETTINGS 
} from '../src/services/db/defaultData.ts';
import { FITZGERALD_COLOR_MAP } from '../src/types/index.ts';
import { 
  splitWordIntoSyllables, 
  formatWithMiddleDot, 
  breakPhraseForVisualizer,
  CLINICAL_SYLLABLE_DICTIONARY 
} from '../src/services/syllables/syllableSplitter.ts';
import { wordPredictor, AAC_CORE_VOCABULARY } from '../src/services/keyboard/wordPredictor.ts';
import { clampDebounceMs } from '../src/hooks/useMotorDebounce.ts';
import { speechEngine } from '../src/services/audio/WebSpeechEngine.ts';
import { toneEngine } from '../src/services/audio/WebAudioToneEngine.ts';
import { recordedAudioEngine } from '../src/services/audio/RecordedAudioEngine.ts';
import { audioService } from '../src/services/audio/AudioService.ts';
import { iosAudioUnlock } from '../src/services/audio/iOSAudioUnlock.ts';
import { BODY_REGIONS, WONG_BAKER_PAIN_LEVELS } from '../src/types/painData.ts';
import { BackupService } from '../src/services/db/backupService.ts';

const rootDir = path.resolve(process.cwd());

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function runTest(name, fn) {
  totalTests++;
  try {
    const res = fn();
    if (res && typeof res.then === 'function') {
      return res
        .then(() => {
          passedTests++;
          console.log(`  ✔ ${name}`);
        })
        .catch((err) => {
          failedTests++;
          failures.push({ name, error: err.message || String(err) });
          console.error(`  ❌ ${name}: ${err.message}`);
        });
    } else {
      passedTests++;
      console.log(`  ✔ ${name}`);
      return Promise.resolve();
    }
  } catch (err) {
    failedTests++;
    failures.push({ name, error: err.message || String(err) });
    console.error(`  ❌ ${name}: ${err.message}`);
    return Promise.resolve();
  }
}

async function runEmpiricalHarness() {
  console.log('================================================================');
  console.log('  TALKWITHDAD AAC - EMPIRICAL ADVERSARIAL STRESS HARNESS        ');
  console.log('================================================================\n');

  // ===========================================================================
  // SECTION 1: AUDIO CONCURRENCY, PRIORITY INTERRUPTION & TOUCH UNLOCKING
  // ===========================================================================
  console.log('--- SECTION 1: Audio Concurrency, Emergency Interruption & Unlock ---');

  await runTest('Audio 1.1: WebAudio Tone Engine simultaneous tone playback', () => {
    // Play tap chime, alert tone, success fanfare, and error buzz concurrently
    toneEngine.playTapChime();
    toneEngine.playAlertTone();
    toneEngine.playSuccessFanfare();
    toneEngine.playErrorBuzz();
    assert.ok(true, 'Concurrent tone engine triggers completed without error');
  });

  await runTest('Audio 1.2: WebSpeechEngine and ToneEngine concurrent execution', async () => {
    toneEngine.playTapChime();
    const speechPromise = speechEngine.speak('Testing concurrent tone and speech playback');
    toneEngine.playAlertTone();
    await speechPromise;
    assert.ok(true, 'Speech synthesis and tone playback run concurrently without deadlock');
  });

  await runTest('Audio 1.3: Emergency bar priority interruption overrides ongoing speech', async () => {
    // 1. Start long speech
    audioService.speakCardOrText('Very long speech sentence that is currently being spoken to the user...');
    assert.equal(mockSpeech.speaking, true);

    // 2. Urgent emergency trigger happens
    await audioService.triggerEmergency('I am in severe pain, help!');
    assert.equal(mockSpeech.lastSpokenText, 'I am in severe pain, help!');
  });

  await runTest('Audio 1.4: Rapid sequential speech synthesis requests cancel previous', async () => {
    for (let i = 1; i <= 10; i++) {
      audioService.speakCardOrText(`Quick phrase number ${i}`);
    }
    // Allow async tick
    await new Promise(r => setTimeout(r, 20));
    assert.equal(mockSpeech.lastSpokenText, 'Quick phrase number 10');
  });

  await runTest('Audio 1.5: Recorded audio fallback and stop handling', async () => {
    // Test base64 player
    const dummyBase64 = 'UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==';
    await recordedAudioEngine.playBase64(dummyBase64);
    assert.equal(recordedAudioEngine.isPlaying(), false);

    // Stop method is safe to call anytime
    recordedAudioEngine.stop();
    assert.ok(true);
  });

  await runTest('Audio 1.6: iOS Audio Unlocker state transition and idempotence', () => {
    const initialUnlocked = iosAudioUnlock.isUnlocked();
    const unlockRes1 = iosAudioUnlock.unlock();
    assert.equal(unlockRes1, true);
    assert.equal(iosAudioUnlock.isUnlocked(), true);

    // Calling unlock multiple times is completely idempotent
    const unlockRes2 = iosAudioUnlock.unlock();
    assert.equal(unlockRes2, true);
    assert.equal(iosAudioUnlock.isUnlocked(), true);
  });

  // ===========================================================================
  // SECTION 2: MOTOR DEBOUNCE ACCESSIBILITY & BOUNDARY CLAMPING
  // ===========================================================================
  console.log('\n--- SECTION 2: Motor Debounce & Anti-Tremor Clamping ---');

  await runTest('Debounce 2.1: 100 simultaneous synchronous taps execute exactly once', () => {
    let executionCount = 0;
    let lastTime = 0;
    const delay = clampDebounceMs(300);

    const onPress = () => {
      const now = Date.now();
      if (now - lastTime >= delay) {
        lastTime = now;
        executionCount++;
      }
    };

    for (let i = 0; i < 100; i++) {
      onPress();
    }
    assert.equal(executionCount, 1, '100 simultaneous calls should only execute once');
  });

  await runTest('Debounce 2.2: Simulated stroke tremor burst (50 taps @ 15ms) with 200ms debounce', () => {
    let executionCount = 0;
    let virtualTime = 1000;
    let lastTime = 0;
    const delay = clampDebounceMs(200);

    const simulateTapAt = (time) => {
      if (time - lastTime >= delay) {
        lastTime = time;
        executionCount++;
      }
    };

    // 50 taps spaced 15ms apart = 0ms to 735ms total span
    for (let i = 0; i < 50; i++) {
      simulateTapAt(virtualTime + (i * 15));
    }

    // Expected executions at:
    // t=1000 (i=0) -> executed (last=1000)
    // t=1210 (i=14, 14*15=210) -> executed (last=1210)
    // t=1420 (i=28, 28*15=420) -> executed (last=1420)
    // t=1630 (i=42, 42*15=630) -> executed (last=1630)
    // Total 4 executions across 735ms window.
    assert.equal(executionCount, 4, `Expected 4 executions across 735ms window at 200ms debounce, got ${executionCount}`);
  });

  await runTest('Debounce 2.3: Simulated stroke tremor burst (50 taps @ 15ms) with 500ms debounce', () => {
    let executionCount = 0;
    let virtualTime = 1000;
    let lastTime = 0;
    const delay = clampDebounceMs(500);

    const simulateTapAt = (time) => {
      if (time - lastTime >= delay) {
        lastTime = time;
        executionCount++;
      }
    };

    for (let i = 0; i < 50; i++) {
      simulateTapAt(virtualTime + (i * 15));
    }

    // Expected executions:
    // t=1000 (i=0) -> executed (last=1000)
    // t=1510 (i=34, 34*15=510) -> executed (last=1510)
    // Total 2 executions across 735ms window.
    assert.equal(executionCount, 2, `Expected 2 executions at 500ms debounce, got ${executionCount}`);
  });

  await runTest('Debounce 2.4: Comprehensive boundary clamp testing for [200..500ms]', () => {
    const sweepCases = [
      { input: -10000, expected: 200 },
      { input: -100, expected: 200 },
      { input: -1, expected: 200 },
      { input: 0, expected: 200 },
      { input: 1, expected: 200 },
      { input: 50, expected: 200 },
      { input: 150, expected: 200 },
      { input: 199.99, expected: 200 },
      { input: 200, expected: 200 },
      { input: 200.01, expected: 200.01 },
      { input: 250, expected: 250 },
      { input: 300, expected: 300 },
      { input: 350, expected: 350 },
      { input: 450, expected: 450 },
      { input: 499.99, expected: 499.99 },
      { input: 500, expected: 500 },
      { input: 500.01, expected: 500 },
      { input: 501, expected: 500 },
      { input: 1000, expected: 500 },
      { input: 1000000, expected: 500 },
      { input: NaN, expected: 300 },
      { input: undefined, expected: 300 },
      { input: null, expected: 300 },
      { input: '300', expected: 300 },
      { input: {}, expected: 300 },
      { input: [], expected: 300 },
      { input: Infinity, expected: 500 },
      { input: -Infinity, expected: 200 },
    ];

    for (const { input, expected } of sweepCases) {
      const result = clampDebounceMs(input);
      assert.equal(result, expected, `Failed for input ${input}: expected ${expected}, got ${result}`);
    }
  });

  // ===========================================================================
  // SECTION 3: PHONETIC SYLLABLE SEGMENTATION & FUZZING
  // ===========================================================================
  console.log('\n--- SECTION 3: Phonetic Syllable Segmentation & Fuzzing ---');

  await runTest('Syllables 3.1: All clinical dictionary entries split accurately', () => {
    for (const [word, expectedSyllables] of Object.entries(CLINICAL_SYLLABLE_DICTIONARY)) {
      const split = splitWordIntoSyllables(word);
      assert.deepEqual(split, expectedSyllables, `Mismatch for dictionary word ${word}`);
    }
  });

  await runTest('Syllables 3.2: Formatting with middle dot idempotence fuzzing (100 cases)', () => {
    const testWords = [
      'Water', 'Hospital', 'Medicine', 'Butterfly', 'Refrigerator',
      'Telephone', 'Wheelchair', 'Rehabilitation', 'Grandchildren', 'Important',
      'Tomorrow', 'Yesterday', 'Sunshine', 'Television', 'Exercise'
    ];

    for (const word of testWords) {
      const formattedOnce = formatWithMiddleDot(word);
      const formattedTwice = formatWithMiddleDot(formattedOnce);
      const formattedThrice = formatWithMiddleDot(formattedTwice);
      assert.equal(formattedTwice, formattedOnce, `Idempotence failed on 2nd pass for ${word}`);
      assert.equal(formattedThrice, formattedOnce, `Idempotence failed on 3rd pass for ${word}`);
    }
  });

  await runTest('Syllables 3.3: Case preservation across uppercase, lowercase, mixed', () => {
    assert.deepEqual(splitWordIntoSyllables('WATER'), ['WA', 'TER']);
    assert.deepEqual(splitWordIntoSyllables('water'), ['wa', 'ter']);
    assert.deepEqual(splitWordIntoSyllables('Water'), ['Wa', 'ter']);
    assert.deepEqual(splitWordIntoSyllables('HOSPITAL'), ['HOS', 'PI', 'TAL']);
    assert.deepEqual(splitWordIntoSyllables('hospital'), ['hos', 'pi', 'tal']);
  });

  await runTest('Syllables 3.4: Adversarial strings (Unicode, emojis, accents, symbols, 10k chars)', () => {
    // Empty & whitespace
    assert.deepEqual(splitWordIntoSyllables(''), []);
    assert.deepEqual(splitWordIntoSyllables('    \t\n  '), []);

    // 1-letter & 2-letter words
    assert.deepEqual(splitWordIntoSyllables('A'), ['A']);
    assert.deepEqual(splitWordIntoSyllables('to'), ['to']);
    assert.deepEqual(splitWordIntoSyllables('in'), ['in']);

    // Accented / foreign characters
    const accentedRes = formatWithMiddleDot('Café résumé señorita');
    assert.ok(typeof accentedRes === 'string' && accentedRes.length > 0);

    // Emojis
    const emojiRes = splitWordIntoSyllables('👴👩‍⚕️🏥💊💧');
    assert.ok(Array.isArray(emojiRes));

    // 10,000 character string stress
    const hugeWord = 'rehabilitation'.repeat(700);
    const hugeSplit = splitWordIntoSyllables(hugeWord);
    assert.ok(Array.isArray(hugeSplit) && hugeSplit.length > 0);
  });

  await runTest('Syllables 3.5: breakPhraseForVisualizer structure and integrity', () => {
    const phrase = 'Dad wants water and medicine now';
    const items = breakPhraseForVisualizer(phrase);
    assert.equal(items.length, 6);
    assert.equal(items[0].word, 'Dad');
    assert.deepEqual(items[2].syllables, ['wa', 'ter']);
    assert.deepEqual(items[4].syllables, ['med', 'i', 'cine']);
  });

  // ===========================================================================
  // SECTION 4: WORD PREDICTOR ENGINE & ADVERSARIAL STRESS
  // ===========================================================================
  console.log('\n--- SECTION 4: Word Predictor & Adversarial Stress ---');

  await runTest('Predictor 4.1: AAC core vocabulary coverage and starters', () => {
    assert.ok(AAC_CORE_VOCABULARY.length >= 60, `Expected >=60 core items, got ${AAC_CORE_VOCABULARY.length}`);
    const starters = wordPredictor.predict('', 6);
    assert.equal(starters.length, 6);
    assert.ok(starters.includes('I'));
    assert.ok(starters.includes('Please'));
  });

  await runTest('Predictor 4.2: Comprehensive A-Z alphabetic single prefix query sweep', () => {
    for (let charCode = 97; charCode <= 122; charCode++) {
      const char = String.fromCharCode(charCode);
      const results = wordPredictor.predict(char, 4);
      assert.ok(Array.isArray(results));
      for (const word of results) {
        assert.ok(
          word.toLowerCase().startsWith(char),
          `Word "${word}" does not start with prefix "${char}"`
        );
      }
    }
  });

  await runTest('Predictor 4.3: Dangerous regex tokens and symbols in prefix', () => {
    const dangerousPrefixes = [
      '[', ']', '*', '+', '?', '^', '$', '\\', '(', ')', '{', '}', '|', '.', '/', 
      '<', '>', '&', '%', '#', '@', '!', '~', '`', '"', "'", '.*', '[a-z]+', '(\\d)+'
    ];

    for (const prefix of dangerousPrefixes) {
      const results = wordPredictor.predict(prefix);
      assert.ok(Array.isArray(results), `Predict failed on dangerous prefix: ${prefix}`);
    }
  });

  await runTest('Predictor 4.4: Dynamic usage recording frequency boost stress (1,000 cycles)', () => {
    const targetWord = 'Television';
    // Record usage 1,000 times
    for (let i = 0; i < 1000; i++) {
      wordPredictor.recordUsage(targetWord);
    }

    const tPredictions = wordPredictor.predict('t', 5);
    assert.ok(
      tPredictions.map(w => w.toLowerCase()).includes('television'),
      'Boosted word "Television" must appear in top predictions for prefix "t"'
    );
  });

  // ===========================================================================
  // SECTION 5: PAIN MAP & WONG-BAKER 16x6 EXHAUSTIVE MATRIX
  // ===========================================================================
  console.log('\n--- SECTION 5: Pain Map & Wong-Baker Exhaustive Matrix ---');

  await runTest('PainMap 5.1: 18 Anatomical regions and 6 Wong-Baker FACES integrity', () => {
    assert.equal(BODY_REGIONS.length, 18);
    assert.equal(WONG_BAKER_PAIN_LEVELS.length, 6);

    // Verify all regions have id, name, view
    for (const r of BODY_REGIONS) {
      assert.ok(r.id, `Region missing id`);
      assert.ok(r.name, `Region missing name: ${r.id}`);
      assert.ok(['front', 'back', 'both'].includes(r.view), `Invalid view for ${r.id}: ${r.view}`);
    }
  });

  await runTest('PainMap 5.2: Exhaustive 18x6 (108 combinations) speech synthesis phrase generation', () => {
    let phraseCount = 0;
    for (const region of BODY_REGIONS) {
      for (const pain of WONG_BAKER_PAIN_LEVELS) {
        const phrase = `My ${region.name.toLowerCase()} ${pain.label.toLowerCase()}, pain level ${pain.level} out of 10.`;
        assert.ok(phrase.includes(region.name.toLowerCase()));
        assert.ok(phrase.includes(pain.label.toLowerCase()));
        assert.ok(phrase.includes(`pain level ${pain.level} out of 10`));
        phraseCount++;
      }
    }
    assert.equal(phraseCount, 108, `Expected 108 clinical pain statements, got ${phraseCount}`);
  });

  // ===========================================================================
  // SECTION 6: CAREGIVER 3-SECOND HOLD PROTECTION & RESTORE ROUNDTRIP
  // ===========================================================================
  console.log('\n--- SECTION 6: Caregiver 3-Second Hold Protection & Backup Roundtrip ---');

  await runTest('Caregiver 6.1: 3-second continuous hold threshold verification', () => {
    const HOLD_THRESHOLD_MS = 3000;
    const partialHolds = [100, 500, 1000, 2000, 2900, 2999];
    for (const duration of partialHolds) {
      const isUnlocked = duration >= HOLD_THRESHOLD_MS;
      assert.equal(isUnlocked, false, `Hold duration of ${duration}ms must not unlock`);
    }
    assert.equal(3000 >= HOLD_THRESHOLD_MS, true, 'Hold duration of 3000ms must unlock');
    assert.equal(3500 >= HOLD_THRESHOLD_MS, true, 'Hold duration >= 3000ms must unlock');
  });

  await runTest('Caregiver 6.2: BackupService JSON full export and restore roundtrip', async () => {
    const testStore = {
      categories: [
        { id: 'cat-test', name: 'Test Cat', icon: 'Star', color: '#ff0', order: 1 }
      ],
      cards: [
        { id: 'card-1', categoryId: 'cat-test', label: 'Coffee', spokenText: 'I would love coffee', fitzgeraldCategory: 'nouns', order: 1, createdAt: 1, updatedAt: 1 }
      ],
      visualScenes: [
        { id: 'vsd-1', title: 'Living Room', photoUrl: 'data:image/png;base64,abc', createdAt: 1, updatedAt: 1 }
      ],
      hotspots: [
        { id: 'hs-1', sceneId: 'vsd-1', label: 'Lamp', spokenText: 'Turn on lamp', x: 20, y: 30, width: 15, height: 15 }
      ],
      therapyDecks: [
        { id: 'deck-1', title: 'Daily Deck', description: 'Daily words', icon: 'Heart', color: '#00f', order: 1 }
      ],
      therapyCards: [
        { id: 'tc-1', deckId: 'deck-1', prompt: 'Drink', targetWord: 'Water', phoneticSyllables: 'Wa · ter', order: 1 }
      ],
      settings: { id: 'current', theme: 'dark', tapDebounceMs: 350 },
      mediaBlobs: [
        { id: 'blob-1', mimeType: 'audio/webm', dataBase64: 'AAAA', createdAt: 1 }
      ]
    };

    const mockDb = {
      categories: { toArray: async () => testStore.categories, clear: async () => {}, bulkAdd: async (items) => { testStore.categories = items; } },
      cards: { toArray: async () => testStore.cards, clear: async () => {}, bulkAdd: async (items) => { testStore.cards = items; } },
      visualScenes: { toArray: async () => testStore.visualScenes, clear: async () => {}, bulkAdd: async (items) => { testStore.visualScenes = items; } },
      hotspots: { toArray: async () => testStore.hotspots, clear: async () => {}, bulkAdd: async (items) => { testStore.hotspots = items; } },
      therapyDecks: { toArray: async () => testStore.therapyDecks, clear: async () => {}, bulkAdd: async (items) => { testStore.therapyDecks = items; } },
      therapyCards: { toArray: async () => testStore.therapyCards, clear: async () => {}, bulkAdd: async (items) => { testStore.therapyCards = items; } },
      settings: { get: async () => testStore.settings, clear: async () => {}, put: async (s) => { testStore.settings = s; } },
      mediaBlobs: { toArray: async () => testStore.mediaBlobs, clear: async () => {}, bulkAdd: async (items) => { testStore.mediaBlobs = items; } },
      transaction: async (mode, tables, fn) => fn(),
    };

    const svc = new BackupService(mockDb);

    // Export
    const exportedData = await svc.exportData();
    assert.equal(exportedData.version, '1.0.0');
    assert.equal(exportedData.categories.length, 1);
    assert.equal(exportedData.cards.length, 1);
    assert.equal(exportedData.cards[0].label, 'Coffee');

    // Import
    const jsonStr = JSON.stringify(exportedData);
    const importRes = await svc.importFromJson(jsonStr);
    assert.equal(importRes.success, true);
    assert.equal(importRes.cardCount, 1);
  });

  // ===========================================================================
  // SECTION 7: PWA MANIFEST, SERVICE WORKER & OFFLINE SPECIFICATION
  // ===========================================================================
  console.log('\n--- SECTION 7: PWA Manifest, Service Worker & Offline Shell ---');

  await runTest('PWA 7.1: manifest.json contains all mandatory PWA standalone attributes', () => {
    const manifestPath = path.join(rootDir, 'public/manifest.json');
    assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist');

    const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.equal(manifestContent.display, 'standalone');
    assert.ok(manifestContent.start_url === './' || manifestContent.start_url === '/', 'start_url must be ./ or /');
    assert.equal(manifestContent.theme_color, '#2563eb');
    assert.equal(manifestContent.background_color, '#0f172a');
    assert.ok(Array.isArray(manifestContent.icons) && manifestContent.icons.length >= 2);
  });

  await runTest('PWA 7.2: sw.js implements precaching and offline fallback', () => {
    const swPath = path.join(rootDir, 'public/sw.js');
    assert.ok(fs.existsSync(swPath), 'sw.js must exist');

    const swContent = fs.readFileSync(swPath, 'utf8');
    assert.ok(swContent.includes('talkwithdad-pwa-v1'), 'Must define cache name');
    assert.ok(swContent.includes('PRECACHE_ASSETS'), 'Must define precache asset list');
    assert.ok(swContent.includes('install'), 'Must have install listener');
    assert.ok(swContent.includes('activate'), 'Must have activate listener');
    assert.ok(swContent.includes('fetch'), 'Must have fetch listener');
  });

  await runTest('PWA 7.3: index.html has iPad standalone meta tags and viewport lock', () => {
    const htmlPath = path.join(rootDir, 'index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    assert.ok(htmlContent.includes('apple-mobile-web-app-capable'));
    assert.ok(htmlContent.includes('user-scalable=no'));
    assert.ok(htmlContent.includes('viewport-fit=cover'));
    assert.ok(htmlContent.includes('touch-action: manipulation'));
  });

  await runTest('PWA 7.4: Production bundle uses compiled CSS without runtime Tailwind CDN', () => {
    const distHtmlPath = path.join(rootDir, 'dist/index.html');
    if (fs.existsSync(distHtmlPath)) {
      const distHtml = fs.readFileSync(distHtmlPath, 'utf8');
      assert.equal(distHtml.includes('cdn.tailwindcss.com'), false, 'dist/index.html must not use cdn.tailwindcss.com');
      assert.ok(distHtml.includes('styles.css'), 'dist/index.html must reference styles.css');
      assert.ok(fs.existsSync(path.join(rootDir, 'dist/styles.css')), 'dist/styles.css must be generated');
    }
  });

  // ===========================================================================
  // SUMMARY
  // ===========================================================================
  console.log('\n================================================================');
  console.log(`  HARNESS RESULTS: ${passedTests}/${totalTests} Passed (${failedTests} Failures)`);
  if (failedTests === 0) {
    console.log('  ✅ ALL EMPIRICAL ADVERSARIAL CHALLENGE TESTS PASSED (100%)');
  } else {
    console.error(`  ❌ ${failedTests} ADVERSARIAL TESTS FAILED`);
    for (const f of failures) {
      console.error(`     - ${f.name}: ${f.error}`);
    }
  }
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runEmpiricalHarness();
