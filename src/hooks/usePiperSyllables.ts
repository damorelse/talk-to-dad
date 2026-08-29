/**
 * Hook for True Neural Piper TTS & eSpeak NG Syllable-by-Syllable Articulation Training
 * 
 * Powered 100% by offline ONNX Runtime Web (WASM) neural VITS speech synthesis.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { WordPronunciationData } from '../types/index.ts';
import { phonemizeWord } from '../services/syllables/espeakPhonemizer.ts';
import { piperTTSService } from '../services/syllables/piperTTSService.ts';
import { piperOnnxService, ModelLoadStatus } from '../services/syllables/piperOnnxService.ts';
import { iosAudioUnlock } from '../services/audio/iOSAudioUnlock.ts';
import { speechEngine } from '../services/audio/WebSpeechEngine.ts';

export function usePiperSyllables(initialWord = 'Photography', initialSpeed = 0.5) {
  const [word, setWordState] = useState<string>(initialWord);
  const [speed, setSpeedState] = useState<number>(initialSpeed);
  const [modelStatus, setModelStatus] = useState<{ status: ModelLoadStatus; progress: number; error: string | null }>({
    status: 'unloaded',
    progress: 0,
    error: null,
  });
  const [pronunciationData, setPronunciationData] = useState<WordPronunciationData>(() =>
    phonemizeWord(initialWord)
  );
  const [activeSyllableIdx, setActiveSyllableIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      piperTTSService.stop();
      speechEngine.cancel();
    };
  }, []);

  // Update pronunciation data when word changes
  const setWord = useCallback((newWord: string) => {
    const trimmed = newWord.trim();
    if (!trimmed) return;
    piperTTSService.stop();
    speechEngine.cancel();
    setActiveSyllableIdx(null);
    setIsPlaying(false);
    setWordState(trimmed);
    const data = phonemizeWord(trimmed);
    setPronunciationData(data);
  }, []);

  const setSpeed = useCallback((newSpeed: number) => {
    setSpeedState(newSpeed);
  }, []);

  // Load ONNX neural model on mount
  useEffect(() => {
    let isCurrent = true;
    piperOnnxService
      .loadModel(() => {
        if (isCurrent && isMountedRef.current) {
          setModelStatus(piperOnnxService.getStatus());
        }
      })
      .then(() => {
        if (isCurrent && isMountedRef.current) {
          setModelStatus(piperOnnxService.getStatus());
        }
      })
      .catch(() => {
        if (isCurrent && isMountedRef.current) {
          setModelStatus(piperOnnxService.getStatus());
        }
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  // Pre-synthesize and cache syllables on word, speed, or model readiness change
  useEffect(() => {
    let isCurrent = true;
    const warmCache = async () => {
      if (!pronunciationData || pronunciationData.syllables.length === 0) return;

      setIsSynthesizing(true);
      try {
        const hydrated = piperOnnxService.isReady()
          ? await piperOnnxService.synthesizeWord(pronunciationData, speed)
          : await piperTTSService.synthesizeWordAudio(pronunciationData, speed);
        if (isCurrent && isMountedRef.current) {
          setPronunciationData(hydrated);
        }
      } catch (err) {
        console.error('Syllable synthesis error:', err);
      } finally {
        if (isCurrent && isMountedRef.current) {
          setIsSynthesizing(false);
        }
      }
    };
    warmCache();
    return () => {
      isCurrent = false;
    };
  }, [word, speed, modelStatus.status]);

  // Play an isolated single syllable audio
  const playSingleSyllable = useCallback(
    async (index: number) => {
      const syl = pronunciationData.syllables[index];
      if (!syl) return;

      setActiveSyllableIdx(index);
      setIsPlaying(true);
      iosAudioUnlock.ensureUnlockedAndResumed();

      try {
        let audioBase64 = syl.audioBase64;
        if (!audioBase64) {
          audioBase64 = piperOnnxService.isReady()
            ? await piperOnnxService.synthesizeSyllable(syl, word, speed)
            : await piperTTSService.synthesizeSyllableAudio(syl, word, speed);
        }
        await piperTTSService.playSyllableAudio(audioBase64);
      } catch (err) {
        console.error('Failed to play syllable audio:', err);
      } finally {
        setTimeout(() => {
          if (isMountedRef.current) {
            setActiveSyllableIdx(null);
            setIsPlaying(false);
          }
        }, 450);
      }
    },
    [pronunciationData, word, speed]
  );

  // Play an isolated individual IPA phoneme chip
  const playIndividualPhoneme = useCallback(
    async (phoneme: string) => {
      if (!phoneme) return;
      iosAudioUnlock.ensureUnlockedAndResumed();
      try {
        await piperTTSService.playPhonemeAudio(phoneme, speed);
      } catch (err) {
        console.error('Failed to play phoneme audio:', err);
      }
    },
    [speed]
  );

  // Synchronized sequential articulation training ("Sound It Out")
  // Sequence: 1. Speaks whole phrase -> 2. Sounds it out syllable-by-syllable -> 3. Speaks whole phrase again
  const soundItOut = useCallback(async () => {
    if (isPlaying || pronunciationData.syllables.length === 0) return;

    setIsPlaying(true);
    setActiveSyllableIdx(null);
    iosAudioUnlock.ensureUnlockedAndResumed();

    const pauseMs = Math.round(350 / speed);

    try {
      const activeData = piperOnnxService.isReady()
        ? await piperOnnxService.synthesizeWord(pronunciationData, speed)
        : await piperTTSService.synthesizeWordAudio(pronunciationData, speed);

      // STEP 1: First says the whole phrase using normal voice
      if (isMountedRef.current) {
        setActiveSyllableIdx(null);
        await new Promise<void>((resolve) => {
          speechEngine.speak(word, {
            locale: 'en-US',
            rate: Math.min(1.0, speed * 1.2),
            onEnd: () => resolve(),
            onError: () => resolve(),
          });
        });
        await new Promise((r) => setTimeout(r, 450));
      }

      // STEP 2: Then sounds it out syllable-by-syllable using dedicated phoneme audio
      for (let i = 0; i < activeData.syllables.length; i++) {
        if (!isMountedRef.current) break;
        const syl = activeData.syllables[i];
        setActiveSyllableIdx(i);

        let audio = syl.audioBase64;
        if (!audio) {
          audio = piperOnnxService.isReady()
            ? await piperOnnxService.synthesizeSyllable(syl, word, speed)
            : await piperTTSService.synthesizeSyllableAudio(syl, word, speed);
        }
        if (audio) {
          await piperTTSService.playSyllableAudio(audio);
        }
        await new Promise((r) => setTimeout(r, pauseMs));
      }

      // STEP 3: Then says the whole phrase again using normal voice
      if (isMountedRef.current) {
        setActiveSyllableIdx(null);
        await new Promise((r) => setTimeout(r, 350));
        await new Promise<void>((resolve) => {
          speechEngine.speak(word, {
            locale: 'en-US',
            rate: Math.min(1.0, speed * 1.2),
            onEnd: () => resolve(),
            onError: () => resolve(),
          });
        });
      }
    } catch (err) {
      console.error('Sequential articulation playback error:', err);
    } finally {
      if (isMountedRef.current) {
        setActiveSyllableIdx(null);
        setIsPlaying(false);
      }
    }
  }, [isPlaying, pronunciationData, speed, word]);

  // Speak whole word using normal voice (WebSpeechEngine en-US)
  const speakWholeWord = useCallback(() => {
    setIsPlaying(true);
    iosAudioUnlock.ensureUnlockedAndResumed();
    speechEngine.speak(word, {
      locale: 'en-US',
      rate: Math.min(1.0, speed * 1.2),
      onEnd: () => {
        if (isMountedRef.current) setIsPlaying(false);
      },
      onError: () => {
        if (isMountedRef.current) setIsPlaying(false);
      },
    });
  }, [word, speed]);

  const stop = useCallback(() => {
    piperTTSService.stop();
    speechEngine.cancel();
    setActiveSyllableIdx(null);
    setIsPlaying(false);
  }, []);

  return {
    word,
    setWord,
    speed,
    setSpeed,
    modelStatus,
    pronunciationData,
    activeSyllableIdx,
    isPlaying,
    isSynthesizing,
    playSingleSyllable,
    playIndividualPhoneme,
    soundItOut,
    speakWholeWord,
    stop,
  };
}
