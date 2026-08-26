import React from 'react';
import { WeekdayDef, getWeekDates } from '../../services/location/locationService';
import { DebouncedTouchable } from '../common/DebouncedTouchable';

interface WeekdayBarProps {
  currentDate: Date;
  onSelectDay: (day: WeekdayDef, isToday: boolean) => void;
  debounceMs?: number;
  activeGlowDayIndex?: number | null;
}

export const WeekdayBar: React.FC<WeekdayBarProps> = ({
  currentDate,
  onSelectDay,
  debounceMs = 200,
  activeGlowDayIndex = null,
}) => {
  const weekDays = getWeekDates(currentDate);

  return (
    <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 w-full select-none pt-1">
      {weekDays.map(({ weekday, dayOfMonth, isToday }) => {
        const isGlowSpeaking = activeGlowDayIndex === weekday.index;

        return (
          <DebouncedTouchable
            key={weekday.name}
            onPress={() => onSelectDay(weekday, isToday)}
            debounceMs={debounceMs}
            minTouchSize="md"
            className={`
              relative flex flex-col items-center justify-between min-h-[58px] sm:min-h-[68px] py-2 sm:py-2.5 px-0.5 sm:px-1.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer
              ${
                isGlowSpeaking
                  ? 'bg-amber-500/40 border-amber-300 ring-4 ring-amber-300 scale-105 shadow-xl brightness-125 z-20 animate-pulse'
                  : isToday
                  ? 'bg-gradient-to-b from-amber-500/30 via-amber-600/30 to-slate-900 border-amber-400 shadow-lg shadow-amber-950/60 ring-2 ring-amber-400/50 scale-105 z-10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 hover:border-slate-700'
              }
            `}
            aria-label={`${weekday.name}, ${weekday.nameZh}, ${dayOfMonth}${isToday ? ' (Today)' : ''}`}
            aria-current={isToday ? 'date' : undefined}
          >
            {/* Today Badge */}
            {isToday && (
              <div className="absolute -top-2.5 inset-x-0 flex items-center justify-center pointer-events-none">
                <span className="bg-amber-400 text-slate-950 text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full shadow">
                  Today
                </span>
              </div>
            )}

            {/* Day Short Name in English */}
            <span
              className={`
                text-[10px] sm:text-[11px] font-black uppercase tracking-tight
                ${isToday ? 'text-amber-300 pt-0.5' : 'text-slate-400'}
              `}
            >
              {weekday.nameShort}
            </span>

            {/* Day Number (Day of Month) */}
            <span
              className={`
                text-sm sm:text-base font-black leading-none font-mono
                ${isToday ? 'text-white scale-110 drop-shadow' : 'text-slate-200'}
              `}
            >
              {dayOfMonth}
            </span>

            {/* Day Name in Traditional Chinese */}
            <span
              className={`
                text-[10px] sm:text-[11px] font-extrabold
                ${isToday ? 'text-amber-200 font-black' : 'text-slate-400'}
              `}
            >
              {weekday.nameZhShort}
            </span>
          </DebouncedTouchable>
        );
      })}
    </div>
  );
};
