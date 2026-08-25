import React from 'react';
import { DebouncedTouchable } from '../common/DebouncedTouchable';
import { PainLevelDef, WONG_BAKER_PAIN_LEVELS } from '../../types/painData';

export { WONG_BAKER_PAIN_LEVELS };
export type { PainLevelDef };

interface FacesScaleProps {
  selectedPainLevel: number | null;
  onSelectPainLevel: (level: number) => void;
  debounceMs?: number;
}

export const FacesScale: React.FC<FacesScaleProps> = ({
  selectedPainLevel,
  onSelectPainLevel,
  debounceMs = 250,
}) => {
  return (
    <div className="w-full flex flex-col gap-2 select-none">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
          2. How Much Does It Hurt? · 疼痛程度
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full">
        {WONG_BAKER_PAIN_LEVELS.map((item) => {
          const isSelected = selectedPainLevel === item.level;

          return (
            <DebouncedTouchable
              key={item.level}
              onPress={() => onSelectPainLevel(item.level)}
              debounceMs={debounceMs}
              minTouchSize="md"
              className={`
                flex flex-col items-center justify-between p-2 rounded-2xl border-4 transition-all duration-150
                ${item.bgClass} ${item.borderClass}
                ${
                  isSelected
                    ? 'ring-4 ring-yellow-400 scale-105 shadow-2xl z-10 brightness-125'
                    : 'opacity-85 hover:opacity-100'
                }
              `}
              aria-label={`Pain rating ${item.level}: ${item.label}`}
              aria-pressed={isSelected}
            >
              <span className="text-3xl sm:text-4xl drop-shadow-md my-0.5 select-none">
                {item.emoji}
              </span>
              <span className="text-lg sm:text-xl font-black text-white">
                {item.level}
              </span>
              <div className="flex flex-col items-center justify-center text-center">
                <span className={`text-xs sm:text-sm font-black leading-tight ${item.colorClass}`}>
                  {item.label}
                </span>
                <span className="text-xs sm:text-sm text-slate-100 font-extrabold leading-tight mt-0.5">
                  {item.labelZh}
                </span>
              </div>
            </DebouncedTouchable>
          );
        })}
      </div>
    </div>
  );
};
