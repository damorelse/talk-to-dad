import React, { useState, useEffect, useCallback } from 'react';
import { UserLocationInfo } from '../../types';
import {
  detectUserLocation,
  getFallbackLocationFromTimezone,
  formatWeekdaySpeech,
  formatDateSpeech,
  formatTimeSpeech,
  formatLocationSpeech,
  formatFullOrientationSpeech,
  getDayPeriod,
  getGreeting,
  WEEKDAYS,
  WeekdayDef,
} from '../../services/location/locationService';
import { WeekdayBar } from './WeekdayBar';
import { WorldMapSvg } from './WorldMapSvg';
import { DebouncedTouchable } from '../common/DebouncedTouchable';
import { useAudio } from '../../hooks/useAudio';
import {
  Volume2,
  Calendar,
  Clock,
  RefreshCw,
  Compass,
  VolumeX,
} from 'lucide-react';

export const TodayOrientationView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [location, setLocation] = useState<UserLocationInfo>(() => getFallbackLocationFromTimezone());
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [activeSpeechType, setActiveSpeechType] = useState<'all' | 'weekday' | 'date' | 'time' | 'location' | null>(null);

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
    } catch (err) {
      console.warn('Location detection error:', err);
    } finally {
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

  const handleSpeakWeekday = async (day?: WeekdayDef, isToday: boolean = true) => {
    setActiveSpeechType('weekday');
    let en = '';
    let zh = '';
    if (!day || isToday) {
      const sp = formatWeekdaySpeech(currentDate);
      en = sp.en;
      zh = sp.zh;
    } else {
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

  return (
    <div className="w-full h-full flex flex-col gap-3 overflow-y-auto p-1 select-none scrollbar-thin">
      {/* 1. CLEAN HERO GREETING & MASTER SPEAK ALL */}
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3 shadow-lg flex items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl sm:text-3xl shrink-0 drop-shadow">
            {greeting.icon}
          </span>
          <div className="flex items-baseline gap-2 min-w-0 flex-wrap">
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight truncate">
              {greeting.en}
            </h1>
            <span className="text-sm sm:text-base font-extrabold text-indigo-300">
              {greeting.zh}
            </span>
          </div>
        </div>

        {/* Master Speak All & Stop Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <DebouncedTouchable
            onPress={handleSpeakAll}
            minTouchSize="lg"
            className={`
              px-4 sm:px-5 py-2.5 rounded-xl font-black text-white flex items-center gap-2 shadow-lg transition-all duration-200 text-xs sm:text-sm cursor-pointer
              ${
                isSpeaking && activeSpeechType === 'all'
                  ? 'bg-indigo-500 ring-4 ring-indigo-300/60 scale-105 shadow-indigo-500/50'
                  : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 hover:scale-[1.02]'
              }
            `}
            aria-label="Speak all orientation information aloud"
          >
            <Volume2 className="w-4 h-4 stroke-[2.5]" />
            <span>Speak All · 朗讀全部</span>
          </DebouncedTouchable>

          {isSpeaking && (
            <button
              type="button"
              onClick={stopAll}
              className="px-3 py-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-xl text-xs font-black shadow border border-rose-400 flex items-center gap-1.5 transition-all cursor-pointer"
              aria-label="Stop speaking"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. BALANCED 4-CARD ORIENTATION GRID */}
      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-0">
        {/* LEFT COLUMN: 1. Time (top), 2. Date (middle), 3. Weekday (bottom) */}
        <div className="flex flex-col gap-3">
          {/* Card 1: Bedside Digital Clock (Top Left) */}
          <DebouncedTouchable
            onPress={handleSpeakTime}
            minTouchSize="lg"
            className={`
              bg-slate-900 border-2 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-lg transition-all duration-200 cursor-pointer group
              ${
                isTimeActive
                  ? 'border-emerald-400 ring-4 ring-emerald-400/40 shadow-emerald-950/60'
                  : 'border-slate-800 hover:border-emerald-500/60'
              }
            `}
            aria-label={`Current time: ${displayHours12}:${minStr} ${ampm}. Tap to hear.`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Day Phase Icon Badge */}
              <div className="w-16 h-18 sm:w-18 sm:h-20 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white flex flex-col items-center justify-center shadow-md border border-emerald-400/40 shrink-0">
                <span className="text-2xl sm:text-3xl drop-shadow">{dayPeriod.icon}</span>
                <span className="text-[10px] font-black uppercase text-emerald-100 mt-0.5 tracking-wider">
                  {dayPeriod.zh}
                </span>
              </div>

              {/* Clock Digits & Chinese Time */}
              <div className="flex flex-col text-left min-w-0">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Live Time · 現在時間
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                    {displayHours12}:{minStr}
                  </span>
                  <span className="text-xs font-black text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    {ampm}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-emerald-200 mt-0.5 truncate">
                  {dayPeriod.zh} {displayHours12} 點 {minutes === 0 ? '整' : `${minutes} 分`}
                </span>
              </div>
            </div>

            <div className="shrink-0 text-emerald-400 group-hover:text-white transition-colors p-2">
              <Volume2 className="w-4 h-4" />
            </div>
          </DebouncedTouchable>

          {/* Card 2: Date Card (Middle Left) */}
          <DebouncedTouchable
            onPress={handleSpeakDate}
            minTouchSize="lg"
            className={`
              bg-slate-900 border-2 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-lg transition-all duration-200 cursor-pointer group
              ${
                isDateActive
                  ? 'border-blue-400 ring-4 ring-blue-400/40 shadow-blue-950/60'
                  : 'border-slate-800 hover:border-blue-500/60'
              }
            `}
            aria-label={`Current date: ${monthName} ${dayNum}, ${year}. Tap to hear.`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Calendar Block */}
              <div className="w-16 h-18 sm:w-18 sm:h-20 rounded-xl bg-slate-100 text-slate-900 flex flex-col items-center overflow-hidden shadow-md border border-slate-300 shrink-0 select-none">
                <div className="w-full bg-rose-600 text-white py-0.5 text-center text-[10px] font-black uppercase tracking-wider">
                  {monthShort} · {monthNum}月
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
                    {dayNum}
                  </span>
                </div>
                <div className="w-full bg-slate-200 py-0.5 text-center text-[9px] font-black text-slate-600">
                  {year}
                </div>
              </div>

              {/* Date Text */}
              <div className="flex flex-col text-left min-w-0">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Date · 日曆日期
                </span>
                <span className="text-lg sm:text-xl font-black text-white group-hover:text-blue-300 transition-colors truncate">
                  {monthName} {dayNum}, {year}
                </span>
                <span className="text-xs sm:text-sm font-bold text-blue-200 mt-0.5">
                  {year} 年 {monthNum} 月 {dayNum} 日
                </span>
              </div>
            </div>

            <div className="shrink-0 text-blue-400 group-hover:text-white transition-colors p-2">
              <Volume2 className="w-4 h-4" />
            </div>
          </DebouncedTouchable>

          {/* Card 3: Weekday & Visual Weekday Strip (Bottom Left) */}
          <div
            className={`
              bg-slate-900 border-2 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg gap-2.5 transition-all duration-200
              ${
                isWeekdayActive
                  ? 'border-amber-400 ring-4 ring-amber-400/40 shadow-amber-950/60'
                  : 'border-slate-800 hover:border-slate-700'
              }
            `}
          >
            <div className="flex items-center justify-between px-0.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Weekday · 星期
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleSpeakWeekday()}
                className="text-sm sm:text-base font-black text-amber-300 hover:text-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{currentWeekday.name} ({currentWeekday.nameZh})</span>
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>

            {/* Visual 7-Day Weekday Tracker */}
            <WeekdayBar
              currentDate={currentDate}
              onSelectDay={(day, isToday) => handleSpeakWeekday(day, isToday)}
              activeGlowDayIndex={isWeekdayActive ? currentWeekday.index : null}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Location & World Map (Top Right) */}
        <div className="flex flex-col gap-3">
          <div
            className={`
              bg-slate-900 border-2 rounded-2xl p-3.5 flex flex-col justify-between gap-2.5 shadow-lg h-full transition-all duration-200
              ${
                isLocationActive
                  ? 'border-purple-400 ring-4 ring-purple-400/40 shadow-purple-950/60'
                  : 'border-slate-800 hover:border-slate-700'
              }
            `}
          >
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Location · 所在位置
                </span>
              </div>
              <button
                type="button"
                onClick={refreshLocation}
                disabled={isLocating}
                className="p-1 text-slate-400 hover:text-purple-300 transition-colors disabled:opacity-50 cursor-pointer"
                aria-label="Refresh location"
                title="Refresh GPS"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-purple-400' : ''}`} />
              </button>
            </div>

            {/* High-Contrast SVG World Map */}
            <div className="flex-1 flex flex-col justify-center">
              <WorldMapSvg
                location={location}
                onSelectLocation={handleSpeakLocation}
                isSpeakingLocation={isLocationActive}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. CLEAN TRANSCRIPTION SUBTITLE BAR */}
      <div className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3 shadow-inner">
        <div className="flex flex-col min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-amber-300 truncate">
            "{fullSpeech.en}"
          </p>
          <p className="text-xs sm:text-sm font-semibold text-slate-300 truncate mt-0.5">
            「{fullSpeech.zh}」
          </p>
        </div>

        <button
          type="button"
          onClick={handleSpeakAll}
          className="text-slate-400 hover:text-indigo-300 p-1.5 rounded-lg hover:bg-slate-900 transition-colors shrink-0 cursor-pointer"
          aria-label="Play full orientation statement"
          title="Play aloud"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
