import React, { useState, useEffect } from 'react';
import { AACCard, AACCategory } from '../../types';
import { RefreshCw, Sparkles, Lightbulb } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';

interface FlashcardDeckProps {
  card: AACCard;
  isFlipped: boolean;
  onFlip: () => void;
  category?: AACCategory;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  card,
  isFlipped,
  onFlip,
  category: _category,
}) => {
  const [showFirstLetter, setShowFirstLetter] = useState<boolean>(false);
  const [activeHint, setActiveHint] = useState<'sound' | 'letter' | null>(null);
  const { speakText, speakBilingual } = useAudio();

  // Reset hint state whenever card changes or flips
  useEffect(() => {
    setShowFirstLetter(false);
    setActiveHint(null);
  }, [card.id, isFlipped]);

  const clueText = card.clue || card.spokenText || card.label;
  const clueTextZh = card.clueZh || card.spokenTextZh || card.labelZh;
  const firstLetter = card.label.trim().charAt(0).toUpperCase();

  // First Sound (speaks starting phoneme/syllable)
  const handleFirstSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveHint('sound');
    const syllables = (card.phoneticSyllables || card.label)
      .split(/[\s·•-]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const firstSound = syllables[0] || card.label.charAt(0);
    speakText(firstSound);
  };

  // First Letter (shows and speaks "The first letter is X")
  const handleFirstLetter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFirstLetter(true);
    setActiveHint('letter');
    speakBilingual(
      `The first letter is ${firstLetter}`,
      `第一個字母是 ${firstLetter}`
    );
  };

  return (
    <div
      onClick={onFlip}
      className="w-full max-w-lg min-h-[260px] sm:min-h-[290px] md:min-h-[320px] [perspective:1000px] cursor-pointer select-none group relative"
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
        {/* Front Face (Mystery Clue & Hints) */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-purple-500/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 flex flex-col justify-between gap-2 shadow-xl overflow-y-auto scrollbar-none">
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

          {/* Mystery Target Center */}
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-1.5 text-center px-1">
            <div className="flex items-center justify-center select-none shrink-0 mb-0.5">
              <span className="text-3xl sm:text-4xl drop-shadow-md leading-none">
                🎯
              </span>
            </div>

            {/* Mystery Clue Text */}
            <p className="text-sm sm:text-base md:text-lg font-bold text-center text-white leading-snug">
              {clueText}
            </p>
            {clueTextZh && (
              <p className="text-xs sm:text-sm md:text-base font-semibold text-center text-purple-200 leading-snug">
                {clueTextZh}
              </p>
            )}

            {/* Streamlined First Letter Hint Display */}
            {showFirstLetter && (
              <div className="text-center mt-2 animate-in fade-in">
                <p className="text-base sm:text-lg font-black text-amber-300 tracking-wide">
                  The first letter is {firstLetter}
                </p>
              </div>
            )}
          </div>

          {/* Clean 2-Button Hint Ladder: First Sound | First Letter */}
          <div className="w-full grid grid-cols-2 gap-2 pt-1 border-t border-slate-700/60 shrink-0">
            {/* First Sound */}
            <button
              type="button"
              onClick={handleFirstSound}
              className={`
                flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer
                ${
                  activeHint === 'sound'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-sm font-black'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-200 border-amber-600/50'
                }
              `}
              aria-label="First Sound hint"
            >
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="whitespace-nowrap text-xs">First Sound</span>
            </button>

            {/* First Letter */}
            <button
              type="button"
              onClick={handleFirstLetter}
              className={`
                flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer
                ${
                  activeHint === 'letter' || showFirstLetter
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm font-black'
                    : 'bg-slate-800 hover:bg-slate-700 text-emerald-200 border-emerald-600/50'
                }
              `}
              aria-label="First Letter hint"
            >
              <Lightbulb className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="whitespace-nowrap text-xs">First Letter</span>
            </button>
          </div>
        </div>

        {/* Back Face (Streamlined Answer Side - Emoji, Labels, Phonetic Syllables) */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-purple-950 via-slate-900 to-slate-900 border-4 border-yellow-400 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 flex flex-col justify-between gap-2 shadow-2xl overflow-y-auto scrollbar-none">
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

          {/* Answer Body: Canonical Emoji, Labels, Phonetic Syllables */}
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-2 text-center px-1">
            {/* Single Canonical Emoji Anchor */}
            <div className="flex items-center justify-center select-none shrink-0">
              <span className="text-5xl sm:text-6xl md:text-7xl drop-shadow-md leading-none">
                {card.icon || '💬'}
              </span>
            </div>

            {/* Labels */}
            <div className="flex flex-col items-center justify-center gap-0.5">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                {card.label}
              </h2>
              {card.labelZh && (
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-300 tracking-wide drop-shadow leading-tight">
                  {card.labelZh}
                </h3>
              )}
            </div>

            {/* Phonetic Syllables */}
            {card.phoneticSyllables && (
              <div className="inline-flex items-center px-3 py-1 bg-slate-800/80 border border-slate-700/80 text-purple-200 text-sm sm:text-base font-bold rounded-xl tracking-wider">
                <span>{card.phoneticSyllables}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
