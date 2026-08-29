import React from 'react';
import { AACCard, FITZGERALD_COLOR_MAP } from '../../types';
import { DebouncedTouchable } from '../common/DebouncedTouchable';

interface GridCardProps {
  card: AACCard;
  onSelect: (card: AACCard) => void;
  onInspect?: (card: AACCard) => void;
  debounceMs?: number;
  isSelected?: boolean;
  fontSize?: 'standard' | 'large' | 'extra-large';
}

export const GridCard: React.FC<GridCardProps> = ({
  card,
  onSelect,
  onInspect,
  debounceMs = 300,
  isSelected = false,
  fontSize = 'large',
}) => {
  const fitzgerald = FITZGERALD_COLOR_MAP[card.fitzgeraldCategory] || FITZGERALD_COLOR_MAP.nouns;

  const enFontClasses = {
    standard: 'text-sm sm:text-base font-bold',
    large: 'text-base sm:text-lg md:text-xl font-bold',
    'extra-large': 'text-lg sm:text-xl md:text-2xl font-black',
  }[fontSize];

  const zhFontClasses = {
    standard: 'text-sm sm:text-base md:text-lg font-black',
    large: 'text-base sm:text-lg md:text-xl font-black',
    'extra-large': 'text-lg sm:text-xl md:text-2xl font-black',
  }[fontSize];

  return (
    <div
      className="relative w-full h-full"
      onContextMenu={(e) => {
        if (onInspect) {
          e.preventDefault();
          onInspect(card);
        }
      }}
    >
      <DebouncedTouchable
        onPress={() => onSelect(card)}
        debounceMs={debounceMs}
        minTouchSize="lg"
        className={`
          w-full h-full min-h-[145px] flex flex-col items-center justify-between pt-2 pb-2.5 sm:pt-2.5 sm:pb-3 px-2 sm:px-2.5 rounded-2xl
          border-4 ${fitzgerald.border} ${fitzgerald.bg}
          shadow-lg transition-all duration-150 relative overflow-hidden group
          ${isSelected ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-slate-900 scale-95' : ''}
        `}
        aria-label={`AAC Card: ${card.label}. Spoken: ${card.spokenText}`}
      >
        {/* Custom Audio Recording Badge if present (pointer-events-none to prevent intercepting taps) */}
        {card.audioBlobId && (
          <div className="absolute top-2 right-2 pointer-events-none z-10">
            <span
              className="text-xs bg-purple-600 text-white font-bold px-1.5 py-0.5 rounded-full shadow select-none"
              title="Custom family voice recording"
            >
              🎙️ Voice
            </span>
          </div>
        )}

        {/* Main Emoji / Icon - Enlarged canonical emoji with drop shadow */}
        <div className="flex-1 flex items-center justify-center my-auto">
          <span className="text-5xl sm:text-6xl md:text-7xl drop-shadow-md select-none">
            {card.icon || '💬'}
          </span>
        </div>

        {/* Card Label (English on top, Chinese underneath) - High contrast bold bilingual text */}
        <div className="w-full text-center flex flex-col items-center justify-center px-1 shrink-0 mt-1">
          <span className={`${enFontClasses} ${fitzgerald.text} leading-tight line-clamp-1`}>
            {card.label}
          </span>
          {card.labelZh && (
            <span className={`${zhFontClasses} text-slate-900 dark:text-slate-100 font-black leading-tight tracking-wide drop-shadow-sm line-clamp-1 mt-0.5`}>
              {card.labelZh}
            </span>
          )}
        </div>
      </DebouncedTouchable>
    </div>
  );
};
