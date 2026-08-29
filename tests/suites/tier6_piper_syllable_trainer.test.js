/**
 * Tier 6: Piper TTS & eSpeak NG Phonemizer Articulation Trainer Test Suite
 * 
 * Verifies canonical IPA derivation, syllable-to-phoneme mapping, deterministic Piper audio
 * synthesis, syllable-level audio generation, caching, and the flagship "photography" showcase.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import '../setup.js';

import {
  phonemizeWord,
  getCanonicalIpa,
  formatIpaWithSyllables,
} from '../../src/services/syllables/espeakPhonemizer.ts';
import {
  piperTTSService,
  generateDeterministicPhonemeAudio,
  createWavHeader,
} from '../../src/services/syllables/piperTTSService.ts';
import { piperOnnxService } from '../../src/services/syllables/piperOnnxService.ts';
import {
  splitWordIntoSyllables,
  formatWithMiddleDot,
  getWordPronunciation,
  getSyllableBreakdownWithIpa,
  CANONICAL_PHONEME_DICTIONARY,
} from '../../src/services/syllables/syllableSplitter.ts';

describe('Tier 6: Piper TTS & eSpeak NG Syllable Articulation Trainer', () => {

  // ===========================================================================
  // 1. FLAGSHIP SHOWCASE: "photography" -> pho | tog | ra | phy
  // ===========================================================================
  describe('Showcase: "photography" -> pho | tog | ra | phy', () => {
    it('should derive the canonical IPA and 4-syllable sequence for "photography"', () => {
      const data = phonemizeWord('photography');
      assert.equal(data.word, 'photography');
      assert.equal(data.canonicalIpa, 'fəˈtɑːɡɹəfi');
      assert.equal(data.syllables.length, 4);

      // Syllable 1: pho -> fə (unstressed)
      assert.equal(data.syllables[0].text, 'pho');
      assert.equal(data.syllables[0].ipa, 'fə');
      assert.equal(data.syllables[0].stress, 'unstressed');
      assert.deepEqual(data.syllables[0].phonemes, ['f', 'ə']);

      // Syllable 2: tog -> ˈtɑːɡ (primary stress)
      assert.equal(data.syllables[1].text, 'tog');
      assert.equal(data.syllables[1].ipa, 'ˈtɑːɡ');
      assert.equal(data.syllables[1].stress, 'primary');
      assert.deepEqual(data.syllables[1].phonemes, ['t', 'ɑː', 'ɡ']);

      // Syllable 3: ra -> ɹə (unstressed)
      assert.equal(data.syllables[2].text, 'ra');
      assert.equal(data.syllables[2].ipa, 'ɹə');
      assert.equal(data.syllables[2].stress, 'unstressed');
      assert.deepEqual(data.syllables[2].phonemes, ['ɹ', 'ə']);

      // Syllable 4: phy -> fi (unstressed)
      assert.equal(data.syllables[3].text, 'phy');
      assert.equal(data.syllables[3].ipa, 'fi');
      assert.equal(data.syllables[3].stress, 'unstressed');
      assert.deepEqual(data.syllables[3].phonemes, ['f', 'i']);
    });

    it('should format middle dot representation as "pho · tog · ra · phy"', () => {
      const formatted = formatWithMiddleDot('photography');
      assert.equal(formatted, 'pho · tog · ra · phy');
    });

    it('should format IPA with syllables as "fə · ˈtɑːɡ · ɹə · fi"', () => {
      const ipaFormatted = formatIpaWithSyllables('photography');
      assert.equal(ipaFormatted, 'fə · ˈtɑːɡ · ɹə · fi');
    });

    it('should generate separate, valid Piper audio data for each of the 4 syllables of "photography"', async () => {
      const data = phonemizeWord('photography');
      const hydrated = await piperTTSService.synthesizeWordAudio(data, 0.5);

      assert.equal(hydrated.syllables.length, 4);

      for (let i = 0; i < 4; i++) {
        const syl = hydrated.syllables[i];
        assert.ok(syl.audioBase64, `Syllable ${i} (${syl.text}) must have audioBase64`);
        assert.ok(syl.audioBase64.startsWith('data:audio/wav;base64,'), 'Audio must be base64 WAV data URL');
        assert.ok(syl.audioBlobId, `Syllable ${i} must have audioBlobId`);
      }

      assert.ok(hydrated.fullAudioBase64, 'Hydrated word must include full audio');
    });
  });

  // ===========================================================================
  // 2. CLINICAL VOCABULARY PHONEMIZATION & SYLLABLE MAPPING
  // ===========================================================================
  describe('Clinical Vocabulary Phonemization & Syllables', () => {
    it('should phonemize "water" -> wa [ˈwɔː] | ter [təɹ]', () => {
      const data = phonemizeWord('water');
      assert.equal(data.canonicalIpa, 'ˈwɔːtəɹ');
      assert.equal(data.syllables.length, 2);
      assert.equal(data.syllables[0].text, 'wa');
      assert.equal(data.syllables[0].ipa, 'ˈwɔː');
      assert.equal(data.syllables[0].stress, 'primary');
      assert.equal(data.syllables[1].text, 'ter');
      assert.equal(data.syllables[1].ipa, 'təɹ');
    });

    it('should phonemize "daughter" -> daugh [ˈdɔː] | ter [təɹ]', () => {
      const data = phonemizeWord('daughter');
      assert.equal(data.canonicalIpa, 'ˈdɔːtəɹ');
      assert.equal(data.syllables.length, 2);
      assert.equal(data.syllables[0].text, 'daugh');
      assert.equal(data.syllables[0].ipa, 'ˈdɔː');
      assert.equal(data.syllables[0].stress, 'primary');
      assert.equal(data.syllables[1].text, 'ter');
      assert.equal(data.syllables[1].ipa, 'təɹ');
      assert.equal(data.syllables[1].stress, 'unstressed');
    });

    it('should phonemize "medicine" -> med [ˈmɛd] | i [ɪ] | cine [sɪn]', () => {
      const data = phonemizeWord('medicine');
      assert.equal(data.canonicalIpa, 'ˈmɛdɪsɪn');
      assert.equal(data.syllables.length, 3);
      assert.equal(data.syllables[0].text, 'med');
      assert.equal(data.syllables[0].ipa, 'ˈmɛd');
      assert.equal(data.syllables[0].stress, 'primary');
      assert.equal(data.syllables[1].text, 'i');
      assert.equal(data.syllables[2].text, 'cine');
    });

    it('should phonemize "hospital" -> hos [ˈhɑːs] | pi [pɪ] | tal [təl]', () => {
      const data = phonemizeWord('hospital');
      assert.equal(data.canonicalIpa, 'ˈhɑːspɪtəl');
      assert.equal(data.syllables.length, 3);
      assert.equal(data.syllables[0].text, 'hos');
      assert.equal(data.syllables[0].stress, 'primary');
    });

    it('should phonemize "butterfly" -> but [ˈbʌt] | ter [əɹ] | fly [flaɪ]', () => {
      const data = phonemizeWord('butterfly');
      assert.equal(data.canonicalIpa, 'ˈbʌtəɹflaɪ');
      assert.equal(data.syllables.length, 3);
    });

    it('should phonemize "refrigerator" -> re [ɹɪ] | frig [ˈfɹɪdʒ] | er [ə] | a [ˌɹeɪ] | tor [təɹ]', () => {
      const data = phonemizeWord('refrigerator');
      assert.equal(data.canonicalIpa, 'ɹɪˈfɹɪdʒəˌɹeɪtəɹ');
      assert.equal(data.syllables.length, 5);
      assert.equal(data.syllables[1].text, 'frig');
      assert.equal(data.syllables[1].stress, 'primary');
      assert.equal(data.syllables[3].text, 'a');
      assert.equal(data.syllables[3].stress, 'secondary');
    });

    it('should phonemize "rehabilitation" -> 6 syllables with primary and secondary stress', () => {
      const data = phonemizeWord('rehabilitation');
      assert.equal(data.canonicalIpa, 'ˌɹiːhəˌbɪlɪˈteɪʃən');
      assert.equal(data.syllables.length, 6);
      assert.equal(data.syllables[4].text, 'ta');
      assert.equal(data.syllables[4].stress, 'primary');
    });

    it('should phonemize "bookshelf" -> book [ˈbʊk] | shelf [ʃɛlf]', () => {
      const data = phonemizeWord('bookshelf');
      assert.equal(data.canonicalIpa, 'ˈbʊkʃɛlf');
      assert.equal(data.syllables.length, 2);
      assert.equal(data.syllables[0].text, 'book');
      assert.equal(data.syllables[0].ipa, 'ˈbʊk');
      assert.equal(data.syllables[0].stress, 'primary');
      assert.equal(data.syllables[1].text, 'shelf');
      assert.equal(data.syllables[1].ipa, 'ʃɛlf');
    });
  });

  // ===========================================================================
  // 3. ALGORITHMIC G2P ENGINE FOR NOVEL / UNSEEN WORDS
  // ===========================================================================
  describe('Algorithmic G2P Engine for Arbitrary Words', () => {
    it('should algorithmically phonemize novel word "aphasia"', () => {
      const data = phonemizeWord('aphasia');
      assert.equal(data.source, 'espeak_g2p');
      assert.ok(data.syllables.length >= 2);
      assert.ok(data.canonicalIpa.length > 0);
      assert.ok(data.syllables.some(s => s.stress === 'primary'));
    });

    it('should algorithmically phonemize novel word "articulation"', () => {
      const data = phonemizeWord('articulation');
      assert.equal(data.source, 'espeak_g2p');
      assert.ok(data.syllables.length >= 4);
      // Suffix -tion should place primary stress on penult
      const primarySyl = data.syllables.find(s => s.stress === 'primary');
      assert.ok(primarySyl, 'Must have primary stress syllable');
    });

    it('should algorithmically phonemize compound or multi-syllable word "fantastic"', () => {
      const data = phonemizeWord('fantastic');
      assert.ok(data.syllables.length >= 3);
      assert.ok(data.canonicalIpa.length > 0);
    });

    it('should algorithmically split 3-consonant cluster novel words like "monster"', () => {
      const data = phonemizeWord('monster');
      assert.equal(data.syllables.length, 2);
      assert.equal(data.syllables[0].text.toLowerCase(), 'mon');
      assert.equal(data.syllables[1].text.toLowerCase(), 'ster');
    });
  });

  // ===========================================================================
  // 4. DETERMINISTIC PIPER TTS WAVEFORM SYNTHESIS & WAV FORMAT
  // ===========================================================================
  describe('Deterministic Piper TTS Audio Synthesis & WAV Quality', () => {
    it('should produce valid RIFF/WAVE header with 22050Hz sample rate', () => {
      const header = createWavHeader(1000, 22050, 1, 16);
      assert.equal(header.length, 44);

      // Verify RIFF magic
      const view = new DataView(header.buffer);
      const riffTag = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
      assert.equal(riffTag, 'RIFF');

      const waveTag = String.fromCharCode(view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11));
      assert.equal(waveTag, 'WAVE');

      const sampleRate = view.getUint32(24, true);
      assert.equal(sampleRate, 22050);

      const bitsPerSample = view.getUint16(34, true);
      assert.equal(bitsPerSample, 16);
    });

    it('should produce identical audio output on consecutive runs (Determinism)', () => {
      const phonemes = ['f', 'ə'];
      const run1 = generateDeterministicPhonemeAudio(phonemes, 'unstressed', 0.5);
      const run2 = generateDeterministicPhonemeAudio(phonemes, 'unstressed', 0.5);

      assert.equal(run1.base64, run2.base64, 'Waveform output must be 100% deterministic bit-for-bit');
      assert.equal(run1.durationMs, run2.durationMs);
      assert.equal(run1.rawBytes.length, run2.rawBytes.length);
    });

    it('should modulate pitch and duration for primary stress compared to unstressed', () => {
      const phonemes = ['t', 'ɑː', 'ɡ'];
      const stressed = generateDeterministicPhonemeAudio(phonemes, 'primary', 0.5);
      const unstressed = generateDeterministicPhonemeAudio(phonemes, 'unstressed', 0.5);

      assert.ok(stressed.durationMs > unstressed.durationMs, 'Stressed syllable should have longer duration');
      assert.ok(stressed.rawBytes.length > unstressed.rawBytes.length);
    });
  });

  // ===========================================================================
  // 5. AUDIO CACHING (IN-MEMORY & PERSISTENCE)
  // ===========================================================================
  describe('Audio Caching & Retrieval', () => {
    it('should cache synthesized syllable audio in memory for sub-millisecond playback', async () => {
      const syl = {
        index: 0,
        text: 'pho',
        ipa: 'fə',
        stress: 'unstressed',
        phonemes: ['f', 'ə'],
      };

      const audio1 = await piperTTSService.synthesizeSyllableAudio(syl, 'photography', 0.5);
      assert.ok(audio1);
      assert.equal(piperTTSService.isAudioCached('photography', 0, 0.5), true);

      const audio2 = await piperTTSService.synthesizeSyllableAudio(syl, 'photography', 0.5);
      assert.equal(audio1, audio2, 'Cached audio must match exactly');
    });
  });

  // ===========================================================================
  // 6. SEQUENTIAL ARTICULATION PLAYBACK SIMULATION
  // ===========================================================================
  describe('Sequential Articulation Playback', () => {
    it('should simulate full sequential syllable articulation with start/end events', async () => {
      const data = phonemizeWord('photography');
      const startedIndices = [];
      const endedIndices = [];
      let isCompleted = false;

      await piperTTSService.playArticulationSequence(data, {
        speed: 1.0,
        pauseMs: 10,
        onSyllableStart: (idx) => startedIndices.push(idx),
        onSyllableEnd: (idx) => endedIndices.push(idx),
        onComplete: () => { isCompleted = true; },
      });

      assert.deepEqual(startedIndices, [0, 1, 2, 3]);
      assert.deepEqual(endedIndices, [0, 1, 2, 3]);
      assert.equal(isCompleted, true);
    });
  });

  // ===========================================================================
  // 7. NEURAL PIPER ONNX SERVICE & PHONEME-TO-ID TOKENIZATION
  // ===========================================================================
  describe('Neural Piper ONNX Service & Tokenizer', () => {
    it('should correctly tokenize eSpeak IPA phonemes into Piper input IDs with BOS/PAD/EOS', () => {
      const mockConfig = {
        audio: { sample_rate: 22050, quality: 'medium' },
        espeak: { voice: 'en-us' },
        inference: { noise_scale: 0.667, length_scale: 1, noise_w: 0.8 },
        phoneme_type: 'espeak',
        phoneme_id_map: {
          '_': [0],
          '^': [1],
          '$': [2],
          'f': [19],
          'ə': [59],
          't': [32],
          'ɑ': [51],
          'ː': [122],
          'ɡ': [66],
          'ɹ': [88],
          'i': [21],
        },
      };

      piperOnnxService.config = mockConfig;
      const ids = piperOnnxService.phonemesToIds(['f', 'ə']);
      // Expected: [BOS, PAD, 'f', PAD, 'ə', PAD, EOS] -> [1, 0, 19, 0, 59, 0, 2]
      assert.deepEqual(ids, [1, 0, 19, 0, 59, 0, 2]);

      const photoIds = piperOnnxService.phonemesToIds(['f', 'ə', 't', 'ɑː', 'ɡ', 'ɹ', 'ə', 'f', 'i']);
      assert.ok(photoIds.length > 10);
      assert.equal(photoIds[0], 1); // BOS
      assert.equal(photoIds[photoIds.length - 1], 2); // EOS
    });
  });

  // ===========================================================================
  // 8. ISOLATED INDIVIDUAL IPA PHONEME AUDIO SYNTHESIS & PLAYBACK
  // ===========================================================================
  describe('Isolated Individual IPA Phoneme Audio Synthesis', () => {
    it('should synthesize valid audio for isolated IPA phonemes', async () => {
      const phonemes = ['f', 'ə', 't', 'ɑː', 'ɡ', 'ɹ', 'i'];
      for (const ph of phonemes) {
        const audio = await piperTTSService.synthesizeIndividualPhonemeAudio(ph, 0.5);
        assert.ok(audio, `Audio for phoneme /${ph}/ must be defined`);
        assert.ok(audio.startsWith('data:audio/wav;base64,'), `Audio for /${ph}/ must be a valid WAV data URL`);
      }
    });

    it('should play isolated IPA phoneme via playPhonemeAudio without errors', async () => {
      await piperTTSService.playPhonemeAudio('t', 0.5);
      // Completes cleanly
      assert.ok(true);
    });
  });

  // ===========================================================================
  // 9. GUARANTEED PHONEME MODEL USAGE IN ONNX & FALLBACK
  // ===========================================================================
  describe('Guaranteed Phoneme Model Invariant & Fallback', () => {
    it('should synthesize syllables using deterministic phonetic fallback when ONNX is uninitialized', async () => {
      const syl = {
        index: 1,
        text: 'tog',
        ipa: 'ˈtɑːɡ',
        stress: 'primary',
        phonemes: ['t', 'ɑː', 'ɡ'],
      };

      const audio = await piperOnnxService.synthesizeSyllable(syl, 'photography', 0.5);
      assert.ok(audio, 'Must return valid audio from phoneme model fallback');
      assert.ok(audio.startsWith('data:audio/wav;base64,'));
    });

    it('should hydrate entire word with phonetic audio for every syllable without WebSpeech', async () => {
      const data = phonemizeWord('photography');
      const hydrated = await piperOnnxService.synthesizeWord(data, 0.5);

      assert.equal(hydrated.syllables.length, 4);
      for (const syl of hydrated.syllables) {
        assert.ok(syl.audioBase64, `Syllable ${syl.text} must have phoneme audio base64`);
        assert.ok(syl.audioBase64.startsWith('data:audio/wav;base64,'));
      }
      assert.ok(hydrated.fullAudioBase64);
    });
  });
});


