import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback } from 'react';
import { detectUserLocation, getFallbackLocationFromTimezone, formatWeekdaySpeech, formatDateSpeech, formatTimeSpeech, formatLocationSpeech, formatFullOrientationSpeech, getDayPeriod, getGreeting, WEEKDAYS, } from '../../services/location/locationService.js';
import { WeekdayBar } from './WeekdayBar.js';
import { WorldMapSvg } from './WorldMapSvg.js';
import { DebouncedTouchable } from '../common/DebouncedTouchable.js';
import { useAudio } from '../../hooks/useAudio.js';
import { Volume2, Calendar, Clock, RefreshCw, Compass, VolumeX, } from 'lucide-react';
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
    // Active Glow Indicators for Visual-Audio Synchrony
    const isWeekdayActive = isSpeaking && (activeSpeechType === 'weekday' || activeSpeechType === 'all');
    const isDateActive = isSpeaking && (activeSpeechType === 'date' || activeSpeechType === 'all');
    const isTimeActive = isSpeaking && (activeSpeechType === 'time' || activeSpeechType === 'all');
    const isLocationActive = isSpeaking && (activeSpeechType === 'location' || activeSpeechType === 'all');
    return (_jsxs("div", { className: "w-full h-full flex flex-col gap-3 overflow-y-auto p-1 select-none scrollbar-thin", children: [_jsxs("div", { className: "w-full bg-transparent px-1.5 py-1 flex items-center justify-between gap-3 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-3.5 min-w-0", children: [_jsx("span", { className: "text-3xl sm:text-4xl shrink-0 drop-shadow", children: greeting.icon }), _jsxs("div", { className: "flex items-baseline gap-2.5 min-w-0 flex-wrap", children: [_jsx("h1", { className: "text-xl sm:text-2xl font-black text-white tracking-tight truncate", children: greeting.en }), _jsx("span", { className: "text-base sm:text-lg font-extrabold text-indigo-300", children: greeting.zh })] })] }), _jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [_jsxs(DebouncedTouchable, { onPress: handleSpeakAll, minTouchSize: "lg", className: `
              px-4 sm:px-5 py-2.5 rounded-xl font-black text-white flex items-center gap-2 shadow-lg transition-all duration-200 text-sm sm:text-base cursor-pointer
              ${isSpeaking && activeSpeechType === 'all'
                                    ? 'bg-indigo-500 ring-4 ring-indigo-300/60 scale-105 shadow-indigo-500/50'
                                    : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 hover:scale-[1.02]'}
            `, "aria-label": "Speak orientation information aloud", children: [_jsx(Volume2, { className: "w-5 h-5 stroke-[2.5]" }), _jsx("span", { children: "Speak" })] }), isSpeaking && (_jsxs("button", { type: "button", onClick: stopAll, className: "px-3 py-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-xl text-xs font-black shadow border border-rose-400 flex items-center gap-1.5 transition-all cursor-pointer", "aria-label": "Stop speaking", children: [_jsx(VolumeX, { className: "w-4 h-4" }), _jsx("span", { children: "Stop" })] }))] })] }), _jsxs("div", { className: "w-full flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3.5 min-h-0", children: [_jsxs("div", { className: "flex flex-col gap-3.5", children: [_jsxs(DebouncedTouchable, { onPress: handleSpeakTime, minTouchSize: "lg", className: `
              bg-slate-900 border-2 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg transition-all duration-200 cursor-pointer group
              ${isTimeActive
                                    ? 'border-emerald-400 ring-4 ring-emerald-400/40 shadow-emerald-950/60'
                                    : 'border-slate-800 hover:border-emerald-500/60'}
            `, "aria-label": `Current time: ${displayHours12}:${minStr} ${ampm}. Tap to hear.`, children: [_jsxs("div", { className: "flex items-center justify-between w-full", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "w-5 h-5 text-emerald-400" }), _jsx("span", { className: "text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider", children: "Time \u00B7 \u73FE\u5728\u6642\u9593" })] }), _jsx("div", { className: "text-emerald-400 group-hover:text-white transition-colors p-1", children: _jsx(Volume2, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "flex flex-col my-auto py-2", children: [_jsxs("div", { className: "flex items-baseline gap-3", children: [_jsxs("span", { className: "text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight text-white group-hover:text-emerald-300 transition-colors", children: [displayHours12, ":", minStr] }), _jsx("span", { className: "text-xs sm:text-sm font-black text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-md border border-emerald-500/30", children: ampm })] }), _jsxs("span", { className: "text-sm sm:text-base font-bold text-emerald-200 mt-1 truncate", children: [dayPeriod.zh, " ", displayHours12, " \u9EDE ", minutes === 0 ? '整' : `${minutes} 分`] })] })] }), _jsxs(DebouncedTouchable, { onPress: handleSpeakDate, minTouchSize: "lg", className: `
              bg-slate-900 border-2 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg transition-all duration-200 cursor-pointer group
              ${isDateActive
                                    ? 'border-blue-400 ring-4 ring-blue-400/40 shadow-blue-950/60'
                                    : 'border-slate-800 hover:border-blue-500/60'}
            `, "aria-label": `Current date: ${monthName} ${dayNum}, ${year}. Tap to hear.`, children: [_jsxs("div", { className: "flex items-center justify-between w-full", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "w-5 h-5 text-blue-400" }), _jsx("span", { className: "text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider", children: "Date \u00B7 \u65E5\u66C6\u65E5\u671F" })] }), _jsx("div", { className: "text-blue-400 group-hover:text-white transition-colors p-1", children: _jsx(Volume2, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "flex items-center gap-3.5 sm:gap-4 my-auto py-2 min-w-0", children: [_jsxs("div", { className: "w-14 h-16 sm:w-16 sm:h-18 rounded-xl bg-slate-100 text-slate-900 flex flex-col items-center overflow-hidden shadow-md border border-slate-300 shrink-0 select-none", children: [_jsxs("div", { className: "w-full bg-rose-600 text-white py-0.5 text-center text-[10px] sm:text-[11px] font-black uppercase tracking-wider", children: [monthShort, " \u00B7 ", monthNum, "\u6708"] }), _jsx("div", { className: "flex-1 flex items-center justify-center", children: _jsx("span", { className: "text-2xl sm:text-3xl font-black text-slate-900 leading-none", children: dayNum }) }), _jsx("div", { className: "w-full bg-slate-200 py-0.5 text-center text-[9px] sm:text-[10px] font-black text-slate-600", children: year })] }), _jsxs("div", { className: "flex flex-col text-left min-w-0", children: [_jsxs("span", { className: "text-xl sm:text-2xl lg:text-3xl font-black text-white group-hover:text-blue-300 transition-colors truncate", children: [monthName, " ", dayNum, ", ", year] }), _jsxs("span", { className: "text-sm sm:text-base font-bold text-blue-200 mt-1", children: [year, " \u5E74 ", monthNum, " \u6708 ", dayNum, " \u65E5"] })] })] })] }), _jsxs("div", { onClick: () => handleSpeakWeekday(), className: `
              bg-slate-900 border-2 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg gap-3 transition-all duration-200 cursor-pointer group
              ${isWeekdayActive
                                    ? 'border-amber-400 ring-4 ring-amber-400/40 shadow-amber-950/60'
                                    : 'border-slate-800 hover:border-amber-500/60'}
            `, role: "button", tabIndex: 0, "aria-label": `Current weekday: ${currentWeekday.name}, ${currentWeekday.nameZh}. Tap to hear.`, onKeyDown: (e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleSpeakWeekday();
                                    }
                                }, children: [_jsxs("div", { className: "flex items-center justify-between w-full", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "w-5 h-5 text-amber-400" }), _jsx("span", { className: "text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider", children: "Weekday \u00B7 \u661F\u671F" })] }), _jsxs("div", { className: "text-sm sm:text-base font-black text-amber-300 group-hover:text-amber-200 flex items-center gap-1.5 transition-colors", children: [_jsxs("span", { children: [currentWeekday.name, " (", currentWeekday.nameZh, ")"] }), _jsx(Volume2, { className: "w-4 h-4 text-amber-400 group-hover:text-white transition-colors" })] })] }), _jsx("div", { className: "my-auto py-1", onClick: (e) => e.stopPropagation(), children: _jsx(WeekdayBar, { currentDate: currentDate, onSelectDay: (day, isToday) => handleSpeakWeekday(day, isToday), activeGlowDayIndex: isWeekdayActive ? currentWeekday.index : null }) })] })] }), _jsx("div", { className: "flex flex-col", children: _jsxs("div", { onClick: handleSpeakLocation, className: `
              bg-slate-900 border-2 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3.5 shadow-lg h-full transition-all duration-200 cursor-pointer group
              ${isLocationActive
                                ? 'border-purple-400 ring-4 ring-purple-400/40 shadow-purple-950/60'
                                : 'border-slate-800 hover:border-purple-500/60'}
            `, role: "button", tabIndex: 0, "aria-label": `Current location: ${location.city || 'Unknown'}, ${location.country || ''}. Tap to hear.`, onKeyDown: (e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleSpeakLocation();
                                }
                            }, children: [_jsxs("div", { className: "flex items-center justify-between w-full", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Compass, { className: "w-5 h-5 text-purple-400" }), _jsx("span", { className: "text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider", children: "Location \u00B7 \u6240\u5728\u4F4D\u7F6E" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { type: "button", onClick: (e) => {
                                                        e.stopPropagation();
                                                        refreshLocation();
                                                    }, disabled: isLocating, className: "p-1 text-slate-400 hover:text-purple-300 transition-colors disabled:opacity-50 cursor-pointer", "aria-label": "Refresh location", title: "Refresh GPS", children: _jsx(RefreshCw, { className: `w-4 h-4 ${isLocating ? 'animate-spin text-purple-400' : ''}` }) }), _jsx("div", { className: "text-purple-400 group-hover:text-white transition-colors p-1", "aria-hidden": "true", children: _jsx(Volume2, { className: "w-5 h-5" }) })] })] }), _jsx("div", { className: "flex-1 flex flex-col justify-center min-h-[300px] sm:min-h-[360px]", children: _jsx(WorldMapSvg, { location: location, onSelectLocation: handleSpeakLocation, isSpeakingLocation: isLocationActive }) })] }) })] })] }));
};
