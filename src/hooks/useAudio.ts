import { useState, useCallback } from 'react';
import { audioService } from '../services/audio/AudioService';
import { SpeechOptions, isChineseText } from '../services/audio/WebSpeechEngine';
import { AACCard, VisualSceneHotspot } from '../types';
import { useSettings } from './useSettings';

export function useAudio() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { settings } = useSettings();

  const getVoiceForText = useCallback(
    (text: string) => {
      if (isChineseText(text)) {
        return settings.selectedVoiceZhTW || settings.selectedVoiceURI || '';
      }
      return settings.selectedVoiceEnUS || settings.selectedVoiceURI || '';
    },
    [settings]
  );

  const speakText = useCallback(
    async (text: string, customOptions?: SpeechOptions) => {
      setIsSpeaking(true);
      const voiceURI = customOptions?.voiceURI || getVoiceForText(text);
      const locale = customOptions?.locale || (isChineseText(text) ? 'zh-TW' : 'en-US');
      try {
        await audioService.speakCardOrText(text, undefined, {
          rate: settings.speechRate,
          pitch: settings.speechPitch,
          voiceURI,
          locale,
          ...customOptions,
          onStart: () => {
            setIsSpeaking(true);
            customOptions?.onStart?.();
          },
          onEnd: () => {
            setIsSpeaking(false);
            customOptions?.onEnd?.();
          },
          onError: (e) => {
            setIsSpeaking(false);
            customOptions?.onError?.(e);
          },
        });
      } finally {
        setIsSpeaking(false);
      }
    },
    [settings, getVoiceForText]
  );

  /**
   * Universal bilingual speech method for Cards, Scenes, and Pain Map.
   * Respects settings.cardSpeechLanguage: 'en', 'zh', 'en-then-zh', 'zh-then-en', 'both'.
   */
  const speakBilingual = useCallback(
    async (
      enText: string,
      zhText?: string,
      audioBlobId?: string,
      customOptions?: SpeechOptions
    ) => {
      setIsSpeaking(true);
      const mode = settings.cardSpeechLanguage || 'en-then-zh';
      const enVoice = customOptions?.voiceURI || settings.selectedVoiceEnUS || settings.selectedVoiceURI || '';
      const zhVoice = settings.selectedVoiceZhTW || settings.selectedVoiceURI || '';

      try {
        if (mode === 'zh') {
          // Chinese only
          const textToSpeak = zhText || enText;
          const voiceURI = zhText ? zhVoice : enVoice;
          const locale: 'en-US' | 'zh-TW' = zhText ? 'zh-TW' : 'en-US';
          await audioService.speakCardOrText(textToSpeak, audioBlobId, {
            rate: settings.speechRate,
            pitch: settings.speechPitch,
            voiceURI,
            locale,
            ...customOptions,
            onStart: () => {
              setIsSpeaking(true);
              customOptions?.onStart?.();
            },
            onEnd: () => {
              setIsSpeaking(false);
              customOptions?.onEnd?.();
            },
            onError: (e) => {
              setIsSpeaking(false);
              customOptions?.onError?.(e);
            },
          });
        } else if (mode === 'en-then-zh' || mode === 'both') {
          // English first, then Chinese
          await audioService.speakCardOrText(enText, audioBlobId, {
            rate: settings.speechRate,
            pitch: settings.speechPitch,
            voiceURI: enVoice,
            locale: 'en-US',
            ...customOptions,
            onStart: () => {
              setIsSpeaking(true);
              customOptions?.onStart?.();
            },
          });

          if (zhText) {
            await new Promise((resolve) => setTimeout(resolve, 250));
            await audioService.speakCardOrText(zhText, undefined, {
              rate: settings.speechRate,
              pitch: settings.speechPitch,
              voiceURI: zhVoice,
              locale: 'zh-TW',
              onEnd: () => {
                setIsSpeaking(false);
                customOptions?.onEnd?.();
              },
              onError: (e) => {
                setIsSpeaking(false);
                customOptions?.onError?.(e);
              },
            });
          } else {
            setIsSpeaking(false);
            customOptions?.onEnd?.();
          }
        } else if (mode === 'zh-then-en') {
          // Chinese first, then English
          const firstText = zhText || enText;
          const firstVoice = zhText ? zhVoice : enVoice;
          const firstLocale: 'en-US' | 'zh-TW' = zhText ? 'zh-TW' : 'en-US';

          await audioService.speakCardOrText(firstText, undefined, {
            rate: settings.speechRate,
            pitch: settings.speechPitch,
            voiceURI: firstVoice,
            locale: firstLocale,
            ...customOptions,
            onStart: () => {
              setIsSpeaking(true);
              customOptions?.onStart?.();
            },
          });

          if (zhText && enText) {
            await new Promise((resolve) => setTimeout(resolve, 250));
            await audioService.speakCardOrText(enText, audioBlobId, {
              rate: settings.speechRate,
              pitch: settings.speechPitch,
              voiceURI: enVoice,
              locale: 'en-US',
              onEnd: () => {
                setIsSpeaking(false);
                customOptions?.onEnd?.();
              },
              onError: (e) => {
                setIsSpeaking(false);
                customOptions?.onError?.(e);
              },
            });
          } else {
            setIsSpeaking(false);
            customOptions?.onEnd?.();
          }
        } else {
          // English only (default)
          await audioService.speakCardOrText(enText, audioBlobId, {
            rate: settings.speechRate,
            pitch: settings.speechPitch,
            voiceURI: enVoice,
            locale: 'en-US',
            ...customOptions,
            onStart: () => {
              setIsSpeaking(true);
              customOptions?.onStart?.();
            },
            onEnd: () => {
              setIsSpeaking(false);
              customOptions?.onEnd?.();
            },
            onError: (e) => {
              setIsSpeaking(false);
              customOptions?.onError?.(e);
            },
          });
        }
      } finally {
        setIsSpeaking(false);
      }
    },
    [settings]
  );

  const speakCard = useCallback(
    (card: AACCard, customOptions?: SpeechOptions) => {
      return speakBilingual(
        card.spokenText || card.label,
        card.spokenTextZh || card.labelZh,
        card.audioBlobId,
        customOptions
      );
    },
    [speakBilingual]
  );

  const speakHotspot = useCallback(
    (hotspot: VisualSceneHotspot, customOptions?: SpeechOptions) => {
      return speakBilingual(
        hotspot.spokenText || hotspot.label,
        hotspot.spokenTextZh || hotspot.labelZh,
        hotspot.audioBlobId,
        customOptions
      );
    },
    [speakBilingual]
  );

  const speakPainReport = useCallback(
    (enSentence: string, zhSentence?: string, customOptions?: SpeechOptions) => {
      return speakBilingual(enSentence, zhSentence, undefined, customOptions);
    },
    [speakBilingual]
  );

  const triggerEmergency = useCallback(
    async (enPhrase: string, zhPhrase?: string) => {
      setIsSpeaking(true);
      try {
        audioService.stopAll();
        audioService.playAlert();
        // Short pause to let alert tone lead, then speak phrase(s) bilingually
        await new Promise((r) => setTimeout(r, 120));
        await speakBilingual(enPhrase, zhPhrase, undefined, { pitch: 1.1 });
      } finally {
        setIsSpeaking(false);
      }
    },
    [speakBilingual]
  );

  const playSuccess = useCallback(() => {
    audioService.playSuccess();
  }, []);

  const playAlert = useCallback(() => {
    audioService.playAlert();
  }, []);

  const playError = useCallback(() => {
    audioService.playError();
  }, []);

  const stopAll = useCallback(() => {
    audioService.stopAll();
    setIsSpeaking(false);
  }, []);

  return {
    isSpeaking,
    speakText,
    speakBilingual,
    speakCard,
    speakHotspot,
    speakPainReport,
    triggerEmergency,
    playSuccess,
    playAlert,
    playError,
    stopAll,
  };
}
