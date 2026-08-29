import { iosAudioUnlock } from './iOSAudioUnlock';

export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  voiceURI?: string;
  locale?: 'en-US' | 'zh-TW';
  onBoundary?: (event: SpeechSynthesisEvent) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (event: SpeechSynthesisErrorEvent) => void;
  _isFallbackRetry?: boolean;
}

/**
 * Checks if a string contains Chinese/CJK characters.
 */
export function isChineseText(text: string): boolean {
  return /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/.test(text || '');
}

/**
 * Checks if a BCP-47 locale tag or voice name corresponds to Traditional Chinese (Taiwan/HK/cmn-TW).
 * Supports Android Google Speech Services tags: cmn-TW, cmn-tw-x-ctd#female_1-local, cmn-Hant-TW,
 * Apple voices: zh-TW, zh-HK, and Google TTS naming variations.
 */
export function isZhTWLocale(lang: string, name: string = ''): boolean {
  const l = (lang || '').replace(/_/g, '-').toLowerCase();
  const n = (name || '').toLowerCase();
  return (
    l === 'zh-tw' ||
    l.startsWith('zh-tw') ||
    l.startsWith('cmn-tw') ||
    l.includes('cmn-tw') ||
    l.includes('zh-hant') ||
    l.includes('cmn-hant') ||
    l.includes('taiwan') ||
    l === 'zh-hant-tw' ||
    l === 'zh-hant_tw' ||
    l.startsWith('zh-hk') ||
    n.includes('臺灣') ||
    n.includes('台灣') ||
    n.includes('taiwan') ||
    n.includes('cmn-tw') ||
    n.includes('國語 (臺灣)') ||
    n.includes('國語（臺灣）') ||
    n.includes('國語')
  );
}

/**
 * Checks if a locale tag or voice name corresponds to any Chinese / Mandarin / Cantonese dialect.
 */
export function isAnyZhLocale(lang: string, name: string = ''): boolean {
  const l = (lang || '').replace(/_/g, '-').toLowerCase();
  const n = (name || '').toLowerCase();
  return (
    l.startsWith('zh') ||
    l.startsWith('cmn') ||
    l.startsWith('yue') ||
    l.includes('chinese') ||
    l.includes('mandarin') ||
    l.includes('cantonese') ||
    l.includes('taiwan') ||
    l.includes('hant') ||
    l.includes('hans') ||
    n.includes('chinese') ||
    n.includes('國語') ||
    n.includes('普通话') ||
    n.includes('普通話') ||
    n.includes('中文') ||
    n.includes('taiwan') ||
    n.includes('臺灣') ||
    n.includes('台灣') ||
    n.includes('粵語') ||
    n.includes('cantonese')
  );
}

/**
 * Checks if a locale is English (United States) (en-US).
 */
export function isEnUSLocale(lang: string): boolean {
  const l = (lang || '').replace(/_/g, '-').toLowerCase();
  return l === 'en-us' || l.startsWith('en-us') || l.startsWith('en-us-');
}

/**
 * Checks if a locale is any English dialect (en, en-US, en-GB, en-AU, etc.).
 */
export function isEnLocale(lang: string): boolean {
  return (lang || '').replace(/_/g, '-').toLowerCase().startsWith('en');
}

/**
 * Detects if a voice is an offline on-device local voice (prioritized over network-streamed voices).
 * Android TTS appends '#...-local' or sets localService = true.
 */
export function isLocalVoice(voice: SpeechSynthesisVoice): boolean {
  if (voice.localService === true) return true;
  const uri = (voice.voiceURI || '').toLowerCase();
  const name = (voice.name || '').toLowerCase();
  if (uri.includes('local') || name.includes('local') || uri.includes('#local') || name.includes('#local')) {
    return true;
  }
  if (uri.includes('network') || name.includes('network') || uri.includes('-network') || name.includes('-network')) {
    return false;
  }
  return false;
}

export class WebSpeechEngine {
  private voices: SpeechSynthesisVoice[] = [];
  private activeUtterances: Set<SpeechSynthesisUtterance> = new Set();
  private keepAliveTimer: any = null;
  private speakSequence = 0;
  private isCancelling = false;
  private subscribers: Set<() => void> = new Set();
  private pollTimeouts: any[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
      if (typeof window.speechSynthesis.addEventListener === 'function') {
        window.speechSynthesis.addEventListener('voiceschanged', () => this.loadVoices());
      }
      this.pollVoicesWithBackoff();
    }
  }

  /**
   * Subscribe to voice list availability changes.
   */
  onVoicesChanged(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    for (const callback of this.subscribers) {
      try {
        callback();
      } catch (err) {
        console.error('Error in onVoicesChanged subscriber:', err);
      }
    }
  }

  /**
   * Android Chrome initial voice enumeration is asynchronous and delayed.
   * Polls with exponential backoff [50, 150, 300, 600, 1200, 2400]ms to catch voices when initialized.
   */
  private pollVoicesWithBackoff(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const intervals = [50, 150, 300, 600, 1200, 2400];
    intervals.forEach((delay) => {
      const timer = setTimeout(() => {
        const prevCount = this.voices.length;
        this.loadVoices();
        if (this.voices.length > prevCount) {
          this.notifySubscribers();
        }
      }, delay);
      this.pollTimeouts.push(timer);
    });
  }

  private loadVoices(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const newVoices = window.speechSynthesis.getVoices();
    if (newVoices && newVoices.length > 0) {
      const changed =
        newVoices.length !== this.voices.length ||
        !this.voices.every((v, i) => v.voiceURI === newVoices[i]?.voiceURI);
      this.voices = newVoices;
      if (changed) {
        this.notifySubscribers();
      }
    }
  }

  getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voices;
  }

  private startKeepAlive(): void {
    this.stopKeepAlive();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.keepAliveTimer = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  }

  private stopKeepAlive(): void {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  /**
   * Finds the most natural voice for a given locale (en-US or zh-TW).
   * Prioritizes local on-device voices ahead of network voices for reliability.
   */
  getPreferredVoiceForLocale(locale: 'en-US' | 'zh-TW', preferredURI?: string): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    if (voices.length === 0) return null;

    if (preferredURI) {
      const match = voices.find(
        (v) => v.voiceURI === preferredURI && (locale === 'zh-TW' ? isAnyZhLocale(v.lang, v.name) : isEnLocale(v.lang))
      );
      if (match) return match;
    }

    if (locale === 'zh-TW') {
      const isMeijia = (name: string) => {
        const n = (name || '').toLowerCase();
        return n.includes('mei-jia') || n.includes('meijia') || n.includes('meijiahant');
      };

      // 1. Prioritize Meijia as the preset default Traditional Chinese voice (prefer local)
      const meijiaLocal = voices.find(
        (v) => isZhTWLocale(v.lang, v.name) && isMeijia(v.name) && isLocalVoice(v) && !isExcludedVoice(v.name)
      );
      if (meijiaLocal) return meijiaLocal;

      const meijiaVoice = voices.find(
        (v) => isZhTWLocale(v.lang, v.name) && isMeijia(v.name) && !isExcludedVoice(v.name)
      );
      if (meijiaVoice) return meijiaVoice;

      // 2. High quality Traditional Chinese fallback keywords (prefer local)
      const zhPriorityKeywords = [
        'Mei-Jia',
        'Meijia',
        'Google 國語（臺灣）',
        'Google 國語 (臺灣)',
        'Google 國語',
        'cmn-tw',
        'cmn-Hant',
        'Google',
        'HanHan',
        'Yating',
        'Ting-Ting',
        'Hsiao-Chen',
        'Sin-Ji',
        'Siri',
        'Traditional',
        'Taiwan',
        'Natural',
        'Enhanced',
      ];

      for (const kw of zhPriorityKeywords) {
        const matchedLocal = voices.find(
          (v) =>
            isZhTWLocale(v.lang, v.name) &&
            (v.name.includes(kw) || v.voiceURI.includes(kw)) &&
            isLocalVoice(v) &&
            !isExcludedVoice(v.name)
        );
        if (matchedLocal) return matchedLocal;

        const matched = voices.find(
          (v) =>
            isZhTWLocale(v.lang, v.name) &&
            (v.name.includes(kw) || v.voiceURI.includes(kw)) &&
            !isExcludedVoice(v.name)
        );
        if (matched) return matched;
      }

      // 3. Any Traditional Chinese (Taiwan/HK) voice (local first)
      const anyZhTWLocal = voices.find(
        (v) => isZhTWLocale(v.lang, v.name) && isLocalVoice(v) && !isExcludedVoice(v.name)
      );
      if (anyZhTWLocal) return anyZhTWLocal;

      const anyZhTW = voices.find((v) => isZhTWLocale(v.lang, v.name) && !isExcludedVoice(v.name));
      if (anyZhTW) return anyZhTW;

      // 4. Fallback to any Chinese / Mandarin dialect voice on system (local first)
      const anyGoogleZhLocal = voices.find(
        (v) =>
          isAnyZhLocale(v.lang, v.name) &&
          v.name.toLowerCase().includes('google') &&
          isLocalVoice(v) &&
          !isExcludedVoice(v.name)
      );
      if (anyGoogleZhLocal) return anyGoogleZhLocal;

      const anyGoogleZh = voices.find(
        (v) =>
          isAnyZhLocale(v.lang, v.name) &&
          v.name.toLowerCase().includes('google') &&
          !isExcludedVoice(v.name)
      );
      if (anyGoogleZh) return anyGoogleZh;

      const anyZhLocal = voices.find(
        (v) => isAnyZhLocale(v.lang, v.name) && isLocalVoice(v) && !isExcludedVoice(v.name)
      );
      if (anyZhLocal) return anyZhLocal;

      const anyZh = voices.find((v) => isAnyZhLocale(v.lang, v.name) && !isExcludedVoice(v.name));
      if (anyZh) return anyZh;

      // Do not fall back to English voices[0] for Chinese; return null so browser's native/cloud engine handles zh-TW
      return null;
    } else {
      // 1. Prioritize Samantha as the default en-US voice (prefer local)
      const samanthaLocal = voices.find(
        (v) =>
          isEnUSLocale(v.lang) &&
          v.name.toLowerCase().includes('samantha') &&
          isLocalVoice(v) &&
          !isExcludedVoice(v.name)
      );
      if (samanthaLocal) return samanthaLocal;

      const samanthaVoice = voices.find(
        (v) => isEnUSLocale(v.lang) && v.name.toLowerCase().includes('samantha') && !isExcludedVoice(v.name)
      );
      if (samanthaVoice) return samanthaVoice;

      // 2. High quality English fallback keywords (prefer local)
      const priorityKeywords = [
        'Samantha',
        'Alex',
        'Ava',
        'Allison',
        'Siri',
        'Google US English',
        'Google',
        'Natural',
        'Enhanced',
        'Daniel',
        'Tom',
        'Karen',
      ];
      for (const kw of priorityKeywords) {
        const matchedLocal = voices.find(
          (v) => isEnUSLocale(v.lang) && v.name.includes(kw) && isLocalVoice(v) && !isExcludedVoice(v.name)
        );
        if (matchedLocal) return matchedLocal;

        const matched = voices.find(
          (v) => isEnUSLocale(v.lang) && v.name.includes(kw) && !isExcludedVoice(v.name)
        );
        if (matched) return matched;
      }

      // 3. Any en-US voice (local first)
      const anyEnUSLocal = voices.find(
        (v) => isEnUSLocale(v.lang) && isLocalVoice(v) && !isExcludedVoice(v.name)
      );
      if (anyEnUSLocal) return anyEnUSLocal;

      const anyEnUS = voices.find((v) => isEnUSLocale(v.lang) && !isExcludedVoice(v.name));
      if (anyEnUS) return anyEnUS;

      // 4. Any English voice (local first)
      const anyGoogleEnLocal = voices.find(
        (v) =>
          isEnLocale(v.lang) &&
          v.name.toLowerCase().includes('google') &&
          isLocalVoice(v) &&
          !isExcludedVoice(v.name)
      );
      if (anyGoogleEnLocal) return anyGoogleEnLocal;

      const anyGoogleEn = voices.find(
        (v) => isEnLocale(v.lang) && v.name.toLowerCase().includes('google') && !isExcludedVoice(v.name)
      );
      if (anyGoogleEn) return anyGoogleEn;

      const anyEnLocal = voices.find(
        (v) => isEnLocale(v.lang) && isLocalVoice(v) && !isExcludedVoice(v.name)
      );
      if (anyEnLocal) return anyEnLocal;

      const anyEn = voices.find((v) => isEnLocale(v.lang) && !isExcludedVoice(v.name));
      if (anyEn) return anyEn;

      return (
        voices.find((v) => isLocalVoice(v) && !isExcludedVoice(v.name)) ||
        voices.find((v) => !isExcludedVoice(v.name)) ||
        voices[0] ||
        null
      );
    }
  }

  /**
   * Finds the preferred voice based on preferred URI, language content, or explicit locale.
   */
  getPreferredVoice(preferredURI?: string, text?: string, locale?: 'en-US' | 'zh-TW'): SpeechSynthesisVoice | null {
    if (locale) {
      return this.getPreferredVoiceForLocale(locale, preferredURI);
    }
    if (text && isChineseText(text)) {
      return this.getPreferredVoiceForLocale('zh-TW', preferredURI);
    }
    return this.getPreferredVoiceForLocale('en-US', preferredURI);
  }

  /**
   * Synthesizes text with word boundary synchronization, Android fallback recovery, and watchdog protection.
   */
  async speak(text: string, options: SpeechOptions = {}): Promise<void> {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const currentSeq = ++this.speakSequence;

    iosAudioUnlock.ensureUnlockedAndResumed();

    // If iOS Safari left speech in paused state, unpause it
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    // Cancel any ongoing or pending speech before starting new speech.
    // In Chromium, wait 60ms after cancel() so the browser's asynchronous
    // speech IPC dispatcher finishes clearing the internal queue before the next speak() call.
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending || this.isCancelling || this.activeUtterances.size > 0) {
      this.cancel();
      this.isCancelling = true;
      const isMock = typeof window !== 'undefined' && (window.speechSynthesis as any)?.constructor?.name === 'MockSpeechSynthesis';
      const cancelWaitMs = isMock ? 10 : 60;
      await new Promise((r) => setTimeout(r, cancelWaitMs));
      this.isCancelling = false;
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      if (currentSeq !== this.speakSequence) {
        return;
      }
    }

    if (!text || text.trim().length === 0) {
      return;
    }

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate ?? 0.9;
      utterance.pitch = options.pitch ?? 1.0;

      const targetLocale: 'en-US' | 'zh-TW' = options.locale || (isChineseText(text) ? 'zh-TW' : 'en-US');
      const voice = options._isFallbackRetry ? null : this.getPreferredVoiceForLocale(targetLocale, options.voiceURI);

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || targetLocale;
      } else {
        utterance.voice = null;
        utterance.lang = targetLocale;
      }

      // Retain reference to prevent premature Chromium garbage collection
      this.activeUtterances.add(utterance);
      this.startKeepAlive();

      // Watchdog timer: safety net in case browser TTS drops utterance or fails to emit onend
      const estimatedDurationMs = Math.max(5000, Math.ceil((text.length / (options.rate || 0.9)) * 500));
      const watchdogTimer = setTimeout(() => {
        this.activeUtterances.delete(utterance);
        if (this.activeUtterances.size === 0) {
          this.stopKeepAlive();
        }
        if (
          typeof window !== 'undefined' &&
          'speechSynthesis' in window &&
          (window.speechSynthesis.speaking || window.speechSynthesis.pending)
        ) {
          window.speechSynthesis.cancel();
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        }
        options.onEnd?.();
        resolve();
      }, estimatedDurationMs);

      utterance.onstart = () => {
        options.onStart?.();
      };

      utterance.onboundary = (e) => {
        options.onBoundary?.(e);
      };

      utterance.onend = () => {
        clearTimeout(watchdogTimer);
        this.activeUtterances.delete(utterance);
        if (this.activeUtterances.size === 0) {
          this.stopKeepAlive();
        }
        options.onEnd?.();
        resolve();
      };

      utterance.onerror = (e) => {
        clearTimeout(watchdogTimer);
        this.activeUtterances.delete(utterance);
        if (this.activeUtterances.size === 0) {
          this.stopKeepAlive();
        }

        // 'interrupted' or 'canceled' are expected when user taps another card
        if (e.error === 'interrupted' || e.error === 'canceled') {
          resolve();
          return;
        }

        // Multi-tier Fallback Recovery:
        // If a specific voice failed (e.g. language-unavailable, voice-unavailable, network, or synthesis-failed on Android),
        // retry once with utterance.voice = null and targetLocale so the OS default TTS dispatcher attempts synthesis.
        const isRecoverableError =
          e.error === 'language-unavailable' ||
          e.error === 'voice-unavailable' ||
          e.error === 'network' ||
          e.error === 'synthesis-failed';
        if (isRecoverableError && !options._isFallbackRetry && voice !== null) {
          this.speak(text, {
            ...options,
            voiceURI: undefined,
            _isFallbackRetry: true,
          })
            .then(() => resolve())
            .catch(() => resolve());
          return;
        }

        options.onError?.(e);
        resolve(); // Resolve to prevent unhandled rejections in UI
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  cancel(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.activeUtterances.clear();
      this.stopKeepAlive();
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }
  }

  isSpeaking(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.speaking;
  }
}

export interface GroupedVoiceLocale {
  locale: 'en-US' | 'zh-TW';
  label: string;
  voices: SpeechSynthesisVoice[];
}

/**
 * List of eccentric / novelty sound-effect voices to exclude from clinical AAC options.
 */
export const EXCLUDED_VOICES = new Set([
  'Albert',
  'Bad News',
  'Bahh',
  'Bells',
  'Boing',
  'Bubbles',
  'Cellos',
  'Good News',
  'Grandma',
  'Jester',
  'Junior',
  'Kathy',
  'Organ',
  'Sandy',
  'Superstar',
  'Trinoids',
  'Whisper',
  'Wobble',
  'Zarvox',
]);

/**
 * Determines if a voice name matches any of the excluded voice names.
 */
export function isExcludedVoice(name: string): boolean {
  const cleanName = (name || '').trim();
  if (EXCLUDED_VOICES.has(cleanName)) return true;
  const lowerName = cleanName.toLowerCase();
  for (const excluded of EXCLUDED_VOICES) {
    const lowerExcluded = excluded.toLowerCase();
    if (
      lowerName === lowerExcluded ||
      lowerName.startsWith(`${lowerExcluded} `) ||
      lowerName.startsWith(`${lowerExcluded} (`) ||
      lowerName.startsWith(`${lowerExcluded}-`)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Filters voice list to non-excluded English and Chinese voices, grouped and prioritized.
 * Prioritizes local on-device voices ahead of network-streamed voices.
 */
export function filterAndGroupVoices(voices: SpeechSynthesisVoice[]): GroupedVoiceLocale[] {
  const eligibleVoices = voices.filter((v) => !isExcludedVoice(v.name));

  // Sort English voices: en-US first, then local voices first, then alphabetically
  const enVoices = eligibleVoices
    .filter((v) => isEnLocale(v.lang))
    .sort((a, b) => {
      const aIsUS = isEnUSLocale(a.lang) ? 0 : 1;
      const bIsUS = isEnUSLocale(b.lang) ? 0 : 1;
      if (aIsUS !== bIsUS) return aIsUS - bIsUS;

      const aLocal = isLocalVoice(a) ? 0 : 1;
      const bLocal = isLocalVoice(b) ? 0 : 1;
      if (aLocal !== bLocal) return aLocal - bLocal;

      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    });

  // Sort Chinese voices: zh-TW / Traditional Chinese (Taiwan/HK/cmn-TW) first, then local voices first, then alphabetically
  const zhVoices = eligibleVoices
    .filter((v) => isAnyZhLocale(v.lang, v.name))
    .sort((a, b) => {
      const aIsTW = isZhTWLocale(a.lang, a.name) ? 0 : 1;
      const bIsTW = isZhTWLocale(b.lang, b.name) ? 0 : 1;
      if (aIsTW !== bIsTW) return aIsTW - bIsTW;

      const aLocal = isLocalVoice(a) ? 0 : 1;
      const bLocal = isLocalVoice(b) ? 0 : 1;
      if (aLocal !== bLocal) return aLocal - bLocal;

      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    });

  const groups: GroupedVoiceLocale[] = [];

  if (enVoices.length > 0) {
    groups.push({
      locale: 'en-US',
      label: '🇺🇸 English (United States) — en-US',
      voices: enVoices,
    });
  }

  if (zhVoices.length > 0) {
    groups.push({
      locale: 'zh-TW',
      label: '🇹🇼 Chinese (Traditional / Taiwan) — zh-TW',
      voices: zhVoices,
    });
  }

  return groups;
}

export const speechEngine = new WebSpeechEngine();
