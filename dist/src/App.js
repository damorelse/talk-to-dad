import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import { useDatabase } from './hooks/useDatabase.js';
import { useSettings } from './hooks/useSettings.js';
import { syncGoogleSheetOnStartup } from './services/googleSheets/googleSheetsAutoSync.js';
import { MainContainer } from './components/layout/MainContainer.js';
import { CardGrid } from './components/grid/CardGrid.js';
import { VisualSceneViewer } from './components/visualScene/VisualSceneViewer.js';
import { PainMapContainer } from './components/painMap/PainMapContainer.js';
import { TodayOrientationView } from './components/today/TodayOrientationView.js';
import { SyllableVisualizerView } from './components/syllable/SyllableVisualizerView.js';
import { TherapySessionView } from './components/therapy/TherapySessionView.js';
import { BigSpeechKeyboard } from './components/keyboard/BigSpeechKeyboard.js';
import { CaregiverDashboard } from './components/caregiver/CaregiverDashboard.js';
import { CaregiverHoldLockModal } from './components/caregiver/CaregiverHoldLockModal.js';
import { Check } from 'lucide-react';
export const App = () => {
    const [activeTab, setActiveTab] = useState('grid');
    const [isCaregiverAuthenticated, setIsCaregiverAuthenticated] = useState(false);
    const [showCaregiverLockModal, setShowCaregiverLockModal] = useState(false);
    const [syncToast, setSyncToast] = useState(null);
    const { isReady, categories, cards, visualScenes, hotspots, refreshDatabase, } = useDatabase();
    const { settings, loading: settingsLoading } = useSettings();
    const syncExecutedRef = useRef(false);
    // Automatic Google Sheet import on initial page load
    useEffect(() => {
        if (!isReady || syncExecutedRef.current)
            return;
        syncExecutedRef.current = true;
        syncGoogleSheetOnStartup().then((res) => {
            if (res.synced && res.importedCards > 0) {
                refreshDatabase();
                setSyncToast(`Auto-synced ${res.importedCards} Cards from Google Sheet!`);
                setTimeout(() => setSyncToast(null), 4500);
            }
        }).catch((err) => {
            console.warn('Initial Google Sheet sync skipped:', err);
        });
    }, [isReady, refreshDatabase]);
    const handleTabChange = (tab) => {
        if (tab === 'caregiver') {
            if (isCaregiverAuthenticated) {
                setActiveTab('caregiver');
            }
            else {
                setShowCaregiverLockModal(true);
            }
        }
        else {
            setActiveTab(tab);
        }
    };
    const handleCaregiverUnlockSuccess = () => {
        setIsCaregiverAuthenticated(true);
        setShowCaregiverLockModal(false);
        setActiveTab('caregiver');
    };
    const handleCaregiverUnlockCancel = () => {
        setShowCaregiverLockModal(false);
    };
    const handleExitCaregiver = () => {
        setIsCaregiverAuthenticated(false);
        setActiveTab('grid');
    };
    if (!isReady || settingsLoading) {
        return (_jsxs("div", { className: "w-full h-full h-[100dvh] bg-slate-950 flex flex-col items-center justify-center gap-3 text-white", children: [_jsx("div", { className: "w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" }), _jsx("p", { className: "text-sm font-bold text-slate-400", children: "Loading TalkWithDad AAC..." })] }));
    }
    return (_jsxs(MainContainer, { activeTab: activeTab, onTabChange: handleTabChange, children: [activeTab === 'grid' && (_jsx(CardGrid, { categories: categories, cards: cards, settings: settings })), activeTab === 'today' && _jsx(TodayOrientationView, {}), activeTab === 'scenes' && (_jsx(VisualSceneViewer, { scenes: visualScenes, hotspots: hotspots, debounceMs: settings.tapDebounceMs })), activeTab === 'pain' && _jsx(PainMapContainer, {}), activeTab === 'syllables' && (_jsx(SyllableVisualizerView, { categories: categories, cards: cards })), activeTab === 'therapy' && (_jsx(TherapySessionView, { categories: categories, cards: cards })), activeTab === 'keyboard' && _jsx(BigSpeechKeyboard, { cards: cards }), activeTab === 'caregiver' && isCaregiverAuthenticated && (_jsx(CaregiverDashboard, { categories: categories, cards: cards, settings: settings, onCloseCaregiverMode: handleExitCaregiver, onRefreshData: refreshDatabase })), showCaregiverLockModal && (_jsx(CaregiverHoldLockModal, { onSuccess: handleCaregiverUnlockSuccess, onCancel: handleCaregiverUnlockCancel })), syncToast && (_jsxs("div", { className: "fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-2xl flex items-center gap-2 border-2 border-emerald-400 animate-bounce", children: [_jsx(Check, { className: "w-4 h-4 stroke-[3]" }), _jsx("span", { children: syncToast })] }))] }));
};
export default App;
