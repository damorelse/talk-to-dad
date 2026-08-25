import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { BodyMapSvg, BODY_REGIONS } from './BodyMapSvg.js';
import { FacesScale, WONG_BAKER_PAIN_LEVELS } from './FacesScale.js';
import { DebouncedTouchable } from '../common/DebouncedTouchable.js';
import { useAudio } from '../../hooks/useAudio.js';
import { Volume2, AlertTriangle, RotateCcw } from 'lucide-react';
export const PainMapContainer = () => {
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedPainLevel, setSelectedPainLevel] = useState(null);
    const { speakPainReport, triggerEmergency } = useAudio();
    const activeRegionDef = BODY_REGIONS.find((r) => r.id === selectedRegion);
    const activePainDef = WONG_BAKER_PAIN_LEVELS.find((p) => p.level === selectedPainLevel);
    // Generate composite clinical speech sentence
    const buildPainSentence = () => {
        if (!activeRegionDef && selectedPainLevel === null) {
            return 'I am experiencing pain.';
        }
        if (activeRegionDef && selectedPainLevel === null) {
            return `My ${activeRegionDef.name.toLowerCase()} hurts.`;
        }
        if (!activeRegionDef && activePainDef) {
            return `I have pain rating ${activePainDef.level} out of 10, ${activePainDef.label.toLowerCase()}.`;
        }
        if (activeRegionDef && activePainDef) {
            return `My ${activeRegionDef.name.toLowerCase()} ${activePainDef.label.toLowerCase()}, pain level ${activePainDef.level} out of 10.`;
        }
        return 'I am having pain, please check.';
    };
    const buildPainSentenceZh = () => {
        if (!activeRegionDef && selectedPainLevel === null) {
            return '我覺得痛。';
        }
        if (activeRegionDef && selectedPainLevel === null) {
            return `我的${activeRegionDef.nameZh}痛。`;
        }
        if (!activeRegionDef && activePainDef) {
            return `我的疼痛指數是 ${activePainDef.level} 分（${activePainDef.labelZh}）。`;
        }
        if (activeRegionDef && activePainDef) {
            return `我的${activeRegionDef.nameZh}${activePainDef.labelZh}，疼痛指數 ${activePainDef.level} 分。`;
        }
        return '我身體不舒服覺得痛，請幫我確認。';
    };
    const handleSpeakReport = () => {
        speakPainReport(buildPainSentence(), buildPainSentenceZh());
    };
    const handleUrgentAlert = () => {
        const text = `Urgent medical alert! ${buildPainSentence()} Please assist me immediately!`;
        const textZh = `緊急醫療警報！${buildPainSentenceZh()}請立刻前來協助！`;
        triggerEmergency(text, textZh);
    };
    const handleReset = () => {
        setSelectedRegion(null);
        setSelectedPainLevel(null);
    };
    return (_jsxs("div", { className: "w-full h-full flex flex-col lg:flex-row gap-3 overflow-y-auto p-1 select-none scrollbar-thin", children: [_jsxs("div", { className: "flex-1 lg:flex-[1.08] bg-slate-900 border-2 border-slate-700 rounded-3xl p-4 flex flex-col items-center justify-between shadow-xl min-w-0", children: [_jsx("div", { className: "w-full text-center px-2 mb-1", children: _jsx("span", { className: "text-sm sm:text-base font-bold text-slate-200 uppercase tracking-wider", children: "1. Tap Where It Hurts \u00B7 \u9EDE\u9078\u75BC\u75DB\u90E8\u4F4D" }) }), _jsxs("div", { className: "w-full flex-1 flex flex-row items-stretch justify-center gap-2.5 sm:gap-3.5 my-1 min-h-0", children: [_jsxs("div", { className: "flex-1 min-h-[300px] max-h-[380px] flex flex-col items-center justify-between bg-slate-950/70 rounded-2xl p-2 sm:p-2.5 border border-slate-800 shadow-inner overflow-hidden", children: [_jsx("span", { className: "text-xs font-black uppercase tracking-wider text-blue-400 mb-0.5 shrink-0 z-10", children: "Front \u00B7 \u6B63\u9762" }), _jsx(BodyMapSvg, { orientation: "front", selectedRegion: selectedRegion, onSelectRegion: (r) => setSelectedRegion(r) })] }), _jsxs("div", { className: "flex-1 min-h-[300px] max-h-[380px] flex flex-col items-center justify-between bg-slate-950/70 rounded-2xl p-2 sm:p-2.5 border border-slate-800 shadow-inner overflow-hidden", children: [_jsx("span", { className: "text-xs font-black uppercase tracking-wider text-purple-400 mb-0.5 shrink-0 z-10", children: "Back \u00B7 \u80CC\u9762" }), _jsx(BodyMapSvg, { orientation: "back", selectedRegion: selectedRegion, onSelectRegion: (r) => setSelectedRegion(r) })] })] }), _jsxs("div", { className: "w-full text-center py-1.5 mt-1 bg-slate-950/80 rounded-xl border border-slate-800/80 px-3 flex items-center justify-center gap-1.5", children: [_jsx("span", { className: "text-xs font-semibold text-slate-400", children: "Selected:" }), _jsx("span", { className: `text-xs sm:text-sm font-bold ${activeRegionDef ? 'text-yellow-400' : 'text-slate-500'}`, children: activeRegionDef ? `${activeRegionDef.name} (${activeRegionDef.nameZh})` : 'None (無)' })] })] }), _jsxs("div", { className: "flex-1 bg-slate-900 border-2 border-slate-700 rounded-3xl p-4 flex flex-col justify-between shadow-xl gap-3", children: [_jsx(FacesScale, { selectedPainLevel: selectedPainLevel, onSelectPainLevel: (l) => setSelectedPainLevel(l) }), _jsxs("div", { className: "w-full flex flex-col gap-2 mt-auto", children: [_jsxs("div", { className: "w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-3.5 flex flex-col gap-1.5 shadow-inner", children: [_jsxs("p", { className: "text-base sm:text-xl font-bold text-amber-300 tracking-wide leading-snug", children: ["\"", buildPainSentence(), "\""] }), _jsxs("p", { className: "text-base sm:text-xl font-bold text-white tracking-wide leading-snug pt-1 border-t border-slate-800/80", children: ["\u300C", buildPainSentenceZh(), "\u300D"] })] }), _jsxs("div", { className: "w-full flex flex-col sm:flex-row items-stretch gap-2", children: [_jsxs(DebouncedTouchable, { onPress: handleSpeakReport, minTouchSize: "md", className: "flex-1 w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white py-2.5 px-4 rounded-xl sm:rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 text-sm sm:text-base", "aria-label": "Speak pain report aloud", children: [_jsx(Volume2, { className: "w-5 h-5 stroke-[2.5]" }), _jsx("span", { children: "Speak" })] }), (selectedPainLevel !== null && selectedPainLevel >= 8) && (_jsxs(DebouncedTouchable, { onPress: handleUrgentAlert, minTouchSize: "md", className: "flex-1 w-full bg-red-600 hover:bg-red-500 active:bg-red-700 text-white py-2.5 px-4 rounded-xl sm:rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-red-900/50 animate-pulse text-sm sm:text-base", "aria-label": "Trigger urgent severe pain emergency alert", children: [_jsx(AlertTriangle, { className: "w-5 h-5 stroke-[2.5]" }), _jsx("span", { children: "Urgent Alert!" })] })), _jsxs(DebouncedTouchable, { onPress: handleReset, minTouchSize: "md", className: "bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-300 py-2.5 px-4 rounded-xl sm:rounded-2xl border border-slate-700 flex items-center justify-center gap-2 shadow-md shrink-0 text-sm sm:text-base font-bold", "aria-label": "Reset pain selection", title: "Reset", children: [_jsx(RotateCcw, { className: "w-5 h-5 stroke-[2.5]" }), _jsx("span", { children: "Reset" })] })] })] })] })] }));
};
