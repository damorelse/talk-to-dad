import React from 'react';
import { UserLocationInfo } from '../../types';
import { getCountryFlag } from '../../services/location/locationService';
import { Volume2 } from 'lucide-react';
import { DebouncedTouchable } from '../common/DebouncedTouchable';

interface WorldMapSvgProps {
  location: UserLocationInfo;
  onSelectLocation?: () => void;
  isSpeakingLocation?: boolean;
  debounceMs?: number;
}

export const WorldMapSvg: React.FC<WorldMapSvgProps> = ({
  location,
  onSelectLocation,
  isSpeakingLocation = false,
  debounceMs = 200,
}) => {
  const flag = getCountryFlag(location.country || '');

  // Formatted city, state, country
  const cityState = location.city
    ? `${location.city}${location.state ? `, ${location.state}` : ''}`
    : 'Local Area';
  const countryName = location.country || 'United States';

  const fullLocationZh = [
    location.countryZh,
    location.stateZh,
    location.cityZh,
  ]
    .filter(Boolean)
    .join('');

  return (
    <div
      className={`
        w-full h-full flex flex-col items-center justify-between gap-4 p-4 sm:p-6 rounded-xl bg-slate-950/80 border transition-all duration-200
        ${
          isSpeakingLocation
            ? 'border-rose-400/60 bg-rose-950/20 shadow-lg shadow-rose-950/50'
            : 'border-slate-800/80'
        }
      `}
    >
      {/* Flag and Location Information */}
      <div className="flex flex-col items-center text-center gap-2.5 my-auto">
        {/* Country Flag Emoji (>=48px) */}
        <span
          className="text-5xl sm:text-6xl md:text-7xl shrink-0 drop-shadow-md select-none transform transition-transform group-hover:scale-105"
          role="img"
          aria-label={countryName}
        >
          {flag}
        </span>

        {/* Bilingual City & State / Country */}
        <div className="flex flex-col items-center gap-1 min-w-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
            {cityState}
          </h2>
          <span className="text-sm sm:text-base font-extrabold text-slate-300">
            {countryName}
          </span>
          {fullLocationZh && (
            <span className="text-base sm:text-lg md:text-xl font-black text-rose-300 mt-1">
              {fullLocationZh}
            </span>
          )}
        </div>
      </div>

      {/* 1-Tap Audio Speech Button */}
      {onSelectLocation && (
        <DebouncedTouchable
          onPress={onSelectLocation}
          debounceMs={debounceMs}
          minTouchSize="md"
          className={`
            w-full max-w-xs h-11 sm:h-12 px-4 rounded-xl font-black text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border text-xs sm:text-sm
            ${
              isSpeakingLocation
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 border-rose-300 ring-4 ring-rose-400/50 scale-105 shadow-rose-500/50 animate-pulse'
                : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:from-rose-700 active:to-rose-800 border-rose-500/40 shadow-rose-950/50 hover:scale-[1.02]'
            }
          `}
          aria-label="Hear location aloud"
        >
          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] text-white shrink-0" />
          <span className="font-black tracking-wide text-white whitespace-nowrap">
            Hear Location · 朗讀位置
          </span>
        </DebouncedTouchable>
      )}
    </div>
  );
};
