import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Check, X, AlertTriangle, Flame, Clock } from 'lucide-react';
import { DebouncedTouchable } from '../common/DebouncedTouchable.js';
import { useAudio } from '../../hooks/useAudio.js';
export const EmergencyBar = () => {
    const { speakBilingual, triggerEmergency } = useAudio();
    const emergencyButtons = [
        {
            id: 'yes',
            label: 'YES',
            labelZh: '好 / 是',
            spokenText: 'Yes.',
            spokenTextZh: '好，是的。',
            bgClass: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-emerald-900/30',
            textClass: 'text-white',
            icon: _jsx(Check, { className: "w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" }),
        },
        {
            id: 'no',
            label: 'NO',
            labelZh: '不要 / 不',
            spokenText: 'No.',
            spokenTextZh: '不要，不是。',
            bgClass: 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-rose-900/30',
            textClass: 'text-white',
            icon: _jsx(X, { className: "w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" }),
        },
        {
            id: 'wait',
            label: 'WAIT',
            labelZh: '等等',
            spokenText: 'Please wait, I need a minute.',
            spokenTextZh: '請等一下。',
            bgClass: 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-indigo-900/30',
            textClass: 'text-white font-bold',
            icon: _jsx(Clock, { className: "w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" }),
        },
        {
            id: 'toilet',
            label: 'TOILET',
            labelZh: '廁所',
            spokenText: 'I need to use the toilet immediately.',
            spokenTextZh: '我想上廁所。',
            bgClass: 'bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white shadow-cyan-900/30',
            textClass: 'text-white font-bold',
            icon: _jsx("span", { className: "text-lg sm:text-xl leading-none", children: "\uD83D\uDEBB" }),
        },
        {
            id: 'pain',
            label: 'PAIN',
            labelZh: '痛 / 難受',
            spokenText: 'I am in pain, please help me.',
            spokenTextZh: '我現在很痛，請幫幫我。',
            isUrgent: true,
            bgClass: 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white shadow-amber-900/30',
            textClass: 'text-white font-bold',
            icon: _jsx(Flame, { className: "w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" }),
        },
        {
            id: 'help',
            label: 'HELP',
            labelZh: '求助',
            spokenText: 'I need help right now!',
            spokenTextZh: '請幫幫我！',
            isUrgent: true,
            bgClass: 'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-red-900/40',
            textClass: 'text-white font-black',
            icon: _jsx(AlertTriangle, { className: "w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" }),
        },
    ];
    const handlePress = (btn) => {
        if (btn.isUrgent) {
            triggerEmergency(btn.spokenText, btn.spokenTextZh);
        }
        else {
            speakBilingual(btn.spokenText, btn.spokenTextZh);
        }
    };
    return (_jsx("header", { className: "w-full bg-slate-100 dark:bg-slate-950 px-2 sm:px-3 pt-1.5 pb-0.5 shrink-0 z-40 transition-colors", role: "region", "aria-label": "Permanent Emergency Quick Response Bar", children: _jsx("div", { className: "grid grid-cols-6 gap-1.5 sm:gap-2 w-full max-w-7xl mx-auto", children: emergencyButtons.map((btn) => (_jsxs(DebouncedTouchable, { onPress: () => handlePress(btn), debounceMs: 250, minTouchSize: "md", className: `
              flex flex-col items-center justify-center py-1 px-1 rounded-xl shadow-md border-2 border-white/20
              ${btn.bgClass}
            `, "aria-label": `Emergency quick response: ${btn.label} (${btn.labelZh})`, children: [_jsxs("div", { className: "flex items-center gap-0.5 sm:gap-1 leading-none", children: [btn.icon, _jsx("span", { className: "text-xs sm:text-sm md:text-base font-black tracking-wider uppercase leading-none", children: btn.label })] }), _jsx("span", { className: "text-xs sm:text-sm font-black opacity-95 tracking-tight leading-tight mt-0.5", children: btn.labelZh })] }, btn.id))) }) }));
};
