import React, { useRef, useEffect } from 'react';
import {
  LayoutGrid,
  Compass,
  Image as ImageIcon,
  PersonStanding,
  MessageSquareQuote,
  Sparkles,
  Keyboard as KeyboardIcon,
  Settings as SettingsIcon,
} from 'lucide-react';
import { ActiveTab, TAB_METADATA } from '../../types';
import { DebouncedTouchable } from '../common/DebouncedTouchable';

interface NavigationBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const activeTabRef = useRef<HTMLDivElement | null>(null);

  const tabs: {
    id: ActiveTab;
    label: string;
    labelZh: string;
    icon: React.ReactNode;
    activeBg: string;
    activeText: string;
    activeBorder: string;
  }[] = [
    {
      id: 'grid',
      label: TAB_METADATA.grid.label,
      labelZh: TAB_METADATA.grid.labelZh,
      icon: <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />,
      activeBg: 'bg-blue-600',
      activeText: 'text-white',
      activeBorder: 'border-blue-400 shadow-blue-500/30',
    },
    {
      id: 'today',
      label: TAB_METADATA.today.label,
      labelZh: TAB_METADATA.today.labelZh,
      icon: <Compass className="w-5 h-5 sm:w-6 sm:h-6" />,
      activeBg: 'bg-indigo-600',
      activeText: 'text-white',
      activeBorder: 'border-indigo-400 shadow-indigo-500/30',
    },
    {
      id: 'scenes',
      label: TAB_METADATA.scenes.label,
      labelZh: TAB_METADATA.scenes.labelZh,
      icon: <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      activeBg: 'bg-emerald-600',
      activeText: 'text-white',
      activeBorder: 'border-emerald-400 shadow-emerald-500/30',
    },
    {
      id: 'pain',
      label: TAB_METADATA.pain.label,
      labelZh: TAB_METADATA.pain.labelZh,
      icon: <PersonStanding className="w-5 h-5 sm:w-6 sm:h-6" />,
      activeBg: 'bg-rose-600',
      activeText: 'text-white',
      activeBorder: 'border-rose-400 shadow-rose-500/30',
    },
    {
      id: 'syllables',
      label: TAB_METADATA.syllables.label,
      labelZh: TAB_METADATA.syllables.labelZh,
      icon: <MessageSquareQuote className="w-5 h-5 sm:w-6 sm:h-6" />,
      activeBg: 'bg-amber-600',
      activeText: 'text-white',
      activeBorder: 'border-amber-400 shadow-amber-500/30',
    },
    {
      id: 'therapy',
      label: TAB_METADATA.therapy.label,
      labelZh: TAB_METADATA.therapy.labelZh,
      icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />,
      activeBg: 'bg-purple-600',
      activeText: 'text-white',
      activeBorder: 'border-purple-400 shadow-purple-500/30',
    },
    {
      id: 'keyboard',
      label: TAB_METADATA.keyboard.label,
      labelZh: TAB_METADATA.keyboard.labelZh,
      icon: <KeyboardIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      activeBg: 'bg-cyan-600',
      activeText: 'text-white',
      activeBorder: 'border-cyan-400 shadow-cyan-500/30',
    },
    {
      id: 'caregiver',
      label: TAB_METADATA.caregiver.label,
      labelZh: TAB_METADATA.caregiver.labelZh,
      icon: <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      activeBg: 'bg-pink-600',
      activeText: 'text-white',
      activeBorder: 'border-pink-400 shadow-pink-500/30',
    },
  ];

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeTab]);

  return (
    <nav
      className="w-full bg-slate-200/95 dark:bg-slate-900/95 backdrop-blur border-t-2 border-slate-300 dark:border-slate-800 shrink-0 z-30 select-none shadow-lg transition-colors"
      role="navigation"
      aria-label="Main Application Navigation Tabs"
    >
      <div className="w-full max-w-7xl mx-auto overflow-x-auto py-2 px-2.5 sm:px-4 scrollbar-none flex items-center justify-start lg:justify-around gap-2 sm:gap-2.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              className="shrink-0 flex-1 min-w-[110px] sm:min-w-[125px] max-w-[180px]"
            >
              <DebouncedTouchable
                onPress={() => onTabChange(tab.id)}
                minTouchSize="lg"
                debounceMs={200}
                className={`
                  w-full min-h-[50px] sm:min-h-[56px] flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl
                  border-2 transition-all duration-150 shadow-md cursor-pointer
                  ${
                    isActive
                      ? `${tab.activeBg} ${tab.activeText} ${tab.activeBorder} scale-100 ring-2 ring-white/40 shadow-lg font-black`
                      : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }
                `}
                aria-label={`Switch to ${tab.label} tab`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className={`${isActive ? 'scale-110 drop-shadow' : 'opacity-85'} transition-transform`}>
                  {tab.icon}
                </div>
                <span className="text-xs sm:text-sm font-black tracking-tight mt-0.5 whitespace-nowrap">
                  {tab.label}
                </span>
              </DebouncedTouchable>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
