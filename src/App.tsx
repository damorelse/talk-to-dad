import React, { useState, useEffect, useRef } from 'react';
import { ActiveTab } from './types';
import { useDatabase } from './hooks/useDatabase';
import { useSettings } from './hooks/useSettings';
import { syncGoogleSheetOnStartup } from './services/googleSheets/googleSheetsAutoSync';
import { MainContainer } from './components/layout/MainContainer';
import { CardGrid } from './components/grid/CardGrid';
import { VisualSceneViewer } from './components/visualScene/VisualSceneViewer';
import { PainMapContainer } from './components/painMap/PainMapContainer';
import { TodayOrientationView } from './components/today/TodayOrientationView';
import { SyllableVisualizerView } from './components/syllable/SyllableVisualizerView';
import { TherapySessionView } from './components/therapy/TherapySessionView';
import { BigSpeechKeyboard } from './components/keyboard/BigSpeechKeyboard';
import { CaregiverDashboard } from './components/caregiver/CaregiverDashboard';
import { CaregiverHoldLockModal } from './components/caregiver/CaregiverHoldLockModal';
import { speechEngine } from './services/audio/WebSpeechEngine';
import { piperTTSService } from './services/syllables/piperTTSService';
import { Check } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('grid');
  const [isCaregiverAuthenticated, setIsCaregiverAuthenticated] = useState<boolean>(false);
  const [showCaregiverLockModal, setShowCaregiverLockModal] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const {
    isReady,
    categories,
    cards,
    visualScenes,
    hotspots,
    refreshDatabase,
  } = useDatabase();

  const { settings, loading: settingsLoading } = useSettings();
  const syncExecutedRef = useRef<boolean>(false);

  // Automatic Google Sheet import on initial page load
  useEffect(() => {
    if (!isReady || syncExecutedRef.current) return;
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

  const handleTabChange = (tab: ActiveTab) => {
    speechEngine.cancel();
    piperTTSService.stop();
    if (tab === 'caregiver') {
      if (isCaregiverAuthenticated) {
        setActiveTab('caregiver');
      } else {
        setShowCaregiverLockModal(true);
      }
    } else {
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
    return (
      <div className="w-full h-full h-[100dvh] bg-slate-950 flex flex-col items-center justify-center gap-3 text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-400">Loading Talk With Dad AAC...</p>
      </div>
    );
  }

  return (
    <MainContainer
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      {/* 1. AAC Grid View */}
      {activeTab === 'grid' && (
        <CardGrid
          categories={categories}
          cards={cards}
          settings={settings}
        />
      )}

      {/* 2. Today & Daily Orientation View */}
      {activeTab === 'today' && <TodayOrientationView />}

      {/* 3. Visual Scene Displays View */}
      {activeTab === 'scenes' && (
        <VisualSceneViewer
          scenes={visualScenes}
          hotspots={hotspots}
          debounceMs={settings.tapDebounceMs}
        />
      )}

      {/* 3. Pain Map & Body Silhouette View */}
      {activeTab === 'pain' && <PainMapContainer />}

      {/* 4. Phonetic Syllable Visualizer View */}
      {activeTab === 'syllables' && (
        <SyllableVisualizerView
          categories={categories}
          cards={cards}
        />
      )}

      {/* 5. Speech Therapy Rehabilitation View */}
      {activeTab === 'therapy' && (
        <TherapySessionView
          categories={categories}
          cards={cards}
        />
      )}

      {/* 6. Speech Virtual Keyboard View */}
      {activeTab === 'keyboard' && <BigSpeechKeyboard cards={cards} />}

      {/* 7. Caregiver Management View */}
      {activeTab === 'caregiver' && isCaregiverAuthenticated && (
        <CaregiverDashboard
          categories={categories}
          cards={cards}
          settings={settings}
          onCloseCaregiverMode={handleExitCaregiver}
          onRefreshData={refreshDatabase}
        />
      )}

      {/* Caregiver 3-Second Hold Authentication Modal */}
      {showCaregiverLockModal && (
        <CaregiverHoldLockModal
          onSuccess={handleCaregiverUnlockSuccess}
          onCancel={handleCaregiverUnlockCancel}
        />
      )}

      {/* Startup Auto-Sync Floating Notification */}
      {syncToast && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-2xl flex items-center gap-2 border-2 border-emerald-400 animate-bounce">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{syncToast}</span>
        </div>
      )}
    </MainContainer>
  );
};

export default App;
