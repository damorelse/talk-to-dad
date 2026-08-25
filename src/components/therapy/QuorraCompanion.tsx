import React, { useState, useEffect, useCallback } from "react";
import { useAudio } from "../../hooks/useAudio";

export type QuorraAnimationType = "category-transition" | "corner-peek" | "ball-fetch" | "spin-trophy";

interface QuorraCompanionProps {
  animationType: QuorraAnimationType | null;
  onComplete?: () => void;
  categoryName?: string;
  categoryNameZh?: string;
}

export const QuorraCompanion: React.FC<QuorraCompanionProps> = ({
  animationType,
  onComplete,
  categoryName,
  categoryNameZh,
}) => {
  const [isPetted, setIsPetted] = useState(false);
  const [petHearts, setPetHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const { playPuppyBark } = useAudio();

  // Play audio on initial entrance
  useEffect(() => {
    if (animationType) {
      setIsPetted(false);
      setPetHearts([]);
      playPuppyBark();

      const timer = setTimeout(() => {
        onComplete?.();
      }, 2400);

      return () => clearTimeout(timer);
    }
  }, [animationType, onComplete, playPuppyBark]);

  // Handle tap-to-pet interaction
  const handlePet = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      setIsPetted(true);
      playPuppyBark();

      const newHeart = {
        id: Date.now() + Math.random(),
        x: (Math.random() - 0.5) * 40,
        y: -10 - Math.random() * 20,
      };
      setPetHearts((prev) => [...prev.slice(-3), newHeart]);

      setTimeout(() => {
        setIsPetted(false);
      }, 800);
    },
    [playPuppyBark]
  );

  if (!animationType) return null;

  return (
    <>
      {/* 1. CATEGORY TRANSITION: Header Trot Across Top */}
      {animationType === "category-transition" && (
        <div className="absolute top-0 left-0 right-0 h-14 z-30 pointer-events-auto flex items-center overflow-hidden">
          <div
            onClick={handlePet}
            className="flex items-center gap-2 cursor-pointer select-none animate-in fade-in slide-in-from-left duration-700 hover:scale-105 transition-transform"
            style={{
              animation: "quorraTrotAcross 2.3s cubic-bezier(0.25, 1, 0.5, 1) forwards",
            }}
          >
            {/* SVG Golden Retriever Trotting */}
            <div className="relative w-12 h-12 shrink-0 drop-shadow-md">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="goldFur" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                  <linearGradient id="earFur" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                </defs>

                {/* Wagging Tail */}
                <path
                  d="M 22 55 Q 10 40 18 28 Q 28 38 24 55 Z"
                  fill="url(#goldFur)"
                  className="animate-bounce origin-bottom"
                />

                {/* Body */}
                <ellipse cx="48" cy="60" rx="26" ry="18" fill="url(#goldFur)" />

                {/* Front & Back Paws */}
                <ellipse cx="32" cy="76" rx="6" ry="8" fill="#d97706" />
                <ellipse cx="64" cy="76" rx="6" ry="8" fill="#d97706" />

                {/* Head */}
                <circle cx="70" cy="40" r="18" fill="url(#goldFur)" />

                {/* Floppy Golden Ears */}
                <path d="M 60 30 Q 52 45 58 55 Q 66 52 64 36 Z" fill="url(#earFur)" />
                <path d="M 78 30 Q 86 45 80 55 Q 74 52 74 36 Z" fill="url(#earFur)" />

                {/* Muzzle & Nose */}
                <ellipse cx="76" cy="46" rx="8" ry="6" fill="#fef3c7" />
                <polygon points="76,43 73,40 79,40" fill="#0f172a" />
                <path d="M 76 43 Q 76 48 74 49 M 76 43 Q 76 48 78 49" stroke="#0f172a" strokeWidth="1.2" fill="none" />
                {/* Happy Tongue */}
                <path d="M 74 48 Q 76 53 78 48 Z" fill="#f43f5e" />

                {/* Eyes with Shinies */}
                <circle cx="67" cy="38" r="2.8" fill="#0f172a" />
                <circle cx="66" cy="37" r="1" fill="#ffffff" />
                <circle cx="79" cy="38" r="2.8" fill="#0f172a" />
                <circle cx="78" cy="37" r="1" fill="#ffffff" />

                {/* Red Collar */}
                <path d="M 62 52 Q 70 56 78 52" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" fill="none" />
                <circle cx="70" cy="55" r="2" fill="#facc15" />
              </svg>
            </div>

            {/* Quorra Category Banner */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm px-3 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
              <span>🐾</span>
              <span>{categoryName}</span>
              {categoryNameZh && <span className="text-amber-950 font-extrabold text-xs">({categoryNameZh})</span>}
            </div>
          </div>
        </div>
      )}

      {/* 2. MILESTONE: Corner Peek & Paw Wave (Bottom-Right) */}
      {animationType === "corner-peek" && (
        <div
          onClick={handlePet}
          className="absolute -bottom-1 right-2 sm:right-6 z-30 cursor-pointer select-none flex flex-col items-center pointer-events-auto group"
          style={{
            animation: "quorraCornerPeek 2.3s ease-in-out forwards",
          }}
        >
          {/* Tap-to-Pet Floating Hearts */}
          {petHearts.map((h) => (
            <span
              key={h.id}
              className="absolute text-xl pointer-events-none animate-ping"
              style={{ transform: `translate(${h.x}px, ${h.y}px)` }}
            >
              💖
            </span>
          ))}

          {/* Speech Bubble */}
          <div className="bg-amber-400 text-slate-950 px-3 py-1 rounded-xl text-xs font-black shadow-md border-2 border-white mb-1 flex items-center gap-1 animate-bounce">
            <span>🐾</span>
            <span>{isPetted ? "Woof! Love you!" : "Good job! 🐾"}</span>
          </div>

          {/* SVG Golden Retriever Peeking with Waving Paw */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 filter drop-shadow-xl">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="goldFurPeek" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="earFurPeek" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
              </defs>

              {/* Wagging Tail at Left */}
              <path
                d="M 18 60 Q 4 45 12 32 Q 22 42 19 60 Z"
                fill="url(#goldFurPeek)"
                className="animate-spin origin-bottom-right opacity-90"
                style={{ animationDuration: "0.6s" }}
              />

              {/* Head */}
              <circle cx="50" cy="46" r="28" fill="url(#goldFurPeek)" />

              {/* Floppy Golden Ears */}
              <path d="M 28 32 Q 16 52 24 66 Q 36 62 34 38 Z" fill="url(#earFurPeek)" />
              <path d="M 72 32 Q 84 52 76 66 Q 64 62 66 38 Z" fill="url(#earFurPeek)" />

              {/* White Muzzle & Nose */}
              <ellipse cx="50" cy="54" rx="13" ry="10" fill="#fef3c7" />
              <polygon points="50,50 44,45 56,45" fill="#0f172a" />
              <path d="M 50 50 Q 50 58 46 60 M 50 50 Q 50 58 54 60" stroke="#0f172a" strokeWidth="1.8" fill="none" />
              {/* Happy Tongue */}
              <path d="M 47 58 Q 50 67 53 58 Z" fill="#f43f5e" />

              {/* Cute Shiny Eyes */}
              <circle cx="39" cy="42" r="4.2" fill="#0f172a" />
              <circle cx="37.5" cy="40.5" r="1.6" fill="#ffffff" />
              <circle cx="61" cy="42" r="4.2" fill="#0f172a" />
              <circle cx="59.5" cy="40.5" r="1.6" fill="#ffffff" />

              {/* Red Collar */}
              <path d="M 32 72 Q 50 78 68 72" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" fill="none" />
              <circle cx="50" cy="76" r="3" fill="#facc15" />

              {/* Resting Left Paw */}
              <ellipse cx="30" cy="84" rx="8" ry="6" fill="#d97706" />

              {/* Waving Right Paw */}
              <g className="animate-bounce origin-bottom">
                <ellipse cx="72" cy="80" rx="9" ry="7" fill="#d97706" />
                <circle cx="72" cy="80" r="3" fill="#fbbf24" />
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* 3. MILESTONE: Tennis Ball Fetch (Top / Header) */}
      {animationType === "ball-fetch" && (
        <div
          onClick={handlePet}
          className="absolute top-1 left-0 right-0 h-16 z-30 pointer-events-auto flex items-center justify-center overflow-hidden"
        >
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            style={{
              animation: "quorraFetch 2.3s cubic-bezier(0.25, 1, 0.5, 1) forwards",
            }}
          >
            {/* Golden Retriever with Tennis Ball in Mouth */}
            <div className="relative w-16 h-16 shrink-0 drop-shadow-xl">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="goldFurFetch" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                  <linearGradient id="earFurFetch" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                </defs>

                {/* Wagging Tail */}
                <path d="M 20 55 Q 8 38 16 26 Q 26 36 22 55 Z" fill="url(#goldFurFetch)" className="animate-bounce" />

                {/* Body */}
                <ellipse cx="46" cy="58" rx="24" ry="17" fill="url(#goldFurFetch)" />

                {/* Paws */}
                <ellipse cx="32" cy="74" rx="6" ry="7" fill="#d97706" />
                <ellipse cx="60" cy="74" rx="6" ry="7" fill="#d97706" />

                {/* Head */}
                <circle cx="68" cy="40" r="17" fill="url(#goldFurFetch)" />
                <path d="M 58 32 Q 52 46 56 54 Q 64 50 62 36 Z" fill="url(#earFurFetch)" />
                <path d="M 76 32 Q 82 46 78 54 Q 72 50 72 36 Z" fill="url(#earFurFetch)" />

                {/* Bright Neon Tennis Ball clamped in mouth */}
                <circle cx="78" cy="45" r="7" fill="#a3e635" stroke="#4d7c0f" strokeWidth="1.5" />
                <path d="M 73 42 Q 78 45 73 48" stroke="#ffffff" strokeWidth="1.2" fill="none" />
                <path d="M 83 42 Q 78 45 83 48" stroke="#ffffff" strokeWidth="1.2" fill="none" />

                {/* Happy Eyes */}
                <path d="M 64 38 Q 67 34 70 38" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* Celebration Tag */}
            <div className="bg-lime-500 text-lime-950 font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-full shadow-xl border-2 border-white flex items-center gap-1.5 animate-pulse">
              <span>🎾</span>
              <span>3 in a Row! Great Fetch!</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. MILESTONE: Joyful Spin & Golden Trophy */}
      {animationType === "spin-trophy" && (
        <div
          onClick={handlePet}
          className="absolute -bottom-1 right-2 sm:right-6 z-30 cursor-pointer select-none flex flex-col items-center pointer-events-auto"
          style={{
            animation: "quorraSpin 2.3s ease-in-out forwards",
          }}
        >
          {/* Trophy Bubble */}
          <div className="bg-yellow-400 text-yellow-950 px-3 py-1 rounded-xl text-xs font-black shadow-lg border-2 border-white mb-1 flex items-center gap-1 animate-bounce">
            <span>🏆</span>
            <span>You are Amazing, Dad! 🦴</span>
          </div>

          {/* SVG Golden Retriever Holding Golden Bone */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 filter drop-shadow-2xl">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="goldFurSpin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="earFurSpin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
              </defs>

              {/* Head */}
              <circle cx="50" cy="46" r="28" fill="url(#goldFurSpin)" />
              <path d="M 28 32 Q 16 52 24 66 Q 36 62 34 38 Z" fill="url(#earFurSpin)" />
              <path d="M 72 32 Q 84 52 76 66 Q 64 62 66 38 Z" fill="url(#earFurSpin)" />

              {/* Golden Dog Bone in Mouth */}
              <g transform="translate(50, 56)">
                <rect x="-14" y="-3" width="28" height="6" rx="3" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
                <circle cx="-14" cy="-4" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
                <circle cx="-14" cy="4" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
                <circle cx="14" cy="-4" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
                <circle cx="14" cy="4" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
              </g>

              {/* Sparkle Eyes */}
              <circle cx="39" cy="42" r="4.2" fill="#0f172a" />
              <circle cx="37.5" cy="40.5" r="1.6" fill="#ffffff" />
              <circle cx="61" cy="42" r="4.2" fill="#0f172a" />
              <circle cx="59.5" cy="40.5" r="1.6" fill="#ffffff" />

              {/* Paws */}
              <ellipse cx="32" cy="80" rx="8" ry="6" fill="#d97706" />
              <ellipse cx="68" cy="80" rx="8" ry="6" fill="#d97706" />
            </svg>
          </div>
        </div>
      )}

      {/* Global Embedded CSS Keyframe Animations */}
      <style>{`
        @keyframes quorraTrotAcross {
          0% {
            transform: translateX(-120px) scale(0.9);
            opacity: 0;
          }
          15% {
            transform: translateX(10px) scale(1);
            opacity: 1;
          }
          75% {
            transform: translateX(calc(100vw - 320px)) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateX(calc(100vw - 180px)) scale(0.9);
            opacity: 0;
          }
        }

        @keyframes quorraCornerPeek {
          0% {
            transform: translateY(80px) scale(0.8);
            opacity: 0;
          }
          15% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          80% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(90px) scale(0.8);
            opacity: 0;
          }
        }

        @keyframes quorraFetch {
          0% {
            transform: translateX(-100px) scale(0.85);
            opacity: 0;
          }
          20% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          80% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateX(120px) scale(0.85);
            opacity: 0;
          }
        }

        @keyframes quorraSpin {
          0% {
            transform: translateY(80px) rotate(-15deg) scale(0.8);
            opacity: 0;
          }
          20% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          45% {
            transform: translateY(-8px) rotate(8deg) scale(1.05);
          }
          65% {
            transform: translateY(0) rotate(-5deg) scale(1);
          }
          80% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(90px) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};
