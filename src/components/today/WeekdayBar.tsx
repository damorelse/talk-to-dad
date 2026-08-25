import React from 'react';
import { WeekdayDef, getWeekDates } from '../../services/location/locationService';
import { DebouncedTouchable } from '../common/DebouncedTouchable';
import { CalendarCheck, Sparkles } from 'lucide-react';

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
    <div className="w-full flex flex-col gap-2 select-none">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <CalendarCheck className="w-4 h-4 text-amber-400" />
          <span className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
            Day of Week · 星期與日期表
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          Tap any day to speak · 點選任一日發音
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 w-full">
        {weekDays.map(({ weekday, dayOfMonth, isToday }) => {
          const isGlowSpeaking = activeGlowDayIndex === weekday.index;

          return (
            <DebouncedTouchable
              key={weekday.name}
              onPress={() => onSelectDay(weekday, isToday)}
              debounceMs={debounceMs}
              minTouchSize="md"
              className={`
                relative flex flex-col items-center justify-between min-h-[80px] sm:min-h-[92px] py-2 px-1 sm:px-2 rounded-2xl border-2 sm:border-3 transition-all duration-200 cursor-pointer
                ${
                  isGlowSpeaking
                    ? 'bg-amber-500/40 border-amber-300 ring-4 ring-amber-300 scale-105 shadow-2xl brightness-125 z-20 animate-pulse'
                    : isToday
                    ? 'bg-gradient-to-b from-amber-500/30 via-amber-600/40 to-slate-950 border-amber-400 shadow-xl shadow-amber-950/60 ring-4 ring-amber-400/40 scale-105 z-10 brightness-110'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 hover:border-slate-700'
                }
              `}
              aria-label={`${weekday.name}, ${weekday.nameZh}, ${dayOfMonth}${isToday ? ' (Today)' : ''}`}
              aria-current={isToday ? 'date' : undefined}
            >
              {/* Today Badge */}
              {isToday && (
                <div className="absolute -top-2.5 inset-x-0 flex items-center justify-center pointer-events-none">
                  <span className="bg-amber-400 text-amber-950 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5 fill-amber-950 stroke-[2]" />
                    <span>Today</span>
                  </span>
                </div>
              )}

              {/* Day Short Name in English */}
              <span
                className={`
                  text-[11px] sm:text-xs font-black uppercase tracking-tight
                  ${isToday ? 'text-amber-300 pt-0.5' : 'text-slate-400'}
                `}
              >
                {weekday.nameShort}
              </span>

              {/* Day Number (Day of Month) */}
              <span
                className={`
                  text-base sm:text-xl font-black leading-none my-0.5 font-mono
                  ${isToday ? 'text-white scale-110 drop-shadow' : 'text-slate-200'}
                `}
              >
                {dayOfMonth}
              </span>

              {/* Day Name in Traditional Chinese */}
              <span
                className={`
                  text-[11px] sm:text-xs font-extrabold
                  ${isToday ? 'text-amber-200 font-black' : 'text-slate-400'}
                `}
              >
                {weekday.nameZhShort}
              </span>

              {/* Status indicator dot */}
              <div className="mt-0.5 flex items-center justify-center">
                <div
                  className={`
                    w-1.5 h-1.5 rounded-full
                    ${isToday ? 'bg-amber-400 shadow-sm shadow-amber-300 animate-pulse' : 'bg-slate-700'}
                  `}
                />
              </div>
            </DebouncedTouchable>
          );
        })}
      </div>
    </div>
  );
};
