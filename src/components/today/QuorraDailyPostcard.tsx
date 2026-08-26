import React, { useState, useCallback } from 'react';
import { getQuorraDailyGreeting } from '../../services/quorra/quorraMessages';
import { useAudio } from '../../hooks/useAudio';
import { DebouncedTouchable } from '../common/DebouncedTouchable';
import { Volume2, Sparkles, Heart } from 'lucide-react';

interface QuorraDailyPostcardProps {
  currentDate: Date;
  onSelectSpeech?: (spokenEn: string, spokenZh: string) => void;
  isSpeakingPostcard?: boolean;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

export const QuorraDailyPostcard: React.FC<QuorraDailyPostcardProps> = ({
  currentDate,
  onSelectSpeech,
  isSpeakingPostcard = false,
}) => {
  const greeting = getQuorraDailyGreeting(currentDate);
  const { playQuorraPetTone, speakBilingual } = useAudio();
  const [isPetted, setIsPetted] = useState(false);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  const handlePetQuorra = useCallback(
    (e?: React.MouseEvent | React.TouchEvent) => {
      e?.stopPropagation();
      setIsPetted(true);
      playQuorraPetTone();

      const now = Date.now();
      const newHearts: FloatingHeart[] = [
        { id: now + 1, x: (Math.random() - 0.5) * 40, y: -20 - Math.random() * 20, emoji: '💖' },
        { id: now + 2, x: (Math.random() - 0.5) * 50, y: -30 - Math.random() * 25, emoji: '🐾' },
        { id: now + 3, x: (Math.random() - 0.5) * 40, y: -15 - Math.random() * 30, emoji: '✨' },
        { id: now + 4, x: (Math.random() - 0.5) * 45, y: -25 - Math.random() * 20, emoji: '❤️' },
      ];
      setHearts((prev) => [...prev.slice(-6), ...newHearts]);

      setTimeout(() => {
        setIsPetted(false);
      }, 2500);

      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
      }, 1600);
    },
    [playQuorraPetTone]
  );

  const handleSpeak = useCallback(async () => {
    handlePetQuorra();
    if (onSelectSpeech) {
      onSelectSpeech(greeting.spokenEn, greeting.spokenZh);
    } else {
      await speakBilingual(greeting.spokenEn, greeting.spokenZh);
    }
  }, [greeting, handlePetQuorra, onSelectSpeech, speakBilingual]);

  return (
    <div
      onClick={handleSpeak}
      className={`
        w-full bg-gradient-to-br from-amber-950/40 via-slate-900 to-amber-950/30
        border-2 rounded-2xl p-3 sm:p-3.5 shadow-lg flex flex-col justify-between gap-2.5 transition-all duration-200 cursor-pointer group select-none relative overflow-hidden
        ${
          isSpeakingPostcard
            ? 'border-amber-400 ring-4 ring-amber-400/40 shadow-amber-950/60 scale-[1.01]'
            : 'border-amber-500/40 hover:border-amber-400/80 hover:shadow-amber-900/30'
        }
      `}
      role="button"
      tabIndex={0}
      aria-label={`Quorra's Daily Postcard. Message: ${greeting.messageEn}. Tap to hear.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSpeak();
        }
      }}
    >
      {/* Decorative Vintage Postcard Header & Stamp */}
      <div className="flex items-center justify-between w-full border-b border-amber-500/20 pb-2">
        {/* Left: Card Header */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-sm">
            🐾
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs sm:text-sm font-black text-amber-300 tracking-wide">
              {greeting.titleEn}
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-amber-400/80">
              · {greeting.titleZh}
            </span>
          </div>
        </div>

        {/* Right: Vintage Postcard Stamp */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Postmark Wave Lines */}
          <div className="hidden sm:flex flex-col gap-0.5 opacity-40">
            <div className="w-6 h-0.5 bg-amber-400 rounded-full" />
            <div className="w-8 h-0.5 bg-amber-400 rounded-full" />
            <div className="w-5 h-0.5 bg-amber-400 rounded-full" />
          </div>

          {/* Golden Paw Post Stamp */}
          <div className="bg-amber-400/15 border-2 border-dashed border-amber-400/60 rounded-md px-1.5 py-0.5 flex items-center gap-1 text-[10px] font-black text-amber-300 shadow-sm">
            <span>{greeting.moodEmoji}</span>
            <span className="tracking-wider uppercase text-[9px] font-black">{greeting.stampLabel}</span>
          </div>
        </div>
      </div>

      {/* Main Postcard Content Layout */}
      <div className="flex items-center gap-3 sm:gap-4 my-auto min-w-0">
        {/* Mascot Avatar Container */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            handlePetQuorra(e);
          }}
          className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          title="Tap to pet Quorra!"
        >
          {/* Floating Hearts when Petted */}
          {hearts.map((h) => (
            <span
              key={h.id}
              className="absolute text-xl pointer-events-none animate-ping z-30 select-none"
              style={{
                left: '50%',
                top: '20%',
                transform: `translate(calc(-50% + ${h.x}px), ${h.y}px)`,
              }}
            >
              {h.emoji}
            </span>
          ))}

          {/* Quorra SVG Illustration */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="postcardGoldFur" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="postcardEarFur" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>

            {/* Backdrop Badge */}
            <circle cx="50" cy="50" r="46" fill="#78350f" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,3" />

            {/* Dog Body */}
            <ellipse cx="50" cy="72" rx="30" ry="20" fill="url(#postcardGoldFur)" />

            {/* Dog Head */}
            <circle cx="50" cy="42" r="24" fill="url(#postcardGoldFur)" />

            {/* Ears with Pet Wiggle Animation */}
            <g
              className={isPetted ? 'animate-bounce origin-top' : undefined}
              style={{ transformOrigin: '50% 30%' }}
            >
              <path d="M 32 30 Q 18 48 26 62 Q 38 58 36 38 Z" fill="url(#postcardEarFur)" />
              <path d="M 68 30 Q 82 48 74 62 Q 62 58 64 38 Z" fill="url(#postcardEarFur)" />
            </g>

            {/* Muzzle & Nose */}
            <ellipse cx="50" cy="50" rx="11" ry="8" fill="#fef3c7" />
            <polygon points="50,47 44,42 56,42" fill="#0f172a" />
            <path d="M 50 47 Q 50 53 46 55 M 50 47 Q 50 53 54 55" stroke="#0f172a" strokeWidth="1.5" fill="none" />

            {/* Smiling Mouth / Tongue when Petted */}
            {isPetted ? (
              <path d="M 47 52 Q 50 58 53 52" fill="#f43f5e" stroke="#0f172a" strokeWidth="1" />
            ) : null}

            {/* Eyes */}
            {greeting.period === 'night' && !isPetted ? (
              /* Peaceful closed sleeping eyes */
              <>
                <path d="M 38 39 Q 42 43 46 39" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M 54 39 Q 58 43 62 39" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
              </>
            ) : (
              /* Happy bright open eyes with shine */
              <>
                <circle cx="41" cy="38" r="3.2" fill="#0f172a" />
                <circle cx="42" cy="37" r="1" fill="#ffffff" />
                <circle cx="59" cy="38" r="3.2" fill="#0f172a" />
                <circle cx="60" cy="37" r="1" fill="#ffffff" />
              </>
            )}

            {/* Red Collar & Gold Tag */}
            <path d="M 34 60 Q 50 66 66 60" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="50" cy="64" r="3" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />

            {/* Time-of-day Accessory */}
            {greeting.period === 'morning' ? (
              <g transform="translate(68, 62)">
                <rect x="-6" y="-3" width="12" height="8" rx="2" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
                <path d="M 6 -1 Q 9 1 6 3" stroke="#0284c7" strokeWidth="1.2" fill="none" />
                <path d="M -2 -6 Q 0 -8 -2 -10" stroke="#cbd5e1" strokeWidth="1" fill="none" className="animate-pulse" />
              </g>
            ) : greeting.period === 'afternoon' ? (
              <g transform="translate(68, 60)">
                <circle cx="0" cy="0" r="5" fill="#f43f5e" />
                <circle cx="0" cy="0" r="2" fill="#facc15" />
              </g>
            ) : greeting.period === 'evening' ? (
              <g transform="translate(50, 60)">
                <path d="M -14 0 Q 0 6 14 0 Q 8 6 4 14 Q 0 8 -14 0 Z" fill="#dc2626" />
              </g>
            ) : (
              <g transform="translate(50, 20)" className="animate-pulse">
                <path d="M 0 0 Q 8 -10 14 -4 Q 8 4 0 0 Z" fill="#38bdf8" />
                <circle cx="14" cy="-4" r="2" fill="#facc15" />
              </g>
            )}
          </svg>
        </div>

        {/* Message Bubble Container */}
        <div className="flex-1 flex flex-col justify-center min-w-0 pr-1">
          <p className="text-xs sm:text-sm font-black text-amber-200 leading-snug line-clamp-2">
            {greeting.messageEn}
          </p>
          <p className="text-[11px] sm:text-xs font-bold text-amber-300/90 leading-snug mt-0.5 line-clamp-2">
            {greeting.messageZh}
          </p>
        </div>

        {/* Right Audio Action Button */}
        <div className="shrink-0 flex items-center">
          <DebouncedTouchable
            onPress={handleSpeak}
            minTouchSize="md"
            className={`
              h-9 sm:h-10 px-3 rounded-xl font-black text-white flex items-center gap-1.5 shadow-md transition-all duration-150 cursor-pointer border text-xs
              ${
                isSpeakingPostcard
                  ? 'bg-amber-400 text-slate-950 border-amber-300 ring-4 ring-amber-400/50 scale-105 animate-pulse font-black'
                  : 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 border-amber-300/60 shadow-amber-950/40 hover:scale-105'
              }
            `}
            aria-label="Hear Quorra speak greeting"
          >
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            <span className="font-black whitespace-nowrap">
              {isSpeakingPostcard ? 'Speaking...' : 'Listen'}
            </span>
          </DebouncedTouchable>
        </div>
      </div>
    </div>
  );
};
