import React, { useState, useEffect, useMemo } from 'react';
import {
  AACCategory,
  AACCard,
  AppSettings,
  FITZGERALD_COLOR_MAP,
} from '../../types';
import { CardEditorModal } from './CardEditorModal';
import { BackupRestoreView } from './BackupRestoreView';
import { AppQRCodeView } from './AppQRCodeView';
import { DebouncedTouchable } from '../common/DebouncedTouchable';
import { useDatabase } from '../../hooks/useDatabase';
import { useSettings } from '../../hooks/useSettings';
import { speechEngine, filterAndGroupVoices } from '../../services/audio/WebSpeechEngine';
import {
  Settings,
  Grid,
  Download,
  FileSpreadsheet,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Star,
  Volume2,
  LayoutGrid,
  Sparkles,
  QrCode,
} from 'lucide-react';

interface CaregiverDashboardProps {
  categories: AACCategory[];
  cards: AACCard[];
  settings: AppSettings;
  onCloseCaregiverMode: () => void;
  onRefreshData: () => void;
}

type CaregiverTab =
  | 'settings'
  | 'cards'
  | 'backup'
  | 'qrcode';

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({
  categories,
  cards,
  settings,
  onCloseCaregiverMode,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<CaregiverTab>('settings');
  const [editingCard, setEditingCard] = useState<AACCard | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const [isTestingEnglish, setIsTestingEnglish] = useState(false);
  const [isTestingChinese, setIsTestingChinese] = useState(false);

  const { saveCard, deleteCard } = useDatabase();
  const { updateSettings } = useSettings();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() => speechEngine.getVoices());

  useEffect(() => {
    const updateVoices = () => {
      setVoices(speechEngine.getVoices());
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.addEventListener?.('voiceschanged', updateVoices);

      return () => {
        window.speechSynthesis.removeEventListener?.('voiceschanged', updateVoices);
      };
    }
  }, []);

  const groupedVoices = useMemo(() => {
    return filterAndGroupVoices(voices);
  }, [voices]);

  const enUSVoices = useMemo(() => {
    const enGroup = groupedVoices.find((g) => g.locale === 'en-US');
    return enGroup ? enGroup.voices : [];
  }, [groupedVoices]);

  const defaultEnVoiceURI = useMemo(() => {
    return enUSVoices.find((v) => v.name.toLowerCase().includes('samantha'))?.voiceURI || enUSVoices[0]?.voiceURI || '';
  }, [enUSVoices]);

  const zhTWVoices = useMemo(() => {
    const zhGroup = groupedVoices.find((g) => g.locale === 'zh-TW');
    return zhGroup ? zhGroup.voices : [];
  }, [groupedVoices]);

  const defaultZhVoiceURI = useMemo(() => {
    return zhTWVoices.find((v) => v.name.toLowerCase().includes('mei-jia') || v.name.toLowerCase().includes('meijia'))?.voiceURI || zhTWVoices[0]?.voiceURI || '';
  }, [zhTWVoices]);

  const handleTestEnglish = async () => {
    if (isTestingEnglish) return;
    setIsTestingEnglish(true);
    try {
      await speechEngine.speak('Hello! Testing the English voice and speech rate setting.', {
        rate: settings.speechRate,
        pitch: settings.speechPitch,
        voiceURI: settings.selectedVoiceEnUS || defaultEnVoiceURI,
        locale: 'en-US',
      });
    } finally {
      setIsTestingEnglish(false);
    }
  };

  const handleTestChinese = async () => {
    if (isTestingChinese) return;
    setIsTestingChinese(true);
    try {
      await speechEngine.speak('您好！測試繁體中文語音與語速設定。', {
        rate: settings.speechRate,
        pitch: settings.speechPitch,
        voiceURI: settings.selectedVoiceZhTW || defaultZhVoiceURI,
        locale: 'zh-TW',
      });
    } finally {
      setIsTestingChinese(false);
    }
  };

  const tabs: { id: CaregiverTab; label: string; icon: React.ReactNode }[] = [
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { id: 'cards', label: 'Cards', icon: <Grid className="w-5 h-5" /> },
    { id: 'backup', label: 'Backup & Restore', icon: <Download className="w-5 h-5" /> },
    { id: 'qrcode', label: 'App QR Code', icon: <QrCode className="w-5 h-5" /> },
  ];

  const handleToggleFavorite = async (card: AACCard) => {
    await saveCard({ ...card, isFavorite: !card.isFavorite });
    onRefreshData();
  };

  const handleDeleteCard = async (cardId: string) => {
    if (window.confirm('Delete this AAC card?')) {
      await deleteCard(cardId);
      onRefreshData();
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-2.5 overflow-hidden select-none bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-2 sm:p-3 transition-colors">
      {/* Top Header & Lock Button */}
      <div className="w-full bg-white dark:bg-slate-900 border-2 border-pink-500/40 rounded-2xl p-3 flex items-center justify-between shadow-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-600/20 border border-pink-400 flex items-center justify-center text-pink-600 dark:text-pink-400 font-bold text-lg">
            🔒
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">Caregiver Settings</h1>
          </div>
        </div>

        <DebouncedTouchable
          onPress={onCloseCaregiverMode}
          minTouchSize="md"
          className="bg-pink-600 hover:bg-pink-500 active:bg-pink-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-md shadow-pink-900/40 text-xs sm:text-sm border border-pink-400/30 cursor-pointer"
        >
          <Lock className="w-4 h-4" />
          <span>Lock Settings</span>
        </DebouncedTouchable>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="w-full flex items-center gap-2 overflow-x-auto scrollbar-none py-1 shrink-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <DebouncedTouchable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              minTouchSize="sm"
              className={`
                px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap border-2 transition-all cursor-pointer
                ${
                  isActive
                    ? 'bg-pink-600 text-white border-pink-400 shadow-md shadow-pink-900/30 font-black'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </DebouncedTouchable>
          );
        })}
      </div>

      {/* Dynamic Content Area */}
      <div className="flex-1 w-full overflow-y-auto p-1 scrollbar-none">
        {/* --- SETTINGS TAB --- */}
        {activeTab === 'settings' && (
          <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 bg-white dark:bg-slate-900 border-2 border-pink-500/30 dark:border-pink-500/30 rounded-3xl p-5 shadow-xl shadow-pink-950/20">
            <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-pink-500/20 dark:border-pink-500/20 pb-2 flex items-center gap-2">
              <span className="text-pink-500">⚙️</span>
              <span>Settings</span>
            </h2>

            {/* 1. Theme Selector (Dark & Light) */}
            <div className="flex flex-col gap-2.5 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Display Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'dark', label: '🌙 Dark', isDefault: true },
                  { id: 'light', label: '☀️ Light', isDefault: false },
                ].map((t) => {
                  const isSelected = settings.theme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => updateSettings({ theme: t.id as 'dark' | 'light' })}
                      className={`
                        py-2.5 px-4 rounded-xl text-center font-bold text-sm border-2 transition-all duration-150 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2
                        ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/40 font-black'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }
                      `}
                    >
                      <span>{t.label}</span>
                      {t.isDefault && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                            isSelected
                              ? 'bg-blue-700/80 text-blue-100'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          Default
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Card Grid - Columns */}
            <div className="flex flex-col gap-2.5 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <LayoutGrid className="w-4 h-4 text-blue-500" />
                <span>Card Grid - Columns</span>
              </label>

              {/* Column Count Buttons: 3, 4, 5 */}
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { cols: 3, label: '3', isDefault: false },
                  { cols: 4, label: '4', isDefault: true },
                  { cols: 5, label: '5', isDefault: false },
                ].map((preset) => {
                  const isSelected = (settings.gridCols || 4) === preset.cols;
                  return (
                    <button
                      key={preset.cols}
                      type="button"
                      onClick={() => updateSettings({ gridCols: preset.cols })}
                      className={`
                        py-2 px-2 text-center rounded-xl border-2 transition-all duration-150 active:scale-[0.98] cursor-pointer flex flex-col items-center justify-center min-h-[52px] gap-1
                        ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/40 font-black'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        {/* Tactile Column Bars */}
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: preset.cols }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 h-3.5 rounded-full transition-colors ${
                                isSelected ? 'bg-white' : 'bg-slate-400 dark:bg-slate-500'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-black sm:text-base">{preset.label}</span>
                      </div>
                      {preset.isDefault && (
                        <span
                          className={`text-[9px] font-normal leading-tight ${
                            isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          Default
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weekly Focus Cards Per Category */}
            <div className="flex flex-col gap-2.5 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Weekly Focus - Cards Per Category</span>
              </label>

              {/* Cards Per Category Buttons: 1, 2, 3, 4 */}
              <div className="grid grid-cols-4 gap-2.5">
                {[
                  { count: 1, label: '1 Card', isDefault: false },
                  { count: 2, label: '2 Cards', isDefault: true },
                  { count: 3, label: '3 Cards', isDefault: false },
                  { count: 4, label: '4 Cards', isDefault: false },
                ].map((preset) => {
                  const isSelected = (settings.weeklyFocusCardsPerCategory ?? 2) === preset.count;
                  return (
                    <button
                      key={preset.count}
                      type="button"
                      onClick={() => updateSettings({ weeklyFocusCardsPerCategory: preset.count })}
                      className={`
                        py-2 px-2 text-center rounded-xl border-2 transition-all duration-150 active:scale-[0.98] cursor-pointer flex flex-col items-center justify-center min-h-[52px] gap-1
                        ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/40 font-black'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'
                        }
                      `}
                    >
                      <span className="text-xs sm:text-sm font-black whitespace-nowrap">{preset.label}</span>
                      {preset.isDefault && (
                        <span
                          className={`text-[9px] font-normal leading-tight ${
                            isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          Default
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Speech Rate & Voice Settings */}
            <div className="flex flex-col gap-3.5 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              {/* Speech Rate Section */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-blue-500" />
                  <span>Speech Rate</span>
                </label>

                {/* Speed Rate Buttons */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { label: '0.25x', val: 0.25, isDefault: false },
                    { label: '0.5x', val: 0.5, isDefault: false },
                    { label: '0.75x', val: 0.75, isDefault: false },
                    { label: '0.9x', val: 0.9, isDefault: true },
                    { label: '1.0x', val: 1.0, isDefault: false },
                    { label: '1.2x', val: 1.2, isDefault: false },
                  ].map((p) => {
                    const isSelected = Math.abs(settings.speechRate - p.val) < 0.04;
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => updateSettings({ speechRate: p.val })}
                        className={`
                          py-2 px-1 text-xs sm:text-sm font-bold rounded-xl border-2 transition-all duration-150 active:scale-[0.98] cursor-pointer flex flex-col items-center justify-center min-h-[46px]
                          ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/40 font-black'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }
                        `}
                      >
                        <span>{p.label}</span>
                        {p.isDefault && (
                          <span
                            className={`text-[9px] font-normal leading-tight ${
                              isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            Default
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Voices (English and Chinese) */}
              <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <label className="text-xs font-black tracking-wider text-slate-800 dark:text-white">
                  Voices
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 1. English Voice */}
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col gap-2 shadow-sm">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      🇺🇸 English
                    </span>

                    <select
                      value={settings.selectedVoiceEnUS || defaultEnVoiceURI}
                      onChange={(e) => updateSettings({ selectedVoiceEnUS: e.target.value })}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {enUSVoices.length === 0 && (
                        <option value="">No English voices detected</option>
                      )}
                      {enUSVoices.map((v) => {
                        const isSamantha = v.name.toLowerCase().includes('samantha');
                        return (
                          <option key={v.voiceURI} value={v.voiceURI}>
                            {v.name}{isSamantha ? ' (Default)' : ''}
                          </option>
                        );
                      })}
                    </select>

                    <DebouncedTouchable
                      onPress={handleTestEnglish}
                      disabled={isTestingEnglish}
                      minTouchSize="sm"
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all duration-150 active:scale-[0.98]"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isTestingEnglish ? 'Speaking...' : 'Test'}</span>
                    </DebouncedTouchable>
                  </div>

                  {/* 2. Chinese Voice */}
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col gap-2 shadow-sm">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      🇹🇼 Chinese
                    </span>

                    <select
                      value={settings.selectedVoiceZhTW || defaultZhVoiceURI}
                      onChange={(e) => updateSettings({ selectedVoiceZhTW: e.target.value })}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {zhTWVoices.length === 0 && (
                        <option value="">No Chinese voices detected</option>
                      )}
                      {zhTWVoices.map((v) => {
                        const isMeijia = v.name.toLowerCase().includes('mei-jia') || v.name.toLowerCase().includes('meijia');
                        return (
                          <option key={v.voiceURI} value={v.voiceURI}>
                            {v.name}{isMeijia ? ' (Default)' : ''}
                          </option>
                        );
                      })}
                    </select>

                    <DebouncedTouchable
                      onPress={handleTestChinese}
                      disabled={isTestingChinese}
                      minTouchSize="sm"
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all duration-150 active:scale-[0.98]"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isTestingChinese ? 'Speaking...' : 'Test'}</span>
                    </DebouncedTouchable>
                  </div>
                </div>
              </div>

              {/* Spoken Languages */}
              <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <label className="text-xs font-black tracking-wider text-slate-800 dark:text-white">
                  Spoken Languages
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'en', label: 'English', isDefault: false },
                    { id: 'zh', label: 'Chinese', isDefault: false },
                    { id: 'en-then-zh', label: 'English → Chinese', isDefault: true },
                    { id: 'zh-then-en', label: 'Chinese → English', isDefault: false },
                  ].map((item) => {
                    const current = settings.cardSpeechLanguage || 'en-then-zh';
                    const isSelected = current === item.id || (item.id === 'en-then-zh' && current === 'both');
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => updateSettings({ cardSpeechLanguage: item.id as any })}
                        className={`
                          py-2 px-1 text-center rounded-xl border-2 transition-all duration-150 active:scale-[0.98] cursor-pointer flex flex-col items-center justify-center min-h-[48px]
                          ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/40 font-black'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'
                          }
                        `}
                      >
                        <span className="text-xs sm:text-sm">{item.label}</span>
                        {item.isDefault && (
                          <span
                            className={`text-[9px] font-normal leading-tight mt-0.5 ${
                              isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            Default
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. Google Sheet Auto-Sync on Startup */}
            <div className="flex flex-col gap-2.5 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span>Google Sheet Startup Auto-Sync</span>
                </label>
              </div>

              <div className="flex flex-col gap-2">
                <input
                  type="url"
                  value={settings.googleSheetSyncUrl || ''}
                  onChange={(e) => updateSettings({ googleSheetSyncUrl: e.target.value })}
                  placeholder="https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit..."
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.googleSheetAutoSyncOnLoad !== false}
                    onChange={(e) => updateSettings({ googleSheetAutoSyncOnLoad: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>Automatically sync on initial page load</span>
                </label>

                {settings.lastGoogleSheetSyncStatus && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Last sync: {settings.lastGoogleSheetSyncStatus}
                  </p>
                )}
              </div>
            </div>

            {/* 5. Anti-Tremor Tap Debounce */}
            <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Tap Debounce: <strong className="text-amber-600 dark:text-amber-400">{settings.tapDebounceMs} ms</strong>
                </label>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  Default: 300 ms
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="500"
                step="50"
                value={settings.tapDebounceMs}
                onChange={(e) => updateSettings({ tapDebounceMs: Number(e.target.value) })}
                className="accent-amber-500 w-full cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* --- CARDS MANAGER TAB --- */}
        {activeTab === 'cards' && (
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between bg-slate-900 p-3 rounded-2xl border border-slate-800">
              <span className="text-sm font-bold text-slate-200">Total Cards: {cards.length}</span>
              <DebouncedTouchable
                onPress={() => {
                  setEditingCard(null);
                  setIsCardModalOpen(true);
                }}
                minTouchSize="sm"
                className="bg-pink-600 hover:bg-pink-500 active:bg-pink-700 text-white px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-pink-900/30 border border-pink-400/30 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add New Card</span>
              </DebouncedTouchable>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {cards.map((card) => {
                const fitz = FITZGERALD_COLOR_MAP[card.fitzgeraldCategory] || FITZGERALD_COLOR_MAP.nouns;
                return (
                  <div
                    key={card.id}
                    className={`
                      p-3 rounded-2xl border-2 flex items-center justify-between bg-slate-900 shadow-md
                      ${fitz.border}
                    `}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="text-2xl shrink-0">{card.icon || '💬'}</span>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5 truncate">
                          <h4 className="text-sm font-bold text-white truncate">{card.label}</h4>
                          {card.labelZh && (
                            <span className="text-sm font-black text-amber-400 shrink-0">
                              {card.labelZh}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate">
                          {card.spokenText} {card.spokenTextZh ? `· ${card.spokenTextZh}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(card)}
                        className="p-1.5 text-slate-400 hover:text-amber-400"
                        title="Toggle Favorite"
                      >
                        <Star className={`w-4 h-4 ${card.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingCard(card);
                          setIsCardModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-blue-400"
                        title="Edit Card"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCard(card.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400"
                        title="Delete Card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- BACKUP & RESTORE TAB --- */}
        {activeTab === 'backup' && (
          <BackupRestoreView onDataChanged={onRefreshData} />
        )}

        {/* --- APP QR CODE TAB --- */}
        {activeTab === 'qrcode' && (
          <AppQRCodeView />
        )}
      </div>

      {/* Card Editor Modal */}
      {isCardModalOpen && (
        <CardEditorModal
          initialCard={editingCard}
          categories={categories}
          onSave={() => {
            setIsCardModalOpen(false);
            onRefreshData();
          }}
          onCancel={() => setIsCardModalOpen(false)}
        />
      )}
    </div>
  );
};
