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
    // Keep live time synchronized every second (updating minutes without seconds visual flicker)
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
    return (_jsxs("div", { className: "w-full h-full flex flex-col gap-3.5 overflow-y-auto p-1 select-none scrollbar-thin", children: [_jsxs("div", { className: "w-full bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border-2 border-indigo-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-3.5 sm:gap-4 text-center sm:text-left min-w-0", children: [_jsx("div", { className: "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-600/30 border-2 border-indigo-400/60 flex items-center justify-center text-indigo-300 shrink-0 text-3xl sm:text-4xl shadow-lg shadow-indigo-950/80", children: greeting.icon }), _jsxs("div", { className: "flex flex-col min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 justify-center sm:justify-start flex-wrap", children: [_jsx("h1", { className: "text-xl sm:text-2xl font-black text-white tracking-tight", children: greeting.en }), _jsx("span", { className: "text-sm sm:text-base font-extrabold text-indigo-300 bg-indigo-500/20 border border-indigo-400/40 px-2.5 py-0.5 rounded-full", children: greeting.zh })] }), _jsxs("p", { className: "text-xs sm:text-sm font-bold text-slate-300 mt-1 truncate", children: ["Today is ", currentWeekday.name, ", ", monthName, " ", dayNum, " \u00B7 \u4ECA\u5929\u662F ", year, " \u5E74 ", monthNum, " \u6708 ", dayNum, " \u65E5 (", currentWeekday.nameZh, ")"] })] })] }), _jsxs("div", { className: "flex items-center gap-2.5 w-full sm:w-auto shrink-0", children: [_jsxs(DebouncedTouchable, { onPress: handleSpeakAll, minTouchSize: "lg", className: `
              flex-1 sm:flex-initial px-6 sm:px-7 py-3.5 rounded-2xl font-black text-white flex items-center justify-center gap-3 shadow-xl transition-all duration-200 text-sm sm:text-base cursor-pointer
              ${isSpeaking && activeSpeechType === 'all'
                                    ? 'bg-indigo-500 ring-4 ring-indigo-300 scale-105 shadow-indigo-500/50 brightness-125 animate-pulse'
                                    : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 shadow-indigo-900/50 hover:scale-[1.02]'}
            `, "aria-label": "Speak all orientation information aloud", children: [_jsx(Volume2, { className: `w-5 h-5 stroke-[2.5] ${isSpeaking ? 'animate-bounce text-amber-300' : ''}` }), _jsxs("div", { className: "flex flex-col items-start leading-tight", children: [_jsx("span", { className: "text-sm sm:text-base", children: "Speak All" }), _jsx("span", { className: "text-[11px] font-extrabold text-indigo-200", children: "\u6717\u8B80\u5168\u90E8\u6642\u7A7A" })] })] }), isSpeaking && (_jsxs("button", { type: "button", onClick: stopAll, className: "px-4 py-3.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-2xl text-xs font-black shadow-lg border border-rose-400 flex items-center gap-1.5 transition-all cursor-pointer", "aria-label": "Stop speaking", children: [_jsx(VolumeX, { className: "w-4 h-4" }), _jsx("span", { children: "Stop \u505C\u6B62" })] }))] })] }), _jsxs("div", { className: "w-full flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3.5 min-h-0", children: [_jsxs("div", { className: "flex flex-col gap-3.5", children: [_jsxs("div", { className: `
              bg-slate-900 border-2 rounded-3xl p-4 flex flex-col justify-between shadow-xl gap-3.5 transition-all duration-300
              ${isWeekdayActive
                                    ? 'border-amber-400 ring-4 ring-amber-400/40 shadow-amber-950/60 brightness-110'
                                    : 'border-slate-700/80 hover:border-slate-600'}
            `, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 shadow-inner", children: _jsx(Calendar, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("span", { className: "text-xs font-extrabold text-slate-400 uppercase tracking-wider block", children: "Weekday \u00B7 \u661F\u671F" }), _jsxs("span", { className: "text-lg sm:text-xl font-black text-white", children: [currentWeekday.name, " (", currentWeekday.nameZh, ")"] })] })] }), _jsxs(DebouncedTouchable, { onPress: () => handleSpeakWeekday(), minTouchSize: "md", className: `
                  border px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow transition-colors cursor-pointer
                  ${isWeekdayActive
                                                    ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-white'
                                                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/40'}
                `, "aria-label": "Speak current weekday", children: [_jsx(Volume2, { className: "w-4 h-4" }), _jsx("span", { children: "Speak \u661F\u671F" })] })] }), _jsx(WeekdayBar, { currentDate: currentDate, onSelectDay: (day, isToday) => handleSpeakWeekday(day, isToday), activeGlowDayIndex: isWeekdayActive ? currentWeekday.index : null })] }), _jsxs("div", { className: `
              bg-slate-900 border-2 rounded-3xl p-4 flex flex-col justify-between shadow-xl gap-3.5 transition-all duration-300
              ${isDateActive
                                    ? 'border-blue-400 ring-4 ring-blue-400/40 shadow-blue-950/60 brightness-110'
                                    : 'border-slate-700/80 hover:border-slate-600'}
            `, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-300 shadow-inner", children: _jsx(Calendar, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("span", { className: "text-xs font-extrabold text-slate-400 uppercase tracking-wider block", children: "Date \u00B7 \u65E5\u66C6\u65E5\u671F" }), _jsx("span", { className: "text-xs text-slate-400 font-medium", children: "Month, Day & Year Calendar" })] })] }), _jsxs(DebouncedTouchable, { onPress: handleSpeakDate, minTouchSize: "md", className: `
                  border px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow transition-colors cursor-pointer
                  ${isDateActive
                                                    ? 'bg-blue-500 text-white border-blue-300 ring-2 ring-white'
                                                    : 'bg-slate-800 hover:bg-slate-700 text-blue-300 border-blue-500/40'}
                `, "aria-label": "Speak current date", children: [_jsx(Volume2, { className: "w-4 h-4" }), _jsx("span", { children: "Speak \u65E5\u671F" })] })] }), _jsxs(DebouncedTouchable, { onPress: handleSpeakDate, minTouchSize: "lg", className: "w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-inner hover:border-blue-500/60 hover:shadow-blue-950/30 transition-all cursor-pointer group", children: [_jsxs("div", { className: "flex items-center gap-4 min-w-0", children: [_jsxs("div", { className: "w-20 h-22 sm:w-22 sm:h-24 rounded-2xl bg-slate-100 text-slate-900 flex flex-col items-center overflow-hidden shadow-2xl border-2 border-slate-300 shrink-0 select-none", children: [_jsxs("div", { className: "w-full bg-rose-600 text-white py-1 flex items-center justify-between px-2.5 border-b border-rose-700 shadow-sm", children: [_jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-slate-900/60" }), _jsxs("span", { className: "text-[11px] font-black uppercase tracking-wider", children: [monthShort, " \u00B7 ", monthNum, "\u6708"] }), _jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-slate-900/60" })] }), _jsx("div", { className: "flex-1 flex items-center justify-center", children: _jsx("span", { className: "text-3xl sm:text-4xl font-black text-slate-900 leading-none", children: dayNum }) }), _jsx("div", { className: "w-full bg-slate-200/80 py-0.5 text-center text-[10px] font-black text-slate-600 border-t border-slate-300", children: year })] }), _jsxs("div", { className: "flex flex-col text-left min-w-0", children: [_jsxs("span", { className: "text-lg sm:text-2xl font-black text-white group-hover:text-blue-300 transition-colors truncate", children: [monthName, " ", dayNum, ", ", year] }), _jsxs("span", { className: "text-sm sm:text-base font-extrabold text-blue-200 mt-0.5", children: [year, " \u5E74 ", monthNum, " \u6708 ", dayNum, " \u65E5"] }), _jsxs("span", { className: "text-xs font-bold text-slate-400 mt-0.5", children: [currentWeekday.name, " \u00B7 ", currentWeekday.nameZh] })] })] }), _jsxs("div", { className: "shrink-0 hidden sm:flex items-center gap-1 text-xs font-black text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/30 group-hover:bg-blue-500 group-hover:text-white transition-colors", children: [_jsx(Volume2, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Tap to Hear" })] })] })] })] }), _jsxs("div", { className: "flex flex-col gap-3.5", children: [_jsxs("div", { className: `
              bg-slate-900 border-2 rounded-3xl p-4 flex flex-col justify-between shadow-xl gap-3.5 transition-all duration-300
              ${isTimeActive
                                    ? 'border-emerald-400 ring-4 ring-emerald-400/40 shadow-emerald-950/60 brightness-110'
                                    : 'border-slate-700/80 hover:border-slate-600'}
            `, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shadow-inner", children: _jsx(Clock, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("span", { className: "text-xs font-extrabold text-slate-400 uppercase tracking-wider block", children: "Live Time \u00B7 \u73FE\u5728\u6642\u9593" }), _jsx("span", { className: "text-xs text-slate-400 font-medium", children: "Calm 12-Hour Synchronized Clock" })] })] }), _jsxs(DebouncedTouchable, { onPress: handleSpeakTime, minTouchSize: "md", className: `
                  border px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow transition-colors cursor-pointer
                  ${isTimeActive
                                                    ? 'bg-emerald-500 text-slate-950 border-emerald-300 ring-2 ring-white'
                                                    : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border-emerald-500/40'}
                `, "aria-label": "Speak current time", children: [_jsx(Volume2, { className: "w-4 h-4" }), _jsx("span", { children: "Speak \u6642\u9593" })] })] }), _jsxs(DebouncedTouchable, { onPress: handleSpeakTime, minTouchSize: "lg", className: "w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-inner hover:border-emerald-500/60 hover:shadow-emerald-950/30 transition-all cursor-pointer group", children: [_jsxs("div", { className: "flex items-center gap-4 min-w-0", children: [_jsxs("div", { className: "w-20 h-22 sm:w-22 sm:h-24 rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white flex flex-col items-center justify-center shadow-2xl border-2 border-emerald-400/50 shrink-0", children: [_jsx("span", { className: "text-3xl sm:text-4xl drop-shadow", children: dayPeriod.icon }), _jsx("span", { className: "text-[10px] sm:text-[11px] font-black uppercase text-emerald-100 mt-1 tracking-wider", children: dayPeriod.en }), _jsx("span", { className: "text-[10px] font-bold text-emerald-200", children: dayPeriod.zh })] }), _jsxs("div", { className: "flex flex-col text-left min-w-0", children: [_jsxs("div", { className: "flex items-baseline gap-2", children: [_jsxs("span", { className: "text-3xl sm:text-4xl font-black font-mono tracking-tight text-white group-hover:text-emerald-300 transition-colors", children: [displayHours12, ":", minStr] }), _jsx("span", { className: "text-xs sm:text-sm font-black text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded-lg ml-1", children: ampm })] }), _jsxs("span", { className: "text-sm sm:text-base font-extrabold text-emerald-200 mt-1 truncate", children: [dayPeriod.zh, " ", displayHours12, " \u9EDE ", minutes === 0 ? '整' : `${minutes} 分`] }), _jsxs("span", { className: "text-xs font-bold text-slate-400 mt-0.5", children: [dayPeriod.en.toUpperCase(), " (", ampm, ")"] })] })] }), _jsxs("div", { className: "shrink-0 hidden sm:flex items-center gap-1 text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-white transition-colors", children: [_jsx(Volume2, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Tap to Hear" })] })] })] }), _jsxs("div", { className: `
              bg-slate-900 border-2 rounded-3xl p-4 flex flex-col justify-between shadow-xl gap-3.5 transition-all duration-300
              ${isLocationActive
                                    ? 'border-purple-400 ring-4 ring-purple-400/40 shadow-purple-950/60 brightness-110'
                                    : 'border-slate-700/80 hover:border-slate-600'}
            `, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-300 shadow-inner shrink-0", children: _jsx(Compass, { className: "w-5 h-5" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("span", { className: "text-xs font-extrabold text-slate-400 uppercase tracking-wider block", children: "World Location \u00B7 \u6240\u5728\u4F4D\u7F6E" }), _jsxs("span", { className: "text-xs font-black text-white truncate block", children: [location.city, location.state ? `, ${location.state}` : '', ", ", location.country] })] })] }), _jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [_jsx("button", { type: "button", onClick: refreshLocation, disabled: isLocating, className: "p-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-300 border border-slate-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer", "aria-label": "Refresh location via GPS", title: "Refresh location", children: _jsx(RefreshCw, { className: `w-3.5 h-3.5 ${isLocating ? 'animate-spin text-purple-400' : ''}` }) }), _jsxs(DebouncedTouchable, { onPress: handleSpeakLocation, minTouchSize: "md", className: `
                    border px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow transition-colors cursor-pointer
                    ${isLocationActive
                                                            ? 'bg-purple-500 text-white border-purple-300 ring-2 ring-white'
                                                            : 'bg-slate-800 hover:bg-slate-700 text-purple-300 border-purple-500/40'}
                  `, "aria-label": "Speak current location", children: [_jsx(Volume2, { className: "w-4 h-4" }), _jsx("span", { children: "Speak \u4F4D\u7F6E" })] })] })] }), _jsx(WorldMapSvg, { location: location, onSelectLocation: handleSpeakLocation, isSpeakingLocation: isLocationActive })] })] })] }), _jsxs("div", { className: "w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2 shadow-inner mt-1", children: [_jsxs("div", { className: "flex items-center justify-between text-xs font-extrabold text-slate-400", children: [_jsxs("div", { className: "flex items-center gap-2 text-slate-300", children: [_jsx("span", { children: "\uD83D\uDCAC Spoken Transcription Preview \u00B7 \u6717\u8B80\u8A9E\u53E5\u9810\u89BD" }), isSpeaking && (_jsxs("span", { className: "flex items-center gap-1 text-[11px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/40 animate-pulse", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-amber-400 animate-ping" }), "Speaking \u6B63\u5728\u6717\u8B80..."] }))] }), _jsxs("button", { type: "button", onClick: handleSpeakAll, className: "text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-black text-xs cursor-pointer transition-colors", children: [_jsx(Volume2, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Play Aloud \u64AD\u653E\u5168\u90E8" })] })] }), _jsxs("p", { className: "text-sm sm:text-base font-bold text-amber-300 tracking-wide leading-relaxed", children: ["\"", fullSpeech.en, "\""] }), _jsxs("p", { className: "text-sm sm:text-base font-bold text-white tracking-wide leading-relaxed pt-1.5 border-t border-slate-800/80", children: ["\u300C", fullSpeech.zh, "\u300D"] })] })] }));
};
