import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Star } from 'lucide-react';
import { getSyllableBreakdownWithIpa } from '../../services/syllables/syllableSplitter.js';
export const SyllableCard = ({ word, activeSyllableIndex = null, syllableData, onSyllableClick, showIpa = true, showStress = true, }) => {
    const syllables = syllableData && syllableData.length > 0
        ? syllableData
        : getSyllableBreakdownWithIpa(word);
    return (_jsx("div", { role: "region", "aria-label": `Syllable breakdown for ${word}`, className: "flex items-center justify-center flex-wrap gap-3 sm:gap-4 p-1 select-none", children: syllables.map((syl, idx) => {
            const isActive = activeSyllableIndex === idx;
            const isPrimaryStress = syl.stress === 'primary';
            const isSecondaryStress = syl.stress === 'secondary';
            return (_jsx(React.Fragment, { children: _jsxs("button", { type: "button", onClick: () => onSyllableClick?.(syl.text, idx, syl), "aria-label": `Syllable ${idx + 1}: ${syl.text}, IPA: ${syl.ipa}, Stress: ${syl.stress}`, "aria-current": isActive ? 'true' : undefined, className: `
                group relative flex flex-col items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4.5 rounded-2xl
                transition-all duration-200 cursor-pointer min-h-[95px] sm:min-h-[115px] min-w-[90px] sm:min-w-[110px]
                border-2 sm:border-3 shadow-md focus:outline-none focus:ring-4 focus:ring-amber-400
                ${isActive
                        ? 'bg-amber-400 text-slate-950 border-amber-200 scale-105 shadow-2xl shadow-amber-400/40 ring-4 ring-amber-400/60 z-10 font-black'
                        : isPrimaryStress
                            ? 'bg-slate-800 hover:bg-slate-700 text-blue-200 border-amber-500/80 hover:border-amber-400'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600'}
              `, children: [showStress && (_jsxs("div", { className: "absolute top-1.5 right-1.5 flex items-center gap-0.5", children: [isPrimaryStress && (_jsxs("span", { title: "Primary Stress", className: `
                        text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full flex items-center gap-0.5
                        ${isActive ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}
                      `, children: [_jsx(Star, { className: "w-2.5 h-2.5 fill-current" }), _jsx("span", { children: "Stress" })] })), isSecondaryStress && (_jsx("span", { title: "Secondary Stress", className: `
                        text-[9px] font-bold uppercase px-1 py-0.5 rounded-full
                        ${isActive ? 'bg-slate-950 text-slate-300' : 'bg-slate-800 text-slate-400'}
                      `, children: "2nd" }))] })), _jsx("span", { className: `
                  font-black text-3xl sm:text-5xl md:text-6xl tracking-wide transition-transform py-1
                  ${isActive ? 'scale-105 text-slate-950' : 'text-white'}
                `, children: syl.text }), showIpa && syl.ipa && (_jsx("span", { className: `
                    text-sm sm:text-base font-bold tracking-widest leading-tight
                    ${isActive ? 'text-slate-950 font-black' : 'text-amber-300'}
                  `, children: syl.ipa }))] }) }, `${syl.text}-${idx}`));
        }) }));
};
