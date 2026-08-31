/**
 * Tier 16: Offline Neural Piper Voice Pipeline Regression Suite
 *
 * Guards the three regressions that silently replaced the Sound It Out voice with a tone:
 *
 *  1. Asset pruning removed the WASM runtime files that public/vendor/onnxruntime-web.js
 *     loads, so InferenceSession.create() always failed and isReady() was never true.
 *  2. The Klatt/Fant formant synthesizer was replaced by a phoneme-independent tone
 *     generator, so the local fallback stopped being speech.
 *  3. The system-voice fallback was removed from the playback paths, so that tone became
 *     the only thing a user could hear.
 *
 * Groups 1, 2 and 5 run against the real shipped assets. Groups 3 and 4 assert that no
 * playback path can reach the tone generator.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import '../setup.js';

import { phonemizeWord } from '../../src/services/syllables/espeakPhonemizer.ts';
import { generateDeterministicPhonemeAudio } from '../../src/services/syllables/piperTTSService.ts';
import { piperOnnxService, resolveAssetUrl } from '../../src/services/syllables/piperOnnxService.ts';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), '../../..');
const publicDir = path.join(rootDir, 'public');
const wasmDir = path.join(publicDir, 'wasm');
const vendorBundlePath = path.join(publicDir, 'vendor', 'onnxruntime-web.js');
const modelPath = path.join(publicDir, 'models', 'piper', 'en_US-amy-medium.onnx');
const modelConfigPath = `${modelPath}.json`;

const srcDir = path.join(rootDir, 'src');
const hookSource = fs.readFileSync(path.join(srcDir, 'hooks/usePiperSyllables.ts'), 'utf8');
const onnxServiceSource = fs.readFileSync(path.join(srcDir, 'services/syllables/piperOnnxService.ts'), 'utf8');

/**
 * Extracts every ONNX Runtime WASM runtime file that the vendored bundle loads at run time.
 * The names live in string literals inside minified code, so no static import scan finds them.
 * The proxy worker is excluded: it is only fetched when env.wasm.proxy is on, and it is not.
 */
function referencedWasmRuntimeFiles(bundleSource) {
  const matches = bundleSource.match(/ort-wasm-simd-threaded[A-Za-z0-9.]*\.(?:wasm|mjs)/g) || [];
  return [...new Set(matches)].sort();
}

/** Returns the region of a source file between a marker and the start of the next top-level const. */
function functionBody(source, marker) {
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `Expected to find "${marker}" in source`);
  const next = source.indexOf('\n  const ', start + marker.length);
  return source.slice(start, next === -1 ? source.length : next);
}

describe('Tier 16: Offline Neural Piper Voice Pipeline', () => {

  // ===========================================================================
  // 1. OFFLINE RUNTIME ASSET CONTRACT (regression guard for the pruned WASM files)
  // ===========================================================================
  describe('ONNX Runtime asset contract', () => {
    it('should ship the vendored ONNX Runtime Web bundle', () => {
      assert.ok(fs.existsSync(vendorBundlePath), 'public/vendor/onnxruntime-web.js must exist');
      assert.ok(fs.statSync(vendorBundlePath).size > 10_000, 'Vendored bundle must not be a stub');
    });

    it('should reference at least one WASM runtime file from the vendored bundle', () => {
      const referenced = referencedWasmRuntimeFiles(fs.readFileSync(vendorBundlePath, 'utf8'));
      assert.ok(
        referenced.length > 0,
        'Expected the bundle to name its WASM runtime files; the extraction pattern may be stale'
      );
    });

    it('should ship every WASM runtime file that the vendored bundle loads', () => {
      const referenced = referencedWasmRuntimeFiles(fs.readFileSync(vendorBundlePath, 'utf8'));
      const shipped = fs.readdirSync(wasmDir);
      const missing = referenced.filter((f) => !shipped.includes(f));

      assert.deepEqual(
        missing,
        [],
        `public/wasm/ is missing runtime files that public/vendor/onnxruntime-web.js loads: ${missing.join(', ')}. ` +
          'InferenceSession.create() fails without them and the neural voice silently stops working. ' +
          'Either restore the files or vendor the matching ONNX Runtime build.'
      );
    });

    it('should ship the Piper voice model and its config', () => {
      assert.ok(fs.existsSync(modelPath), 'Piper ONNX model must exist');
      assert.ok(fs.existsSync(modelConfigPath), 'Piper ONNX model config must exist');
      assert.ok(
        fs.statSync(modelPath).size > 1_000_000,
        'Piper model must be the real weights, not a pointer or placeholder'
      );
    });

    it('should ship a Piper model that is a real ONNX protobuf', () => {
      const head = fs.readFileSync(modelPath).subarray(0, 64).toString('latin1');
      assert.ok(head.includes('pytorch'), 'Model header must carry the ONNX producer field');
    });

    it('should ship a Piper config with a usable phoneme id map', () => {
      const config = JSON.parse(fs.readFileSync(modelConfigPath, 'utf8'));
      assert.equal(config.audio.sample_rate, 22050);
      assert.ok(config.phoneme_id_map, 'Config must carry phoneme_id_map');
      for (const token of ['_', '^', '$']) {
        assert.ok(
          Array.isArray(config.phoneme_id_map[token]),
          `Config must define the ${token} PAD/BOS/EOS token`
        );
      }
    });
  });

  // ===========================================================================
  // 1b. ASSET URL RESOLUTION (regression guard for the production-only 404)
  //
  // ONNX Runtime passes env.wasm.wasmPaths to a dynamic import(). A relative path
  // there resolves against the importing chunk, which lives in assets/ after a
  // production build, so "./wasm/" became "assets/wasm/" and 404'd. A dev server
  // serves the module from the site root, so the bug never appeared in dev.
  // ===========================================================================
  describe('Asset URL resolution across dev and production layouts', () => {
    const withBaseUri = (baseURI, run) => {
      const original = global.document.baseURI;
      try {
        global.document.baseURI = baseURI;
        return run();
      } finally {
        global.document.baseURI = original;
      }
    };

    it('should resolve WASM assets to an absolute URL at a root deployment', () => {
      const resolved = withBaseUri('http://localhost:3000/', () => resolveAssetUrl('wasm/'));
      assert.equal(resolved, 'http://localhost:3000/wasm/');
    });

    it('should resolve WASM assets to an absolute URL at a subpath deployment', () => {
      const resolved = withBaseUri('https://damorelse.github.io/talk-with-dad/', () =>
        resolveAssetUrl('wasm/')
      );
      assert.equal(resolved, 'https://damorelse.github.io/talk-with-dad/wasm/');
    });

    it('should never resolve WASM assets under the bundler assets directory', () => {
      for (const baseURI of ['http://localhost:3000/', 'https://damorelse.github.io/talk-with-dad/']) {
        const resolved = withBaseUri(baseURI, () => resolveAssetUrl('wasm/'));
        assert.ok(
          !resolved.includes('/assets/'),
          `wasmPaths must not point into the bundler output directory, got ${resolved}`
        );
        assert.match(
          resolved,
          /^https?:\/\//,
          'wasmPaths must be absolute; a relative path resolves against the ONNX chunk, not the document'
        );
      }
    });

    it('should resolve the model and config to absolute URLs too', () => {
      withBaseUri('https://damorelse.github.io/talk-with-dad/', () => {
        assert.equal(
          resolveAssetUrl('models/piper/en_US-amy-medium.onnx'),
          'https://damorelse.github.io/talk-with-dad/models/piper/en_US-amy-medium.onnx'
        );
      });
    });

    it('should hand ONNX Runtime the resolved URL rather than a bare relative path', () => {
      const assignments = onnxServiceSource.match(/wasmPaths\s*=\s*[^;]+/g) || [];
      assert.ok(assignments.length >= 2, 'Expected wasmPaths to be configured before session creation');
      for (const assignment of assignments) {
        assert.ok(
          assignment.includes('WASM_DIR_URL'),
          `wasmPaths must use the document-resolved URL, found: ${assignment}`
        );
      }
    });
  });

  // ===========================================================================
  // 2. PHONEMIZER OUTPUT MATCHES THE SHIPPED MODEL VOCABULARY
  // ===========================================================================
  describe('Phonemizer output maps onto the shipped model vocabulary', () => {
    const CLINICAL_WORDS = [
      'photography', 'water', 'daughter', 'medicine', 'hospital',
      'butterfly', 'refrigerator', 'rehabilitation', 'bookshelf',
    ];

    it('should map every emitted phoneme to at least one Piper input id', () => {
      const idMap = JSON.parse(fs.readFileSync(modelConfigPath, 'utf8')).phoneme_id_map;
      const unmapped = new Set();

      for (const word of CLINICAL_WORDS) {
        for (const syl of phonemizeWord(word).syllables) {
          for (const phoneme of syl.phonemes) {
            // Piper accepts a whole token, or the token split into single characters.
            const resolvable = idMap[phoneme] || [...phoneme].some((char) => idMap[char]);
            if (!resolvable) unmapped.add(`${word}:${phoneme}`);
          }
        }
      }

      assert.deepEqual(
        [...unmapped],
        [],
        `Phonemes the shipped model cannot tokenize: ${[...unmapped].join(', ')}`
      );
    });

    it('should tokenize a full clinical word into a bounded id sequence', () => {
      const config = JSON.parse(fs.readFileSync(modelConfigPath, 'utf8'));
      piperOnnxService.config = config;

      const phonemes = phonemizeWord('photography').syllables.flatMap((s) => s.phonemes);
      const ids = piperOnnxService.phonemesToIds(phonemes);

      assert.equal(ids[0], config.phoneme_id_map['^'][0], 'Sequence must start with BOS');
      assert.equal(ids[ids.length - 1], config.phoneme_id_map['$'][0], 'Sequence must end with EOS');
      assert.ok(ids.length > phonemes.length, 'Every phoneme must contribute at least one id');
      for (const id of ids) {
        assert.ok(Number.isInteger(id) && id >= 0, `Every id must be a non-negative integer, got ${id}`);
      }
    });
  });

  // ===========================================================================
  // 3. THE NEURAL SERVICE MUST FAIL LOUDLY, NOT SUBSTITUTE A TONE
  // ===========================================================================
  describe('Neural service reports failure instead of substituting a tone', () => {
    it('should reject synthesizeSyllable when the model is not ready', async () => {
      assert.equal(piperOnnxService.isReady(), false, 'Precondition: model is not loaded in tests');
      await assert.rejects(
        () => piperOnnxService.synthesizeSyllable(
          { index: 0, text: 'wa', ipa: 'ˈwɔː', stress: 'primary', phonemes: ['w', 'ɔː'] },
          'water',
          0.5
        ),
        /not ready/,
        'A missing model must surface as an error so callers can use the system voice'
      );
    });

    it('should reject synthesizeWord when the model is not ready', async () => {
      await assert.rejects(
        () => piperOnnxService.synthesizeWord(phonemizeWord('water'), 0.5),
        /not ready/
      );
    });

    it('should never import the tone generator into the neural service', () => {
      assert.ok(
        !onnxServiceSource.includes('generateDeterministicPhonemeAudio'),
        'piperOnnxService must not fall back to the tone generator'
      );
      assert.ok(
        !onnxServiceSource.includes('piperTTSService.synthesize'),
        'piperOnnxService must not fall back to piperTTSService synthesis'
      );
    });
  });

  // ===========================================================================
  // 4. PLAYBACK PATHS FALL BACK TO A REAL VOICE
  // ===========================================================================
  describe('Playback paths fall back to the system voice', () => {
    it('should define a system-voice fallback helper in the hook', () => {
      assert.ok(
        /function speakFragment\(/.test(hookSource),
        'usePiperSyllables must define speakFragment for system-voice fallback'
      );
    });

    it('should fall back to the system voice when a single syllable has no neural audio', () => {
      const body = functionBody(hookSource, 'const playSingleSyllable');
      assert.ok(body.includes('piperOnnxService.synthesizeSyllable'), 'Must try neural audio first');
      assert.ok(body.includes('speakFragment(syl.text'), 'Must speak the syllable when neural audio is absent');
    });

    it('should fall back to the system voice for each syllable of Sound It Out', () => {
      const body = functionBody(hookSource, 'const soundItOut');
      assert.ok(body.includes('speakFragment(syl.text'), 'Step 2 must speak each syllable when neural audio is absent');
      assert.ok(body.includes('speakFragment(word'), 'Steps 1 and 3 must speak the whole word');
    });

    it('should route IPA phoneme chips through the neural engine', () => {
      const body = functionBody(hookSource, 'const playIndividualPhoneme');
      assert.ok(
        body.includes('piperOnnxService.synthesizePhonemes'),
        'Phoneme chips must use the neural engine, not the tone generator'
      );
      assert.ok(body.includes('speakFragment'), 'Phoneme chips must degrade to the system voice');
    });

    it('should keep every tone-generating helper out of the playback hook', () => {
      for (const toneApi of [
        'piperTTSService.synthesizeWordAudio',
        'piperTTSService.synthesizeSyllableAudio',
        'piperTTSService.playPhonemeAudio',
        'piperTTSService.synthesizeIndividualPhonemeAudio',
      ]) {
        assert.ok(
          !hookSource.includes(toneApi),
          `usePiperSyllables must not call ${toneApi}: it returns a tone, not speech`
        );
      }
    });

    it('should prove the tone generator is phoneme-independent and cannot stand in for speech', () => {
      // Same phoneme count and stress, completely different sounds.
      const fricativeVowel = generateDeterministicPhonemeAudio(['f', 'ə'], 'unstressed', 0.5);
      const sibilantVowel = generateDeterministicPhonemeAudio(['s', 'iː'], 'unstressed', 0.5);

      assert.equal(
        fricativeVowel.base64,
        sibilantVowel.base64,
        'The waveform generator ignores its phonemes. Treat it as a placeholder tone, never as speech.'
      );
    });
  });

  // ===========================================================================
  // 5. END-TO-END: THE SHIPPED ASSETS REALLY START A NEURAL SESSION
  // ===========================================================================
  describe('End-to-end neural session from the shipped assets', () => {
    it('should create an inference session and synthesize audible speech', async () => {
      const ort = await import(`file://${vendorBundlePath}`);
      ort.env.wasm.wasmPaths = `file://${wasmDir}/`;
      ort.env.wasm.numThreads = 1;
      ort.env.wasm.simd = true;

      const config = JSON.parse(fs.readFileSync(modelConfigPath, 'utf8'));
      const modelBuffer = new Uint8Array(fs.readFileSync(modelPath)).buffer;

      const session = await ort.InferenceSession.create(modelBuffer, {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all',
      });

      assert.deepEqual(session.inputNames, ['input', 'input_lengths', 'scales']);
      assert.deepEqual(session.outputNames, ['output']);

      piperOnnxService.config = config;
      const phonemes = phonemizeWord('photography').syllables.flatMap((s) => s.phonemes);
      const ids = piperOnnxService.phonemesToIds(phonemes);

      const results = await session.run({
        input: new ort.Tensor('int64', BigInt64Array.from(ids.map(BigInt)), [1, ids.length]),
        input_lengths: new ort.Tensor('int64', BigInt64Array.from([BigInt(ids.length)]), [1]),
        scales: new ort.Tensor(
          'float32',
          Float32Array.from([config.inference.noise_scale, config.inference.length_scale, config.inference.noise_w]),
          [3]
        ),
      });

      const samples = results.output.data;
      const durationSec = samples.length / config.audio.sample_rate;
      let peak = 0;
      for (let i = 0; i < samples.length; i++) {
        const level = Math.abs(samples[i]);
        if (level > peak) peak = level;
      }

      assert.ok(durationSec > 0.4, `"photography" must produce speech-length audio, got ${durationSec.toFixed(2)}s`);
      assert.ok(durationSec < 6.0, `"photography" must not run away, got ${durationSec.toFixed(2)}s`);
      assert.ok(peak > 0.05, `Output must be audible, got peak ${peak.toFixed(4)}`);
    });
  });
});
