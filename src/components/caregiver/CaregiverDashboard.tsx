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
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from '../../services/legal/legalContent';
import { LegalModal } from '../legal/LegalModal';
import { googleAuthService, GoogleAuthState } from '../../services/googleSheets/googleAuthService';
import { syncGoogleSheetOnStartup } from '../../services/googleSheets/googleSheetsAutoSync';
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
  ShieldCheck,
  FileText,
  Printer,
  ExternalLink,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  LogIn,
  LogOut,
  KeyRound,
  ChevronDown,
  ChevronUp,
  Smartphone,
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
  | 'qrcode'
  | 'legal';

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
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalDoc, setLegalModalDoc] = useState<'privacy' | 'terms'>('privacy');
  const [activeLegalSubTab, setActiveLegalSubTab] = useState<'privacy' | 'terms'>('privacy');

  const [isTestingEnglish, setIsTestingEnglish] = useState(false);
  const [isTestingChinese, setIsTestingChinese] = useState(false);
  const [testFeedbackEn, setTestFeedbackEn] = useState<string | null>(null);
  const [testFeedbackZh, setTestFeedbackZh] = useState<string | null>(null);
  const [isAndroidHelpOpen, setIsAndroidHelpOpen] = useState(false);

  // Google OAuth & Sync states
  const [authState, setAuthState] = useState<GoogleAuthState>(() => googleAuthService.getAuthState());
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSyncingNow, setIsSyncingNow] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { saveCard, deleteCard } = useDatabase();
  const { updateSettings } = useSettings();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() => speechEngine.getVoices());

  useEffect(() => {
    const unsub = googleAuthService.subscribe(() => {
      setAuthState(googleAuthService.getAuthState());
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const updateVoices = () => {
      setVoices(speechEngine.getVoices());
    };

    updateVoices();
    const unsubEngine = speechEngine.onVoicesChanged(updateVoices);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.addEventListener?.('voiceschanged', updateVoices);

      return () => {
        unsubEngine();
        window.speechSynthesis.removeEventListener?.('voiceschanged', updateVoices);
      };
    }
    return () => {
      unsubEngine();
    };
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
    setTestFeedbackEn('Testing...');
    try {
      await speechEngine.speak('Hello! Testing the English voice and speech rate setting.', {
        rate: settings.speechRate,
        pitch: settings.speechPitch,
        voiceURI: settings.selectedVoiceEnUS || defaultEnVoiceURI,
        locale: 'en-US',
      });
      setTestFeedbackEn('✅ Success');
      setTimeout(() => setTestFeedbackEn(null), 3000);
    } catch {
      setTestFeedbackEn('⚠️ Error');
      setTimeout(() => setTestFeedbackEn(null), 3000);
    } finally {
      setIsTestingEnglish(false);
    }
  };

  const handleTestChinese = async () => {
    if (isTestingChinese) return;
    setIsTestingChinese(true);
    setTestFeedbackZh('測試中...');
    try {
      await speechEngine.speak('您好！測試繁體中文語音與語速設定。', {
        rate: settings.speechRate,
        pitch: settings.speechPitch,
        voiceURI: settings.selectedVoiceZhTW || defaultZhVoiceURI,
        locale: 'zh-TW',
      });
      setTestFeedbackZh('✅ 成功');
      setTimeout(() => setTestFeedbackZh(null), 3000);
    } catch {
      setTestFeedbackZh('⚠️ 異常');
      setTimeout(() => setTestFeedbackZh(null), 3000);
    } finally {
      setIsTestingChinese(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);
    setSyncFeedback(null);

    try {
      const res = await googleAuthService.requestAccessToken({
        clientId: settings.googleOAuthClientId,
      });

      if (res.userEmail && res.userEmail !== settings.googleOAuthUserEmail) {
        await updateSettings({ googleOAuthUserEmail: res.userEmail });
      }

      setSyncFeedback({
        type: 'success',
        message: `Google Account connected: ${res.userEmail || 'Authenticated'} (Google 帳號已連結)`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSyncFeedback({
        type: 'error',
        message: `Authentication failed: ${msg} (驗證失敗)`,
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await googleAuthService.signOut();
      await updateSettings({ googleOAuthUserEmail: '' });
      setSyncFeedback({
        type: 'success',
        message: 'Disconnected from Google Account. (已解除 Google 帳號連結)',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSyncFeedback({
        type: 'error',
        message: `Sign out error: ${msg}`,
      });
    }
  };

  const handleSyncNow = async () => {
    if (isSyncingNow) return;
    setIsSyncingNow(true);
    setSyncFeedback(null);

    try {
      const res = await syncGoogleSheetOnStartup({ force: true });
      if (res.synced) {
        onRefreshData();
        setSyncFeedback({
          type: 'success',
          message: res.message || `Successfully synced ${res.importedCards} cards from Google Sheet! (成功同步圖卡)`,
        });
      } else {
        setSyncFeedback({
          type: 'error',
          message: res.error || res.message || 'Sync failed. Please check your Sheet URL and permissions.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSyncFeedback({
        type: 'error',
        message: `Sync error: ${msg}`,
      });
    } finally {
      setIsSyncingNow(false);
    }
  };

  const tabs: { id: CaregiverTab; label: string; icon: React.ReactNode }[] = [
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { id: 'cards', label: 'Cards', icon: <Grid className="w-5 h-5" /> },
    { id: 'backup', label: 'Backup & Restore', icon: <Download className="w-5 h-5" /> },
    { id: 'qrcode', label: 'App QR Code', icon: <QrCode className="w-5 h-5" /> },
    { id: 'legal', label: 'Privacy & Terms', icon: <ShieldCheck className="w-5 h-5" /> },
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
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black tracking-wider text-slate-800 dark:text-white">
                    Voices
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAndroidHelpOpen(!isAndroidHelpOpen)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Android Setup Guide</span>
                    {isAndroidHelpOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {/* Collapsible Android Voice Setup Guide */}
                {isAndroidHelpOpen && (
                  <div className="p-3.5 bg-blue-50/80 dark:bg-slate-900/90 border border-blue-200 dark:border-blue-800/60 rounded-2xl flex flex-col gap-2 text-xs animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-200">
                      <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>Android Phone Voice Setup Guide (安卓手機語音設定指南)</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                      If voices sound robotic or Chinese speech does not play on your Android phone, install offline Google Speech Services voice packs in Android Settings:
                    </p>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-700 dark:text-slate-200 text-[11px] font-medium pl-1">
                      <li>
                        Open Android <strong className="text-slate-900 dark:text-white font-bold">Settings (設定)</strong> → <strong className="text-slate-900 dark:text-white font-bold">System (系統)</strong> or <strong className="text-slate-900 dark:text-white font-bold">General management (一般管理)</strong>.
                      </li>
                      <li>
                        Tap <strong className="text-slate-900 dark:text-white font-bold">Language &amp; input (語言與輸入)</strong> → <strong className="text-slate-900 dark:text-white font-bold">Text-to-speech output (文字轉語音輸出)</strong>.
                      </li>
                      <li>
                        Select <strong className="text-slate-900 dark:text-white font-bold">Preferred engine (偏好的引擎)</strong> → <strong className="text-slate-900 dark:text-white font-bold">Speech Recognition and Synthesis from Google (Google 語音服務)</strong>.
                      </li>
                      <li>
                        Tap the ⚙️ <strong className="text-slate-900 dark:text-white font-bold">Settings gear icon</strong> next to Google Engine → <strong className="text-slate-900 dark:text-white font-bold">Install voice data (安裝語音資料)</strong>.
                      </li>
                      <li>
                        Download <strong className="text-slate-900 dark:text-white font-bold">Chinese (Taiwan) (中文 (台灣))</strong> and <strong className="text-slate-900 dark:text-white font-bold">English (United States) (英文 (美國))</strong> for 100% offline playback.
                      </li>
                    </ol>
                    <div className="mt-1 pt-2 border-t border-blue-200 dark:border-blue-800/40 flex items-center gap-1.5 text-[10px] text-blue-700 dark:text-blue-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Once downloaded, local high-quality voices will automatically appear in the selectors below.</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 1. English Voice */}
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col gap-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        🇺🇸 English
                      </span>
                      {testFeedbackEn && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          {testFeedbackEn}
                        </span>
                      )}
                    </div>

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
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        🇹🇼 Chinese
                      </span>
                      {testFeedbackZh && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          {testFeedbackZh}
                        </span>
                      )}
                    </div>

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

            {/* 4. Google Sheet Synchronization & Google Identity Services OAuth */}
            <div className="flex flex-col gap-3.5 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span>Google Sheet Synchronization (Google 試算表同步)</span>
                </label>
              </div>

              {/* Feedback Alert */}
              {syncFeedback && (
                <div
                  className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs font-bold ${
                    syncFeedback.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {syncFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <span className="flex-1 leading-snug">{syncFeedback.message}</span>
                </div>
              )}

              {/* Sheet URL & Tab Name */}
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Google Sheet URL (試算表網址)
                  </span>
                  <input
                    type="url"
                    value={settings.googleSheetSyncUrl || ''}
                    onChange={(e) => updateSettings({ googleSheetSyncUrl: e.target.value })}
                    placeholder="https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit..."
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Sheet Tab Name (工作表分頁名稱，選填)
                    </span>
                    <input
                      type="text"
                      value={settings.googleSheetSyncCardsTab || ''}
                      onChange={(e) => updateSettings({ googleSheetSyncCardsTab: e.target.value })}
                      placeholder="e.g. Sheet1, Cards (defaults to first sheet)"
                      className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={settings.googleSheetAutoSyncOnLoad !== false}
                    onChange={(e) => updateSettings({ googleSheetAutoSyncOnLoad: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>Automatically sync on initial page load (每次啟動時自動同步)</span>
                </label>
              </div>

              {/* Google Identity Services (GIS) OAuth 2.0 Configuration for Private Sheets */}
              <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    <span>Google Account Authorization (Google 帳號授權，存取私人試算表)</span>
                  </label>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      authState.isAuthenticated
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {authState.isAuthenticated ? 'Connected · 已連結' : 'Not Connected · 未連結'}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                    <span>Google OAuth Client ID (OAuth 用戶端 ID)</span>
                  </span>
                  <input
                    type="text"
                    value={settings.googleOAuthClientId || ''}
                    onChange={(e) => updateSettings({ googleOAuthClientId: e.target.value })}
                    placeholder="e.g. 1234567890-abc.apps.googleusercontent.com"
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    Create a Web Application Client ID in Google Cloud Console with authorized origin and spreadsheets.readonly scope.
                  </p>
                </div>

                {/* Auth Controls & Status */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                  {authState.isAuthenticated ? (
                    <div className="w-full flex items-center justify-between gap-2 bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl">
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 truncate">
                          Signed in as: {authState.userEmail || settings.googleOAuthUserEmail || 'Google User'}
                        </span>
                        <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">
                          OAuth Token Active (已成功取得授權)
                        </span>
                      </div>
                      <DebouncedTouchable
                        onPress={handleGoogleSignOut}
                        minTouchSize="sm"
                        className="py-1.5 px-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Disconnect (解除連結)</span>
                      </DebouncedTouchable>
                    </div>
                  ) : (
                    <DebouncedTouchable
                      onPress={handleGoogleSignIn}
                      disabled={isAuthenticating}
                      minTouchSize="sm"
                      className="w-full sm:w-auto py-2 px-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>{isAuthenticating ? 'Authorizing... (驗證中)' : 'Sign in with Google (以 Google 帳號登入)'}</span>
                    </DebouncedTouchable>
                  )}
                </div>
              </div>

              {/* Sync Now Action Button & Last Sync Details */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <DebouncedTouchable
                  onPress={handleSyncNow}
                  disabled={isSyncingNow}
                  minTouchSize="sm"
                  className="w-full sm:w-auto py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-emerald-900/30 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncingNow ? 'animate-spin' : ''}`} />
                  <span>{isSyncingNow ? 'Syncing... (同步中)' : 'Sync Now (立即同步)'}</span>
                </DebouncedTouchable>

                {settings.lastGoogleSheetSyncStatus && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium text-center sm:text-right">
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

            {/* 6. Legal, Privacy & Medical Disclaimers */}
            <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-pink-500" />
                  <span>Privacy Policy & Terms of Service</span>
                </label>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                  Zero Data Collection
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Talk With Dad AAC is engineered with 100% on-device privacy (GDPR Article 25). No personal data, health information, or voice recordings are collected or transmitted. Hosted statically on GitHub Pages.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <DebouncedTouchable
                  onPress={() => {
                    setLegalModalDoc('privacy');
                    setIsLegalModalOpen(true);
                  }}
                  minTouchSize="sm"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-pink-400 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-pink-500 shrink-0" />
                    <span>Privacy Policy (隱私權政策)</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </DebouncedTouchable>

                <DebouncedTouchable
                  onPress={() => {
                    setLegalModalDoc('terms');
                    setIsLegalModalOpen(true);
                  }}
                  minTouchSize="sm"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-pink-400 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Terms of Service (服務條款)</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </DebouncedTouchable>
              </div>
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

        {/* --- PRIVACY & TERMS LEGAL TAB --- */}
        {activeTab === 'legal' && (
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 bg-white dark:bg-slate-900 border-2 border-pink-500/30 rounded-3xl p-4 sm:p-6 shadow-xl">
            {/* Top Subtabs & Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveLegalSubTab('privacy')}
                  className={`
                    flex-1 sm:flex-initial py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-2 transition-all cursor-pointer
                    ${
                      activeLegalSubTab === 'privacy'
                        ? 'bg-pink-600 text-white border-pink-400 shadow-md font-black'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }
                  `}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Privacy Policy (隱私權政策)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveLegalSubTab('terms')}
                  className={`
                    flex-1 sm:flex-initial py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-2 transition-all cursor-pointer
                    ${
                      activeLegalSubTab === 'terms'
                        ? 'bg-pink-600 text-white border-pink-400 shadow-md font-black'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }
                  `}
                >
                  <FileText className="w-4 h-4" />
                  <span>Terms of Service (服務條款)</span>
                </button>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 cursor-pointer"
                  title="Print Document"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const url = activeLegalSubTab === 'privacy' ? './privacy.html' : './terms.html';
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 cursor-pointer"
                  title="Open Standalone Page"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Page</span>
                </button>
              </div>
            </div>

            {/* Document Header */}
            {(() => {
              const doc = activeLegalSubTab === 'privacy' ? PRIVACY_POLICY : TERMS_OF_SERVICE;
              return (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900/50 flex flex-col gap-1">
                    <h3 className="text-base font-black text-pink-700 dark:text-pink-300">
                      {doc.title} <span className="text-sm font-bold">({doc.titleZh})</span>
                    </h3>
                    <p className="text-xs text-pink-600 dark:text-pink-400 font-semibold">
                      {doc.subtitle} · {doc.subtitleZh}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Effective Date: {doc.effectiveDate} · Last Updated: {doc.lastUpdated}
                    </p>
                  </div>

                  {/* Summary Highlights */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Key Highlights · 重點摘要</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {doc.summaryPoints.map((pt, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col gap-1 text-xs"
                        >
                          <p className="font-bold text-slate-800 dark:text-slate-200">{pt.en}</p>
                          <p className="text-slate-500 dark:text-slate-400">{pt.zh}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* All Sections */}
                  <div className="space-y-4">
                    {doc.sections.map((section) => (
                      <div
                        key={section.id}
                        className={`
                          p-4 rounded-2xl border flex flex-col gap-2.5
                          ${
                            section.isImportant
                              ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                              : 'bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                          {section.isImportant ? (
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                          ) : (
                            <ShieldCheck className="w-4 h-4 text-pink-500 shrink-0" />
                          )}
                          <div className="flex flex-col">
                            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                              {section.title}
                            </h4>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                              {section.titleZh}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {section.contentEn.map((para, pIdx) => (
                            <p key={`en-${pIdx}`}>{para}</p>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 space-y-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {section.contentZh.map((para, pIdx) => (
                            <p key={`zh-${pIdx}`}>{para}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
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

      {/* Legal & Privacy Modal */}
      {isLegalModalOpen && (
        <LegalModal
          initialDoc={legalModalDoc}
          onClose={() => setIsLegalModalOpen(false)}
        />
      )}
    </div>
  );
};
