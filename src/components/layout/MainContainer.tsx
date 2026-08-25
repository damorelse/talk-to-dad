import React from 'react';
import { EmergencyBar } from './EmergencyBar';
import { NavigationBar } from './NavigationBar';
import { ActiveTab } from '../../types';

interface MainContainerProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  children: React.ReactNode;
}

export const MainContainer: React.FC<MainContainerProps> = ({
  activeTab,
  onTabChange,
  children,
}) => {
  return (
    <div
      className="w-full h-full h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 select-none transition-colors duration-200"
    >
      {/* Permanent Top Priority Emergency Bar */}
      <EmergencyBar />

      {/* Main Dynamic View Content */}
      <main className="flex-1 w-full overflow-hidden flex flex-col relative px-2 sm:px-3 pt-1 pb-2 sm:pb-3">
        {children}
      </main>

      {/* Main Navigation Bar */}
      <NavigationBar activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
};
