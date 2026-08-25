import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useRef, useEffect } from 'react';
import { LayoutGrid, Compass, Image as ImageIcon, PersonStanding, MessageSquareQuote, Sparkles, Keyboard as KeyboardIcon, Settings as SettingsIcon, } from 'lucide-react';
import { DebouncedTouchable } from '../common/DebouncedTouchable.js';
export const NavigationBar = ({ activeTab, onTabChange, }) => {
    const activeTabRef = useRef(null);
    const tabs = [
        {
            id: 'grid',
            label: 'Cards',
            labelZh: '圖卡溝通',
            icon: _jsx(LayoutGrid, { className: "w-5 h-5 sm:w-6 sm:h-6" }),
            activeBg: 'bg-blue-600',
            activeText: 'text-white',
            activeBorder: 'border-blue-400 shadow-blue-500/30',
        },
        {
            id: 'today',
            label: 'Today',
            labelZh: '今天時空',
            icon: _jsx(Compass, { className: "w-5 h-5 sm:w-6 sm:h-6" }),
            activeBg: 'bg-indigo-600',
            activeText: 'text-white',
            activeBorder: 'border-indigo-400 shadow-indigo-500/30',
        },
        {
            id: 'scenes',
            label: 'Scenes',
            labelZh: '實景照片',
            icon: _jsx(ImageIcon, { className: "w-5 h-5 sm:w-6 sm:h-6" }),
            activeBg: 'bg-emerald-600',
            activeText: 'text-white',
            activeBorder: 'border-emerald-400 shadow-emerald-500/30',
        },
        {
            id: 'pain',
            label: 'Pain Map',
            labelZh: '疼痛標示',
            icon: _jsx(PersonStanding, { className: "w-5 h-5 sm:w-6 sm:h-6" }),
            activeBg: 'bg-rose-600',
            activeText: 'text-white',
            activeBorder: 'border-rose-400 shadow-rose-500/30',
        },
        {
            id: 'syllables',
            label: 'Sound It Out',
            labelZh: '分段發音',
            icon: _jsx(MessageSquareQuote, { className: "w-5 h-5 sm:w-6 sm:h-6" }),
            activeBg: 'bg-amber-600',
            activeText: 'text-white',
            activeBorder: 'border-amber-400 shadow-amber-500/30',
        },
        {
            id: 'therapy',
            label: 'Word Finding',
            labelZh: '找字練習',
            icon: _jsx(Sparkles, { className: "w-5 h-5 sm:w-6 sm:h-6" }),
            activeBg: 'bg-purple-600',
            activeText: 'text-white',
            activeBorder: 'border-purple-400 shadow-purple-500/30',
        },
        {
            id: 'keyboard',
            label: 'Speech Keys',
            labelZh: '語音鍵盤',
            icon: _jsx(KeyboardIcon, { className: "w-5 h-5 sm:w-6 sm:h-6" }),
            activeBg: 'bg-cyan-600',
            activeText: 'text-white',
            activeBorder: 'border-cyan-400 shadow-cyan-500/30',
        },
        {
            id: 'caregiver',
            label: 'Settings',
            labelZh: '系統設定',
            icon: _jsx(SettingsIcon, { className: "w-5 h-5 sm:w-6 sm:h-6" }),
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
    return (_jsx("nav", { className: "w-full bg-slate-200/95 dark:bg-slate-900/95 backdrop-blur border-t-2 border-slate-300 dark:border-slate-800 shrink-0 z-30 select-none shadow-lg transition-colors", role: "navigation", "aria-label": "Main Application Navigation Tabs", children: _jsx("div", { className: "w-full max-w-7xl mx-auto overflow-x-auto py-2 px-2.5 sm:px-4 scrollbar-none flex items-center justify-start lg:justify-around gap-2 sm:gap-2.5", children: tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (_jsx("div", { ref: isActive ? activeTabRef : null, className: "shrink-0 flex-1 min-w-[110px] sm:min-w-[125px] max-w-[180px]", children: _jsxs(DebouncedTouchable, { onPress: () => onTabChange(tab.id), minTouchSize: "lg", debounceMs: 200, className: `
                  w-full min-h-[50px] sm:min-h-[56px] flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl
                  border-2 transition-all duration-150 shadow-md cursor-pointer
                  ${isActive
                            ? `${tab.activeBg} ${tab.activeText} ${tab.activeBorder} scale-100 ring-2 ring-white/40 shadow-lg font-black`
                            : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}
                `, "aria-label": `Switch to ${tab.label} tab`, "aria-current": isActive ? 'page' : undefined, children: [_jsx("div", { className: `${isActive ? 'scale-110 drop-shadow' : 'opacity-85'} transition-transform`, children: tab.icon }), _jsx("span", { className: "text-xs sm:text-sm font-black tracking-tight mt-0.5 whitespace-nowrap", children: tab.label })] }) }, tab.id));
            }) }) }));
};
