import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getQuorraPeriod } from '../../services/quorra/quorraMessages';
import { useAudio } from '../../hooks/useAudio';

export interface QuorraGreetingAvatarProps {
  currentDate: Date;
  isSpeakingAll?: boolean;
  className?: string;
  onPet?: () => void;
}

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

export const QuorraGreetingAvatar: React.FC<QuorraGreetingAvatarProps> = ({
  currentDate,
  isSpeakingAll = false,
  className = '',
  onPet,
}) => {
  const { playQuorraPetTone } = useAudio();
  const [isPetted, setIsPetted] = useState(false);
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const prevSpeakingAllRef = useRef(false);

  const hours = currentDate.getHours();
  const period = getQuorraPeriod(hours);

  const isActive = isSpeakingAll || isPetted;

  // Trigger burst of floating hearts / sparkles
  const triggerBurst = useCallback(() => {
    const now = Date.now();
    const newParticles: FloatingParticle[] = [
      { id: now + 1, x: (Math.random() - 0.5) * 36, y: -16 - Math.random() * 18, emoji: '💖' },
      { id: now + 2, x: (Math.random() - 0.5) * 44, y: -24 - Math.random() * 20, emoji: '🐾' },
      { id: now + 3, x: (Math.random() - 0.5) * 36, y: -12 - Math.random() * 24, emoji: '✨' },
      { id: now + 4, x: (Math.random() - 0.5) * 40, y: -20 - Math.random() * 16, emoji: '❤️' },
    ];
    setParticles((prev) => [...prev.slice(-6), ...newParticles]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 1600);
  }, []);

  // When Speak All turns on, trigger animation and burst
  useEffect(() => {
    if (isSpeakingAll && !prevSpeakingAllRef.current) {
      triggerBurst();
    }
    prevSpeakingAllRef.current = isSpeakingAll;
  }, [isSpeakingAll, triggerBurst]);

  // Handle direct tapping on Quorra
  const handlePetQuorra = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      setIsPetted(true);
      playQuorraPetTone();
      triggerBurst();

      if (onPet) {
        onPet();
      }

      setTimeout(() => {
        setIsPetted(false);
      }, 2500);
    },
    [onPet, playQuorraPetTone, triggerBurst]
  );

  return (
    <div
      onClick={handlePetQuorra}
      className={`
        relative shrink-0 select-none cursor-pointer group
        w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
        rounded-2xl flex items-center justify-center
        transition-all duration-200
        hover:scale-110 active:scale-95
        ${className}
      `}
      role="button"
      tabIndex={0}
      title="Quorra the Golden Retriever · Tap to pet!"
      aria-label="Quorra the Golden Retriever mascot. Tap to pet."
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handlePetQuorra(e as unknown as React.MouseEvent);
        }
      }}
    >
      {/* Floating Hearts & Sparkles when Active / Tapped */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute text-base sm:text-lg pointer-events-none animate-ping z-30 select-none"
          style={{
            left: '50%',
            top: '15%',
            transform: `translate(calc(-50% + ${p.x}px), ${p.y}px)`,
          }}
        >
          {p.emoji}
        </span>
      ))}

      {/* Quorra SVG Illustration */}
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full drop-shadow-md transition-transform duration-200 ${
          isActive ? 'scale-105' : 'group-hover:scale-105'
        }`}
      >
        <defs>
          <linearGradient id="quorraAvatarGoldFur" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="quorraAvatarEarFur" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>

        {/* Circular Backdrop Badge */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="#78350f"
          fillOpacity={isActive ? '0.45' : '0.25'}
          stroke="#f59e0b"
          strokeWidth={isActive ? '2.5' : '1.5'}
          strokeDasharray={isActive ? 'none' : '4,3'}
          className="transition-all duration-200"
        />

        {/* Dog Body */}
        <ellipse cx="50" cy="72" rx="30" ry="20" fill="url(#quorraAvatarGoldFur)" />

        {/* Dog Head */}
        <circle cx="50" cy="42" r="24" fill="url(#quorraAvatarGoldFur)" />

        {/* Ears with Pet & Speak All Wiggle Animation */}
        <g
          className={isActive ? 'animate-bounce origin-top' : undefined}
          style={{ transformOrigin: '50% 30%' }}
        >
          <path d="M 32 30 Q 18 48 26 62 Q 38 58 36 38 Z" fill="url(#quorraAvatarEarFur)" />
          <path d="M 68 30 Q 82 48 74 62 Q 62 58 64 38 Z" fill="url(#quorraAvatarEarFur)" />
        </g>

        {/* Muzzle & Nose */}
        <ellipse cx="50" cy="50" rx="11" ry="8" fill="#fef3c7" />
        <polygon points="50,47 44,42 56,42" fill="#0f172a" />
        <path
          d="M 50 47 Q 50 53 46 55 M 50 47 Q 50 53 54 55"
          stroke="#0f172a"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Smiling Mouth / Tongue when Active */}
        {isActive ? (
          <path d="M 47 52 Q 50 58 53 52" fill="#f43f5e" stroke="#0f172a" strokeWidth="1" />
        ) : null}

        {/* Eyes */}
        {period === 'night' && !isActive ? (
          /* Peaceful closed sleeping eyes */
          <>
            <path
              d="M 38 39 Q 42 43 46 39"
              stroke="#0f172a"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 54 39 Q 58 43 62 39"
              stroke="#0f172a"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
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
        <path
          d="M 34 60 Q 50 66 66 60"
          stroke="#ef4444"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="50" cy="64" r="3" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />

        {/* Time-of-day Accessory */}
        {period === 'morning' ? (
          <g transform="translate(68, 62)">
            <rect
              x="-6"
              y="-3"
              width="12"
              height="8"
              rx="2"
              fill="#38bdf8"
              stroke="#0284c7"
              strokeWidth="1"
            />
            <path d="M 6 -1 Q 9 1 6 3" stroke="#0284c7" strokeWidth="1.2" fill="none" />
            <path
              d="M -2 -6 Q 0 -8 -2 -10"
              stroke="#cbd5e1"
              strokeWidth="1"
              fill="none"
              className={isActive ? 'animate-pulse' : undefined}
            />
          </g>
        ) : period === 'afternoon' ? (
          <g transform="translate(68, 60)">
            <circle cx="0" cy="0" r="5" fill="#f43f5e" />
            <circle cx="0" cy="0" r="2" fill="#facc15" />
          </g>
        ) : period === 'evening' ? (
          <g transform="translate(50, 60)">
            <path d="M -14 0 Q 0 6 14 0 Q 8 6 4 14 Q 0 8 -14 0 Z" fill="#dc2626" />
          </g>
        ) : (
          <g transform="translate(50, 20)" className={isActive ? 'animate-pulse' : undefined}>
            <path d="M 0 0 Q 8 -10 14 -4 Q 8 4 0 0 Z" fill="#38bdf8" />
            <circle cx="14" cy="-4" r="2" fill="#facc15" />
          </g>
        )}
      </svg>
    </div>
  );
};
