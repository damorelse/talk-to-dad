/**
 * TalkWithDad AAC PWA - Comprehensive Master Test Runner
 * Transpiles and executes all 5 tiers of automated test suites.
 */

import { spawnSync, spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('    TALKWITHDAD AAC PROGRESSIVE WEB APP - TEST HARNESS          ');
console.log('================================================================');

// 1. Run transpile step
console.log('Step 1: Transpiling application and test suites to runtime JavaScript...');
const transpileRes = spawnSync(process.execPath, [path.join(rootDir, 'scripts/transpile.js')], {
  stdio: 'inherit',
  cwd: rootDir,
});

if (transpileRes.status !== 0) {
  console.error('Transpile failed.');
  process.exit(1);
}

// 2. Run test suites
const testFiles = [
  path.join(rootDir, 'dist-test/tests/weeklyCardSelector.test.js'),
  path.join(rootDir, 'dist-test/tests/suites/bilingual_clues_and_weekly_therapy.test.js'),
  path.join(rootDir, 'dist-test/tests/suites/tier1_features.test.js'),
  path.join(rootDir, 'dist-test/tests/suites/tier2_boundaries.test.js'),
  path.join(rootDir, 'dist-test/tests/suites/tier3_pairwise.test.js'),
  path.join(rootDir, 'dist-test/tests/suites/tier4_clinical_workflows.test.js'),
  path.join(rootDir, 'dist-test/tests/suites/tier5_adversarial.test.js'),
  path.join(rootDir, 'dist-test/tests/suites/tier6_piper_syllable_trainer.test.js'),
  path.join(rootDir, 'dist-test/tests/suites/tier7_google_sheets_import.test.js'),
  path.join(rootDir, 'dist-test/tests/suites/tier8_sound_it_out_aac_vocab.test.js'),
  path.join(rootDir, 'dist-test/tests/suites/tier9_today_orientation.test.js'),
  path.join(rootDir, 'dist-test/tests/empirical_challenge_runner.js'),
  path.join(rootDir, 'dist-test/tests/empirical_deep_fuzzer.js'),
  path.join(rootDir, 'dist-test/tests/weekly_selector_stress_harness.js'),
];

console.log(`\nStep 2: Executing ${testFiles.length} test suites with Node test runner...\n`);

let allPassed = true;
for (const file of testFiles) {
  const res = spawnSync(process.execPath, [file], {
    stdio: 'inherit',
    cwd: rootDir,
  });
  if (res.status !== 0) {
    allPassed = false;
  }
}

console.log('\n================================================================');
if (allPassed) {
  console.log('    ✅ ALL TEST SUITES PASSED (100% SUCCESS)                     ');
} else {
  console.error('    ❌ TEST SUITES FAILED                                       ');
}
console.log('================================================================\n');
process.exit(allPassed ? 0 : 1);

