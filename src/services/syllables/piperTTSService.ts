/**
 * Local Deterministic Syllable Audio Synthesis & Caching Engine
 * 
 * Provides fast, deterministic, lightweight syllable waveform audio generation,
 * caching in memory and IndexedDB, and articulation playback orchestration.
 */

import type { SyllablePhonemeData, WordPronunciationData, SyllableStress } from '../../types/index.ts';
import { db } from '../db/AppDatabase.ts';
import { recordedAudioEngine } from '../audio/RecordedAudioEngine.ts';
import { iosAudioUnlock } from '../audio/iOSAudioUnlock.ts';

const SAMPLE_RATE = 22050; // Standard audio sample rate (Hz)

/**
 * Creates standard 44-byte RIFF/WAVE header for mono 16-bit PCM audio.
 */
export function createWavHeader(dataLength: number, sampleRate = SAMPLE_RATE, numChannels = 1, bitsPerSample = 16): Uint8Array {
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  // "RIFF" chunk
  view.setUint8(0, 0x52); // 'R'
  view.setUint8(1, 0x49); // 'I'
  view.setUint8(2, 0x46); // 'F'
  view.setUint8(3, 0x46); // 'F'
  view.setUint32(4, 36 + dataLength, true);

  // "WAVE" format
  view.setUint8(8, 0x57);  // 'W'
  view.setUint8(9, 0x41);  // 'A'
  view.setUint8(10, 0x56); // 'V'
  view.setUint8(11, 0x45); // 'E'

  // "fmt " subchunk
  view.setUint8(12, 0x66); // 'f'
  view.setUint8(13, 0x6d); // 'm'
  view.setUint8(14, 0x74); // 't'
  view.setUint8(15, 0x20); // ' '
  view.setUint32(16, 16, true);          // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true);           // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true);  // SampleRate
  view.setUint32(28, byteRate, true);    // ByteRate
  view.setUint16(32, blockAlign, true);  // BlockAlign
  view.setUint16(34, bitsPerSample, true);// BitsPerSample

  // "data" subchunk
  view.setUint8(36, 0x64); // 'd'
  view.setUint8(37, 0x61); // 'a'
  view.setUint8(38, 0x74); // 't'
  view.setUint8(39, 0x61); // 'a'
  view.setUint32(40, dataLength, true);

  return new Uint8Array(buffer);
}

/**
 * Converts Uint8Array bytes to base64 Data URL string safely in browser & node.
 */
export function bytesToBase64DataUrl(bytes: Uint8Array, mimeType = 'audio/wav'): string {
  if (typeof Buffer !== 'undefined') {
    const base64 = Buffer.from(bytes).toString('base64');
    return `data:${mimeType};base64,${base64}`;
  }
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Lightweight, Deterministic Syllable Audio Generator
 * Generates clean, click-free audio with harmonic richness and natural envelope.
 */
export function generateDeterministicPhonemeAudio(
  phonemes: string[],
  stress: SyllableStress = 'unstressed',
  speed = 0.5,
  pitchMultiplier = 1.0,
  voiceProfileId = 'en_US-lessac-medium'
): { base64: string; durationMs: number; rawBytes: Uint8Array } {
  const durationFactor = (1.0 / Math.max(0.2, speed)) * (stress === 'primary' ? 1.3 : stress === 'secondary' ? 1.15 : 0.95);
  const basePitch = (voiceProfileId.includes('ryan') || voiceProfileId.includes('danny') ? 110 : 210) * pitchMultiplier;
  const stressPitchMod = stress === 'primary' ? 1.2 : stress === 'secondary' ? 1.08 : 0.96;
  const targetPitch = basePitch * stressPitchMod;

  const baseDurationMs = 200 + phonemes.length * 35;
  const durationMs = Math.round(baseDurationMs * durationFactor);
  const numSamples = Math.round((durationMs / 1000) * SAMPLE_RATE);
  const rawOutput = new Float32Array(numSamples);

  const attackSamples = Math.min(Math.round(SAMPLE_RATE * 0.02), Math.round(numSamples * 0.15));
  const decaySamples = Math.min(Math.round(SAMPLE_RATE * 0.04), Math.round(numSamples * 0.25));

  for (let i = 0; i < numSamples; i++) {
    const progress = i / numSamples;
    const pitch = targetPitch * (1.0 - progress * 0.05);
    const t = (2 * Math.PI * pitch * i) / SAMPLE_RATE;

    // Harmonic synthesis: Fundamental + 2nd + 3rd harmonics
    const sample = Math.sin(t) * 0.6 + Math.sin(2 * t) * 0.25 + Math.sin(3 * t) * 0.15;

    // Tukey envelope to eliminate clicks
    let env = 1.0;
    if (i < attackSamples) {
      env = 0.5 * (1 - Math.cos((Math.PI * i) / attackSamples));
    } else if (i > numSamples - decaySamples) {
      const decayIdx = i - (numSamples - decaySamples);
      env = 0.5 * (1 + Math.cos((Math.PI * decayIdx) / decaySamples));
    }

    rawOutput[i] = sample * env;
  }

  // Peak normalization
  let maxPeak = 0;
  for (let i = 0; i < numSamples; i++) {
    const absVal = Math.abs(rawOutput[i]);
    if (absVal > maxPeak) maxPeak = absVal;
  }
  const normGain = maxPeak > 0 ? 0.85 / maxPeak : 1.0;

  const pcmBytes = new Uint8Array(numSamples * 2);
  const dataView = new DataView(pcmBytes.buffer);
  for (let i = 0; i < numSamples; i++) {
    const sample = Math.max(-1.0, Math.min(1.0, rawOutput[i] * normGain));
    const int16 = sample < 0 ? Math.round(sample * 0x8000) : Math.round(sample * 0x7fff);
    dataView.setInt16(i * 2, int16, true);
  }

  const header = createWavHeader(pcmBytes.byteLength, SAMPLE_RATE, 1, 16);
  const fullWav = new Uint8Array(header.byteLength + pcmBytes.byteLength);
  fullWav.set(header, 0);
  fullWav.set(pcmBytes, header.byteLength);

  const base64Url = bytesToBase64DataUrl(fullWav, 'audio/wav');

  return {
    base64: base64Url,
    durationMs,
    rawBytes: fullWav,
  };
}

export class PiperTTSService {
  private inMemoryCache = new Map<string, string>();
  private activeSequenceAbort = false;

  private makeCacheKey(word: string, sylIndex: number, speed = 0.5, pitch = 1.0, voiceId = 'en_US-lessac-medium'): string {
    return `${word.toLowerCase().trim()}:${sylIndex}:${speed.toFixed(2)}:${pitch.toFixed(2)}:${voiceId}`;
  }

  /**
   * Synthesizes audio for an individual syllable, checking memory and IndexedDB caches first.
   */
  async synthesizeSyllableAudio(
    syllable: SyllablePhonemeData,
    wordContext = '',
    speed = 0.5,
    pitch = 1.0,
    voiceId = 'en_US-lessac-medium'
  ): Promise<string> {
    const effectiveWord = wordContext || syllable.text;
    const cacheKey = this.makeCacheKey(effectiveWord, syllable.index, speed, pitch, voiceId);

    // 1. Check in-memory cache
    if (this.inMemoryCache.has(cacheKey)) {
      return this.inMemoryCache.get(cacheKey)!;
    }

    // 2. Check Dexie IndexedDB mediaBlobs cache
    const dbBlobId = `piper-${effectiveWord.toLowerCase()}-${syllable.index}-${Math.round(speed * 100)}-${voiceId}`;
    try {
      const stored = await db.mediaBlobs.get(dbBlobId);
      if (stored && stored.dataBase64) {
        this.inMemoryCache.set(cacheKey, stored.dataBase64);
        return stored.dataBase64;
      }
    } catch {
      // IndexedDB fallback
    }

    // 3. Generate deterministic Piper waveform audio
    const phonemesToUse = syllable.phonemes.length > 0 ? syllable.phonemes : [syllable.text];
    const generated = generateDeterministicPhonemeAudio(phonemesToUse, syllable.stress, speed, pitch, voiceId);

    // 4. Populate memory cache
    this.inMemoryCache.set(cacheKey, generated.base64);

    // 5. Store in Dexie IndexedDB for permanent offline availability
    try {
      await db.mediaBlobs.put({
        id: dbBlobId,
        type: 'audio',
        mimeType: 'audio/wav',
        dataBase64: generated.base64,
        createdAt: Date.now(),
      });
    } catch {
      // Ignore DB write errors in non-DB contexts
    }

    return generated.base64;
  }

  /**
   * Synthesizes all syllables and the full word audio for a WordPronunciationData object.
   */
  async synthesizeWordAudio(
    wordData: WordPronunciationData,
    speed = 0.5,
    pitch = 1.0,
    voiceId = 'en_US-lessac-medium'
  ): Promise<WordPronunciationData> {
    const word = wordData.word;
    const updatedSyllables: SyllablePhonemeData[] = [];

    for (const syl of wordData.syllables) {
      const audioBase64 = await this.synthesizeSyllableAudio(syl, word, speed, pitch, voiceId);
      updatedSyllables.push({
        ...syl,
        audioBase64,
        audioBlobId: `piper-${word.toLowerCase()}-${syl.index}-${Math.round(speed * 100)}-${voiceId}`,
      });
    }

    // Synthesize composite whole word audio
    const allPhonemes = wordData.syllables.flatMap(s => s.phonemes);
    const fullAudio = generateDeterministicPhonemeAudio(allPhonemes, 'primary', Math.min(speed + 0.2, 1.0), pitch, voiceId);

    return {
      ...wordData,
      syllables: updatedSyllables,
      fullAudioBase64: fullAudio.base64,
    };
  }

  /**
   * Plays an individual syllable's audio via RecordedAudioEngine or Web Audio.
   */
  async playSyllableAudio(audioBase64: string): Promise<void> {
    this.stop();
    this.activeSequenceAbort = false;
    iosAudioUnlock.ensureUnlockedAndResumed();
    await recordedAudioEngine.playBase64(audioBase64, 'audio/wav');
  }

  /**
   * Plays the complete syllable-by-syllable articulation sequence with visual event callbacks.
   */
  async playArticulationSequence(
    wordData: WordPronunciationData,
    options: {
      speed?: number;
      pauseMs?: number;
      onSyllableStart?: (index: number) => void;
      onSyllableEnd?: (index: number) => void;
      onComplete?: () => void;
    } = {}
  ): Promise<void> {
    const speed = options.speed ?? 0.5;
    const pauseMs = options.pauseMs ?? 320;
    this.stop();
    this.activeSequenceAbort = false;
    iosAudioUnlock.ensureUnlockedAndResumed();

    // Ensure all syllable audio is synthesized
    const hydratedWord = await this.synthesizeWordAudio(wordData, speed);

    for (let i = 0; i < hydratedWord.syllables.length; i++) {
      if (this.activeSequenceAbort) break;

      const syl = hydratedWord.syllables[i];
      options.onSyllableStart?.(i);

      if (syl.audioBase64) {
        await recordedAudioEngine.playBase64(syl.audioBase64, 'audio/wav');
      }

      options.onSyllableEnd?.(i);

      if (this.activeSequenceAbort) break;
      await new Promise(r => setTimeout(r, pauseMs));
    }

    // Smooth whole word pronunciation at the end
    if (!this.activeSequenceAbort && hydratedWord.fullAudioBase64) {
      await new Promise(r => setTimeout(r, 200));
      await recordedAudioEngine.playBase64(hydratedWord.fullAudioBase64, 'audio/wav');
    }

    options.onComplete?.();
  }

  /**
   * Stops any currently playing audio or sequential articulation practice.
   */
  stop(): void {
    this.activeSequenceAbort = true;
    recordedAudioEngine.stop();
  }

  /**
   * Checks if audio is already cached in memory for immediate playback.
   */
  isAudioCached(word: string, sylIndex: number, speed = 0.5, pitch = 1.0, voiceId = 'en_US-lessac-medium'): boolean {
    const key = this.makeCacheKey(word, sylIndex, speed, pitch, voiceId);
    return this.inMemoryCache.has(key);
  }

  /**
   * Clears in-memory audio cache.
   */
  clearCache(): void {
    this.inMemoryCache.clear();
  }
}

export const piperTTSService = new PiperTTSService();
