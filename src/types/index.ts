/**
 * TalkWithDad AAC Progressive Web Application
 * Core Domain TypeScript Types & Models
 */

export type FitzgeraldCategory = 
  | 'people'       // Yellow (Who - People/Pronouns)
  | 'verbs'        // Green (Actions)
  | 'nouns'        // Orange (Objects/Things)
  | 'adjectives'   // Blue (Descriptors/Feelings)
  | 'social'       // Pink (Polite/Social expressions)
  | 'questions'    // Purple (What, Where, Why, etc.)
  | 'places'       // Coral/Red (Locations)
  | 'emergency';   // Deep Red (Urgent/Medical)

export interface FitzgeraldStyle {
  border: string;
  bg: string;
  badgeBg: string;
  text: string;
  contrastBg: string;
  contrastText: string;
}

export const FITZGERALD_COLOR_MAP: Record<FitzgeraldCategory, FitzgeraldStyle> = {
  people: {
    border: 'border-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-950/40',
    badgeBg: 'bg-yellow-400 text-yellow-950',
    text: 'text-yellow-900 dark:text-yellow-200',
    contrastBg: '#fef08a',
    contrastText: '#713f12',
  },
  verbs: {
    border: 'border-green-400',
    bg: 'bg-green-50 dark:bg-green-950/40',
    badgeBg: 'bg-green-400 text-green-950',
    text: 'text-green-900 dark:text-green-200',
    contrastBg: '#bbf7d0',
    contrastText: '#14532d',
  },
  nouns: {
    border: 'border-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    badgeBg: 'bg-orange-400 text-orange-950',
    text: 'text-orange-900 dark:text-orange-200',
    contrastBg: '#fed7aa',
    contrastText: '#7c2d12',
  },
  adjectives: {
    border: 'border-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    badgeBg: 'bg-blue-400 text-blue-950',
    text: 'text-blue-900 dark:text-blue-200',
    contrastBg: '#bfdbfe',
    contrastText: '#1e3a8a',
  },
  social: {
    border: 'border-pink-400',
    bg: 'bg-pink-50 dark:bg-pink-950/40',
    badgeBg: 'bg-pink-400 text-pink-950',
    text: 'text-pink-900 dark:text-pink-200',
    contrastBg: '#fbcfe8',
    contrastText: '#831843',
  },
  questions: {
    border: 'border-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    badgeBg: 'bg-purple-400 text-purple-950',
    text: 'text-purple-900 dark:text-purple-200',
    contrastBg: '#e9d5ff',
    contrastText: '#581c87',
  },
  places: {
    border: 'border-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeBg: 'bg-rose-400 text-rose-950',
    text: 'text-rose-900 dark:text-rose-200',
    contrastBg: '#fecdd3',
    contrastText: '#881337',
  },
  emergency: {
    border: 'border-red-600',
    bg: 'bg-red-50 dark:bg-red-950/50',
    badgeBg: 'bg-red-600 text-white',
    text: 'text-red-950 dark:text-red-100',
    contrastBg: '#fca5a5',
    contrastText: '#450a0a',
  },
};

export interface AACCategory {
  id: string;
  name: string;
  nameZh?: string; // Traditional Mandarin Chinese category name
  icon: string;
  color: string;
  order: number;
  isDefault?: boolean;
}

export interface AACCard {
  id: string;
  categoryId: string;
  label: string;
  labelZh?: string; // Traditional Mandarin Chinese name (e.g. "水", "洗手間")
  spokenText: string;
  spokenTextZh?: string; // Traditional Mandarin Chinese spoken phrase
  phoneticSyllables?: string; // e.g. "Wa · ter"
  clue?: string;              // Clinical descriptive clue in English
  clueZh?: string;            // Clinical descriptive clue in Traditional Chinese
  fitzgeraldCategory: FitzgeraldCategory;
  icon?: string; // Lucide icon name or emoji
  imageBlobId?: string; // Key to mediaBlobs
  audioBlobId?: string; // Key to custom recorded voice clip in mediaBlobs
  order: number;
  isFavorite?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface VisualScene {
  id: string;
  title: string;
  titleZh?: string;
  description?: string;
  descriptionZh?: string;
  imageBlobId: string; // Key to mediaBlobs or base64 data URL
  createdAt: number;
  updatedAt: number;
}

export interface VisualSceneHotspot {
  id: string;
  sceneId: string;
  x: number;      // 0 to 100 percentage
  y: number;      // 0 to 100 percentage
  width: number;  // 5 to 100 percentage
  height: number; // 5 to 100 percentage
  label: string;
  labelZh?: string;
  spokenText: string;
  spokenTextZh?: string;
  audioBlobId?: string;
  color?: string; // Optional highlight border color
}

export type SpeechLanguageMode = 'en' | 'zh' | 'en-then-zh' | 'zh-then-en' | 'both';
export type CardSpeechLanguage = SpeechLanguageMode;

export interface AppSettings {
  id: string; // fixed 'current'
  theme: 'dark' | 'light';
  gridCols: number; // 2 to 6
  tapDebounceMs: number; // 200 to 500 ms anti-tremor
  speechRate: number; // 0.5 to 1.5
  speechPitch: number; // 0.5 to 1.5
  selectedVoiceURI: string;
  selectedVoiceEnUS: string; // Preferred voice for English (en-US)
  selectedVoiceZhTW: string; // Preferred voice for Traditional Chinese (zh-TW)
  cardSpeechLanguage?: SpeechLanguageMode; // 'en' (default), 'zh', 'en-then-zh', or 'zh-then-en'
  weeklyFocusCardsPerCategory?: number; // Cards selected per category per week (preset default 2)
  fontSize: 'standard' | 'large' | 'extra-large';
  googleSheetSyncUrl?: string; // Auto-sync Google Sheet URL on initial load
  googleSheetAutoSyncOnLoad?: boolean; // Enable auto-sync on initial page load (default true)
  googleSheetSyncCardsTab?: string; // Sheet/tab name for Cards (optional)
  lastGoogleSheetSyncTime?: number; // Timestamp of last successful sync
  lastGoogleSheetSyncStatus?: string; // Status message from last sync
}

export interface MediaBlobRecord {
  id: string;
  type: 'image' | 'audio';
  mimeType: string;
  dataBase64: string;
  createdAt: number;
}

export interface UserLocationInfo {
  city: string;
  state?: string;
  country: string;
  cityZh?: string;
  stateZh?: string;
  countryZh?: string;
  latitude?: number;
  longitude?: number;
  source: 'geolocation' | 'timezone' | 'default';
  isLoading?: boolean;
}

export type ActiveTab = 
  | 'grid'
  | 'today'
  | 'scenes'
  | 'pain'
  | 'syllables'
  | 'therapy'
  | 'keyboard'
  | 'caregiver';

export const TAB_METADATA: Record<ActiveTab, { label: string; labelZh: string }> = {
  grid: { label: 'Cards', labelZh: '圖卡溝通' },
  today: { label: 'Today', labelZh: '今天時空' },
  scenes: { label: 'Scenes', labelZh: '實景照片' },
  pain: { label: 'Pain Map', labelZh: '疼痛標示' },
  syllables: { label: 'Sound It Out', labelZh: '分段發音' },
  therapy: { label: 'Word Finding', labelZh: '找字練習' },
  keyboard: { label: 'Speech Keys', labelZh: '語音鍵盤' },
  caregiver: { label: 'Settings', labelZh: '系統設定' },
};

export interface ExportDataPackage {
  version: string;
  exportDate: string;
  categories: AACCategory[];
  cards: AACCard[];
  visualScenes: VisualScene[];
  hotspots: VisualSceneHotspot[];
  settings: AppSettings;
  mediaBlobs: MediaBlobRecord[];
  therapyDecks?: any[];
  therapyCards?: any[];
}

export type SyllableStress = 'primary' | 'secondary' | 'unstressed';

export interface SyllablePhonemeData {
  index: number;
  text: string;             // e.g. "pho", "tog", "ra", "phy"
  ipa: string;              // e.g. "fə", "ˈtɑːɡ", "ɹə", "fi"
  phoneticSpelling?: string;// e.g. "fuh", "TAHG", "ruh", "fee"
  stress: SyllableStress;
  phonemes: string[];       // Individual IPA tokens: e.g. ["f", "ə"]
  audioBase64?: string;     // Base64-encoded PCM WAV data URL
  audioBlobId?: string;     // Database media blob ID if cached in IndexedDB
  durationMs?: number;      // Duration in milliseconds
}

export interface WordPronunciationData {
  word: string;
  canonicalIpa: string;     // Canonical full IPA (e.g. "fəˈtɑːɡɹəfi")
  syllables: SyllablePhonemeData[];
  fullAudioBase64?: string; // Synthesized full word audio
  source: 'clinical_dictionary' | 'espeak_g2p';
  generatedAt?: number;
}

