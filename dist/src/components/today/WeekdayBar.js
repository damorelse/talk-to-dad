import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { WEEKDAYS } from '../../services/location/locationService.js';
import { DebouncedTouchable } from '../common/DebouncedTouchable.js';
import { CalendarCheck, Sparkles } from 'lucide-react';
export const WeekdayBar = ({ currentDate, onSelectDay, debounceMs = 200, activeGlowDayIndex = null, }) => {
    const currentDayIndex = currentDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    return (_jsxs("div", { className: "w-full flex flex-col gap-2 select-none", children: [_jsxs("div", { className: "flex items-center justify-between px-1", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(CalendarCheck, { className: "w-4 h-4 text-amber-400" }), _jsx("span", { className: "text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider", children: "Day of Week \u00B7 \u661F\u671F\u8996\u89BA\u8868" })] }), _jsx("span", { className: "text-xs font-semibold text-slate-400", children: "Tap any day to speak \u00B7 \u9EDE\u9078\u4EFB\u4E00\u65E5\u767C\u97F3" })] }), _jsx("div", { className: "grid grid-cols-7 gap-1.5 sm:gap-2.5 w-full", children: WEEKDAYS.map((day) => {
                    const isToday = day.index === currentDayIndex;
                    const isGlowSpeaking = activeGlowDayIndex === day.index;
                    return (_jsxs(DebouncedTouchable, { onPress: () => onSelectDay(day, isToday), debounceMs: debounceMs, minTouchSize: "md", className: `
                relative flex flex-col items-center justify-between min-h-[72px] sm:min-h-[84px] p-1.5 sm:p-2.5 rounded-2xl border-2 sm:border-3 transition-all duration-200 cursor-pointer
                ${isGlowSpeaking
                            ? 'bg-amber-500/40 border-amber-300 ring-4 ring-amber-300 scale-105 shadow-2xl brightness-125 z-20 animate-pulse'
                            : isToday
                                ? 'bg-gradient-to-b from-amber-500/30 to-amber-600/40 border-amber-400 shadow-xl shadow-amber-950/50 ring-4 ring-amber-400/40 scale-105 z-10 brightness-110'
                                : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 hover:border-slate-700'}
              `, "aria-label": `${day.name}, ${day.nameZh}${isToday ? ' (Today)' : ''}`, "aria-current": isToday ? 'date' : undefined, children: [isToday && (_jsx("div", { className: "absolute -top-2.5 inset-x-0 flex items-center justify-center pointer-events-none", children: _jsxs("span", { className: "bg-amber-400 text-amber-950 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full shadow-md flex items-center gap-0.5", children: [_jsx(Sparkles, { className: "w-2.5 h-2.5 fill-amber-950 stroke-[2]" }), _jsx("span", { children: "Today" })] }) })), _jsx("span", { className: `
                  text-xs sm:text-base font-black uppercase tracking-tight
                  ${isToday ? 'text-amber-300 pt-1' : 'text-slate-300'}
                `, children: day.nameShort }), _jsx("span", { className: `
                  text-xs sm:text-sm font-extrabold my-0.5
                  ${isToday ? 'text-white font-black scale-110' : 'text-slate-400'}
                `, children: day.nameZhShort }), _jsx("div", { className: "mt-1 flex items-center justify-center", children: _jsx("div", { className: `
                    w-2 h-2 rounded-full
                    ${isToday ? 'bg-amber-400 shadow-sm shadow-amber-300 animate-pulse' : 'bg-slate-700'}
                  ` }) })] }, day.name));
                }) })] }));
};
