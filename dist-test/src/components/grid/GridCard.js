import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { FITZGERALD_COLOR_MAP } from '../../types/index.js';
import { DebouncedTouchable } from '../common/DebouncedTouchable.js';
export const GridCard = ({ card, onSelect, debounceMs = 300, isSelected = false, fontSize = 'large', }) => {
    const fitzgerald = FITZGERALD_COLOR_MAP[card.fitzgeraldCategory] || FITZGERALD_COLOR_MAP.nouns;
    const enFontClasses = {
        standard: 'text-sm sm:text-base font-bold',
        large: 'text-base sm:text-lg md:text-xl font-bold',
        'extra-large': 'text-lg sm:text-xl md:text-2xl font-black',
    }[fontSize];
    const zhFontClasses = {
        standard: 'text-sm sm:text-base md:text-lg font-black',
        large: 'text-base sm:text-lg md:text-xl font-black',
        'extra-large': 'text-lg sm:text-xl md:text-2xl font-black',
    }[fontSize];
    return (_jsxs(DebouncedTouchable, { onPress: () => onSelect(card), debounceMs: debounceMs, minTouchSize: "lg", className: `
        w-full h-full min-h-[145px] flex flex-col items-center justify-between pt-1 pb-2 sm:pt-1.5 sm:pb-2.5 px-2 sm:px-2.5 rounded-2xl
        border-4 ${fitzgerald.border} ${fitzgerald.bg}
        shadow-lg transition-all duration-150 relative overflow-hidden group
        ${isSelected ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-slate-900 scale-95' : ''}
      `, "aria-label": `AAC Card: ${card.label}. Spoken: ${card.spokenText}`, children: [card.audioBlobId && (_jsx("span", { className: "absolute top-2 right-2 text-xs bg-purple-600 text-white font-bold px-1.5 py-0.5 rounded-full shadow", title: "Custom family voice recording", children: "\uD83C\uDF99\uFE0F Voice" })), _jsx("div", { className: "flex-1 flex items-center justify-center mt-0 mb-1", children: _jsx("span", { className: "text-4xl sm:text-5xl md:text-6xl drop-shadow-md select-none", children: card.icon || '💬' }) }), _jsxs("div", { className: "w-full text-center flex flex-col items-center justify-center px-1 shrink-0", children: [_jsx("span", { className: `${enFontClasses} ${fitzgerald.text} leading-tight line-clamp-1`, children: card.label }), card.labelZh && (_jsx("span", { className: `${zhFontClasses} text-slate-900 dark:text-slate-100 font-black leading-tight tracking-wide drop-shadow-sm line-clamp-1 mt-0.5`, children: card.labelZh }))] })] }));
};
