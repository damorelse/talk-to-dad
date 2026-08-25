import React from 'react';
import { AACCard } from '../../types';
import { RefreshCw } from 'lucide-react';

interface FlashcardDeckProps {
  card: AACCard;
  isFlipped: boolean;
  onFlip: () => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  card,
  isFlipped,
  onFlip,
}) => {
  const clueText = card.clue || card.spokenText || card.label;
  const clueTextZh = card.clueZh || card.spokenTextZh || card.labelZh;

  return (
    <div
      onClick={onFlip}
      className="w-full max-w-lg h-52 sm:h-56 md:h-60 [perspective:1000px] cursor-pointer select-none group relative"
      role="button"
      tabIndex={0}
      aria-label={
        isFlipped
          ? `Flashcard Answer: ${card.label}${card.labelZh ? ` (${card.labelZh})` : ''}. Tap to flip.`
          : `Flashcard Clue: ${clueText}${clueTextZh ? ` (${clueTextZh})` : ''}. Tap to flip.`
      }
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onFlip();
        }
      }}
    >
      <div
        className={`
          w-full h-full relative transition-transform duration-500 [transform-style:preserve-3d] rounded-2xl sm:rounded-3xl shadow-xl
          ${isFlipped ? '[transform:rotateY(180deg)]' : ''}
        `}
      >
        {/* Front Face (Clue Side) */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-purple-500/80 rounded-2xl sm:rounded-3xl px-4 py-2 sm:px-5 sm:py-2.5 flex flex-col justify-start gap-1 sm:gap-1.5 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="w-full flex items-center justify-between shrink-0">
            <span className="text-xs font-black uppercase tracking-widest text-purple-300 bg-purple-950/80 px-3 py-0.5 rounded-full border border-purple-800 shadow-xs">
              Clue
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-purple-300/80 bg-transparent border-0 flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 text-purple-300/80 stroke-[2.5]" />
              <span>Tap to Flip</span>
            </span>
          </div>

          {/* Clue Content: Icon + English + Chinese */}
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-1.5 sm:gap-2 text-center px-1 overflow-y-auto scrollbar-none">
            <div className="flex items-center justify-center select-none shrink-0">
              <span className="text-3xl sm:text-4xl md:text-5xl drop-shadow-md whitespace-nowrap inline-flex items-center justify-center gap-2 leading-none">
                {card.icon || '🎯'}
              </span>
            </div>

            <p className="text-base sm:text-lg md:text-xl font-bold text-center text-white leading-snug">
              {clueText}
            </p>
            {clueTextZh && (
              <p className="text-sm sm:text-base md:text-lg font-semibold text-center text-purple-200 leading-snug">
                {clueTextZh}
              </p>
            )}
          </div>
        </div>

        {/* Back Face (Answer Side - No Syllable Breakdown) */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-purple-950 to-slate-900 border-4 border-yellow-400 rounded-2xl sm:rounded-3xl px-4 py-2 sm:px-5 sm:py-2.5 flex flex-col justify-start gap-1 sm:gap-1.5 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="w-full flex items-center justify-between shrink-0">
            <span className="text-xs font-black uppercase tracking-widest text-yellow-950 bg-yellow-400 px-3 py-0.5 rounded-full font-bold shadow-xs">
              Answer
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-yellow-300/80 bg-transparent border-0 flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 text-yellow-300/80 stroke-[2.5]" />
              <span>Tap to Flip</span>
            </span>
          </div>

          {/* Answer Content: Icon + English Label + Chinese Label */}
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-1.5 sm:gap-2 text-center px-1 overflow-y-auto scrollbar-none">
            <div className="flex items-center justify-center select-none shrink-0">
              <span className="text-3xl sm:text-4xl md:text-5xl drop-shadow-md whitespace-nowrap inline-flex items-center justify-center gap-2 leading-none">
                {card.icon || '🎯'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              {card.label}
            </h2>
            {card.labelZh && (
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-300 tracking-wide drop-shadow leading-tight">
                {card.labelZh}
              </h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
