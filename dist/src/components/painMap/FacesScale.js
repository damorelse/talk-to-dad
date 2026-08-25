import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { DebouncedTouchable } from '../common/DebouncedTouchable.js';
import { WONG_BAKER_PAIN_LEVELS } from '../../types/painData.js';
export { WONG_BAKER_PAIN_LEVELS };
export const FacesScale = ({ selectedPainLevel, onSelectPainLevel, debounceMs = 250, }) => {
    return (_jsxs("div", { className: "w-full flex flex-col gap-2 select-none", children: [_jsx("div", { className: "flex items-center justify-between px-1", children: _jsx("span", { className: "text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider", children: "2. How Much Does It Hurt? \u00B7 \u75BC\u75DB\u7A0B\u5EA6" }) }), _jsx("div", { className: "grid grid-cols-3 sm:grid-cols-6 gap-2 w-full", children: WONG_BAKER_PAIN_LEVELS.map((item) => {
                    const isSelected = selectedPainLevel === item.level;
                    return (_jsxs(DebouncedTouchable, { onPress: () => onSelectPainLevel(item.level), debounceMs: debounceMs, minTouchSize: "md", className: `
                flex flex-col items-center justify-between p-2 rounded-2xl border-4 transition-all duration-150
                ${item.bgClass} ${item.borderClass}
                ${isSelected
                            ? 'ring-4 ring-yellow-400 scale-105 shadow-2xl z-10 brightness-125'
                            : 'opacity-85 hover:opacity-100'}
              `, "aria-label": `Pain rating ${item.level}: ${item.label}`, "aria-pressed": isSelected, children: [_jsx("span", { className: "text-3xl sm:text-4xl drop-shadow-md my-0.5 select-none", children: item.emoji }), _jsx("span", { className: "text-lg sm:text-xl font-black text-white", children: item.level }), _jsxs("div", { className: "flex flex-col items-center justify-center text-center", children: [_jsx("span", { className: `text-xs sm:text-sm font-black leading-tight ${item.colorClass}`, children: item.label }), _jsx("span", { className: "text-xs sm:text-sm text-slate-100 font-extrabold leading-tight mt-0.5", children: item.labelZh })] })] }, item.level));
                }) })] }));
};
