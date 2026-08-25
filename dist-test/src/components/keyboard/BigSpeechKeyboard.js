import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { PredictiveWordBar } from './PredictiveWordBar.js';
import { DebouncedTouchable } from '../common/DebouncedTouchable.js';
import { useAudio } from '../../hooks/useAudio.js';
import { wordPredictor } from '../../services/keyboard/wordPredictor.js';
import { Volume2, Delete, Trash2, Space } from 'lucide-react';
export const BigSpeechKeyboard = ({ cards }) => {
    const [text, setText] = useState('');
    const { speakText, isSpeaking } = useAudio();
    const handleKeyPress = (char) => {
        setText((prev) => prev + char);
    };
    const handleBackspace = () => {
        setText((prev) => prev.slice(0, -1));
    };
    const handleClear = () => {
        setText('');
    };
    const handleSpace = () => {
        setText((prev) => (prev.endsWith(' ') ? prev : prev + ' '));
    };
    const handleSelectPredictedWord = (word) => {
        wordPredictor.recordUsage(word);
        setText((prev) => {
            const trimmedEnd = prev.trimEnd();
            const lastSpaceIndex = trimmedEnd.lastIndexOf(' ');
            if (lastSpaceIndex === -1) {
                return word + ' ';
            }
            return trimmedEnd.substring(0, lastSpaceIndex + 1) + word + ' ';
        });
    };
    const handleSpeakAloud = () => {
        if (!text.trim())
            return;
        speakText(text);
    };
    const keyboardRows = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '?'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '!'],
    ];
    return (_jsxs("div", { className: "w-full h-full flex flex-col gap-2.5 overflow-hidden select-none p-1", children: [_jsxs("div", { className: "w-full bg-slate-900 border-2 border-slate-700 rounded-2xl p-3 flex items-center justify-between gap-3 shrink-0 shadow-lg min-h-[76px]", children: [_jsx("div", { className: "flex-1 overflow-x-auto text-xl sm:text-2xl md:text-3xl font-black text-white px-2 py-1 scrollbar-thin", children: text || (_jsx("span", { className: "text-slate-500 font-normal italic text-lg sm:text-xl", children: "Type or tap predictive words to speak..." })) }), _jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [_jsxs(DebouncedTouchable, { onPress: handleSpeakAloud, disabled: !text.trim() || isSpeaking, minTouchSize: "md", className: "bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white px-4 py-2.5 rounded-xl font-black flex items-center gap-2 shadow-md shadow-cyan-900/40 text-sm sm:text-base", "aria-label": "Speak typed message", children: [_jsx(Volume2, { className: "w-5 h-5 stroke-[2.5]" }), _jsx("span", { children: "Speak" })] }), _jsx(DebouncedTouchable, { onPress: handleClear, disabled: !text, minTouchSize: "md", className: "bg-rose-950 hover:bg-rose-900 text-rose-300 p-2.5 rounded-xl border border-rose-800", "aria-label": "Clear typed text", children: _jsx(Trash2, { className: "w-5 h-5" }) })] })] }), _jsx(PredictiveWordBar, { currentText: text, cards: cards, onSelectWord: handleSelectPredictedWord }), _jsxs("div", { className: "flex-1 w-full bg-slate-900 border-2 border-slate-700 rounded-3xl p-2 sm:p-3 flex flex-col justify-between gap-2 shadow-xl overflow-hidden", children: [keyboardRows.map((row, rowIdx) => (_jsx("div", { className: "flex items-center justify-center gap-1.5 sm:gap-2 flex-1 w-full", children: row.map((keyChar) => (_jsx(DebouncedTouchable, { onPress: () => handleKeyPress(keyChar), minTouchSize: "md", debounceMs: 150, className: "flex-1 h-full max-h-[64px] bg-slate-800 hover:bg-slate-700 active:bg-blue-600 active:text-white text-slate-100 rounded-xl border-2 border-slate-700 text-lg sm:text-2xl font-black shadow-md flex items-center justify-center", "aria-label": `Key ${keyChar}`, children: keyChar }, keyChar))) }, rowIdx))), _jsxs("div", { className: "flex items-center justify-center gap-2 flex-1 w-full max-h-[64px]", children: [_jsxs(DebouncedTouchable, { onPress: handleBackspace, minTouchSize: "md", className: "w-24 sm:w-32 h-full bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-amber-300 rounded-xl border-2 border-slate-700 flex items-center justify-center gap-1 font-bold text-sm sm:text-base shadow-md", "aria-label": "Backspace", children: [_jsx(Delete, { className: "w-5 h-5" }), _jsx("span", { className: "hidden sm:inline", children: "Delete" })] }), _jsxs(DebouncedTouchable, { onPress: handleSpace, minTouchSize: "md", className: "flex-1 h-full bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 rounded-xl border-2 border-slate-700 flex items-center justify-center gap-2 font-black text-sm sm:text-base shadow-md", "aria-label": "Space bar", children: [_jsx(Space, { className: "w-6 h-6" }), _jsx("span", { children: "SPACE" })] }), _jsx(DebouncedTouchable, { onPress: () => handleKeyPress('. '), minTouchSize: "md", className: "w-16 sm:w-20 h-full bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 rounded-xl border-2 border-slate-700 flex items-center justify-center font-black text-lg shadow-md", "aria-label": "Period and Space", children: "." })] })] })] }));
};
