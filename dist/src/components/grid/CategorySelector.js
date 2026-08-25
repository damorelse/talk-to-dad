import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { DebouncedTouchable } from '../common/DebouncedTouchable.js';
import { Star, Sparkles, LayoutGrid } from 'lucide-react';
export const CategorySelector = ({ categories, selectedCategoryId, onSelectCategory, showAll = false, allLabel = 'All Cards', allLabelZh = '全部圖卡', showWeekly = false, weeklyLabel = 'Weekly Focus', weeklyLabelZh = '本週焦點', showFavorites = true, favoritesLabel = 'Favorites', favoritesLabelZh = '常用最愛', language = 'en', className = '', }) => {
    return (_jsxs("div", { className: `w-full flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-1 scrollbar-thin select-none shrink-0 scroll-smooth ${className}`, role: "tablist", "aria-label": "AAC Categories", children: [showAll && (_jsxs(DebouncedTouchable, { onPress: () => onSelectCategory('all'), debounceMs: 200, minTouchSize: "md", "aria-label": language === 'zh' ? allLabelZh : allLabel, title: language === 'zh' ? allLabelZh : allLabel, className: `
            flex items-center gap-2 px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold sm:font-black whitespace-nowrap border-2 transition-all shrink-0 min-h-[44px] sm:min-h-[48px] shadow-sm
            ${selectedCategoryId === 'all'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-900/30 ring-2 ring-amber-400/40 font-black'
                    : 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-500'}
          `, children: [_jsx(LayoutGrid, { className: "w-4 h-4 sm:w-5 sm:h-5 shrink-0" }), _jsx("span", { children: language === 'zh' ? allLabelZh : allLabel })] })), showWeekly && (_jsxs(DebouncedTouchable, { onPress: () => onSelectCategory('weekly'), debounceMs: 200, minTouchSize: "md", "aria-label": language === 'zh' ? weeklyLabelZh : weeklyLabel, title: language === 'zh' ? weeklyLabelZh : weeklyLabel, className: `
            flex items-center gap-2 px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold sm:font-black whitespace-nowrap border-2 transition-all shrink-0 min-h-[44px] sm:min-h-[48px] shadow-sm
            ${selectedCategoryId === 'weekly'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-900/30 ring-2 ring-amber-400/40 font-black'
                    : 'bg-slate-900 text-amber-300 border-amber-500/50 hover:bg-slate-800 hover:text-amber-100 hover:border-amber-400'}
          `, children: [_jsx(Sparkles, { className: `w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${selectedCategoryId === 'weekly' ? 'text-slate-950' : 'text-amber-400'}` }), _jsx("span", { children: language === 'zh' ? weeklyLabelZh : weeklyLabel })] })), showFavorites && (_jsx(DebouncedTouchable, { onPress: () => onSelectCategory('favorites'), debounceMs: 200, minTouchSize: "md", "aria-label": language === 'zh' ? favoritesLabelZh : favoritesLabel, title: language === 'zh' ? favoritesLabelZh : favoritesLabel, className: `
            flex items-center justify-center px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border-2 transition-all shrink-0 min-h-[44px] sm:min-h-[48px] shadow-sm
            ${selectedCategoryId === 'favorites'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-900/30 ring-2 ring-amber-400/40'
                    : 'bg-slate-900 text-yellow-300 border-yellow-500/50 hover:bg-slate-800 hover:text-yellow-100 hover:border-yellow-400'}
          `, children: _jsx(Star, { className: `w-5 h-5 sm:w-6 sm:h-6 shrink-0 ${selectedCategoryId === 'favorites' ? 'fill-slate-950 text-slate-950' : 'fill-yellow-400 text-yellow-400'}` }) })), categories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                const displayName = language === 'zh' ? (cat.nameZh || cat.name) : cat.name;
                return (_jsxs(DebouncedTouchable, { onPress: () => onSelectCategory(cat.id), debounceMs: 200, minTouchSize: "md", "aria-label": displayName, title: displayName, className: `
              flex items-center gap-2 px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold sm:font-black whitespace-nowrap border-2 transition-all shrink-0 min-h-[44px] sm:min-h-[48px] shadow-sm
              ${isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-900/30 ring-2 ring-amber-400/40 font-black'
                        : 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-500'}
            `, children: [_jsx("span", { className: "w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full shrink-0 shadow-xs ring-1 ring-white/20", style: { backgroundColor: cat.color || '#F59E0B' } }), _jsx("span", { children: displayName })] }, cat.id));
            })] }));
};
