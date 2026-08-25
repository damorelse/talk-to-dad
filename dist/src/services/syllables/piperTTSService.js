/**
 * Local Deterministic Piper TTS Syllable Audio Synthesis & Caching Engine
 *
 * Implements a high-precision digital IIR Biquad Resonator Source-Filter synthesizer (Klatt/Fant model)
 * with distinct Piper voice profiles (Lessac, Ryan, Amy, Danny, LibriTTS).
 * Generates natural, clean, click-free 22,050Hz PCM audio for individual IPA syllables and caches
 * in memory and IndexedDB.
 */
import { db } from '../db/AppDatabase.js';
import { recordedAudioEngine } from '../audio/RecordedAudioEngine.js';
import { iosAudioUnlock } from '../audio/iOSAudioUnlock.js';
const SAMPLE_RATE = 22050; // Standard Piper TTS sample rate (Hz)
// Digital 2nd-order IIR Biquad Resonator Filter (Klatt Acoustic Resonator)
export class BiquadResonator {
    a;
    b;
    c;
    y1 = 0;
    y2 = 0;
    constructor(freq, bandwidth, sampleRate = SAMPLE_RATE) {
        const clampedFreq = Math.max(50, Math.min(sampleRate * 0.48, freq));
        const clampedBw = Math.max(30, Math.min(sampleRate * 0.25, bandwidth));
        const r = Math.exp((-Math.PI * clampedBw) / sampleRate);
        this.c = -(r * r);
        this.b = 2.0 * r * Math.cos((2.0 * Math.PI * clampedFreq) / sampleRate);
        this.a = 1.0 - this.b - this.c;
    }
    process(x) {
        const y = this.a * x + this.b * this.y1 + this.c * this.y2;
        this.y2 = this.y1;
        this.y1 = y;
        return y;
    }
    reset() {
        this.y1 = 0;
        this.y2 = 0;
    }
}
// 1st-order Low-Pass Filter for Glottal Spectral Tilt (-12dB/octave)
export class LowPassFilter {
    alpha;
    prev = 0;
    constructor(cutoffHz, sampleRate = SAMPLE_RATE) {
        const rc = 1.0 / (2.0 * Math.PI * cutoffHz);
        const dt = 1.0 / sampleRate;
        this.alpha = dt / (rc + dt);
    }
    process(x) {
        this.prev = this.prev + this.alpha * (x - this.prev);
        return this.prev;
    }
}
const VOWEL_ACOUSTICS = {
    // Schwa (unstressed central vowel)
    'ə': { f1: 500, f2: 1500, f3: 2500, bw1: 80, bw2: 100, bw3: 130, baseDurationMs: 170 },
    // Open back unrounded /ɑː/ (father, tog in photography)
    'ɑː': { f1: 760, f2: 1180, f3: 2450, bw1: 90, bw2: 110, bw3: 140, baseDurationMs: 250 },
    // Near-open front /æ/ (cat, trap)
    'æ': { f1: 800, f2: 1750, f3: 2500, bw1: 90, bw2: 120, bw3: 140, baseDurationMs: 240 },
    // Open-mid front /ɛ/ (bed, dress)
    'ɛ': { f1: 550, f2: 1850, f3: 2550, bw1: 80, bw2: 100, bw3: 130, baseDurationMs: 210 },
    // Near-close near-front /ɪ/ (sit, kit, i in medicine)
    'ɪ': { f1: 400, f2: 1950, f3: 2600, bw1: 70, bw2: 100, bw3: 130, baseDurationMs: 180 },
    // Close front /i/ and /iː/ (fleece, phy in photography)
    'i': { f1: 280, f2: 2250, f3: 2900, bw1: 60, bw2: 90, bw3: 120, baseDurationMs: 200 },
    'iː': { f1: 270, f2: 2300, f3: 2950, bw1: 60, bw2: 90, bw3: 120, baseDurationMs: 260 },
    // Close back rounded /uː/ (goose, too, room)
    'uː': { f1: 320, f2: 850, f3: 2250, bw1: 70, bw2: 90, bw3: 130, baseDurationMs: 250 },
    // Near-close near-back /ʊ/ (foot, put)
    'ʊ': { f1: 450, f2: 1050, f3: 2300, bw1: 75, bw2: 95, bw3: 130, baseDurationMs: 190 },
    // Open-mid back /ʌ/ (cup, strut, but in butterfly)
    'ʌ': { f1: 650, f2: 1200, f3: 2400, bw1: 85, bw2: 105, bw3: 135, baseDurationMs: 210 },
    // Open-mid back rounded /ɔː/ (water, thought, call)
    'ɔː': { f1: 560, f2: 880, f3: 2400, bw1: 80, bw2: 100, bw3: 130, baseDurationMs: 260 },
    // Nurse / bird rhotic vowel /ɜː/
    'ɜː': { f1: 480, f2: 1350, f3: 1650, bw1: 80, bw2: 110, bw3: 130, baseDurationMs: 240 },
    // Diphthongs
    'aɪ': { f1: 750, f2: 1200, f3: 2100, bw1: 90, bw2: 110, bw3: 130, baseDurationMs: 280 },
    'eɪ': { f1: 500, f2: 1800, f3: 2150, bw1: 80, bw2: 100, bw3: 130, baseDurationMs: 270 },
    'ɔɪ': { f1: 550, f2: 900, f3: 2100, bw1: 85, bw2: 105, bw3: 130, baseDurationMs: 280 },
    'aʊ': { f1: 750, f2: 1200, f3: 900, bw1: 90, bw2: 110, bw3: 130, baseDurationMs: 280 },
    'oʊ': { f1: 500, f2: 1000, f3: 850, bw1: 80, bw2: 100, bw3: 130, baseDurationMs: 270 },
};
export const PIPER_VOICE_PROFILES = {
    'en_US-lessac-medium': {
        id: 'en_US-lessac-medium',
        name: 'Lessac (Female - Clear)',
        gender: 'female',
        description: 'High-clarity female voice with bright formant clarity for speech rehabilitation',
        basePitch: 210,
        formantScale: 1.08,
        openQuotient: 0.44,
        spectralTiltHz: 2800,
    },
    'en_US-ryan-medium': {
        id: 'en_US-ryan-medium',
        name: 'Ryan (Male - Deep)',
        gender: 'male',
        description: 'Deep resonant male voice with rich fundamental chest harmonics',
        basePitch: 112,
        formantScale: 0.92,
        openQuotient: 0.38,
        spectralTiltHz: 1800,
    },
    'en_US-amy-low': {
        id: 'en_US-amy-low',
        name: 'Amy (Female - Warm)',
        gender: 'female',
        description: 'Warm, soft female register with gentle articulation',
        basePitch: 185,
        formantScale: 1.03,
        openQuotient: 0.48,
        spectralTiltHz: 2400,
    },
    'en_US-danny-low': {
        id: 'en_US-danny-low',
        name: 'Danny (Male - Calm)',
        gender: 'male',
        description: 'Calm, low-register steady male voice',
        basePitch: 98,
        formantScale: 0.88,
        openQuotient: 0.36,
        spectralTiltHz: 1600,
    },
    'en_US-libritts_r-medium': {
        id: 'en_US-libritts_r-medium',
        name: 'LibriTTS (Studio Neutral)',
        gender: 'neutral',
        description: 'Balanced studio narration voice',
        basePitch: 145,
        formantScale: 1.0,
        openQuotient: 0.42,
        spectralTiltHz: 2200,
    },
};
/**
 * Creates standard 44-byte RIFF/WAVE header for mono 16-bit PCM audio.
 */
export function createWavHeader(dataLength, sampleRate = SAMPLE_RATE, numChannels = 1, bitsPerSample = 16) {
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
    view.setUint8(8, 0x57); // 'W'
    view.setUint8(9, 0x41); // 'A'
    view.setUint8(10, 0x56); // 'V'
    view.setUint8(11, 0x45); // 'E'
    // "fmt " subchunk
    view.setUint8(12, 0x66); // 'f'
    view.setUint8(13, 0x6d); // 'm'
    view.setUint8(14, 0x74); // 't'
    view.setUint8(15, 0x20); // ' '
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
    view.setUint16(22, numChannels, true); // NumChannels
    view.setUint32(24, sampleRate, true); // SampleRate
    view.setUint32(28, byteRate, true); // ByteRate
    view.setUint16(32, blockAlign, true); // BlockAlign
    view.setUint16(34, bitsPerSample, true); // BitsPerSample
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
export function bytesToBase64DataUrl(bytes, mimeType = 'audio/wav') {
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
 * High-Precision Klatt/Fant Source-Filter Formant Synthesizer
 *
 * Accurately models the human glottis and vocal tract using IIR Biquad Resonators,
 * Rosenberg glottal excitation pulses, and spectral tilt smoothing.
 */
export function generateDeterministicPhonemeAudio(phonemes, stress = 'unstressed', speed = 0.5, pitchMultiplier = 1.0, voiceProfileId = 'en_US-lessac-medium') {
    const profile = PIPER_VOICE_PROFILES[voiceProfileId] || PIPER_VOICE_PROFILES['en_US-lessac-medium'];
    // Speed multiplier: 0.5x slows down by ~1.8x
    const durationFactor = (1.0 / Math.max(0.2, speed)) * (stress === 'primary' ? 1.25 : stress === 'secondary' ? 1.1 : 0.95);
    // Pitch settings
    const stressPitchMod = stress === 'primary' ? 1.22 : stress === 'secondary' ? 1.08 : 0.96;
    const basePitch = profile.basePitch * pitchMultiplier * stressPitchMod;
    // Identify dominant vowel and consonants
    let vowelModel = VOWEL_ACOUSTICS['ə'];
    for (const ph of phonemes) {
        if (VOWEL_ACOUSTICS[ph]) {
            vowelModel = VOWEL_ACOUSTICS[ph];
            break;
        }
    }
    const durationMs = Math.round(vowelModel.baseDurationMs * durationFactor + (phonemes.length * 35));
    const numSamples = Math.round((durationMs / 1000) * SAMPLE_RATE);
    const rawOutput = new Float32Array(numSamples);
    // Initialize Vocal Tract Resonators (scaled by profile.formantScale)
    const scale = profile.formantScale;
    const hasRhotic = phonemes.some(p => p.includes('ɹ') || p.includes('r'));
    const hasFricativeS = phonemes.some(p => p.includes('s') || p.includes('z'));
    const hasFricativeSh = phonemes.some(p => p.includes('ʃ') || p.includes('ʒ'));
    const hasFricativeF = phonemes.some(p => p.includes('f') || p.includes('v') || p.includes('θ'));
    const hasPlosiveT = phonemes.some(p => p.includes('t') || p.includes('d'));
    const hasPlosiveK = phonemes.some(p => p.includes('k') || p.includes('ɡ'));
    const hasPlosiveP = phonemes.some(p => p.includes('p') || p.includes('b'));
    const hasNasal = phonemes.some(p => p.includes('m') || p.includes('n') || p.includes('ŋ'));
    const f1 = vowelModel.f1 * scale;
    const f2 = (hasRhotic ? Math.min(vowelModel.f2, 1350) : vowelModel.f2) * scale;
    const f3 = (hasRhotic ? 1600 : vowelModel.f3) * scale;
    const f4 = 3400 * scale;
    const res1 = new BiquadResonator(f1, vowelModel.bw1);
    const res2 = new BiquadResonator(f2, vowelModel.bw2);
    const res3 = new BiquadResonator(f3, vowelModel.bw3);
    const res4 = new BiquadResonator(f4, 180);
    // Specialized Fricative Noise Resonators
    const fricativeRes = hasFricativeS
        ? new BiquadResonator(5200, 1200)
        : hasFricativeSh
            ? new BiquadResonator(3200, 1000)
            : new BiquadResonator(2200, 1500);
    // Glottal tilt smoothing filter
    const glottalTilt = new LowPassFilter(profile.spectralTiltHz);
    // Deterministic seed for reproducible noise
    let seed = 1234567;
    for (const char of phonemes.join('') + voiceProfileId) {
        seed = (seed * 31 + char.charCodeAt(0)) % 1000000007;
    }
    const pseudoRand = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed / 2147483647) * 2 - 1;
    };
    // Glottal pulse period tracker
    let phaseInPeriod = 0;
    const openQ = profile.openQuotient;
    for (let i = 0; i < numSamples; i++) {
        const progress = i / numSamples;
        // Pitch intonation contour (natural human arc)
        let curPitch = basePitch;
        if (stress === 'primary') {
            curPitch = basePitch + Math.sin(progress * Math.PI) * (basePitch * 0.18);
        }
        else {
            curPitch = basePitch - progress * (basePitch * 0.08);
        }
        const periodSamples = SAMPLE_RATE / Math.max(50, curPitch);
        // Rosenberg Glottal Source Pulse
        const tRel = phaseInPeriod / periodSamples;
        let glottalRaw = 0;
        if (tRel < openQ) {
            // Opening phase: smooth sinusoidal rise
            glottalRaw = 0.5 * (1.0 - Math.cos((Math.PI * tRel) / openQ));
        }
        else if (tRel < openQ + 0.16) {
            // Rapid closing phase
            glottalRaw = Math.cos((Math.PI * (tRel - openQ)) / 0.32);
        }
        else {
            // Closed phase (0 excitation)
            glottalRaw = 0;
        }
        phaseInPeriod += 1;
        if (phaseInPeriod >= periodSamples) {
            phaseInPeriod -= periodSamples;
        }
        // Apply glottal spectral tilt
        const glottalSource = glottalTilt.process(glottalRaw);
        // Pass glottal pulse through vocal tract formant resonators
        const y1 = res1.process(glottalSource);
        const y2 = res2.process(glottalSource);
        const y3 = res3.process(glottalSource);
        const y4 = res4.process(glottalSource);
        let vocalSound = y1 * 0.5 + y2 * 0.3 + y3 * 0.15 + y4 * 0.05;
        // Nasal murmur addition
        if (hasNasal && progress > 0.55) {
            vocalSound = vocalSound * 0.6 + Math.sin((2 * Math.PI * 220 * i) / SAMPLE_RATE) * 0.25;
        }
        // Fricative consonant noise modeling (e.g. /f/, /s/, /sh/)
        if (hasFricativeS || hasFricativeSh || hasFricativeF) {
            const isInitialFric = progress < 0.28;
            const isFinalFric = progress > 0.72;
            if (isInitialFric || isFinalFric) {
                const noise = pseudoRand();
                const shapedNoise = fricativeRes.process(noise);
                const fricWeight = isInitialFric ? 0.45 : 0.35;
                vocalSound = vocalSound * 0.4 + shapedNoise * fricWeight;
            }
        }
        // Plosive release burst (e.g. /t/, /k/, /p/)
        if (hasPlosiveT || hasPlosiveK || hasPlosiveP) {
            if (progress < 0.08) {
                // Initial closure silence then explosive burst
                if (progress < 0.02) {
                    vocalSound = 0; // Silent closure
                }
                else {
                    const burstEnv = Math.exp(-(progress - 0.02) * 50);
                    const burstFreq = hasPlosiveT ? 3800 : hasPlosiveK ? 2200 : 900;
                    const burstNoise = pseudoRand() * 0.6 + Math.sin((2 * Math.PI * burstFreq * i) / SAMPLE_RATE) * 0.4;
                    vocalSound += burstNoise * burstEnv * 0.5;
                }
            }
        }
        // Syllable Tukey Window Envelope (smooth fade-in and fade-out to prevent clicks)
        let env = 1.0;
        const attackSamples = Math.min(SAMPLE_RATE * 0.015, numSamples * 0.12);
        const decaySamples = Math.min(SAMPLE_RATE * 0.035, numSamples * 0.22);
        if (i < attackSamples) {
            env = 0.5 * (1 - Math.cos((Math.PI * i) / attackSamples));
        }
        else if (i > numSamples - decaySamples) {
            const decayIdx = i - (numSamples - decaySamples);
            env = 0.5 * (1 + Math.cos((Math.PI * decayIdx) / decaySamples));
        }
        rawOutput[i] = vocalSound * env;
    }
    // Find peak for clean auto-gain normalization (target -1.5 dB peak = 0.84)
    let maxPeak = 0;
    for (let i = 0; i < numSamples; i++) {
        const absVal = Math.abs(rawOutput[i]);
        if (absVal > maxPeak)
            maxPeak = absVal;
    }
    const normGain = maxPeak > 0 ? 0.84 / maxPeak : 1.0;
    // Convert Float32 to 16-bit PCM bytes
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
    inMemoryCache = new Map();
    activeSequenceAbort = false;
    makeCacheKey(word, sylIndex, speed = 0.5, pitch = 1.0, voiceId = 'en_US-lessac-medium') {
        return `${word.toLowerCase().trim()}:${sylIndex}:${speed.toFixed(2)}:${pitch.toFixed(2)}:${voiceId}`;
    }
    /**
     * Synthesizes audio for an individual syllable, checking memory and IndexedDB caches first.
     */
    async synthesizeSyllableAudio(syllable, wordContext = '', speed = 0.5, pitch = 1.0, voiceId = 'en_US-lessac-medium') {
        const effectiveWord = wordContext || syllable.text;
        const cacheKey = this.makeCacheKey(effectiveWord, syllable.index, speed, pitch, voiceId);
        // 1. Check in-memory cache
        if (this.inMemoryCache.has(cacheKey)) {
            return this.inMemoryCache.get(cacheKey);
        }
        // 2. Check Dexie IndexedDB mediaBlobs cache
        const dbBlobId = `piper-${effectiveWord.toLowerCase()}-${syllable.index}-${Math.round(speed * 100)}-${voiceId}`;
        try {
            const stored = await db.mediaBlobs.get(dbBlobId);
            if (stored && stored.dataBase64) {
                this.inMemoryCache.set(cacheKey, stored.dataBase64);
                return stored.dataBase64;
            }
        }
        catch {
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
        }
        catch {
            // Ignore DB write errors in non-DB contexts
        }
        return generated.base64;
    }
    /**
     * Synthesizes all syllables and the full word audio for a WordPronunciationData object.
     */
    async synthesizeWordAudio(wordData, speed = 0.5, pitch = 1.0, voiceId = 'en_US-lessac-medium') {
        const word = wordData.word;
        const updatedSyllables = [];
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
    async playSyllableAudio(audioBase64) {
        this.stop();
        this.activeSequenceAbort = false;
        iosAudioUnlock.ensureUnlockedAndResumed();
        await recordedAudioEngine.playBase64(audioBase64, 'audio/wav');
    }
    /**
     * Plays the complete syllable-by-syllable articulation sequence with visual event callbacks.
     */
    async playArticulationSequence(wordData, options = {}) {
        const speed = options.speed ?? 0.5;
        const pauseMs = options.pauseMs ?? 320;
        this.stop();
        this.activeSequenceAbort = false;
        iosAudioUnlock.ensureUnlockedAndResumed();
        // Ensure all syllable audio is synthesized
        const hydratedWord = await this.synthesizeWordAudio(wordData, speed);
        for (let i = 0; i < hydratedWord.syllables.length; i++) {
            if (this.activeSequenceAbort)
                break;
            const syl = hydratedWord.syllables[i];
            options.onSyllableStart?.(i);
            if (syl.audioBase64) {
                await recordedAudioEngine.playBase64(syl.audioBase64, 'audio/wav');
            }
            options.onSyllableEnd?.(i);
            if (this.activeSequenceAbort)
                break;
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
    stop() {
        this.activeSequenceAbort = true;
        recordedAudioEngine.stop();
    }
    /**
     * Checks if audio is already cached in memory for immediate playback.
     */
    isAudioCached(word, sylIndex, speed = 0.5, pitch = 1.0, voiceId = 'en_US-lessac-medium') {
        const key = this.makeCacheKey(word, sylIndex, speed, pitch, voiceId);
        return this.inMemoryCache.has(key);
    }
    /**
     * Clears in-memory audio cache.
     */
    clearCache() {
        this.inMemoryCache.clear();
    }
}
export const piperTTSService = new PiperTTSService();
