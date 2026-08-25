import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useMemo } from 'react';
import { FlashcardDeck } from './FlashcardDeck.js';
import { CategorySelector } from '../grid/CategorySelector.js';
import { DebouncedTouchable } from '../common/DebouncedTouchable.js';
import { useAudio } from '../../hooks/useAudio.js';
import { useSettings } from '../../hooks/useSettings.js';
import { selectWeeklyCards } from '../../services/therapy/weeklyCardSelector.js';
import { CheckCircle2, ChevronRight, ChevronLeft, RotateCcw, Trophy, Award, Volume2, } from 'lucide-react';
export const TherapySessionView = ({ categories, cards, }) => {
    const [selectedCategoryId, setSelectedCategoryId] = useState('favorites');
    const [cardIndex, setCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [celebrationActive, setCelebrationActive] = useState(false);
    const { playSuccess, speakBilingual } = useAudio();
    const categoryCards = useMemo(() => {
        if (selectedCategoryId === 'favorites') {
            return cards.filter((c) => c.isFavorite);
        }
        return cards.filter((c) => c.categoryId === selectedCategoryId);
    }, [cards, selectedCategoryId]);
    const { settings } = useSettings();
    const weeklyCount = settings?.weeklyFocusCardsPerCategory ?? 2;
    const weeklyCards = useMemo(() => {
        return selectWeeklyCards(categoryCards, selectedCategoryId, undefined, weeklyCount);
    }, [categoryCards, selectedCategoryId, weeklyCount]);
    const currentCard = weeklyCards[cardIndex] || weeklyCards[0];
    const handleSelectCategory = (catId) => {
        setSelectedCategoryId(catId);
        setCardIndex(0);
        setIsFlipped(false);
    };
    const handleSpeak = () => {
        if (!currentCard)
            return;
        if (isFlipped) {
            speakBilingual(currentCard.label, currentCard.labelZh);
        }
        else {
            const clueText = currentCard.clue || currentCard.spokenText || currentCard.label;
            const clueTextZh = currentCard.clueZh || currentCard.spokenTextZh || currentCard.labelZh;
            speakBilingual(clueText, clueTextZh);
        }
    };
    const handleCorrect = () => {
        // Play 1046Hz success fanfare
        playSuccess();
        setCorrectCount((c) => c + 1);
        setCelebrationActive(true);
        if (!isFlipped) {
            setIsFlipped(true);
        }
        setTimeout(() => {
            setCelebrationActive(false);
            // Auto-advance to next card if available
            if (cardIndex < weeklyCards.length - 1) {
                setCardIndex((i) => i + 1);
                setIsFlipped(false);
            }
        }, 1200);
    };
    const handleNext = () => {
        if (cardIndex < weeklyCards.length - 1) {
            setCardIndex((i) => i + 1);
            setIsFlipped(false);
        }
    };
    const handlePrev = () => {
        if (cardIndex > 0) {
            setCardIndex((i) => i - 1);
            setIsFlipped(false);
        }
    };
    const handleRestart = () => {
        setCardIndex(0);
        setIsFlipped(false);
        setCorrectCount(0);
    };
    return (_jsxs("div", { className: "w-full h-full flex flex-col gap-2.5 overflow-hidden select-none", children: [_jsxs("div", { className: "w-full flex items-center gap-2 overflow-hidden shrink-0", children: [_jsx("div", { className: "flex-1 min-w-0 overflow-hidden", children: _jsx(CategorySelector, { categories: categories, selectedCategoryId: selectedCategoryId, onSelectCategory: handleSelectCategory }) }), _jsxs(DebouncedTouchable, { onPress: handleRestart, disabled: !currentCard, debounceMs: 200, minTouchSize: "sm", className: "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap border-2 bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 active:bg-slate-600 disabled:opacity-40 transition-all shadow-sm shrink-0", "aria-label": "Reset Deck", title: "Reset Deck", children: [_jsx(RotateCcw, { className: "w-4 h-4 stroke-[2.5]" }), _jsx("span", { children: "Reset" })] })] }), _jsxs("div", { className: "flex-1 min-h-0 bg-transparent border-0 p-0 flex flex-col items-center justify-between relative overflow-hidden", children: [celebrationActive && (_jsx("div", { className: "absolute inset-0 bg-yellow-400/20 backdrop-blur-xs flex items-center justify-center z-30 pointer-events-none animate-bounce", children: _jsxs("div", { className: "bg-yellow-400 text-slate-950 px-6 py-3 rounded-2xl font-black text-xl sm:text-2xl shadow-2xl flex items-center gap-2 border-4 border-white", children: [_jsx(Award, { className: "w-8 h-8" }), _jsx("span", { children: "Great Job!" })] }) })), _jsx("div", { className: "flex-1 w-full flex flex-col items-center justify-center my-auto min-h-0 py-0.5 sm:py-1", children: currentCard ? (_jsxs("div", { className: "w-full max-w-lg flex flex-col gap-1.5 sm:gap-2", children: [_jsxs("div", { className: "w-full flex items-center justify-between px-2 shrink-0", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-yellow-400 font-bold text-xs sm:text-sm", children: [_jsx(Trophy, { className: "w-4 h-4 text-yellow-400" }), _jsx("span", { children: correctCount })] }), _jsx("div", { className: "flex items-center gap-1.5 text-slate-300 font-bold text-xs sm:text-sm", children: _jsxs("span", { children: [weeklyCards.length > 0 ? cardIndex + 1 : 0, " of ", weeklyCards.length] }) })] }), _jsx(FlashcardDeck, { card: currentCard, isFlipped: isFlipped, onFlip: () => setIsFlipped((f) => !f) })] })) : selectedCategoryId === 'favorites' ? (_jsxs("div", { className: "flex flex-col items-center justify-center text-slate-400 gap-2 text-center p-4", children: [_jsx("span", { className: "text-4xl", children: "\u2B50" }), _jsx("p", { className: "text-base font-semibold text-white", children: "No favorite cards yet." }), _jsx("p", { className: "text-xs text-slate-400", children: "Star cards in the Cards view to practice them in Word Finding!" })] })) : (_jsxs("div", { className: "flex flex-col items-center justify-center text-slate-400 gap-2", children: [_jsx("span", { className: "text-4xl", children: "\uD83D\uDCED" }), _jsx("p", { className: "text-base font-semibold", children: "No cards available in this category." })] })) }), _jsxs("div", { className: "w-full max-w-lg flex flex-col gap-2 shrink-0 pb-0.5", children: [_jsxs(DebouncedTouchable, { onPress: handleSpeak, disabled: !currentCard, minTouchSize: "md", className: `
              w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg disabled:opacity-40 transition-all border-2
              ${isFlipped
                                    ? 'bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-yellow-950 border-yellow-300 shadow-yellow-500/20'
                                    : 'bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white border-purple-400 shadow-purple-900/40'}
            `, "aria-label": "Speak clue or answer", children: [_jsx(Volume2, { className: "w-5 h-5 stroke-[2.5]" }), _jsx("span", { children: "Speak" })] }), _jsxs("div", { className: "flex items-center justify-between gap-2.5 w-full", children: [_jsxs(DebouncedTouchable, { onPress: handlePrev, disabled: cardIndex === 0 || !currentCard, minTouchSize: "md", className: "flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-700 flex items-center justify-center gap-1.5 text-sm sm:text-base font-bold disabled:opacity-40 shadow-xs", children: [_jsx(ChevronLeft, { className: "w-5 h-5" }), _jsx("span", { children: "Previous" })] }), _jsxs(DebouncedTouchable, { onPress: handleCorrect, disabled: !currentCard, minTouchSize: "md", className: "flex-[1.4] bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black flex items-center justify-center gap-1.5 text-sm sm:text-base shadow-lg shadow-emerald-900/40 disabled:opacity-40 border-2 border-emerald-400", "aria-label": "Got it right!", children: [_jsx(CheckCircle2, { className: "w-5 h-5 stroke-[2.5]" }), _jsx("span", { children: "Got It Right!" })] }), _jsxs(DebouncedTouchable, { onPress: handleNext, disabled: cardIndex >= weeklyCards.length - 1 || !currentCard, minTouchSize: "md", className: "flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-700 flex items-center justify-center gap-1.5 text-sm sm:text-base font-bold disabled:opacity-40 shadow-xs", children: [_jsx("span", { children: "Next" }), _jsx(ChevronRight, { className: "w-5 h-5" })] })] })] })] })] }));
};
