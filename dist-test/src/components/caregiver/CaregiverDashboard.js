import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useMemo } from 'react';
import { FITZGERALD_COLOR_MAP, } from '../../types/index.js';
import { CardEditorModal } from './CardEditorModal.js';
import { BackupRestoreView } from './BackupRestoreView.js';
import { DebouncedTouchable } from '../common/DebouncedTouchable.js';
import { useDatabase } from '../../hooks/useDatabase.js';
import { useSettings } from '../../hooks/useSettings.js';
import { speechEngine, filterAndGroupVoices } from '../../services/audio/WebSpeechEngine.js';
import { Settings, Grid, Download, FileSpreadsheet, Plus, Trash2, Edit2, Lock, Star, Volume2, LayoutGrid, Sparkles, } from 'lucide-react';
export const CaregiverDashboard = ({ categories, cards, settings, onCloseCaregiverMode, onRefreshData, }) => {
    const [activeTab, setActiveTab] = useState('settings');
    const [editingCard, setEditingCard] = useState(null);
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [isTestingEnglish, setIsTestingEnglish] = useState(false);
    const [isTestingChinese, setIsTestingChinese] = useState(false);
    const { saveCard, deleteCard } = useDatabase();
    const { updateSettings } = useSettings();
    const [voices, setVoices] = useState(() => speechEngine.getVoices());
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
        if (isTestingEnglish)
            return;
        setIsTestingEnglish(true);
        try {
            await speechEngine.speak('Hello! Testing the English voice and speech rate setting.', {
                rate: settings.speechRate,
                pitch: settings.speechPitch,
                voiceURI: settings.selectedVoiceEnUS || defaultEnVoiceURI,
                locale: 'en-US',
            });
        }
        finally {
            setIsTestingEnglish(false);
        }
    };
    const handleTestChinese = async () => {
        if (isTestingChinese)
            return;
        setIsTestingChinese(true);
        try {
            await speechEngine.speak('您好！測試繁體中文語音與語速設定。', {
                rate: settings.speechRate,
                pitch: settings.speechPitch,
                voiceURI: settings.selectedVoiceZhTW || defaultZhVoiceURI || settings.selectedVoiceURI,
                locale: 'zh-TW',
            });
        }
        finally {
            setIsTestingChinese(false);
        }
    };
    const tabs = [
        { id: 'settings', label: 'Settings', icon: _jsx(Settings, { className: "w-5 h-5" }) },
        { id: 'cards', label: 'Cards', icon: _jsx(Grid, { className: "w-5 h-5" }) },
        { id: 'backup', label: 'Backup & Restore', icon: _jsx(Download, { className: "w-5 h-5" }) },
    ];
    const handleToggleFavorite = async (card) => {
        await saveCard({ ...card, isFavorite: !card.isFavorite });
        onRefreshData();
    };
    const handleDeleteCard = async (cardId) => {
        if (window.confirm('Delete this AAC card?')) {
            await deleteCard(cardId);
            onRefreshData();
        }
    };
    return (_jsxs("div", { className: "w-full h-full flex flex-col gap-2.5 overflow-hidden select-none bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-2 sm:p-3 transition-colors", children: [_jsxs("div", { className: "w-full bg-white dark:bg-slate-900 border-2 border-purple-500/50 rounded-2xl p-3 flex items-center justify-between shadow-xl shrink-0", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400 flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold", children: "\uD83D\uDD12" }), _jsx("div", { children: _jsx("h1", { className: "text-base sm:text-lg font-black text-slate-900 dark:text-white", children: "Caregiver Settings" }) })] }), _jsxs(DebouncedTouchable, { onPress: onCloseCaregiverMode, minTouchSize: "md", className: "bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-md shadow-purple-900/40 text-xs sm:text-sm", children: [_jsx(Lock, { className: "w-4 h-4" }), _jsx("span", { children: "Lock Settings" })] })] }), _jsx("div", { className: "w-full flex items-center gap-2 overflow-x-auto scrollbar-thin py-1 shrink-0", children: tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (_jsxs(DebouncedTouchable, { onPress: () => setActiveTab(tab.id), minTouchSize: "sm", className: `
                px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap border-2 transition-all
                ${isActive
                            ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'}
              `, children: [tab.icon, _jsx("span", { children: tab.label })] }, tab.id));
                }) }), _jsxs("div", { className: "flex-1 w-full overflow-y-auto p-1 scrollbar-thin", children: [activeTab === 'settings' && (_jsxs("div", { className: "w-full max-w-3xl mx-auto flex flex-col gap-4 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-3xl p-5 shadow-xl", children: [_jsx("h2", { className: "text-lg font-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2", children: "Settings" }), _jsxs("div", { className: "flex flex-col gap-2.5 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800", children: [_jsx("label", { className: "text-sm font-bold text-slate-800 dark:text-slate-200", children: "Display Mode" }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: [
                                            { id: 'dark', label: '🌙 Dark', isDefault: true },
                                            { id: 'light', label: '☀️ Light', isDefault: false },
                                        ].map((t) => {
                                            const isSelected = settings.theme === t.id;
                                            return (_jsxs("button", { type: "button", onClick: () => updateSettings({ theme: t.id }), className: `
                        py-2.5 px-4 rounded-xl text-center font-bold text-sm border-2 transition-all duration-150 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2
                        ${isSelected
                                                    ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/40 font-black'
                                                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'}
                      `, children: [_jsx("span", { children: t.label }), t.isDefault && (_jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${isSelected
                                                            ? 'bg-blue-700/80 text-blue-100'
                                                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`, children: "Default" }))] }, t.id));
                                        }) })] }), _jsxs("div", { className: "flex flex-col gap-2.5 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800", children: [_jsxs("label", { className: "text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5", children: [_jsx(LayoutGrid, { className: "w-4 h-4 text-blue-500" }), _jsx("span", { children: "Card Grid - Columns" })] }), _jsx("div", { className: "grid grid-cols-3 gap-2.5", children: [
                                            { cols: 3, label: '3', isDefault: false },
                                            { cols: 4, label: '4', isDefault: true },
                                            { cols: 5, label: '5', isDefault: false },
                                        ].map((preset) => {
                                            const isSelected = (settings.gridCols || 4) === preset.cols;
                                            return (_jsxs("button", { type: "button", onClick: () => updateSettings({ gridCols: preset.cols }), className: `
                        py-2 px-2 text-center rounded-xl border-2 transition-all duration-150 active:scale-[0.98] cursor-pointer flex flex-col items-center justify-center min-h-[52px] gap-1
                        ${isSelected
                                                    ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/40 font-black'
                                                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'}
                      `, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "flex items-center gap-0.5", children: Array.from({ length: preset.cols }).map((_, i) => (_jsx("div", { className: `w-1 h-3.5 rounded-full transition-colors ${isSelected ? 'bg-white' : 'bg-slate-400 dark:bg-slate-500'}` }, i))) }), _jsx("span", { className: "text-sm font-black sm:text-base", children: preset.label })] }), preset.isDefault && (_jsx("span", { className: `text-[9px] font-normal leading-tight ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`, children: "Default" }))] }, preset.cols));
                                        }) })] }), _jsxs("div", { className: "flex flex-col gap-2.5 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800", children: [_jsxs("label", { className: "text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5", children: [_jsx(Sparkles, { className: "w-4 h-4 text-amber-500" }), _jsx("span", { children: "Weekly Focus - Cards Per Category" })] }), _jsx("div", { className: "grid grid-cols-4 gap-2.5", children: [
                                            { count: 1, label: '1 Card', isDefault: false },
                                            { count: 2, label: '2 Cards', isDefault: true },
                                            { count: 3, label: '3 Cards', isDefault: false },
                                            { count: 4, label: '4 Cards', isDefault: false },
                                        ].map((preset) => {
                                            const isSelected = (settings.weeklyFocusCardsPerCategory ?? 2) === preset.count;
                                            return (_jsxs("button", { type: "button", onClick: () => updateSettings({ weeklyFocusCardsPerCategory: preset.count }), className: `
                        py-2 px-2 text-center rounded-xl border-2 transition-all duration-150 active:scale-[0.98] cursor-pointer flex flex-col items-center justify-center min-h-[52px] gap-1
                        ${isSelected
                                                    ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/40 font-black'
                                                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'}
                      `, children: [_jsx("span", { className: "text-xs sm:text-sm font-black whitespace-nowrap", children: preset.label }), preset.isDefault && (_jsx("span", { className: `text-[9px] font-normal leading-tight ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`, children: "Default" }))] }, preset.count));
                                        }) })] }), _jsxs("div", { className: "flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("label", { className: "text-sm font-bold text-slate-800 dark:text-slate-200", children: ["Tap Debounce: ", _jsxs("strong", { className: "text-amber-600 dark:text-amber-400", children: [settings.tapDebounceMs, " ms"] })] }), _jsx("span", { className: "text-xs text-slate-500 dark:text-slate-400 font-semibold", children: "Default: 300 ms" })] }), _jsx("input", { type: "range", min: "200", max: "500", step: "50", value: settings.tapDebounceMs, onChange: (e) => updateSettings({ tapDebounceMs: Number(e.target.value) }), className: "accent-amber-500 w-full cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg" })] }), _jsxs("div", { className: "flex flex-col gap-3.5 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800", children: [_jsxs("div", { className: "flex flex-col gap-2", children: [_jsxs("label", { className: "text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5", children: [_jsx(Volume2, { className: "w-4 h-4 text-blue-500" }), _jsx("span", { children: "Speech Rate" })] }), _jsx("div", { className: "grid grid-cols-3 sm:grid-cols-6 gap-2", children: [
                                                    { label: '0.25x', val: 0.25, isDefault: false },
                                                    { label: '0.5x', val: 0.5, isDefault: false },
                                                    { label: '0.75x', val: 0.75, isDefault: false },
                                                    { label: '0.9x', val: 0.9, isDefault: true },
                                                    { label: '1.0x', val: 1.0, isDefault: false },
                                                    { label: '1.2x', val: 1.2, isDefault: false },
                                                ].map((p) => {
                                                    const isSelected = Math.abs(settings.speechRate - p.val) < 0.04;
                                                    return (_jsxs("button", { type: "button", onClick: () => updateSettings({ speechRate: p.val }), className: `
                          py-2 px-1 text-xs sm:text-sm font-bold rounded-xl border-2 transition-all duration-150 active:scale-[0.98] cursor-pointer flex flex-col items-center justify-center min-h-[46px]
                          ${isSelected
                                                            ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/40 font-black'
                                                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'}
                        `, children: [_jsx("span", { children: p.label }), p.isDefault && (_jsx("span", { className: `text-[9px] font-normal leading-tight ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`, children: "Default" }))] }, p.label));
                                                }) })] }), _jsxs("div", { className: "flex flex-col gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800", children: [_jsx("label", { className: "text-xs font-black tracking-wider text-slate-800 dark:text-white", children: "Voices" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("div", { className: "p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col gap-2 shadow-sm", children: [_jsx("span", { className: "text-xs font-bold text-slate-800 dark:text-slate-200", children: "\uD83C\uDDFA\uD83C\uDDF8 English" }), _jsxs("select", { value: settings.selectedVoiceEnUS || defaultEnVoiceURI, onChange: (e) => updateSettings({ selectedVoiceEnUS: e.target.value, selectedVoiceURI: e.target.value }), className: "w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer", children: [enUSVoices.length === 0 && (_jsx("option", { value: "", children: "No English voices detected" })), enUSVoices.map((v) => {
                                                                        const isSamantha = v.name.toLowerCase().includes('samantha');
                                                                        return (_jsxs("option", { value: v.voiceURI, children: [v.name, isSamantha ? ' (Default)' : ''] }, v.voiceURI));
                                                                    })] }), _jsxs(DebouncedTouchable, { onPress: handleTestEnglish, disabled: isTestingEnglish, minTouchSize: "sm", className: "w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all duration-150 active:scale-[0.98]", children: [_jsx(Volume2, { className: "w-3.5 h-3.5" }), _jsx("span", { children: isTestingEnglish ? 'Speaking...' : 'Test' })] })] }), _jsxs("div", { className: "p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col gap-2 shadow-sm", children: [_jsx("span", { className: "text-xs font-bold text-slate-800 dark:text-slate-200", children: "\uD83C\uDDF9\uD83C\uDDFC Chinese" }), _jsxs("select", { value: settings.selectedVoiceZhTW || defaultZhVoiceURI, onChange: (e) => updateSettings({ selectedVoiceZhTW: e.target.value }), className: "w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer", children: [zhTWVoices.length === 0 && (_jsx("option", { value: "", children: "No Chinese voices detected" })), zhTWVoices.map((v) => {
                                                                        const isMeijia = v.name.toLowerCase().includes('mei-jia') || v.name.toLowerCase().includes('meijia');
                                                                        return (_jsxs("option", { value: v.voiceURI, children: [v.name, isMeijia ? ' (Default)' : ''] }, v.voiceURI));
                                                                    })] }), _jsxs(DebouncedTouchable, { onPress: handleTestChinese, disabled: isTestingChinese, minTouchSize: "sm", className: "w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all duration-150 active:scale-[0.98]", children: [_jsx(Volume2, { className: "w-3.5 h-3.5" }), _jsx("span", { children: isTestingChinese ? 'Speaking...' : 'Test' })] })] })] })] }), _jsxs("div", { className: "flex flex-col gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800", children: [_jsx("label", { className: "text-xs font-black tracking-wider text-slate-800 dark:text-white", children: "Spoken Languages" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2", children: [
                                                    { id: 'en', label: 'English', isDefault: false },
                                                    { id: 'zh', label: 'Chinese', isDefault: false },
                                                    { id: 'en-then-zh', label: 'English → Chinese', isDefault: true },
                                                    { id: 'zh-then-en', label: 'Chinese → English', isDefault: false },
                                                ].map((item) => {
                                                    const current = settings.cardSpeechLanguage || 'en-then-zh';
                                                    const isSelected = current === item.id || (item.id === 'en-then-zh' && current === 'both');
                                                    return (_jsxs("button", { type: "button", onClick: () => updateSettings({ cardSpeechLanguage: item.id }), className: `
                          py-2 px-1 text-center rounded-xl border-2 transition-all duration-150 active:scale-[0.98] cursor-pointer flex flex-col items-center justify-center min-h-[48px]
                          ${isSelected
                                                            ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/40 font-black'
                                                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'}
                        `, children: [_jsx("span", { className: "text-xs sm:text-sm", children: item.label }), item.isDefault && (_jsx("span", { className: `text-[9px] font-normal leading-tight mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`, children: "Default" }))] }, item.id));
                                                }) })] })] }), _jsxs("div", { className: "flex flex-col gap-2.5 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("label", { className: "text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5", children: [_jsx(FileSpreadsheet, { className: "w-4 h-4 text-emerald-500" }), _jsx("span", { children: "Google Sheet Startup Auto-Sync" })] }) }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("input", { type: "url", value: settings.googleSheetSyncUrl || '', onChange: (e) => updateSettings({ googleSheetSyncUrl: e.target.value }), placeholder: "https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit...", className: "w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none" }), _jsxs("label", { className: "flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.googleSheetAutoSyncOnLoad !== false, onChange: (e) => updateSettings({ googleSheetAutoSyncOnLoad: e.target.checked }), className: "w-4 h-4 rounded text-emerald-600 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-emerald-500 cursor-pointer" }), _jsx("span", { children: "Automatically sync on initial page load" })] }), settings.lastGoogleSheetSyncStatus && (_jsxs("p", { className: "text-[11px] text-slate-500 dark:text-slate-400 font-medium", children: ["Last sync: ", settings.lastGoogleSheetSyncStatus] }))] })] })] })), activeTab === 'cards' && (_jsxs("div", { className: "w-full flex flex-col gap-3", children: [_jsxs("div", { className: "flex items-center justify-between bg-slate-900 p-3 rounded-2xl border border-slate-800", children: [_jsxs("span", { className: "text-sm font-bold text-slate-200", children: ["Total Cards: ", cards.length] }), _jsxs(DebouncedTouchable, { onPress: () => {
                                            setEditingCard(null);
                                            setIsCardModalOpen(true);
                                        }, minTouchSize: "sm", className: "bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5", children: [_jsx(Plus, { className: "w-4 h-4 stroke-[3]" }), _jsx("span", { children: "Add New Card" })] })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5", children: cards.map((card) => {
                                    const fitz = FITZGERALD_COLOR_MAP[card.fitzgeraldCategory] || FITZGERALD_COLOR_MAP.nouns;
                                    return (_jsxs("div", { className: `
                      p-3 rounded-2xl border-2 flex items-center justify-between bg-slate-900 shadow-md
                      ${fitz.border}
                    `, children: [_jsxs("div", { className: "flex items-center gap-2.5 overflow-hidden", children: [_jsx("span", { className: "text-2xl shrink-0", children: card.icon || '💬' }), _jsxs("div", { className: "truncate", children: [_jsxs("div", { className: "flex items-center gap-1.5 truncate", children: [_jsx("h4", { className: "text-sm font-bold text-white truncate", children: card.label }), card.labelZh && (_jsx("span", { className: "text-sm font-black text-amber-400 shrink-0", children: card.labelZh }))] }), _jsxs("p", { className: "text-xs text-slate-400 truncate", children: [card.spokenText, " ", card.spokenTextZh ? `· ${card.spokenTextZh}` : ''] })] })] }), _jsxs("div", { className: "flex items-center gap-1.5 shrink-0 ml-2", children: [_jsx("button", { type: "button", onClick: () => handleToggleFavorite(card), className: "p-1.5 text-slate-400 hover:text-amber-400", title: "Toggle Favorite", children: _jsx(Star, { className: `w-4 h-4 ${card.isFavorite ? 'fill-amber-400 text-amber-400' : ''}` }) }), _jsx("button", { type: "button", onClick: () => {
                                                            setEditingCard(card);
                                                            setIsCardModalOpen(true);
                                                        }, className: "p-1.5 text-slate-400 hover:text-blue-400", title: "Edit Card", children: _jsx(Edit2, { className: "w-4 h-4" }) }), _jsx("button", { type: "button", onClick: () => handleDeleteCard(card.id), className: "p-1.5 text-slate-400 hover:text-rose-400", title: "Delete Card", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }, card.id));
                                }) })] })), activeTab === 'backup' && (_jsx(BackupRestoreView, { onDataChanged: onRefreshData }))] }), isCardModalOpen && (_jsx(CardEditorModal, { initialCard: editingCard, categories: categories, onSave: () => {
                    setIsCardModalOpen(false);
                    onRefreshData();
                }, onCancel: () => setIsCardModalOpen(false) }))] }));
};
