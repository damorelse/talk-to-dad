import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback } from 'react';
import { detectUserLocation, getFallbackLocationFromTimezone, formatWeekdaySpeech, formatDateSpeech, formatTimeSpeech, formatLocationSpeech, formatFullOrientationSpeech, getDayPeriod, WEEKDAYS, } from '../../services/location/locationService.js';
import { WeekdayBar } from './WeekdayBar.js';
import { WorldMapSvg } from './WorldMapSvg.js';
import { DebouncedTouchable } from '../common/DebouncedTouchable.js';
import { useAudio } from '../../hooks/useAudio.js';
import { Volume2, Calendar, Clock, RefreshCw, Sparkles, Compass, } from 'lucide-react';
export const TodayOrientationView = () => {
    const [currentDate, setCurrentDate] = useState(() => new Date());
    const [location, setLocation] = useState(() => getFallbackLocationFromTimezone());
    const [isLocating, setIsLocating] = useState(false);
    const [activeSpeechType, setActiveSpeechType] = useState(null);
    const { speakBilingual, stopAll, isSpeaking } = useAudio();
    // Keep live time ticking every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    // Detect location on mount
    const refreshLocation = useCallback(async () => {
        setIsLocating(true);
        try {
            const loc = await detectUserLocation();
            setLocation(loc);
        }
        catch (err) {
            console.warn('Location detection error:', err);
        }
        finally {
            setIsLocating(false);
        }
    }, []);
    useEffect(() => {
        refreshLocation();
    }, [refreshLocation]);
    // Speech handlers
    const handleSpeakAll = async () => {
        setActiveSpeechType('all');
        const { en, zh } = formatFullOrientationSpeech(currentDate, location);
        await speakBilingual(en, zh, undefined, {
            onEnd: () => setActiveSpeechType(null),
            onError: () => setActiveSpeechType(null),
        });
    };
    const handleSpeakWeekday = async (day, isToday = true) => {
        setActiveSpeechType('weekday');
        let en = '';
        let zh = '';
        if (!day || isToday) {
            const sp = formatWeekdaySpeech(currentDate);
            en = sp.en;
            zh = sp.zh;
        }
        else {
            en = `That day is ${day.name}.`;
            zh = `那是${day.nameZh}。`;
        }
        await speakBilingual(en, zh, undefined, {
            onEnd: () => setActiveSpeechType(null),
            onError: () => setActiveSpeechType(null),
        });
    };
    const handleSpeakDate = async () => {
        setActiveSpeechType('date');
        const { en, zh } = formatDateSpeech(currentDate);
        await speakBilingual(en, zh, undefined, {
            onEnd: () => setActiveSpeechType(null),
            onError: () => setActiveSpeechType(null),
        });
    };
    const handleSpeakTime = async () => {
        setActiveSpeechType('time');
        const { en, zh } = formatTimeSpeech(currentDate);
        await speakBilingual(en, zh, undefined, {
            onEnd: () => setActiveSpeechType(null),
            onError: () => setActiveSpeechType(null),
        });
    };
    const handleSpeakLocation = async () => {
        setActiveSpeechType('location');
        const { en, zh } = formatLocationSpeech(location);
        await speakBilingual(en, zh, undefined, {
            onEnd: () => setActiveSpeechType(null),
            onError: () => setActiveSpeechType(null),
        });
    };
    // Date/Time Display Helpers
    const currentWeekday = WEEKDAYS[currentDate.getDay()];
    const monthsEn = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const monthName = monthsEn[currentDate.getMonth()];
    const dayNum = currentDate.getDate();
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const displayHours12 = hours % 12 === 0 ? 12 : hours % 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const dayPeriod = getDayPeriod(hours);
    const fullSpeech = formatFullOrientationSpeech(currentDate, location);
    return (_jsxs("div", { className: "w-full h-full flex flex-col gap-3 overflow-y-auto p-1 select-none scrollbar-thin", children: [_jsxs("div", { className: "w-full bg-slate-900 border-2 border-slate-700 rounded-3xl p-3.5 sm:p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-3 text-center sm:text-left", children: [_jsx("div", { className: "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500 flex items-center justify-center text-indigo-400 shrink-0 text-2xl sm:text-3xl shadow-inner", children: "\uD83E\uDDED" }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 justify-center sm:justify-start", children: [_jsx("h1", { className: "text-lg sm:text-xl font-black text-white tracking-tight", children: "Today & Daily Orientation" }), _jsx("span", { className: "text-xs font-bold text-indigo-400 bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded-full", children: "\u6642\u7A7A\u8A8D\u77E5" })] }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Current weekday, calendar date, live time, and world location \u00B7 \u9EDE\u64CA\u4EFB\u4E00\u9805\u76EE\u5373\u53EF\u767C\u97F3" })] })] }), _jsxs("div", { className: "flex items-center gap-2 w-full sm:w-auto shrink-0", children: [_jsxs(DebouncedTouchable, { onPress: handleSpeakAll, minTouchSize: "lg", className: `
              flex-1 sm:flex-initial px-6 py-3 rounded-2xl font-black text-white flex items-center justify-center gap-2.5 shadow-xl transition-all duration-150 text-sm sm:text-base
              ${isSpeaking && activeSpeechType === 'all'
                                    ? 'bg-indigo-500 ring-4 ring-indigo-300 scale-105 shadow-indigo-500/50'
                                    : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 shadow-indigo-900/40'}
            `, "aria-label": "Speak all orientation information aloud", children: [_jsx(Volume2, { className: `w-5 h-5 stroke-[2.5] ${isSpeaking ? 'animate-bounce' : ''}` }), _jsxs("div", { className: "flex flex-col items-start leading-tight", children: [_jsx("span", { children: "Speak All" }), _jsx("span", { className: "text-[10px] font-bold text-indigo-200", children: "\u6717\u8B80\u5168\u90E8\u6642\u7A7A" })] })] }), isSpeaking && (_jsx("button", { type: "button", onClick: stopAll, className: "px-3 py-3 bg-red-600/80 hover:bg-red-600 text-white rounded-2xl text-xs font-black shadow-md border border-red-500", "aria-label": "Stop speaking", children: "Stop \u505C\u6B62" }))] })] }), _jsxs("div", { className: "w-full flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-0", children: [_jsxs("div", { className: "flex flex-col gap-3", children: [_jsxs("div", { className: "bg-slate-900 border-2 border-slate-700 rounded-3xl p-4 flex flex-col justify-between shadow-xl gap-3.5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400", children: _jsx(Calendar, { className: "w-4 h-4" }) }), _jsxs("div", { children: [_jsx("span", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider block", children: "Weekday \u00B7 \u661F\u671F" }), _jsxs("span", { className: "text-lg sm:text-xl font-black text-white", children: [currentWeekday.name, " (", currentWeekday.nameZh, ")"] })] })] }), _jsxs(DebouncedTouchable, { onPress: () => handleSpeakWeekday(), minTouchSize: "md", className: "bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow", "aria-label": "Speak current weekday", children: [_jsx(Volume2, { className: "w-4 h-4" }), _jsx("span", { children: "Speak \u661F\u671F" })] })] }), _jsx(WeekdayBar, { currentDate: currentDate, onSelectDay: (day, isToday) => handleSpeakWeekday(day, isToday) })] }), _jsxs("div", { className: "bg-slate-900 border-2 border-slate-700 rounded-3xl p-4 flex flex-col justify-between shadow-xl gap-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500 flex items-center justify-center text-blue-400", children: _jsx(Sparkles, { className: "w-4 h-4" }) }), _jsxs("div", { children: [_jsx("span", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider block", children: "Date \u00B7 \u65E5\u66C6\u65E5\u671F" }), _jsx("span", { className: "text-xs text-slate-400 font-medium", children: "Today's Calendar Year & Month" })] })] }), _jsxs(DebouncedTouchable, { onPress: handleSpeakDate, minTouchSize: "md", className: "bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-blue-300 border border-blue-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow", "aria-label": "Speak current date", children: [_jsx(Volume2, { className: "w-4 h-4" }), _jsx("span", { children: "Speak \u65E5\u671F" })] })] }), _jsxs(DebouncedTouchable, { onPress: handleSpeakDate, minTouchSize: "lg", className: "w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-inner hover:border-blue-500/50 transition-colors cursor-pointer group", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col items-center justify-center shadow-lg border border-blue-400/40 shrink-0", children: [_jsx("span", { className: "text-[10px] sm:text-xs font-black uppercase tracking-wider text-blue-200", children: monthName.slice(0, 3) }), _jsx("span", { className: "text-2xl sm:text-3xl font-black leading-none my-0.5", children: dayNum }), _jsx("span", { className: "text-[10px] font-bold text-blue-200 leading-none", children: year })] }), _jsxs("div", { className: "flex flex-col text-left", children: [_jsxs("span", { className: "text-lg sm:text-2xl font-black text-white group-hover:text-blue-300 transition-colors", children: [monthName, " ", dayNum, ", ", year] }), _jsxs("span", { className: "text-sm sm:text-base font-bold text-slate-300 mt-0.5", children: [year, " \u5E74 ", currentDate.getMonth() + 1, " \u6708 ", dayNum, " \u65E5"] })] })] }), _jsx("div", { className: "shrink-0 hidden sm:flex items-center text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20", children: "Tap to Hear" })] })] })] }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsxs("div", { className: "bg-slate-900 border-2 border-slate-700 rounded-3xl p-4 flex flex-col justify-between shadow-xl gap-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400", children: _jsx(Clock, { className: "w-4 h-4" }) }), _jsxs("div", { children: [_jsx("span", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider block", children: "Live Time \u00B7 \u73FE\u5728\u6642\u9593" }), _jsx("span", { className: "text-xs text-slate-400 font-medium", children: "12-Hour Synchronized Digital Clock" })] })] }), _jsxs(DebouncedTouchable, { onPress: handleSpeakTime, minTouchSize: "md", className: "bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow", "aria-label": "Speak current time", children: [_jsx(Volume2, { className: "w-4 h-4" }), _jsx("span", { children: "Speak \u6642\u9593" })] })] }), _jsxs(DebouncedTouchable, { onPress: handleSpeakTime, minTouchSize: "lg", className: "w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-inner hover:border-emerald-500/50 transition-colors cursor-pointer group", children: [_jsxs("div", { className: "flex items-center gap-3.5 sm:gap-5", children: [_jsxs("div", { className: "w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex flex-col items-center justify-center shadow-lg border border-emerald-400/40 shrink-0 text-2xl", children: [_jsx("span", { children: dayPeriod.icon }), _jsx("span", { className: "text-[10px] font-black uppercase text-emerald-100 mt-0.5", children: dayPeriod.en })] }), _jsxs("div", { className: "flex flex-col text-left", children: [_jsxs("div", { className: "flex items-baseline gap-2", children: [_jsxs("span", { className: "text-2xl sm:text-4xl font-black font-mono tracking-tight text-white group-hover:text-emerald-300 transition-colors", children: [displayHours12, ":", minStr] }), _jsxs("span", { className: "text-xs sm:text-sm font-mono font-bold text-slate-400", children: [":", secStr] }), _jsx("span", { className: "text-xs sm:text-sm font-black text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.5 rounded-md ml-1", children: ampm })] }), _jsxs("span", { className: "text-xs sm:text-sm font-bold text-slate-300 mt-0.5", children: [dayPeriod.zh, " ", displayHours12, " \u9EDE ", minutes, " \u5206"] })] })] }), _jsx("div", { className: "shrink-0 hidden sm:flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20", children: "Tap to Hear" })] })] }), _jsxs("div", { className: "bg-slate-900 border-2 border-slate-700 rounded-3xl p-4 flex flex-col justify-between shadow-xl gap-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [_jsx("div", { className: "w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500 flex items-center justify-center text-purple-400 shrink-0", children: _jsx(Compass, { className: "w-4 h-4" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("span", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider block", children: "World Location \u00B7 \u6240\u5728\u4F4D\u7F6E" }), _jsxs("span", { className: "text-xs font-black text-white truncate block", children: [location.city, location.state ? `, ${location.state}` : '', ", ", location.country] })] })] }), _jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [_jsx("button", { type: "button", onClick: refreshLocation, disabled: isLocating, className: "p-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-300 border border-slate-700 rounded-xl transition-colors disabled:opacity-50", "aria-label": "Refresh location via GPS", title: "Refresh location", children: _jsx(RefreshCw, { className: `w-3.5 h-3.5 ${isLocating ? 'animate-spin text-purple-400' : ''}` }) }), _jsxs(DebouncedTouchable, { onPress: handleSpeakLocation, minTouchSize: "md", className: "bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-purple-300 border border-purple-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow", "aria-label": "Speak current location", children: [_jsx(Volume2, { className: "w-4 h-4" }), _jsx("span", { children: "Speak \u4F4D\u7F6E" })] })] })] }), _jsx(WorldMapSvg, { location: location, onSelectLocation: handleSpeakLocation })] })] })] }), _jsxs("div", { className: "w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-3.5 flex flex-col gap-1.5 shadow-inner mt-1", children: [_jsxs("div", { className: "flex items-center justify-between text-xs font-bold text-slate-400", children: [_jsx("span", { children: "Spoken Composite Statement \u00B7 \u6717\u8B80\u8A9E\u53E5\u9810\u89BD" }), _jsxs("button", { type: "button", onClick: handleSpeakAll, className: "text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold", children: [_jsx(Volume2, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Play Aloud" })] })] }), _jsxs("p", { className: "text-sm sm:text-base font-bold text-amber-300 tracking-wide leading-snug", children: ["\"", fullSpeech.en, "\""] }), _jsxs("p", { className: "text-sm sm:text-base font-bold text-white tracking-wide leading-snug pt-1 border-t border-slate-800/80", children: ["\u300C", fullSpeech.zh, "\u300D"] })] })] }));
};
