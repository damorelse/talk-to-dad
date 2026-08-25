import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { wordPredictor } from '../../services/keyboard/wordPredictor.js';
import { DebouncedTouchable } from '../common/DebouncedTouchable.js';
import { Lightbulb } from 'lucide-react';
export const PredictiveWordBar = ({ currentText, cards, onSelectWord, }) => {
    // Extract last word prefix
    const words = currentText.trimEnd().split(/\s+/);
    const lastWord = currentText.endsWith(' ') ? '' : words[words.length - 1] || '';
    const predictions = wordPredictor.predict(lastWord, 6, cards);
    return (_jsxs("div", { className: "w-full bg-transparent border-0 p-1 flex items-center gap-2 overflow-x-auto select-none shrink-0 scrollbar-thin shadow-none", role: "region", "aria-label": "Predictive Word Bar", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-cyan-400 font-black text-xs px-2 shrink-0", children: [_jsx(Lightbulb, { className: "w-4 h-4" }), _jsx("span", { className: "hidden sm:inline", children: "PREDICTIONS:" })] }), _jsx("div", { className: "flex items-center gap-2 flex-1", children: predictions.map((word) => (_jsx(DebouncedTouchable, { onPress: () => onSelectWord(word), minTouchSize: "sm", debounceMs: 200, className: "px-4 py-2 bg-slate-800 hover:bg-cyan-600 hover:text-white active:bg-cyan-700 text-cyan-300 rounded-xl border border-cyan-500/40 text-sm sm:text-base font-black whitespace-nowrap shadow-md", "aria-label": `Predictive word: ${word}`, children: word }, word))) })] }));
};
