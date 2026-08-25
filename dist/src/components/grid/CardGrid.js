import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useMemo } from 'react';
import { GridCard } from './GridCard.js';
import { CategorySelector } from './CategorySelector.js';
import { useAudio } from '../../hooks/useAudio.js';
import { Search } from 'lucide-react';
export const CardGrid = ({ categories, cards, settings, }) => {
    const [selectedCategory, setSelectedCategory] = useState('favorites');
    const [searchQuery, setSearchQuery] = useState('');
    const { speakCard } = useAudio();
    const filteredCards = useMemo(() => {
        return cards.filter((card) => {
            // Category filter
            if (selectedCategory === 'favorites') {
                if (!card.isFavorite) {
                    return false;
                }
            }
            else if (card.categoryId !== selectedCategory) {
                return false;
            }
            // Search filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchesLabel = card.label.toLowerCase().includes(q);
                const matchesSpoken = card.spokenText.toLowerCase().includes(q);
                const matchesSyllables = card.phoneticSyllables?.toLowerCase().includes(q);
                if (!matchesLabel && !matchesSpoken && !matchesSyllables) {
                    return false;
                }
            }
            return true;
        });
    }, [cards, selectedCategory, searchQuery]);
    const handleCardSelect = (card) => {
        speakCard(card);
    };
    // Dynamic grid style based on settings
    const cols = Math.max(3, Math.min(5, settings.gridCols || 4));
    // Dynamic row height bounds based on column density to preserve proportional card shapes
    const rowHeightMap = {
        3: { min: 160, max: 210 },
        4: { min: 150, max: 195 },
        5: { min: 135, max: 175 },
    };
    const currentDensity = rowHeightMap[cols] || rowHeightMap[4];
    const gridStyle = {
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridAutoRows: `minmax(${currentDensity.min}px, ${currentDensity.max}px)`,
        alignContent: 'start',
    };
    return (_jsxs("div", { className: "w-full h-full flex flex-col gap-2.5 overflow-hidden", children: [_jsxs("div", { className: "w-full flex flex-col sm:flex-row items-center gap-2 shrink-0", children: [_jsx("div", { className: "flex-1 w-full overflow-hidden", children: _jsx(CategorySelector, { categories: categories, selectedCategoryId: selectedCategory, onSelectCategory: setSelectedCategory }) }), _jsxs("div", { className: "relative w-full sm:w-64 shrink-0", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" }), _jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search words...", className: "w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" }), searchQuery && (_jsx("button", { type: "button", onClick: () => setSearchQuery(''), className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold", children: "Clear" }))] })] }), _jsx("div", { className: "flex-1 w-full overflow-y-auto p-1 scrollbar-thin", children: filteredCards.length === 0 ? (_jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400", children: [_jsx("span", { className: "text-4xl mb-2", children: "\uD83D\uDD0D" }), _jsx("p", { className: "text-lg font-bold", children: "No matching AAC cards found" }), _jsx("p", { className: "text-sm text-slate-400 dark:text-slate-500", children: "Try selecting another category or clearing your search." })] })) : (_jsx("div", { className: "grid gap-2.5 sm:gap-3.5 w-full", style: gridStyle, children: filteredCards.map((card) => (_jsx(GridCard, { card: card, onSelect: handleCardSelect, debounceMs: settings.tapDebounceMs, fontSize: settings.fontSize }, card.id))) })) })] }));
};
