import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback } from 'react';
import { detectUserLocation, getFallbackLocationFromTimezone, formatWeekdaySpeech, formatDateSpeech, formatTimeSpeech, formatLocationSpeech, formatFullOrientationSpeech, getDayPeriod, getGreeting, WEEKDAYS, } from '../../services/location/locationService.js';
import { WeekdayBar } from './WeekdayBar.js';
import { WorldMapSvg } from './WorldMapSvg.js';
import { DebouncedTouchable } from '../common/DebouncedTouchable.js';
import { useAudio } from '../../hooks/useAudio.js';
import { Volume2, Calendar, RefreshCw, Compass, VolumeX, } from 'lucide-react';
export const TodayOrientationView = () => {
    const [currentDate, setCurrentDate] = useState(() => new Date());
    const [location, setLocation] = useState(() => getFallbackLocationFromTimezone());
    const [isLocating, setIsLocating] = useState(false);
    const [activeSpeechType, setActiveSpeechType] = useState(null);
    const { speakBilingual, stopAll, isSpeaking } = useAudio();
    // Keep live time synchronized every second
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
    const monthsEnShort = [
        'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
    ];
    const monthName = monthsEn[currentDate.getMonth()];
    const monthShort = monthsEnShort[currentDate.getMonth()];
    const monthNum = currentDate.getMonth() + 1;
    const dayNum = currentDate.getDate();
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const displayHours12 = hours % 12 === 0 ? 12 : hours % 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const dayPeriod = getDayPeriod(hours);
    const greeting = getGreeting(hours);
    const fullSpeech = formatFullOrientationSpeech(currentDate, location);
    // Active Glow Indicators for Visual-Audio Synchrony
    const isWeekdayActive = isSpeaking && (activeSpeechType === 'weekday' || activeSpeechType === 'all');
    const isDateActive = isSpeaking && (activeSpeechType === 'date' || activeSpeechType === 'all');
    const isTimeActive = isSpeaking && (activeSpeechType === 'time' || activeSpeechType === 'all');
    const isLocationActive = isSpeaking && (activeSpeechType === 'location' || activeSpeechType === 'all');
    return (_jsxs("div", { className: "w-full h-full flex flex-col gap-3 overflow-y-auto p-1 select-none scrollbar-thin", children: [_jsxs("div", { className: "w-full bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3 shadow-lg flex items-center justify-between gap-3 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [_jsx("span", { className: "text-2xl sm:text-3xl shrink-0 drop-shadow", children: greeting.icon }), _jsxs("div", { className: "flex items-baseline gap-2 min-w-0 flex-wrap", children: [_jsx("h1", { className: "text-lg sm:text-xl font-black text-white tracking-tight truncate", children: greeting.en }), _jsx("span", { className: "text-sm sm:text-base font-extrabold text-indigo-300", children: greeting.zh })] })] }), _jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [_jsxs(DebouncedTouchable, { onPress: handleSpeakAll, minTouchSize: "lg", className: `
              px-4 sm:px-5 py-2.5 rounded-xl font-black text-white flex items-center gap-2 shadow-lg transition-all duration-200 text-xs sm:text-sm cursor-pointer
              ${isSpeaking && activeSpeechType === 'all'
                                    ? 'bg-indigo-500 ring-4 ring-indigo-300/60 scale-105 shadow-indigo-500/50'
                                    : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 hover:scale-[1.02]'}
            `, "aria-label": "Speak all orientation information aloud", children: [_jsx(Volume2, { className: "w-4 h-4 stroke-[2.5]" }), _jsx("span", { children: "Speak All \u00B7 \u6717\u8B80\u5168\u90E8" })] }), isSpeaking && (_jsxs("button", { type: "button", onClick: stopAll, className: "px-3 py-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-xl text-xs font-black shadow border border-rose-400 flex items-center gap-1.5 transition-all cursor-pointer", "aria-label": "Stop speaking", children: [_jsx(VolumeX, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Stop" })] }))] })] }), _jsxs("div", { className: "w-full flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-0", children: [_jsxs("div", { className: "flex flex-col gap-3", children: [_jsxs(DebouncedTouchable, { onPress: handleSpeakTime, minTouchSize: "lg", className: `
              bg-slate-900 border-2 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-lg transition-all duration-200 cursor-pointer group
              ${isTimeActive
                                    ? 'border-emerald-400 ring-4 ring-emerald-400/40 shadow-emerald-950/60'
                                    : 'border-slate-800 hover:border-emerald-500/60'}
            `, "aria-label": `Current time: ${displayHours12}:${minStr} ${ampm}. Tap to hear.`, children: [_jsxs("div", { className: "flex items-center gap-3.5 min-w-0", children: [_jsxs("div", { className: "w-16 h-18 sm:w-18 sm:h-20 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white flex flex-col items-center justify-center shadow-md border border-emerald-400/40 shrink-0", children: [_jsx("span", { className: "text-2xl sm:text-3xl drop-shadow", children: dayPeriod.icon }), _jsx("span", { className: "text-[10px] font-black uppercase text-emerald-100 mt-0.5 tracking-wider", children: dayPeriod.zh })] }), _jsxs("div", { className: "flex flex-col text-left min-w-0", children: [_jsx("span", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider", children: "Live Time \u00B7 \u73FE\u5728\u6642\u9593" }), _jsxs("div", { className: "flex items-baseline gap-2", children: [_jsxs("span", { className: "text-2xl sm:text-3xl font-black font-mono tracking-tight text-white group-hover:text-emerald-300 transition-colors", children: [displayHours12, ":", minStr] }), _jsx("span", { className: "text-xs font-black text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30", children: ampm })] }), _jsxs("span", { className: "text-xs sm:text-sm font-bold text-emerald-200 mt-0.5 truncate", children: [dayPeriod.zh, " ", displayHours12, " \u9EDE ", minutes === 0 ? '整' : `${minutes} 分`] })] })] }), _jsx("div", { className: "shrink-0 text-emerald-400 group-hover:text-white transition-colors p-2", children: _jsx(Volume2, { className: "w-4 h-4" }) })] }), _jsxs(DebouncedTouchable, { onPress: handleSpeakDate, minTouchSize: "lg", className: `
              bg-slate-900 border-2 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-lg transition-all duration-200 cursor-pointer group
              ${isDateActive
                                    ? 'border-blue-400 ring-4 ring-blue-400/40 shadow-blue-950/60'
                                    : 'border-slate-800 hover:border-blue-500/60'}
            `, "aria-label": `Current date: ${monthName} ${dayNum}, ${year}. Tap to hear.`, children: [_jsxs("div", { className: "flex items-center gap-3.5 min-w-0", children: [_jsxs("div", { className: "w-16 h-18 sm:w-18 sm:h-20 rounded-xl bg-slate-100 text-slate-900 flex flex-col items-center overflow-hidden shadow-md border border-slate-300 shrink-0 select-none", children: [_jsxs("div", { className: "w-full bg-rose-600 text-white py-0.5 text-center text-[10px] font-black uppercase tracking-wider", children: [monthShort, " \u00B7 ", monthNum, "\u6708"] }), _jsx("div", { className: "flex-1 flex items-center justify-center", children: _jsx("span", { className: "text-2xl sm:text-3xl font-black text-slate-900 leading-none", children: dayNum }) }), _jsx("div", { className: "w-full bg-slate-200 py-0.5 text-center text-[9px] font-black text-slate-600", children: year })] }), _jsxs("div", { className: "flex flex-col text-left min-w-0", children: [_jsx("span", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider", children: "Date \u00B7 \u65E5\u66C6\u65E5\u671F" }), _jsxs("span", { className: "text-lg sm:text-xl font-black text-white group-hover:text-blue-300 transition-colors truncate", children: [monthName, " ", dayNum, ", ", year] }), _jsxs("span", { className: "text-xs sm:text-sm font-bold text-blue-200 mt-0.5", children: [year, " \u5E74 ", monthNum, " \u6708 ", dayNum, " \u65E5"] })] })] }), _jsx("div", { className: "shrink-0 text-blue-400 group-hover:text-white transition-colors p-2", children: _jsx(Volume2, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: `
              bg-slate-900 border-2 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg gap-2.5 transition-all duration-200
              ${isWeekdayActive
                                    ? 'border-amber-400 ring-4 ring-amber-400/40 shadow-amber-950/60'
                                    : 'border-slate-800 hover:border-slate-700'}
            `, children: [_jsxs("div", { className: "flex items-center justify-between px-0.5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "w-4 h-4 text-amber-400" }), _jsx("span", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider", children: "Weekday \u00B7 \u661F\u671F" })] }), _jsxs("button", { type: "button", onClick: () => handleSpeakWeekday(), className: "text-sm sm:text-base font-black text-amber-300 hover:text-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer", children: [_jsxs("span", { children: [currentWeekday.name, " (", currentWeekday.nameZh, ")"] }), _jsx(Volume2, { className: "w-3.5 h-3.5 text-amber-400" })] })] }), _jsx(WeekdayBar, { currentDate: currentDate, onSelectDay: (day, isToday) => handleSpeakWeekday(day, isToday), activeGlowDayIndex: isWeekdayActive ? currentWeekday.index : null })] })] }), _jsx("div", { className: "flex flex-col gap-3", children: _jsxs("div", { className: `
              bg-slate-900 border-2 rounded-2xl p-3.5 flex flex-col justify-between gap-2.5 shadow-lg h-full transition-all duration-200
              ${isLocationActive
                                ? 'border-purple-400 ring-4 ring-purple-400/40 shadow-purple-950/60'
                                : 'border-slate-800 hover:border-slate-700'}
            `, children: [_jsxs("div", { className: "flex items-center justify-between px-1", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Compass, { className: "w-4 h-4 text-purple-400" }), _jsx("span", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider", children: "Location \u00B7 \u6240\u5728\u4F4D\u7F6E" })] }), _jsx("button", { type: "button", onClick: refreshLocation, disabled: isLocating, className: "p-1 text-slate-400 hover:text-purple-300 transition-colors disabled:opacity-50 cursor-pointer", "aria-label": "Refresh location", title: "Refresh GPS", children: _jsx(RefreshCw, { className: `w-3.5 h-3.5 ${isLocating ? 'animate-spin text-purple-400' : ''}` }) })] }), _jsx("div", { className: "flex-1 flex flex-col justify-center", children: _jsx(WorldMapSvg, { location: location, onSelectLocation: handleSpeakLocation, isSpeakingLocation: isLocationActive }) })] }) })] }), _jsxs("div", { className: "w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3 shadow-inner", children: [_jsxs("div", { className: "flex flex-col min-w-0", children: [_jsxs("p", { className: "text-xs sm:text-sm font-semibold text-amber-300 truncate", children: ["\"", fullSpeech.en, "\""] }), _jsxs("p", { className: "text-xs sm:text-sm font-semibold text-slate-300 truncate mt-0.5", children: ["\u300C", fullSpeech.zh, "\u300D"] })] }), _jsx("button", { type: "button", onClick: handleSpeakAll, className: "text-slate-400 hover:text-indigo-300 p-1.5 rounded-lg hover:bg-slate-900 transition-colors shrink-0 cursor-pointer", "aria-label": "Play full orientation statement", title: "Play aloud", children: _jsx(Volume2, { className: "w-4 h-4" }) })] })] }));
};
