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
}

/**
 * Checks if a string contains Chinese/CJK characters.
 */
export function isChineseText(text: string): boolean {
  return /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/.test(text || '');
}

export class WebSpeechEngine {
  private voices: SpeechSynthesisVoice[] = [];
  private activeUtterances: Set<SpeechSynthesisUtterance> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
  }

  getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voices;
  }

  /**
   * Finds the most natural voice for a given locale (en-US or zh-TW).
   */
  getPreferredVoiceForLocale(locale: 'en-US' | 'zh-TW', preferredURI?: string): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    if (voices.length === 0) return null;

    if (preferredURI) {
      const match = voices.find(v => v.voiceURI === preferredURI);
      if (match) return match;
    }

    if (locale === 'zh-TW') {
      const isZhTW = (lang: string) => {
        const l = (lang || '').replace('_', '-').toLowerCase();
        return l === 'zh-tw' || l.includes('zh-hant-tw') || l.includes('cmn-hant-tw') || l === 'zh-hant_tw';
      };

      const isMeijia = (name: string) => {
        const n = (name || '').toLowerCase();
        return n.includes('mei-jia') || n.includes('meijia') || n.includes('meijiahant');
      };

      // 1. Prioritize Meijia as the preset default Traditional Chinese voice
      const meijiaVoice = voices.find(v => isZhTW(v.lang) && isMeijia(v.name) && !isExcludedVoice(v.name));
      if (meijiaVoice) return meijiaVoice;

      // 2. High quality Traditional Chinese fallback keywords
      const zhPriorityKeywords = ['Mei-Jia', 'Meijia', 'Google 國語（臺灣）', 'Google 國語 (臺灣)', 'Google 國語', 'Google', 'HanHan', 'Yating', 'Ting-Ting', 'Hsiao-Chen', 'Sin-Ji', 'Siri', 'Traditional', 'Taiwan', 'Natural', 'Enhanced'];
      for (const kw of zhPriorityKeywords) {
        const matched = voices.find(v => isZhTW(v.lang) && v.name.includes(kw) && !isExcludedVoice(v.name));
        if (matched) return matched;
      }

      const anyZhTW = voices.find(v => isZhTW(v.lang) && !isExcludedVoice(v.name));
      if (anyZhTW) return anyZhTW;

      const anyGoogleZh = voices.find(v => (v.lang || '').startsWith('zh') && v.name.toLowerCase().includes('google') && !isExcludedVoice(v.name));
      if (anyGoogleZh) return anyGoogleZh;

      const anyZh = voices.find(v => (v.lang || '').startsWith('zh') && !isExcludedVoice(v.name));
      if (anyZh) return anyZh;
    } else {
      const isEnUS = (lang: string) => (lang || '').replace('_', '-').toLowerCase() === 'en-us';

      // 1. Prioritize Samantha as the default en-US voice
      const samanthaVoice = voices.find(v => isEnUS(v.lang) && v.name.toLowerCase().includes('samantha') && !isExcludedVoice(v.name));
      if (samanthaVoice) return samanthaVoice;

      // 2. High quality English fallback keywords
      const priorityKeywords = ['Samantha', 'Alex', 'Ava', 'Allison', 'Siri', 'Google US English', 'Google', 'Natural', 'Enhanced', 'Daniel'];
      for (const kw of priorityKeywords) {
        const matched = voices.find(v => isEnUS(v.lang) && v.name.includes(kw) && !isExcludedVoice(v.name));
        if (matched) return matched;
      }

      const anyEnUS = voices.find(v => isEnUS(v.lang) && !isExcludedVoice(v.name));
      if (anyEnUS) return anyEnUS;

      const anyGoogleEn = voices.find(v => (v.lang || '').startsWith('en') && v.name.toLowerCase().includes('google') && !isExcludedVoice(v.name));
      if (anyGoogleEn) return anyGoogleEn;

      const anyEn = voices.find(v => (v.lang || '').startsWith('en') && !isExcludedVoice(v.name));
      if (anyEn) return anyEn;
    }

    return voices[0] || null;
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
   * Synthesizes text with optional word boundary synchronization.
   */
  async speak(text: string, options: SpeechOptions = {}): Promise<void> {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    iosAudioUnlock.ensureUnlockedAndResumed();

    // If iOS Safari left speech in paused state, unpause it
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    // Cancel any ongoing or pending speech before starting new speech.
    // In Chromium, yield an event loop micro-tick after cancel() so the browser's
    // speech dispatcher finishes clearing the internal queue before the next speak() call.
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      this.cancel();
      await new Promise((r) => setTimeout(r, 20));
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
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
      const voice = this.getPreferredVoiceForLocale(targetLocale, options.voiceURI);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || targetLocale;
      } else {
        utterance.lang = targetLocale;
      }

      // Retain reference to prevent premature Chromium garbage collection
      this.activeUtterances.add(utterance);

      utterance.onstart = () => {
        options.onStart?.();
      };

      utterance.onboundary = (e) => {
        options.onBoundary?.(e);
      };

      utterance.onend = () => {
        this.activeUtterances.delete(utterance);
        options.onEnd?.();
        resolve();
      };

      utterance.onerror = (e) => {
        this.activeUtterances.delete(utterance);
        // 'interrupted' or 'canceled' are expected when user taps another card
        if (e.error === 'interrupted' || e.error === 'canceled') {
          resolve();
        } else {
          options.onError?.(e);
          resolve(); // Resolve to prevent unhandled rejections in UI
        }
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  cancel(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.activeUtterances.clear();
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
 * Filters voice list to only non-excluded en-US and zh-TW, grouped by locale and sorted alphabetically by voice name.
 */
export function filterAndGroupVoices(voices: SpeechSynthesisVoice[]): GroupedVoiceLocale[] {
  const isEnUS = (lang: string) => {
    const l = (lang || '').replace('_', '-').toLowerCase();
    return l === 'en-us';
  };

  const isZhTW = (lang: string) => {
    const l = (lang || '').replace('_', '-').toLowerCase();
    return l === 'zh-tw' || l.includes('zh-hant-tw') || l.includes('cmn-hant-tw') || l === 'zh-hant_tw';
  };

  const eligibleVoices = voices.filter((v) => !isExcludedVoice(v.name));

  const enUSVoices = eligibleVoices
    .filter((v) => isEnUS(v.lang))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

  const zhTWVoices = eligibleVoices
    .filter((v) => isZhTW(v.lang))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

  const groups: GroupedVoiceLocale[] = [];

  if (enUSVoices.length > 0) {
    groups.push({
      locale: 'en-US',
      label: '🇺🇸 English (United States) — en-US',
      voices: enUSVoices,
    });
  }

  if (zhTWVoices.length > 0) {
    groups.push({
      locale: 'zh-TW',
      label: '🇹🇼 Chinese (Taiwan) — zh-TW',
      voices: zhTWVoices,
    });
  }

  return groups;
}

export const speechEngine = new WebSpeechEngine();
