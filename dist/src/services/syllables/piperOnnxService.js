/**
 * True Neural Piper TTS Engine with ONNX Runtime Web (WASM / WebGPU)
 *
 * Executes authentic Piper neural voice models (VITS) directly in the browser.
 * Caches model files in IndexedDB / CacheStorage for 100% offline neural synthesis.
 */
import { db } from '../db/AppDatabase.js';
import { createWavHeader, bytesToBase64DataUrl } from './piperTTSService.js';
// Safely resolve ONNX Runtime Web in browser, worker, or testing environments
let ortInstance = typeof globalThis !== 'undefined' && globalThis.ort
    ? globalThis.ort
    : typeof window !== 'undefined' && window.ort
        ? window.ort
        : null;
async function getOrt() {
    if (ortInstance)
        return ortInstance;
    if (typeof globalThis !== 'undefined' && globalThis.ort) {
        ortInstance = globalThis.ort;
        return ortInstance;
    }
    if (typeof window !== 'undefined' && window.ort) {
        ortInstance = window.ort;
        return ortInstance;
    }
    try {
        // @ts-ignore
        ortInstance = await import('onnxruntime-web');
        return ortInstance;
    }
    catch {
        return globalThis?.ort || window?.ort || null;
    }
}
// Configure ONNX WebAssembly environment paths for local offline execution
if (typeof window !== 'undefined' && ortInstance && ortInstance.env && ortInstance.env.wasm) {
    ortInstance.env.wasm.wasmPaths = '/wasm/';
    ortInstance.env.wasm.numThreads = 1;
    ortInstance.env.wasm.simd = true;
}
class PiperOnnxService {
    session = null;
    config = null;
    loadStatus = 'unloaded';
    loadError = null;
    loadProgress = 0;
    voiceId = 'en_US-amy-medium';
    modelUrl = '/models/piper/en_US-amy-medium.onnx';
    configUrl = '/models/piper/en_US-amy-medium.onnx.json';
    inMemoryCache = new Map();
    getVoiceId() {
        return this.voiceId;
    }
    getStatus() {
        return {
            status: this.loadStatus,
            progress: this.loadProgress,
            error: this.loadError,
        };
    }
    isReady() {
        return this.loadStatus === 'ready' && this.session !== null && this.config !== null;
    }
    /**
     * Loads the Piper ONNX model and config from IndexedDB cache or network.
     */
    async loadModel(onProgress) {
        if (this.loadStatus === 'ready' && this.session)
            return;
        if (this.loadStatus === 'loading')
            return;
        this.loadStatus = 'loading';
        this.loadError = null;
        this.loadProgress = 5;
        onProgress?.(5);
        try {
            // 1. Fetch & Parse Model Config
            const configRes = await fetch(this.configUrl);
            if (!configRes.ok)
                throw new Error(`Failed to load config: HTTP ${configRes.status}`);
            this.config = (await configRes.json());
            this.loadProgress = 20;
            onProgress?.(20);
            // 2. Check IndexedDB for cached ONNX model bytes
            let modelBuffer = null;
            try {
                const cachedBlob = await db.mediaBlobs.get(`piper-model-${this.voiceId}`);
                if (cachedBlob && cachedBlob.dataBase64) {
                    const binary = atob(cachedBlob.dataBase64);
                    const bytes = new Uint8Array(binary.length);
                    for (let i = 0; i < binary.length; i++)
                        bytes[i] = binary.charCodeAt(i);
                    modelBuffer = bytes.buffer;
                    this.loadProgress = 60;
                    onProgress?.(60);
                }
            }
            catch {
                // Cache read miss
            }
            // 3. Download if not cached
            if (!modelBuffer) {
                const response = await fetch(this.modelUrl);
                if (!response.ok)
                    throw new Error(`Failed to load model binary: HTTP ${response.status}`);
                modelBuffer = await response.arrayBuffer();
                this.loadProgress = 70;
                onProgress?.(70);
                // Cache model binary in background
                try {
                    const uint8 = new Uint8Array(modelBuffer);
                    let binary = '';
                    const chunkSize = 8192;
                    for (let i = 0; i < uint8.length; i += chunkSize) {
                        binary += String.fromCharCode.apply(null, Array.from(uint8.subarray(i, i + chunkSize)));
                    }
                    const base64 = btoa(binary);
                    await db.mediaBlobs.put({
                        id: `piper-model-${this.voiceId}`,
                        type: 'audio',
                        mimeType: 'application/octet-stream',
                        dataBase64: base64,
                        createdAt: Date.now(),
                    });
                }
                catch {
                    // Ignore cache write errors
                }
            }
            // 4. Initialize ONNX Inference Session
            this.loadProgress = 85;
            onProgress?.(85);
            const ortRuntime = await getOrt();
            if (!ortRuntime) {
                throw new Error('ONNX Runtime Web is not available in current environment');
            }
            // Configure ONNX environment for WebAssembly
            if (ortRuntime.env && ortRuntime.env.wasm) {
                ortRuntime.env.wasm.wasmPaths = '/wasm/';
                ortRuntime.env.wasm.numThreads = 1;
                ortRuntime.env.wasm.simd = true;
            }
            this.session = await ortRuntime.InferenceSession.create(modelBuffer, {
                executionProviders: ['wasm'],
                graphOptimizationLevel: 'all',
            });
            this.loadStatus = 'ready';
            this.loadProgress = 100;
            onProgress?.(100);
        }
        catch (err) {
            this.loadStatus = 'error';
            this.loadError = err?.message || 'Failed to initialize Piper neural model';
            throw err;
        }
    }
    /**
     * Converts a sequence of IPA phoneme tokens to Piper input tensor IDs.
     */
    phonemesToIds(phonemes) {
        if (!this.config)
            throw new Error('Piper configuration not loaded');
        const idMap = this.config.phoneme_id_map;
        const pad = idMap['_'] || [0];
        const bos = idMap['^'] || [1];
        const eos = idMap['$'] || [2];
        const ids = [...bos, ...pad];
        for (const ph of phonemes) {
            if (idMap[ph]) {
                ids.push(...idMap[ph]);
                ids.push(...pad);
            }
            else {
                // Multi-char phoneme fallback (e.g. ɑː -> ɑ + ː)
                for (const char of ph) {
                    if (idMap[char]) {
                        ids.push(...idMap[char]);
                        ids.push(...pad);
                    }
                }
            }
        }
        ids.push(...eos);
        return ids;
    }
    /**
     * Synthesizes authentic neural 22.05kHz PCM audio from IPA phonemes using Piper ONNX.
     */
    async synthesizePhonemes(phonemes, options = {}) {
        if (!this.isReady() || !this.session || !this.config) {
            await this.loadModel();
        }
        const phonemeIds = this.phonemesToIds(phonemes);
        const sampleRate = this.config.audio.sample_rate || 22050;
        // Speech rate control via length_scale (lower length_scale = faster, higher = slower)
        const baseLengthScale = this.config.inference.length_scale || 1.0;
        const userSpeed = options.speed ?? 0.5;
        const effectiveLengthScale = baseLengthScale * (1.0 / Math.max(0.2, userSpeed));
        const noiseScale = options.noiseScale ?? (this.config.inference.noise_scale || 0.667);
        const noiseW = options.noiseW ?? (this.config.inference.noise_w || 0.8);
        const ortRuntime = await getOrt();
        if (!ortRuntime)
            throw new Error('ONNX Runtime is not available');
        // Create ONNX Tensors
        const inputTensor = new ortRuntime.Tensor('int64', BigInt64Array.from(phonemeIds.map((id) => BigInt(id))), [1, phonemeIds.length]);
        const inputLengthsTensor = new ortRuntime.Tensor('int64', BigInt64Array.from([BigInt(phonemeIds.length)]), [1]);
        const scalesTensor = new ortRuntime.Tensor('float32', Float32Array.from([noiseScale, effectiveLengthScale, noiseW]), [3]);
        const feeds = {
            input: inputTensor,
            input_lengths: inputLengthsTensor,
            scales: scalesTensor,
        };
        // Run Neural Inference
        const results = await this.session.run(feeds);
        const outputTensor = results.output;
        const audioFloat = outputTensor.data;
        // Convert Float32 samples [-1.0, 1.0] to 16-bit PCM WAV
        const numSamples = audioFloat.length;
        const pcmBytes = new Uint8Array(numSamples * 2);
        const dataView = new DataView(pcmBytes.buffer);
        for (let i = 0; i < numSamples; i++) {
            const sample = Math.max(-1.0, Math.min(1.0, audioFloat[i]));
            const int16 = sample < 0 ? Math.round(sample * 0x8000) : Math.round(sample * 0x7fff);
            dataView.setInt16(i * 2, int16, true);
        }
        const header = createWavHeader(pcmBytes.byteLength, sampleRate, 1, 16);
        const fullWav = new Uint8Array(header.byteLength + pcmBytes.byteLength);
        fullWav.set(header, 0);
        fullWav.set(pcmBytes, header.byteLength);
        const durationMs = Math.round((numSamples / sampleRate) * 1000.0);
        const base64Url = bytesToBase64DataUrl(fullWav, 'audio/wav');
        return {
            base64: base64Url,
            durationMs,
            rawBytes: fullWav,
        };
    }
    /**
     * Synthesizes and caches an individual syllable audio.
     */
    async synthesizeSyllable(syllable, word = '', speed = 0.5) {
        const cacheKey = `neural:${word.toLowerCase().trim()}:${syllable.index}:${speed.toFixed(2)}`;
        if (this.inMemoryCache.has(cacheKey)) {
            return this.inMemoryCache.get(cacheKey);
        }
        const phonemes = syllable.phonemes.length > 0 ? syllable.phonemes : [syllable.text];
        const result = await this.synthesizePhonemes(phonemes, { speed });
        this.inMemoryCache.set(cacheKey, result.base64);
        // Save to IndexedDB
        try {
            const blobId = `neural-piper-${word.toLowerCase()}-${syllable.index}-${Math.round(speed * 100)}`;
            await db.mediaBlobs.put({
                id: blobId,
                type: 'audio',
                mimeType: 'audio/wav',
                dataBase64: result.base64,
                createdAt: Date.now(),
            });
        }
        catch {
            // Ignore DB write errors
        }
        return result.base64;
    }
    /**
     * Synthesizes all syllables and whole word audio for WordPronunciationData.
     */
    async synthesizeWord(wordData, speed = 0.5) {
        const word = wordData.word;
        const updatedSyllables = [];
        for (const syl of wordData.syllables) {
            const audioBase64 = await this.synthesizeSyllable(syl, word, speed);
            updatedSyllables.push({
                ...syl,
                audioBase64,
                audioBlobId: `neural-piper-${word.toLowerCase()}-${syl.index}-${Math.round(speed * 100)}`,
            });
        }
        // Synthesize full word
        const allPhonemes = wordData.syllables.flatMap((s) => s.phonemes);
        const fullAudio = await this.synthesizePhonemes(allPhonemes, { speed: Math.min(speed + 0.2, 1.0) });
        return {
            ...wordData,
            syllables: updatedSyllables,
            fullAudioBase64: fullAudio.base64,
        };
    }
}
export const piperOnnxService = new PiperOnnxService();
