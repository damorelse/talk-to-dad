import React, { useState, useEffect, useCallback } from "react";
import { useAudio } from "../../hooks/useAudio";

export type CornerAnimationType =
  | "corner-paw-wave"
  | "corner-golden-bone"
  | "corner-tennis-ball"
  | "corner-sunglasses"
  | "corner-chef-hat"
  | "corner-party-hat"
  | "corner-detective"
  | "corner-flower-crown"
  | "corner-butterfly"
  | "corner-sleeping-bubble"
  | "corner-high-five"
  | "corner-graduation-cap"
  | "corner-super-cape"
  | "corner-thumbs-up"
  | "corner-heart-balloon"
  | "corner-head-tilt"
  | "corner-wink-sparkle"
  | "corner-apple-snack"
  | "corner-warm-tea"
  | "corner-medal-ribbon"
  | "corner-tail-chase"
  | "corner-bow-tie"
  | "corner-sunshine"
  | "corner-rainbow"
  | "corner-cheerleader";

export type CrossingAnimationType =
  | "cross-trot-banner"
  | "cross-skateboard"
  | "cross-tennis-chase"
  | "cross-butterfly-follow"
  | "cross-wagon"
  | "cross-flying-cape"
  | "cross-bicycle"
  | "cross-balloon-float"
  | "cross-duckling-parade"
  | "cross-rainbow-trail";

export type QuorraAnimationType =
  | CornerAnimationType
  | CrossingAnimationType
  | "category-transition"
  | "corner-peek"
  | "ball-fetch"
  | "spin-trophy";

export const ALL_CORNER_ANIMATIONS: CornerAnimationType[] = [
  "corner-paw-wave",
  "corner-golden-bone",
  "corner-tennis-ball",
  "corner-sunglasses",
  "corner-chef-hat",
  "corner-party-hat",
  "corner-detective",
  "corner-flower-crown",
  "corner-butterfly",
  "corner-sleeping-bubble",
  "corner-high-five",
  "corner-graduation-cap",
  "corner-super-cape",
  "corner-thumbs-up",
  "corner-heart-balloon",
  "corner-head-tilt",
  "corner-wink-sparkle",
  "corner-apple-snack",
  "corner-warm-tea",
  "corner-medal-ribbon",
  "corner-tail-chase",
  "corner-bow-tie",
  "corner-sunshine",
  "corner-rainbow",
  "corner-cheerleader",
];

export const ALL_CROSSING_ANIMATIONS: CrossingAnimationType[] = [
  "cross-trot-banner",
  "cross-skateboard",
  "cross-tennis-chase",
  "cross-butterfly-follow",
  "cross-wagon",
  "cross-flying-cape",
  "cross-bicycle",
  "cross-balloon-float",
  "cross-duckling-parade",
  "cross-rainbow-trail",
];

export interface QuorraCompanionProps {
  // Legacy single animation prop fallback
  animationType?: QuorraAnimationType | null;
  animationKey?: number | string;
  onComplete?: () => void;

  // Decoupled dual props
  crossingAnimation?: CrossingAnimationType | null;
  crossingKey?: number | string;
  onCrossingComplete?: () => void;

  cornerAnimation?: CornerAnimationType | null;
  cornerKey?: number | string;
  onCornerComplete?: () => void;

  categoryName?: string;
  categoryNameZh?: string;
}

export const QuorraCompanion: React.FC<QuorraCompanionProps> = ({
  animationType,
  animationKey,
  onComplete,
  crossingAnimation,
  crossingKey,
  onCrossingComplete,
  cornerAnimation,
  cornerKey,
  onCornerComplete,
  categoryName,
  categoryNameZh,
}) => {
  const [isPetted, setIsPetted] = useState(false);
  const [petHearts, setPetHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const { playPuppyBark, playQuorraPetTone } = useAudio();

  const onCrossingCompleteRef = React.useRef(onCrossingComplete || onComplete);
  onCrossingCompleteRef.current = onCrossingComplete || onComplete;

  const onCornerCompleteRef = React.useRef(onCornerComplete || onComplete);
  onCornerCompleteRef.current = onCornerComplete || onComplete;

  const crossingDismissTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const cornerDismissTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const petTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastBarkTimeRef = React.useRef<number>(0);

  // Normalize legacy aliases
  const legacyResolved = React.useMemo<CornerAnimationType | CrossingAnimationType | null>(() => {
    if (!animationType) return null;
    if (animationType === "category-transition") return "cross-trot-banner";
    if (animationType === "corner-peek") return "corner-paw-wave";
    if (animationType === "ball-fetch") return "cross-tennis-chase";
    if (animationType === "spin-trophy") return "corner-golden-bone";
    return animationType as CornerAnimationType | CrossingAnimationType;
  }, [animationType]);

  const effectiveCrossing: CrossingAnimationType | null =
    crossingAnimation !== undefined
      ? crossingAnimation
      : legacyResolved && legacyResolved.startsWith("cross-")
      ? (legacyResolved as CrossingAnimationType)
      : null;

  const effectiveCorner: CornerAnimationType | null =
    cornerAnimation !== undefined
      ? cornerAnimation
      : legacyResolved && !legacyResolved.startsWith("cross-")
      ? (legacyResolved as CornerAnimationType)
      : null;

  // Manage Crossing Animation Lifecycle (6.0s duration)
  useEffect(() => {
    if (effectiveCrossing) {
      const now = Date.now();
      if (now - lastBarkTimeRef.current > 20000) {
        playPuppyBark();
        lastBarkTimeRef.current = now;
      }

      if (crossingDismissTimerRef.current) clearTimeout(crossingDismissTimerRef.current);

      crossingDismissTimerRef.current = setTimeout(() => {
        onCrossingCompleteRef.current?.();
      }, 6000);

      return () => {
        if (crossingDismissTimerRef.current) clearTimeout(crossingDismissTimerRef.current);
      };
    }
  }, [effectiveCrossing, crossingKey, animationKey, playPuppyBark]);

  // Manage Corner Mascot Animation Lifecycle (14.0s duration)
  useEffect(() => {
    if (effectiveCorner) {
      setIsPetted(false);
      setPetHearts([]);

      const now = Date.now();
      if (now - lastBarkTimeRef.current > 20000) {
        playPuppyBark();
        lastBarkTimeRef.current = now;
      }

      if (cornerDismissTimerRef.current) clearTimeout(cornerDismissTimerRef.current);
      if (petTimeoutRef.current) clearTimeout(petTimeoutRef.current);

      // Corner animations stay for a full 14.0s
      cornerDismissTimerRef.current = setTimeout(() => {
        onCornerCompleteRef.current?.();
      }, 14000);

      return () => {
        if (cornerDismissTimerRef.current) clearTimeout(cornerDismissTimerRef.current);
        if (petTimeoutRef.current) clearTimeout(petTimeoutRef.current);
      };
    }
  }, [effectiveCorner, cornerKey, animationKey, playPuppyBark]);

  // Handle tap-to-pet interaction for corner mascot: extends stay on every pet
  const handlePetCorner = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      setIsPetted(true);
      playQuorraPetTone();
      lastBarkTimeRef.current = Date.now();

      const newHeart = {
        id: Date.now() + Math.random(),
        x: (Math.random() - 0.5) * 50,
        y: -15 - Math.random() * 25,
      };
      setPetHearts((prev) => [...prev.slice(-5), newHeart]);

      // Keep petted celebration state active for 2.5s
      if (petTimeoutRef.current) clearTimeout(petTimeoutRef.current);
      petTimeoutRef.current = setTimeout(() => {
        setIsPetted(false);
      }, 2500);

      // In corner mode: extend the overall stay by an additional 8.0s from each tap
      if (cornerDismissTimerRef.current) clearTimeout(cornerDismissTimerRef.current);
      cornerDismissTimerRef.current = setTimeout(() => {
        onCornerCompleteRef.current?.();
      }, 8000);
    },
    [playQuorraPetTone]
  );

  if (!effectiveCrossing && !effectiveCorner) return null;

  // Render Corner Animation Accessory Overlay
  const renderCornerAccessory = () => {
    switch (effectiveCorner) {
      case "corner-golden-bone":
        return (
          <g transform="translate(50, 56)">
            <rect x="-14" y="-3" width="28" height="6" rx="3" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="-14" cy="-4" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
            <circle cx="-14" cy="4" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
            <circle cx="14" cy="-4" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
            <circle cx="14" cy="4" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
          </g>
        );
      case "corner-tennis-ball":
        return (
          <g transform="translate(50, 43)">
            <circle cx="0" cy="0" r="7" fill="#a3e635" stroke="#4d7c0f" strokeWidth="1.2" />
            <path d="M -5 -3 Q 0 0 -5 3" stroke="#ffffff" strokeWidth="1" fill="none" />
            <path d="M 5 -3 Q 0 0 5 3" stroke="#ffffff" strokeWidth="1" fill="none" />
          </g>
        );
      case "corner-sunglasses":
        return (
          <g transform="translate(50, 42)">
            <rect x="-20" y="-7" width="18" height="12" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1" />
            <rect x="2" y="-7" width="18" height="12" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1" />
            <line x1="-2" y1="-2" x2="2" y2="-2" stroke="#475569" strokeWidth="2" />
            {/* Glossy glare */}
            <line x1="-16" y1="-4" x2="-6" y2="2" stroke="#ffffff" strokeWidth="1.2" opacity="0.7" />
            <line x1="6" y1="-4" x2="16" y2="2" stroke="#ffffff" strokeWidth="1.2" opacity="0.7" />
          </g>
        );
      case "corner-chef-hat":
        return (
          <g transform="translate(50, 18)">
            <ellipse cx="0" cy="-4" rx="16" ry="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="-10" cy="-10" r="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="10" cy="-10" r="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="0" cy="-14" r="11" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <rect x="-14" y="-3" width="28" height="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
          </g>
        );
      case "corner-party-hat":
        return (
          <g transform="translate(50, 20)">
            <polygon points="0,-24 -12,2 12,2" fill="#ec4899" stroke="#be185d" strokeWidth="1" />
            <circle cx="0" cy="-24" r="4" fill="#facc15" />
            <line x1="-8" y1="-6" x2="8" y2="-6" stroke="#facc15" strokeWidth="2" />
            <line x1="-4" y1="-14" x2="4" y2="-14" stroke="#38bdf8" strokeWidth="2" />
          </g>
        );
      case "corner-detective":
        return (
          <g transform="translate(50, 22)">
            <path d="M -22 2 Q 0 -14 22 2 L 18 -4 Q 0 -18 -18 -4 Z" fill="#92400e" stroke="#78350f" strokeWidth="1" />
            <path d="M -16 -4 Q 0 -22 16 -4 Z" fill="#b45309" stroke="#78350f" strokeWidth="1" />
            <circle cx="26" cy="24" r="9" fill="none" stroke="#ca8a04" strokeWidth="2" />
            <line x1="32" y1="30" x2="40" y2="38" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          </g>
        );
      case "corner-flower-crown":
        return (
          <g transform="translate(50, 24)">
            <circle cx="-16" cy="0" r="5" fill="#f43f5e" />
            <circle cx="-16" cy="0" r="2" fill="#facc15" />
            <circle cx="-6" cy="-3" r="6" fill="#ec4899" />
            <circle cx="-6" cy="-3" r="2.5" fill="#ffffff" />
            <circle cx="6" cy="-3" r="6" fill="#a855f7" />
            <circle cx="6" cy="-3" r="2.5" fill="#facc15" />
            <circle cx="16" cy="0" r="5" fill="#38bdf8" />
            <circle cx="16" cy="0" r="2" fill="#ffffff" />
          </g>
        );
      case "corner-butterfly":
        return (
          <g transform="translate(50, 42)">
            <ellipse cx="-4" cy="-4" rx="5" ry="3" fill="#38bdf8" transform="rotate(-20 -4 -4)" />
            <ellipse cx="4" cy="-4" rx="5" ry="3" fill="#38bdf8" transform="rotate(20 4 -4)" />
            <ellipse cx="-3" cy="2" rx="3.5" ry="2" fill="#0284c7" transform="rotate(-15 -3 2)" />
            <ellipse cx="3" cy="2" rx="3.5" ry="2" fill="#0284c7" transform="rotate(15 3 2)" />
            <line x1="0" y1="-6" x2="0" y2="4" stroke="#0f172a" strokeWidth="1" />
          </g>
        );
      case "corner-sleeping-bubble":
        return (
          <g transform="translate(74, 18)" className="animate-pulse">
            <circle cx="-6" cy="8" r="3" fill="#93c5fd" opacity="0.8" />
            <circle cx="2" cy="0" r="5" fill="#93c5fd" opacity="0.8" />
            <circle cx="14" cy="-8" r="9" fill="#60a5fa" opacity="0.9" />
            <text x="14" y="-5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900">Zzz</text>
          </g>
        );
      case "corner-high-five":
        return (
          <g transform="translate(74, 52)" className="animate-bounce">
            <ellipse cx="0" cy="0" rx="10" ry="12" fill="#d97706" stroke="#b45309" strokeWidth="1" />
            <circle cx="-5" cy="-8" r="3" fill="#fbbf24" />
            <circle cx="0" cy="-10" r="3.2" fill="#fbbf24" />
            <circle cx="5" cy="-8" r="3" fill="#fbbf24" />
            <circle cx="0" cy="2" r="5" fill="#fbbf24" />
          </g>
        );
      case "corner-graduation-cap":
        return (
          <g transform="translate(50, 20)">
            <polygon points="0,-10 -22,0 0,10 22,0" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
            <rect x="-8" y="5" width="16" height="6" fill="#1e293b" />
            <circle cx="0" cy="0" r="2" fill="#facc15" />
            <path d="M 0 0 Q 14 6 18 16" stroke="#facc15" strokeWidth="1.5" fill="none" />
          </g>
        );
      case "corner-super-cape":
        return (
          <g transform="translate(24, 60)" className="animate-pulse">
            <path d="M 0 -8 Q -16 6 -24 24 Q -8 20 0 14 Z" fill="#ef4444" stroke="#dc2626" strokeWidth="1" />
          </g>
        );
      case "corner-thumbs-up":
        return (
          <g transform="translate(74, 56)" className="animate-bounce">
            <rect x="-6" y="-2" width="12" height="12" rx="4" fill="#d97706" stroke="#b45309" strokeWidth="1" />
            <rect x="-5" y="-12" width="6" height="11" rx="3" fill="#d97706" stroke="#b45309" strokeWidth="1" />
          </g>
        );
      case "corner-heart-balloon":
        return (
          <g transform="translate(68, 12)" className="animate-pulse">
            <path d="M 0 0 C -8 -10 -16 2 0 16 C 16 2 8 -10 0 0 Z" fill="#f43f5e" stroke="#e11d48" strokeWidth="1" />
            <path d="M 0 16 Q 2 24 -12 42" stroke="#cbd5e1" strokeWidth="1.2" fill="none" />
          </g>
        );
      case "corner-head-tilt":
        return (
          <g transform="translate(50, 16)">
            <text x="0" y="0" textAnchor="middle" fontSize="14">❓🐾</text>
          </g>
        );
      case "corner-wink-sparkle":
        return (
          <g transform="translate(66, 36)">
            <polygon points="0,-6 2,-1 7,0 2,1 0,6 -2,1 -7,0 -2,-1" fill="#facc15" className="animate-spin" />
          </g>
        );
      case "corner-apple-snack":
        return (
          <g transform="translate(50, 56)">
            <circle cx="0" cy="0" r="7" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
            <path d="M 0 -7 Q 4 -12 6 -10" stroke="#15803d" strokeWidth="1.5" fill="none" />
            <ellipse cx="4" cy="-10" rx="3" ry="1.5" fill="#22c55e" transform="rotate(-30 4 -10)" />
          </g>
        );
      case "corner-warm-tea":
        return (
          <g transform="translate(50, 58)">
            <rect x="-8" y="-4" width="16" height="10" rx="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
            <path d="M 8 -2 Q 13 -2 13 2 Q 13 6 8 6" stroke="#0284c7" strokeWidth="1.5" fill="none" />
            <path d="M -4 -8 Q -2 -12 -4 -16 M 2 -8 Q 4 -12 2 -16" stroke="#cbd5e1" strokeWidth="1.2" fill="none" className="animate-pulse" />
          </g>
        );
      case "corner-medal-ribbon":
        return (
          <g transform="translate(50, 68)">
            <polygon points="-6,6 -10,18 -4,14 0,18 4,14 10,18 6,6" fill="#3b82f6" />
            <circle cx="0" cy="6" r="6" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <text x="0" y="8.5" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#78350f">1</text>
          </g>
        );
      case "corner-tail-chase":
        return (
          <g transform="translate(20, 50)" className="animate-spin">
            <text x="0" y="0" fontSize="14">🌀</text>
          </g>
        );
      case "corner-bow-tie":
        return (
          <g transform="translate(50, 72)">
            <polygon points="-8,-4 0,0 -8,4" fill="#dc2626" />
            <polygon points="8,-4 0,0 8,4" fill="#dc2626" />
            <circle cx="0" cy="0" r="2.5" fill="#ef4444" />
          </g>
        );
      case "corner-sunshine":
        return (
          <g transform="translate(50, 16)" className="animate-spin" style={{ animationDuration: "6s" }}>
            <circle cx="0" cy="0" r="6" fill="#facc15" />
            <line x1="0" y1="-10" x2="0" y2="-7" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            <line x1="0" y1="7" x2="0" y2="10" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            <line x1="-10" y1="0" x2="-7" y2="0" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            <line x1="7" y1="0" x2="10" y2="0" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      case "corner-rainbow":
        return (
          <g transform="translate(50, 18)">
            <path d="M -18 6 A 18 18 0 0 1 18 6" stroke="#ef4444" strokeWidth="2" fill="none" />
            <path d="M -15 6 A 15 15 0 0 1 15 6" stroke="#f59e0b" strokeWidth="2" fill="none" />
            <path d="M -12 6 A 12 12 0 0 1 12 6" stroke="#22c55e" strokeWidth="2" fill="none" />
            <path d="M -9 6 A 9 9 0 0 1 9 6" stroke="#3b82f6" strokeWidth="2" fill="none" />
          </g>
        );
      case "corner-cheerleader":
        return (
          <g transform="translate(50, 56)">
            <circle cx="-24" cy="10" r="7" fill="#f43f5e" className="animate-bounce" />
            <circle cx="24" cy="10" r="7" fill="#facc15" className="animate-bounce" />
          </g>
        );
      default:
        return null;
    }
  };

  // Get bubble label text for Corner animation
  const getCornerBubbleText = () => {
    if (isPetted) return "Woof! Love you, Dad! 💖";
    switch (effectiveCorner) {
      case "corner-golden-bone": return "Golden Bone! 🦴";
      case "corner-tennis-ball": return "Play Ball! 🎾";
      case "corner-sunglasses": return "Cool Dad! 😎";
      case "corner-chef-hat": return "Chef Quorra! 👨‍🍳";
      case "corner-party-hat": return "Party Time! 🥳";
      case "corner-detective": return "Word Found! 🔍";
      case "corner-flower-crown": return "Sweet Blooms! 🌸";
      case "corner-butterfly": return "Butterfly Kiss! 🦋";
      case "corner-sleeping-bubble": return "Refreshed & Ready! 💤";
      case "corner-high-five": return "High Five, Dad! ✋";
      case "corner-graduation-cap": return "Smart Champion! 🎓";
      case "corner-super-cape": return "Super Dad! 🦸‍♂️";
      case "corner-thumbs-up": return "Thumbs Up! 👍";
      case "corner-heart-balloon": return "Love You! 🎈";
      case "corner-head-tilt": return "Curious Pup! 🐶";
      case "corner-wink-sparkle": return "You Got This! ✨";
      case "corner-apple-snack": return "Healthy Snack! 🍎";
      case "corner-warm-tea": return "Cozy Warm Tea! 🍵";
      case "corner-medal-ribbon": return "#1 Champion! 🥇";
      case "corner-tail-chase": return "Happy Wiggle! 🌀";
      case "corner-bow-tie": return "Looking Sharp! 👔";
      case "corner-sunshine": return "Warm Sunshine! ☀️";
      case "corner-rainbow": return "Rainbow Streak! 🌈";
      case "corner-cheerleader": return "Go Dad Go! 📣";
      default: return "Good job, Dad! 🐾";
    }
  };

  return (
    <>
      {/* Shared SVG Gradients and High-Contrast Sticker Drop Shadow Filter */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="qGoldFur" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="35%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="qEarFur" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>
          <linearGradient id="qMuzzleCream" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>
        </defs>
      </svg>

      {/* ============================================================ */}
      {/* 1. TOP CROSSING ANIMATIONS (5.8s, Stroke-Friendly Pacing)    */}
      {/* ============================================================ */}
      {effectiveCrossing && (
        <div className="absolute top-0 left-0 right-0 h-22 sm:h-24 z-30 pointer-events-none flex items-center overflow-hidden">
          <div
            key={crossingKey ?? animationKey ?? effectiveCrossing}
            className="quorra-crossing-item relative flex items-center gap-3 select-none pointer-events-auto hover:scale-105 transition-transform py-1 px-3 rounded-full"
            style={{
              animation: "quorraCrossSmooth 5.8s cubic-bezier(0.25, 1, 0.5, 1) forwards",
            }}
          >
            {/* Custom High-Legibility Golden Retriever Crossing SVGs */}
            {effectiveCrossing === "cross-skateboard" ? (
              /* Skater Quorra: Goggles up on forehead, big smiling eyes, clear breed silhouette */
              <div className="relative w-22 h-22 sm:w-24 sm:h-24 shrink-0 filter drop-shadow-xl">
                <svg viewBox="0 0 120 100" className="w-full h-full">
                  {/* Skateboard Deck & Wheels */}
                  <rect x="14" y="80" width="92" height="8" rx="4" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
                  <rect x="22" y="82" width="76" height="4" rx="2" fill="#38bdf8" />
                  <circle cx="28" cy="91" r="5.5" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="92" cy="91" r="5.5" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />

                  {/* Arched Feathered Wagging Tail */}
                  <g className="quorra-tail-wag" style={{ transformOrigin: "32px 52px", transformBox: "view-box", animation: "quorraCrossingTailWag 0.6s ease-in-out infinite" }}>
                    <path
                      d="M 28 54 C 12 38 14 16 30 12 C 26 24 28 36 38 48 C 35 52 31 54 28 54 Z"
                      fill="url(#qGoldFur)"
                      stroke="#d97706"
                      strokeWidth="1"
                    />
                    <path d="M 28 22 Q 22 28 26 38" stroke="#fef08a" strokeWidth="1.2" fill="none" opacity="0.8" />
                  </g>

                  {/* Body & Paws on Board */}
                  <ellipse cx="54" cy="56" rx="26" ry="18" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" />
                  <path d="M 66 46 Q 78 56 70 68 Q 60 60 66 46 Z" fill="url(#qMuzzleCream)" />

                  {/* Four paws planted on board */}
                  <ellipse cx="32" cy="78" rx="6" ry="4.5" fill="#d97706" stroke="#b45309" strokeWidth="0.8" />
                  <ellipse cx="46" cy="78" rx="6" ry="4.5" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="0.8" />
                  <ellipse cx="74" cy="78" rx="6" ry="4.5" fill="#d97706" stroke="#b45309" strokeWidth="0.8" />
                  <ellipse cx="88" cy="78" rx="6" ry="4.5" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="0.8" />

                  {/* Red Collar & Golden Tag */}
                  <path d="M 68 44 Q 74 52 80 46" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="75" cy="53" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />

                  {/* Background Ear (streaming back in wind behind head) */}
                  <path d="M 66 26 C 56 22 46 28 42 38 C 40 44 48 46 56 40 Z" fill="url(#qEarFur)" opacity="0.8" />

                  {/* Golden Head */}
                  <ellipse cx="80" cy="38" rx="19" ry="17" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" />

                  {/* Retro Goggles on Forehead (Eyes left open & clear!) */}
                  <rect x="70" y="24" width="10" height="7" rx="2.5" fill="#0f172a" stroke="#facc15" strokeWidth="1.2" />
                  <rect x="82" y="24" width="10" height="7" rx="2.5" fill="#0f172a" stroke="#facc15" strokeWidth="1.2" />
                  <line x1="79" y1="27" x2="83" y2="27" stroke="#facc15" strokeWidth="1.5" />
                  <line x1="72" y1="26" x2="77" y2="29" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
                  <line x1="84" y1="26" x2="89" y2="29" stroke="#ffffff" strokeWidth="1" opacity="0.8" />

                  {/* Cream Muzzle, Nose & Panting Tongue */}
                  <ellipse cx="90" cy="42" rx="10" ry="7" fill="url(#qMuzzleCream)" stroke="#d97706" strokeWidth="0.8" />
                  <polygon points="96,38 93,35 99,35" fill="#0f172a" />
                  <circle cx="95" cy="36" r="0.8" fill="#ffffff" />
                  <path d="M 92 44 Q 94 53 98 52 Q 99 45 96 44 Z" fill="#f43f5e" stroke="#e11d48" strokeWidth="0.8" />
                  <path d="M 96 38 Q 96 44 92 46 M 96 38 Q 98 43 100 44" stroke="#0f172a" strokeWidth="1.3" fill="none" />

                  {/* Bright Specular Eyes */}
                  <ellipse cx="80" cy="35" rx="3.8" ry="4.2" fill="#0f172a" />
                  <circle cx="78.5" cy="33.5" r="1.5" fill="#ffffff" />
                  <circle cx="81.5" cy="36" r="0.8" fill="#ffffff" />

                  {/* Foreground Ear (Streaming back naturally in the wind, attached behind eye) */}
                  <path
                    d="M 74 26 C 66 26 50 30 46 40 C 44 48 52 52 62 48 C 70 44 76 36 76 28 Z"
                    fill="url(#qEarFur)"
                    stroke="#b45309"
                    strokeWidth="1"
                  />
                  <path d="M 72 27 Q 60 30 52 40" stroke="#fef08a" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.85" />
                </svg>
              </div>
            ) : effectiveCrossing === "cross-tennis-chase" ? (
              /* Tennis Chase: High-energy bounding Golden Retriever chasing tennis ball */
              <div className="relative w-26 h-22 sm:w-28 sm:h-24 shrink-0 filter drop-shadow-xl">
                <svg viewBox="0 0 140 100" className="w-full h-full">
                  {/* Bouncing Tennis Ball Ahead */}
                  <g className="animate-bounce">
                    <circle cx="124" cy="38" r="9" fill="#a3e635" stroke="#4d7c0f" strokeWidth="1.5" />
                    <path d="M 118 33 Q 124 38 118 43" stroke="#ffffff" strokeWidth="1.3" fill="none" />
                    <path d="M 130 33 Q 124 38 130 43" stroke="#ffffff" strokeWidth="1.3" fill="none" />
                    {/* Motion lines behind ball */}
                    <line x1="108" y1="36" x2="114" y2="36" stroke="#a3e635" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                    <line x1="106" y1="40" x2="112" y2="40" stroke="#a3e635" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                  </g>

                  {/* Wagging High Tail */}
                  <g className="quorra-tail-wag" style={{ transformOrigin: "28px 50px", transformBox: "view-box", animation: "quorraCrossingTailWagFast 0.45s ease-in-out infinite" }}>
                    <path
                      d="M 24 52 C 8 36 10 14 26 10 C 22 22 24 34 34 46 C 30 50 26 52 24 52 Z"
                      fill="url(#qGoldFur)"
                      stroke="#d97706"
                      strokeWidth="1"
                    />
                    <path d="M 22 20 Q 18 26 22 36" stroke="#fef08a" strokeWidth="1.2" fill="none" opacity="0.8" />
                  </g>

                  {/* Bounding Body */}
                  <ellipse cx="50" cy="54" rx="27" ry="17" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" />
                  <path d="M 62 44 Q 74 54 66 66 Q 56 58 62 44 Z" fill="url(#qMuzzleCream)" />

                  {/* Bounding Paws */}
                  <path d="M 28 60 Q 20 74 14 84 Q 20 86 26 82 Q 32 72 36 60 Z" fill="#d97706" />
                  <path d="M 40 62 Q 36 76 30 86 Q 38 88 42 82 Q 44 72 46 62 Z" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="0.8" />
                  <path d="M 64 60 Q 72 74 80 84 Q 86 82 82 72 Q 74 62 68 60 Z" fill="#d97706" />
                  <path d="M 54 62 Q 58 76 66 86 Q 74 84 72 74 Q 64 64 58 62 Z" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="0.8" />

                  {/* Red Collar & Gold Tag */}
                  <path d="M 64 42 Q 70 50 76 44" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="71" cy="51" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />

                  {/* Background Ear */}
                  <path d="M 62 24 C 52 20 44 26 40 34 C 40 40 48 42 56 36 Z" fill="url(#qEarFur)" opacity="0.8" />

                  {/* Golden Head Looking Ahead */}
                  <ellipse cx="76" cy="36" rx="19" ry="17" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" />

                  {/* Happy Open Mouth & Pink Tongue Panting */}
                  <ellipse cx="86" cy="40" rx="10" ry="7" fill="url(#qMuzzleCream)" stroke="#d97706" strokeWidth="0.8" />
                  <polygon points="92,36 89,33 95,33" fill="#0f172a" />
                  <circle cx="91" cy="34" r="0.8" fill="#ffffff" />
                  <path d="M 88 42 Q 90 52 94 51 Q 95 44 92 43 Z" fill="#f43f5e" stroke="#e11d48" strokeWidth="0.8" />
                  <path d="M 92 36 Q 92 42 88 44 M 92 36 Q 94 41 96 42" stroke="#0f172a" strokeWidth="1.3" fill="none" />

                  {/* Eager Focused Puppy Eyes */}
                  <ellipse cx="76" cy="32" rx="4" ry="4.5" fill="#0f172a" />
                  <circle cx="74.5" cy="30.5" r="1.6" fill="#ffffff" />
                  <circle cx="77.5" cy="33" r="0.8" fill="#ffffff" />

                  {/* Foreground Ear (Flapping back excitedly with sprint) */}
                  <path
                    d="M 70 24 C 62 24 48 28 44 38 C 42 46 50 50 60 46 C 68 42 74 34 72 25 Z"
                    fill="url(#qEarFur)"
                    stroke="#b45309"
                    strokeWidth="1"
                  />
                  <path d="M 68 25 Q 56 28 48 38" stroke="#fef08a" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.85" />
                </svg>
              </div>
            ) : effectiveCrossing === "cross-butterfly-follow" ? (
              /* Butterfly Follow: Curious gentle Golden Retriever watching a glowing blue butterfly */
              <div className="relative w-26 h-22 sm:w-28 sm:h-24 shrink-0 filter drop-shadow-xl">
                <svg viewBox="0 0 130 100" className="w-full h-full">
                  {/* Glowing Butterfly Ahead */}
                  <g transform="translate(112, 22)" className="animate-pulse">
                    <ellipse cx="-5" cy="-5" rx="7" ry="4" fill="#38bdf8" transform="rotate(-20 -5 -5)" />
                    <ellipse cx="5" cy="-5" rx="7" ry="4" fill="#38bdf8" transform="rotate(20 5 -5)" />
                    <ellipse cx="-4" cy="3" rx="5" ry="3" fill="#facc15" transform="rotate(-15 -4 3)" />
                    <ellipse cx="4" cy="3" rx="5" ry="3" fill="#facc15" transform="rotate(15 4 3)" />
                    <line x1="0" y1="-7" x2="0" y2="5" stroke="#0f172a" strokeWidth="1.2" />
                    <polygon points="10,-6 12,-4 14,-6 12,-8" fill="#facc15" className="animate-spin" />
                  </g>

                  {/* Wagging Tail */}
                  <g className="quorra-tail-wag" style={{ transformOrigin: "28px 54px", transformBox: "view-box", animation: "quorraCrossingTailWag 0.65s ease-in-out infinite" }}>
                    <path
                      d="M 24 56 C 8 40 10 18 26 14 C 22 26 24 38 34 50 C 30 54 26 56 24 56 Z"
                      fill="url(#qGoldFur)"
                      stroke="#d97706"
                      strokeWidth="1"
                    />
                    <path d="M 22 24 Q 18 30 22 40" stroke="#fef08a" strokeWidth="1.2" fill="none" opacity="0.8" />
                  </g>

                  {/* Trotting Body */}
                  <ellipse cx="48" cy="58" rx="27" ry="18" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" />
                  <path d="M 60 48 Q 72 58 64 70 Q 54 62 60 48 Z" fill="url(#qMuzzleCream)" />

                  {/* 4 Trotting Paws */}
                  <ellipse cx="26" cy="78" rx="6" ry="5" fill="#d97706" />
                  <ellipse cx="40" cy="80" rx="6" ry="5" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="0.8" />
                  <ellipse cx="62" cy="78" rx="6" ry="5" fill="#d97706" />
                  <ellipse cx="76" cy="80" rx="6" ry="5" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="0.8" />

                  {/* Red Collar & Gold Tag */}
                  <path d="M 64 44 Q 70 52 76 46" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="71" cy="53" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />

                  {/* Background Ear */}
                  <path d="M 62 24 C 56 16 48 24 46 34 C 46 42 52 44 58 38 Z" fill="url(#qEarFur)" opacity="0.8" />

                  {/* Golden Head Tilted Slightly Up */}
                  <ellipse cx="76" cy="36" rx="19" ry="17" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" />

                  {/* Cream Muzzle & Gentle Smile */}
                  <ellipse cx="86" cy="38" rx="10" ry="7" fill="url(#qMuzzleCream)" stroke="#d97706" strokeWidth="0.8" />
                  <polygon points="92,34 89,31 95,31" fill="#0f172a" />
                  <circle cx="91" cy="32" r="0.8" fill="#ffffff" />
                  <path d="M 88 40 Q 90 47 93 46 Q 94 41 91 40 Z" fill="#f43f5e" stroke="#e11d48" strokeWidth="0.8" />

                  {/* Curious Looking-Up Eyes */}
                  <ellipse cx="76" cy="31" rx="4" ry="4.5" fill="#0f172a" />
                  <circle cx="75" cy="29" r="1.6" fill="#ffffff" />
                  <circle cx="78" cy="31" r="0.8" fill="#ffffff" />

                  {/* Foreground Floppy Drop Ear (Hanging alertly behind the eye) */}
                  <path
                    d="M 70 24 C 74 25 76 34 74 44 C 72 54 66 58 60 56 C 56 52 56 40 58 32 C 60 26 66 24 70 24 Z"
                    fill="url(#qEarFur)"
                    stroke="#b45309"
                    strokeWidth="1"
                  />
                  <path d="M 67 25 Q 73 27 71 36" stroke="#fef08a" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.85" />
                </svg>
              </div>
            ) : effectiveCrossing === "cross-wagon" ? (
              /* Wagon Parade: Quorra is the 75%+ hero inside a low-profile red wagon, waving happily */
              <div className="relative w-28 h-22 sm:w-32 sm:h-24 shrink-0 filter drop-shadow-xl">
                <svg viewBox="0 0 140 100" className="w-full h-full">
                  {/* Low Profile Classic Red Wagon */}
                  <rect x="22" y="66" width="68" height="18" rx="4" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
                  <circle cx="36" cy="88" r="6.5" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="76" cy="88" r="6.5" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
                  {/* Tow Handle */}
                  <line x1="90" y1="74" x2="110" y2="70" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Wagon Goods: Golden Bone & Star */}
                  <rect x="26" y="58" width="14" height="4" rx="2" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
                  <polygon points="38,52 40,56 44,56 41,58 42,62 38,59 34,62 35,58 32,56 36,56" fill="#fbbf24" />

                  {/* Quorra Sitting Proudly in Wagon - Wagging Tail at Left Rump */}
                  <g className="quorra-tail-wag" style={{ transformOrigin: "42px 48px", transformBox: "view-box", animation: "quorraCrossingTailWag 0.6s ease-in-out infinite" }}>
                    <path
                      d="M 38 52 C 22 40 24 20 38 18 C 34 28 36 38 46 46 C 42 50 39 52 38 52 Z"
                      fill="url(#qGoldFur)"
                      stroke="#d97706"
                      strokeWidth="1"
                    />
                    <path d="M 34 26 Q 30 32 34 40" stroke="#fef08a" strokeWidth="1.2" fill="none" opacity="0.8" />
                  </g>
                  <ellipse cx="58" cy="48" rx="24" ry="20" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" />
                  <path d="M 68 40 Q 78 48 72 58 Q 62 52 68 40 Z" fill="url(#qMuzzleCream)" />

                  {/* Waving Right Paw */}
                  <g className="animate-bounce origin-bottom">
                    <ellipse cx="84" cy="46" rx="7" ry="5" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="0.8" transform="rotate(-30 84 46)" />
                    <circle cx="87" cy="44" r="1.5" fill="#d97706" />
                  </g>

                  {/* Sunny Green Bandana & Collar */}
                  <polygon points="56,44 76,44 66,58" fill="#22c55e" stroke="#16a34a" strokeWidth="1" />
                  <circle cx="66" cy="48" r="2.5" fill="#facc15" />

                  {/* Golden Head */}
                  <ellipse cx="64" cy="30" rx="19" ry="17" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" />

                  {/* Left Drop Ear (Hanging naturally down outer left cheek) */}
                  <path
                    d="M 48 20 C 38 22 32 34 34 46 C 36 54 44 56 48 50 C 52 44 52 32 50 22 Z"
                    fill="url(#qEarFur)"
                    stroke="#b45309"
                    strokeWidth="1"
                  />
                  <path d="M 46 22 Q 40 25 40 34" stroke="#fef08a" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.85" />

                  {/* Right Drop Ear (Hanging naturally down outer right cheek) */}
                  <path
                    d="M 80 20 C 90 22 96 34 94 46 C 92 54 84 56 80 50 C 76 44 76 32 78 22 Z"
                    fill="url(#qEarFur)"
                    stroke="#b45309"
                    strokeWidth="1"
                  />
                  <path d="M 82 22 Q 88 25 88 34" stroke="#fef08a" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.85" />

                  {/* Cream Muzzle & Big Smile */}
                  <ellipse cx="64" cy="36" rx="11" ry="8" fill="url(#qMuzzleCream)" stroke="#d97706" strokeWidth="0.8" />
                  <polygon points="64,32 60,28 68,28" fill="#0f172a" />
                  <circle cx="63" cy="30" r="0.8" fill="#ffffff" />
                  <path d="M 62 38 Q 64 47 66 47 Q 68 47 66 38 Z" fill="#f43f5e" stroke="#e11d48" strokeWidth="0.8" />

                  {/* Happy Shiny Eyes */}
                  <circle cx="56" cy="27" r="3.5" fill="#0f172a" />
                  <circle cx="54.5" cy="25.5" r="1.4" fill="#ffffff" />
                  <circle cx="72" cy="27" r="3.5" fill="#0f172a" />
                  <circle cx="70.5" cy="25.5" r="1.4" fill="#ffffff" />
                </svg>
              </div>
            ) : effectiveCrossing === "cross-flying-cape" ? (
              /* Super Quorra: Flying superhero pose with fluttering red cape */
              <div className="relative w-26 h-22 sm:w-28 sm:h-24 shrink-0 filter drop-shadow-xl">
                <svg viewBox="0 0 130 100" className="w-full h-full">
                  {/* Streaming Feathered Tail */}
                  <g className="quorra-tail-wag" style={{ transformOrigin: "34px 48px", transformBox: "view-box", animation: "quorraCrossingTailWagFast 0.5s ease-in-out infinite" }}>
                    <path
                      d="M 30 50 C 14 46 6 34 16 26 C 20 34 26 40 38 44 C 35 48 32 50 30 50 Z"
                      fill="url(#qGoldFur)"
                      stroke="#d97706"
                      strokeWidth="1"
                    />
                    <path d="M 22 32 Q 28 36 34 40" stroke="#fef08a" strokeWidth="1.2" fill="none" opacity="0.8" />
                  </g>

                  {/* Fluttering Red Superhero Cape */}
                  <path d="M 16 38 Q -6 48 4 72 Q 26 56 34 44 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" className="animate-pulse" />
                  <polygon points="12,54 14,58 18,58 15,60 16,64 12,61 8,64 9,60 6,58 10,58" fill="#facc15" />

                  {/* Dynamic Flying Body */}
                  <ellipse cx="56" cy="46" rx="30" ry="16" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" transform="rotate(-8 56 46)" />
                  <path d="M 70 38 Q 80 46 72 56 Q 64 50 70 38 Z" fill="url(#qMuzzleCream)" />

                  {/* Extended Flying Paws */}
                  <ellipse cx="98" cy="44" rx="8" ry="4" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="0.8" transform="rotate(5 98 44)" />
                  <ellipse cx="92" cy="50" rx="7" ry="3.5" fill="#d97706" stroke="#b45309" strokeWidth="0.8" />
                  <ellipse cx="26" cy="54" rx="8" ry="4" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="0.8" transform="rotate(-15 26 54)" />

                  {/* Red Collar & Golden Medal */}
                  <path d="M 72 34 Q 78 42 84 36" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="79" cy="43" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />

                  {/* Background Ear */}
                  <path d="M 68 22 C 56 18 46 24 44 34 C 44 40 52 42 60 36 Z" fill="url(#qEarFur)" opacity="0.8" />

                  {/* Golden Head */}
                  <ellipse cx="82" cy="32" rx="18" ry="16" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" />

                  {/* Cream Muzzle & Confident Grin */}
                  <ellipse cx="90" cy="35" rx="9" ry="6" fill="url(#qMuzzleCream)" stroke="#d97706" strokeWidth="0.8" />
                  <polygon points="95,32 92,29 98,29" fill="#0f172a" />
                  <circle cx="94" cy="30" r="0.8" fill="#ffffff" />
                  <path d="M 91 37 Q 93 44 96 43 Q 97 38 94 37 Z" fill="#f43f5e" stroke="#e11d48" strokeWidth="0.8" />

                  {/* Joyful Flying Eyes */}
                  <ellipse cx="80" cy="28" rx="3.8" ry="4.2" fill="#0f172a" />
                  <circle cx="78.5" cy="26.5" r="1.5" fill="#ffffff" />
                  <circle cx="81.5" cy="29" r="0.8" fill="#ffffff" />

                  {/* Foreground Ear (Streaming back dynamically with superhero cape) */}
                  <path
                    d="M 76 22 C 66 22 52 26 48 36 C 46 42 54 46 64 42 C 72 38 78 30 78 23 Z"
                    fill="url(#qEarFur)"
                    stroke="#b45309"
                    strokeWidth="1"
                  />
                  <path d="M 74 23 Q 62 26 54 36" stroke="#fef08a" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.85" />
                </svg>
              </div>
            ) : effectiveCrossing === "cross-bicycle" ? (
              /* Bicycle Ride: Retro blue bike with flower basket, Quorra steering with full clear head & chest */
              <div className="relative w-26 h-22 sm:w-28 sm:h-24 shrink-0 filter drop-shadow-xl">
                <svg viewBox="0 0 130 100" className="w-full h-full">
                  {/* Bicycle Frame & Wheels */}
                  <circle cx="34" cy="74" r="13" fill="none" stroke="#0284c7" strokeWidth="2.5" />
                  <circle cx="34" cy="74" r="2.5" fill="#0284c7" />
                  <circle cx="92" cy="74" r="13" fill="none" stroke="#0284c7" strokeWidth="2.5" />
                  <circle cx="92" cy="74" r="2.5" fill="#0284c7" />
                  <line x1="34" y1="74" x2="62" y2="74" stroke="#0284c7" strokeWidth="2.5" />
                  <line x1="62" y1="74" x2="54" y2="52" stroke="#0284c7" strokeWidth="2.5" />
                  <line x1="34" y1="74" x2="54" y2="52" stroke="#0284c7" strokeWidth="2.5" />
                  <line x1="62" y1="74" x2="88" y2="50" stroke="#0284c7" strokeWidth="2.5" />
                  <line x1="92" y1="74" x2="88" y2="50" stroke="#0284c7" strokeWidth="2.5" />
                  <line x1="84" y1="46" x2="94" y2="46" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />

                  {/* Wicker Basket with Flower */}
                  <rect x="92" y="44" width="12" height="9" rx="2.5" fill="#d97706" stroke="#92400e" strokeWidth="1.2" />
                  <circle cx="98" cy="41" r="3.5" fill="#f43f5e" />
                  <circle cx="98" cy="41" r="1.5" fill="#facc15" />

                  {/* Wagging Tail Behind Saddle */}
                  <g className="quorra-tail-wag" style={{ transformOrigin: "44px 48px", transformBox: "view-box", animation: "quorraCrossingTailWag 0.6s ease-in-out infinite" }}>
                    <path
                      d="M 40 50 C 26 38 28 18 42 16 C 38 26 40 36 48 44 C 45 48 42 50 40 50 Z"
                      fill="url(#qGoldFur)"
                      stroke="#d97706"
                      strokeWidth="1"
                    />
                    <path d="M 38 24 Q 34 30 38 38" stroke="#fef08a" strokeWidth="1.2" fill="none" opacity="0.8" />
                  </g>

                  {/* Quorra Rider */}
                  <ellipse cx="58" cy="48" rx="22" ry="18" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" />
                  <ellipse cx="86" cy="48" rx="6" ry="4" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="0.8" />

                  {/* Red Collar & Gold Tag */}
                  <path d="M 64 38 Q 70 46 76 40" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
                  <circle cx="71" cy="47" r="3" fill="#facc15" />

                  {/* Golden Head */}
                  <ellipse cx="68" cy="28" rx="18" ry="16" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" />

                  {/* Left Droop Ear */}
                  <path
                    d="M 52 18 C 42 20 36 32 38 44 C 40 52 48 54 52 48 C 56 42 56 30 54 20 Z"
                    fill="url(#qEarFur)"
                    stroke="#b45309"
                    strokeWidth="1"
                  />
                  <path d="M 50 20 Q 44 23 44 32" stroke="#fef08a" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.85" />

                  {/* Right Droop Ear */}
                  <path
                    d="M 84 18 C 94 20 100 32 98 44 C 96 52 88 54 84 48 C 80 42 80 30 82 20 Z"
                    fill="url(#qEarFur)"
                    stroke="#b45309"
                    strokeWidth="1"
                  />
                  <path d="M 86 20 Q 92 23 92 32" stroke="#fef08a" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.85" />

                  {/* Cream Muzzle & Open Smile */}
                  <ellipse cx="72" cy="33" rx="9" ry="6" fill="url(#qMuzzleCream)" stroke="#d97706" strokeWidth="0.8" />
                  <polygon points="75,30 72,27 78,27" fill="#0f172a" />
                  <circle cx="74" cy="28" r="0.7" fill="#ffffff" />
                  <path d="M 73 35 Q 75 41 77 41 Q 78 36 76 35 Z" fill="#f43f5e" />

                  {/* Happy Eyes */}
                  <circle cx="64" cy="24" r="3.2" fill="#0f172a" />
                  <circle cx="63" cy="23" r="1.2" fill="#ffffff" />
                  <circle cx="76" cy="24" r="3.2" fill="#0f172a" />
                  <circle cx="75" cy="23" r="1.2" fill="#ffffff" />
                </svg>
              </div>
            ) : effectiveCrossing === "cross-balloon-float" ? (
              /* Balloon Float: 3 vibrant balloons overhead, Quorra suspended in harness paddling paws */
              <div className="relative w-24 h-22 sm:w-26 sm:h-24 shrink-0 filter drop-shadow-xl">
                <svg viewBox="0 0 120 110" className="w-full h-full">
                  {/* Floating Balloons Overhead */}
                  <g className="animate-pulse">
                    <circle cx="44" cy="16" r="11" fill="#f43f5e" stroke="#e11d48" strokeWidth="1" />
                    <circle cx="62" cy="11" r="12" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
                    <circle cx="78" cy="18" r="11" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
                    {/* Balloon Strings */}
                    <line x1="44" y1="27" x2="60" y2="48" stroke="#94a3b8" strokeWidth="1.2" />
                    <line x1="62" y1="23" x2="60" y2="48" stroke="#94a3b8" strokeWidth="1.2" />
                    <line x1="78" y1="29" x2="60" y2="48" stroke="#94a3b8" strokeWidth="1.2" />
                  </g>

                  {/* Wagging Floating Tail */}
                  <g className="quorra-tail-wag" style={{ transformOrigin: "44px 64px", transformBox: "view-box", animation: "quorraCrossingTailWag 0.65s ease-in-out infinite" }}>
                    <path
                      d="M 40 66 C 24 54 26 34 40 32 C 36 42 38 50 48 58 C 45 62 42 65 40 66 Z"
                      fill="url(#qGoldFur)"
                      stroke="#d97706"
                      strokeWidth="1"
                    />
                    <path d="M 34 40 Q 32 48 38 54" stroke="#fef08a" strokeWidth="1.2" fill="none" opacity="0.8" />
                  </g>

                  {/* Quorra in Teal Harness Floating */}
                  <ellipse cx="60" cy="68" rx="23" ry="19" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" />

                  {/* Paddling Paws */}
                  <ellipse cx="44" cy="88" rx="5.5" ry="4" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="0.8" />
                  <ellipse cx="56" cy="89" rx="5.5" ry="4" fill="#d97706" stroke="#b45309" strokeWidth="0.8" />
                  <ellipse cx="70" cy="88" rx="5.5" ry="4" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="0.8" />

                  {/* Teal Chest Harness */}
                  <path d="M 48 64 Q 60 72 72 64" stroke="#0d9488" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                  <circle cx="60" cy="48" r="3" fill="#facc15" />

                  {/* Golden Head */}
                  <ellipse cx="60" cy="48" rx="18" ry="16" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" />

                  {/* Left Floating Ear */}
                  <path
                    d="M 44 38 C 34 40 28 52 30 64 C 32 72 40 74 44 68 C 48 62 48 50 46 40 Z"
                    fill="url(#qEarFur)"
                    stroke="#b45309"
                    strokeWidth="1"
                  />
                  <path d="M 42 40 Q 36 44 36 54" stroke="#fef08a" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.85" />

                  {/* Right Floating Ear */}
                  <path
                    d="M 76 38 C 86 40 92 52 90 64 C 88 72 80 74 76 68 C 72 62 72 50 74 40 Z"
                    fill="url(#qEarFur)"
                    stroke="#b45309"
                    strokeWidth="1"
                  />
                  <path d="M 78 40 Q 84 44 84 54" stroke="#fef08a" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.85" />

                  {/* Cream Muzzle & Happy Open Mouth */}
                  <ellipse cx="60" cy="54" rx="10" ry="7" fill="url(#qMuzzleCream)" stroke="#d97706" strokeWidth="0.8" />
                  <polygon points="60,50 56,46 64,46" fill="#0f172a" />
                  <circle cx="59" cy="48" r="0.7" fill="#ffffff" />
                  <path d="M 58 56 Q 60 64 62 64 Q 64 64 62 56 Z" fill="#f43f5e" />

                  {/* Joyful Puppy Eyes */}
                  <circle cx="53" cy="44" r="3.2" fill="#0f172a" />
                  <circle cx="52" cy="43" r="1.2" fill="#ffffff" />
                  <circle cx="67" cy="44" r="3.2" fill="#0f172a" />
                  <circle cx="66" cy="43" r="1.2" fill="#ffffff" />
                </svg>
              </div>
            ) : effectiveCrossing === "cross-duckling-parade" ? (
              /* Duckling Parade: Proud big Golden Retriever leading 2 cute yellow ducklings */
              <div className="relative w-30 h-22 sm:w-34 sm:h-24 shrink-0 filter drop-shadow-xl">
                <svg viewBox="0 0 150 100" className="w-full h-full">
                  {/* Two Baby Ducklings Following Behind */}
                  <g className="animate-bounce" style={{ animationDuration: "0.5s" }}>
                    <circle cx="16" cy="74" r="7.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
                    <circle cx="23" cy="67" r="5.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
                    <polygon points="28,67 33,68.5 28,70" fill="#f97316" />
                    <circle cx="22" cy="65.5" r="1.3" fill="#0f172a" />
                  </g>
                  <g className="animate-bounce" style={{ animationDuration: "0.55s", animationDelay: "0.15s" }}>
                    <circle cx="42" cy="72" r="8.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
                    <circle cx="50" cy="65" r="6" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
                    <polygon points="56,65 61,66.5 56,68" fill="#f97316" />
                    <circle cx="49" cy="63.5" r="1.4" fill="#0f172a" />
                  </g>

                  {/* High Proud Wagging Tail */}
                  <g className="quorra-tail-wag" style={{ transformOrigin: "78px 52px", transformBox: "view-box", animation: "quorraCrossingTailWag 0.6s ease-in-out infinite" }}>
                    <path
                      d="M 74 54 C 58 40 62 16 80 14 C 76 24 78 36 86 46 C 82 51 77 53 74 54 Z"
                      fill="url(#qGoldFur)"
                      stroke="#d97706"
                      strokeWidth="1"
                    />
                    <path d="M 72 24 Q 68 30 72 40" stroke="#fef08a" strokeWidth="1.2" fill="none" opacity="0.8" />
                  </g>

                  {/* Quorra Leading Parade */}
                  <ellipse cx="96" cy="56" rx="25" ry="17" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" />
                  <path d="M 108 46 Q 118 56 112 66 Q 102 60 108 46 Z" fill="url(#qMuzzleCream)" />

                  {/* Paws */}
                  <ellipse cx="80" cy="78" rx="6" ry="5" fill="#d97706" />
                  <ellipse cx="94" cy="80" rx="6" ry="5" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="0.8" />
                  <ellipse cx="114" cy="78" rx="6" ry="5" fill="#d97706" />
                  <ellipse cx="126" cy="80" rx="6" ry="5" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="0.8" />

                  {/* Red Collar & Gold Tag */}
                  <path d="M 110 42 Q 116 50 122 44" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="117" cy="51" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />

                  {/* Background Ear */}
                  <path d="M 108 22 C 102 14 94 22 92 32 C 92 38 98 40 104 34 Z" fill="url(#qEarFur)" opacity="0.8" />

                  {/* Golden Head */}
                  <ellipse cx="122" cy="34" rx="18" ry="16" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" />

                  {/* Cream Muzzle & Happy Smile */}
                  <ellipse cx="132" cy="38" rx="9" ry="6" fill="url(#qMuzzleCream)" stroke="#d97706" strokeWidth="0.8" />
                  <polygon points="137,34 134,31 140,31" fill="#0f172a" />
                  <circle cx="136" cy="32" r="0.8" fill="#ffffff" />
                  <path d="M 134 40 Q 136 47 139 46 Q 140 41 137 40 Z" fill="#f43f5e" stroke="#e11d48" strokeWidth="0.8" />

                  {/* Bright Shiny Eyes */}
                  <circle cx="122" cy="30" r="3.5" fill="#0f172a" />
                  <circle cx="120.5" cy="28.5" r="1.5" fill="#ffffff" />
                  <circle cx="123.5" cy="31" r="0.8" fill="#ffffff" />

                  {/* Foreground Ear (Hanging gracefully behind the eye) */}
                  <path
                    d="M 116 22 C 120 23 122 32 120 42 C 118 52 112 56 106 54 C 102 50 102 38 104 30 C 106 24 112 22 116 22 Z"
                    fill="url(#qEarFur)"
                    stroke="#b45309"
                    strokeWidth="1"
                  />
                  <path d="M 113 23 Q 119 25 117 34" stroke="#fef08a" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.85" />
                </svg>
              </div>
            ) : effectiveCrossing === "cross-rainbow-trail" ? (
              /* Rainbow Sprint: Dynamic running Golden Retriever with colorful trailing rainbow stream */
              <div className="relative w-28 h-22 sm:w-32 sm:h-24 shrink-0 filter drop-shadow-xl">
                <svg viewBox="0 0 140 100" className="w-full h-full">
                  {/* Rainbow Arcs Streaming Behind */}
                  <path d="M 8 50 Q 40 44 72 54" stroke="#ef4444" strokeWidth="3.5" fill="none" opacity="0.9" strokeLinecap="round" />
                  <path d="M 8 54 Q 40 48 72 58" stroke="#f59e0b" strokeWidth="3.5" fill="none" opacity="0.9" strokeLinecap="round" />
                  <path d="M 8 58 Q 40 52 72 62" stroke="#22c55e" strokeWidth="3.5" fill="none" opacity="0.9" strokeLinecap="round" />
                  <path d="M 8 62 Q 40 56 72 66" stroke="#3b82f6" strokeWidth="3.5" fill="none" opacity="0.9" strokeLinecap="round" />

                  {/* Sparkling Stars */}
                  <polygon points="26,42 28,46 32,46 29,48 30,52 26,49 22,52 23,48 20,46 24,46" fill="#facc15" className="animate-spin" />
                  <polygon points="50,62 52,66 56,66 53,68 54,72 50,69 46,72 47,68 44,66 48,66" fill="#facc15" className="animate-spin" />

                  {/* High Energetic Sprinting Tail */}
                  <g className="quorra-tail-wag" style={{ transformOrigin: "72px 52px", transformBox: "view-box", animation: "quorraCrossingTailWagFast 0.45s ease-in-out infinite" }}>
                    <path
                      d="M 68 54 C 52 40 56 16 74 14 C 70 24 72 36 80 46 C 76 51 71 53 68 54 Z"
                      fill="url(#qGoldFur)"
                      stroke="#d97706"
                      strokeWidth="1"
                    />
                    <path d="M 66 24 Q 62 30 66 40" stroke="#fef08a" strokeWidth="1.2" fill="none" opacity="0.8" />
                  </g>

                  {/* Sprinting Dog Body */}
                  <ellipse cx="90" cy="56" rx="26" ry="17" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" />
                  <path d="M 102 46 Q 112 56 106 66 Q 96 60 102 46 Z" fill="url(#qMuzzleCream)" />

                  {/* Running Paws */}
                  <path d="M 72 62 Q 64 76 56 86 Q 64 88 70 82 Q 76 72 80 62 Z" fill="#d97706" />
                  <path d="M 82 64 Q 78 78 72 88 Q 80 90 84 84 Q 86 74 88 64 Z" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="0.8" />
                  <path d="M 104 62 Q 112 76 120 86 Q 126 84 122 74 Q 114 64 108 62 Z" fill="#d97706" />
                  <path d="M 94 64 Q 98 78 106 88 Q 114 86 112 76 Q 104 66 98 64 Z" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="0.8" />

                  {/* Red Collar & Gold Tag */}
                  <path d="M 104 42 Q 110 50 116 44" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="111" cy="51" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />

                  {/* Background Ear */}
                  <path d="M 102 22 C 92 18 84 24 82 34 C 82 40 90 42 98 36 Z" fill="url(#qEarFur)" opacity="0.8" />

                  {/* Golden Head */}
                  <ellipse cx="116" cy="34" rx="18" ry="16" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" />

                  {/* Cream Muzzle & Joyful Panting Tongue */}
                  <ellipse cx="126" cy="38" rx="9" ry="6" fill="url(#qMuzzleCream)" stroke="#d97706" strokeWidth="0.8" />
                  <polygon points="131,34 128,31 134,31" fill="#0f172a" />
                  <circle cx="130" cy="32" r="0.8" fill="#ffffff" />
                  <path d="M 128 40 Q 130 48 134 47 Q 135 42 132 41 Z" fill="#f43f5e" stroke="#e11d48" strokeWidth="0.8" />

                  {/* Sparkling Eyes */}
                  <circle cx="116" cy="30" r="3.5" fill="#0f172a" />
                  <circle cx="114.5" cy="28.5" r="1.5" fill="#ffffff" />
                  <circle cx="117.5" cy="31" r="0.8" fill="#ffffff" />

                  {/* Foreground Ear (Streaming back in sprint) */}
                  <path
                    d="M 110 22 C 100 24 86 28 84 38 C 82 46 90 50 100 46 C 108 42 114 34 112 24 Z"
                    fill="url(#qEarFur)"
                    stroke="#b45309"
                    strokeWidth="1"
                  />
                  <path d="M 108 23 Q 96 26 88 36" stroke="#fef08a" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.85" />
                </svg>
              </div>
            ) : (
              /* Default Classic Joyful Golden Trot (cross-trot-banner) */
              <div className="relative w-24 h-22 sm:w-26 sm:h-24 shrink-0 filter drop-shadow-xl">
                <svg viewBox="0 0 120 100" className="w-full h-full">
                  {/* Arched Feathered Wagging Tail */}
                  <g className="quorra-tail-wag" style={{ transformOrigin: "32px 54px", transformBox: "view-box", animation: "quorraCrossingTailWag 0.6s ease-in-out infinite" }}>
                    <path
                      d="M 28 56 C 12 40 16 16 34 12 C 30 24 32 36 42 48 C 38 53 32 55 28 56 Z"
                      fill="url(#qGoldFur)"
                      stroke="#d97706"
                      strokeWidth="1"
                    />
                    <path d="M 28 22 Q 22 28 26 38" stroke="#fef08a" strokeWidth="1.2" fill="none" opacity="0.8" />
                  </g>

                  {/* Trotting Torso */}
                  <ellipse cx="50" cy="58" rx="28" ry="18" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" />
                  <path d="M 64 48 Q 76 58 68 70 Q 58 62 64 48 Z" fill="url(#qMuzzleCream)" />

                  {/* 4 Articulated Trotting Legs/Paws */}
                  <path d="M 28 62 Q 22 78 18 88 Q 24 90 30 88 Q 32 78 36 64 Z" fill="#d97706" />
                  <path d="M 64 62 Q 68 76 74 86 Q 80 84 78 74 Q 72 64 68 62 Z" fill="#d97706" />
                  <path d="M 40 64 Q 36 78 32 88 Q 40 90 44 86 Q 46 76 48 64 Z" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="0.8" />
                  <path d="M 54 64 Q 50 76 46 88 Q 54 90 58 86 Q 60 76 62 64 Z" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="0.8" />

                  {/* Signature Red Collar & Gold Medal Tag */}
                  <path d="M 66 44 Q 72 52 78 46" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="73" cy="53" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
                  <circle cx="73" cy="53" r="1.2" fill="#ffffff" />

                  {/* Background Ear (Far ear peeking behind skull crown) */}
                  <path d="M 64 26 C 58 18 50 26 48 36 C 48 44 54 46 60 40 Z" fill="url(#qEarFur)" opacity="0.8" />

                  {/* Golden Head */}
                  <ellipse cx="78" cy="38" rx="20" ry="18" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" />

                  {/* Cream Muzzle, Black Button Nose, Open Smile & Joyful Pink Tongue */}
                  <ellipse cx="88" cy="42" rx="10" ry="7" fill="url(#qMuzzleCream)" stroke="#d97706" strokeWidth="0.8" />
                  <polygon points="94,38 91,35 97,35" fill="#0f172a" />
                  <circle cx="93.5" cy="36" r="0.8" fill="#ffffff" />
                  <path d="M 90 44 Q 92 53 96 52 Q 97 45 94 44 Z" fill="#f43f5e" stroke="#e11d48" strokeWidth="0.8" />
                  <path d="M 94 38 Q 94 44 90 46 M 94 38 Q 96 43 98 44" stroke="#0f172a" strokeWidth="1.4" fill="none" />

                  {/* Big Puppy Eyes with Dual Specular Highlights */}
                  <ellipse cx="78" cy="34" rx="4" ry="4.5" fill="#0f172a" />
                  <circle cx="76.5" cy="32.5" r="1.6" fill="#ffffff" />
                  <circle cx="79.5" cy="35" r="0.8" fill="#ffffff" />
                  <ellipse cx="77" cy="27" rx="2.5" ry="1.2" fill="#fef08a" />

                  {/* Foreground Floppy Feathered Golden Drop Ear (Hanging down & back over cheek/neck) */}
                  <path
                    d="M 72 24 C 76 25 76 34 74 44 C 72 54 66 60 60 58 C 55 54 54 44 56 34 C 58 26 66 23 72 24 Z"
                    fill="url(#qEarFur)"
                    stroke="#b45309"
                    strokeWidth="1"
                  />
                  {/* Ear Fold Crease & Feathering Highlight */}
                  <path d="M 68 25 Q 74 27 72 36" stroke="#fef08a" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.85" />
                  <path d="M 57 44 Q 53 48 57 52" stroke="#9a3412" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />
                </svg>
              </div>
            )}

            {/* Crossing Banner / High-Contrast Motivational Pill */}
            <div className="bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-amber-300 font-black text-xs sm:text-sm px-4 py-2 rounded-2xl shadow-xl border-2 border-amber-400 dark:border-amber-500/80 flex items-center gap-2 whitespace-nowrap backdrop-blur-xs">
              <span className="text-base">🐾</span>
              {categoryName ? (
                <span>
                  {categoryName} {categoryNameZh ? `· ${categoryNameZh}` : ""}
                </span>
              ) : effectiveCrossing === "cross-skateboard" ? (
                <span>Cruising Along! 🛹 帥氣溜板</span>
              ) : effectiveCrossing === "cross-tennis-chase" ? (
                <span>Great Fetch! 🎾 接球高手</span>
              ) : effectiveCrossing === "cross-butterfly-follow" ? (
                <span>Butterfly Chase! 🦋 漫步追蝶</span>
              ) : effectiveCrossing === "cross-wagon" ? (
                <span>Rolling Wagon! 🛒 歡樂小車</span>
              ) : effectiveCrossing === "cross-flying-cape" ? (
                <span>Super Quorra! 🦸‍♀️ 超級狗狗</span>
              ) : effectiveCrossing === "cross-bicycle" ? (
                <span>Bicycle Ride! 🚲 單車微風</span>
              ) : effectiveCrossing === "cross-balloon-float" ? (
                <span>Up and Away! 🎈 氣球起飛</span>
              ) : effectiveCrossing === "cross-duckling-parade" ? (
                <span>Duckling Parade! 🦆 鴨鴨隊伍</span>
              ) : effectiveCrossing === "cross-rainbow-trail" ? (
                <span>Rainbow Sprint! 🌈 彩虹奔馳</span>
              ) : (
                <span>Keep Going, Dad! 🐾 爸爸加油！</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. BOTTOM-LEFT CORNER ANIMATIONS (25 Unique Types)          */}
      {/* ============================================================ */}
      {effectiveCorner && (
        <div
          className="absolute -bottom-1 z-30 pointer-events-auto cursor-pointer select-none group"
          style={{
            left: "max(3.5rem, calc(25% - 128px))",
            transform: "translateX(-50%)",
          }}
        >
          <div
            key={cornerKey ?? animationKey ?? effectiveCorner}
            onClick={handlePetCorner}
            className="quorra-corner-item"
            style={{
              animation: isPetted
                ? "none"
                : "quorraCornerPeekLeft 14s ease-in-out forwards",
              transform: isPetted ? "translateY(0) scale(1)" : undefined,
              opacity: isPetted ? 1 : undefined,
            }}
          >
            {/* Main Dog Container with fixed width/height so base position never shifts */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28">
              {/* Speech Bubble Pill - Centered directly above the dog */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 pointer-events-none whitespace-nowrap z-10">
                <div className="bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black shadow-lg border-2 border-white flex items-center gap-1.5 animate-bounce">
                  <span>🐾</span>
                  <span>{getCornerBubbleText()}</span>
                </div>
              </div>

              {/* Tap-to-Pet Floating Hearts */}
              {petHearts.map((h) => (
                <span
                  key={h.id}
                  className="absolute text-2xl pointer-events-none animate-ping z-40"
                  style={{
                    left: "50%",
                    top: "20%",
                    transform: `translate(calc(-50% + ${h.x}px), ${h.y}px)`,
                  }}
                >
                  💖
                </span>
              ))}

              {/* Golden Retriever Base SVG in Bottom-Left */}
              <div className="w-full h-full filter drop-shadow-2xl">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Wagging Tail at Right for left-corner balance */}
                  <g className="quorra-tail-wag" style={{ transformOrigin: "80px 60px", transformBox: "view-box", animation: "quorraCornerTailWag 0.6s ease-in-out infinite" }}>
                    <path
                      d="M 78 62 Q 96 45 88 32 Q 76 42 78 62 Z"
                      fill="url(#qGoldFur)"
                      stroke="#d97706"
                      strokeWidth="1"
                    />
                  </g>

                  {/* Golden Head */}
                  <circle cx="50" cy="46" r="28" fill="url(#qGoldFur)" stroke="#d97706" strokeWidth="1.2" />

                  {/* Floppy Golden Feathered Ears */}
                  <path
                    d="M 32 30 C 20 32 14 46 16 62 C 18 72 28 74 34 66 C 36 60 36 44 34 30 Z"
                    fill="url(#qEarFur)"
                    stroke="#b45309"
                    strokeWidth="1"
                  />
                  <path d="M 30 32 Q 22 36 22 48" stroke="#fef08a" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.85" />

                  <path
                    d="M 68 30 C 80 32 86 46 84 62 C 82 72 72 74 66 66 C 64 60 64 44 66 30 Z"
                    fill="url(#qEarFur)"
                    stroke="#b45309"
                    strokeWidth="1"
                  />
                  <path d="M 70 32 Q 78 36 78 48" stroke="#fef08a" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.85" />

                  {/* Cream Muzzle & Black Button Nose */}
                  <ellipse cx="50" cy="54" rx="14" ry="11" fill="url(#qMuzzleCream)" stroke="#d97706" strokeWidth="1" />
                  <polygon points="50,50 44,45 56,45" fill="#0f172a" />
                  <circle cx="49" cy="47" r="0.9" fill="#ffffff" />
                  <path d="M 50 50 Q 50 58 46 60 M 50 50 Q 50 58 54 60" stroke="#0f172a" strokeWidth="1.8" fill="none" />
                  <path d="M 47 58 Q 50 67 53 58 Z" fill="#f43f5e" stroke="#e11d48" strokeWidth="0.8" />

                  {/* Specular Puppy Eyes */}
                  <circle cx="39" cy="42" r="4.5" fill="#0f172a" />
                  <circle cx="37.5" cy="40.5" r="1.8" fill="#ffffff" />
                  <circle cx="40.5" cy="43.5" r="0.9" fill="#ffffff" />
                  <circle cx="61" cy="42" r="4.5" fill="#0f172a" />
                  <circle cx="59.5" cy="40.5" r="1.8" fill="#ffffff" />
                  <circle cx="62.5" cy="43.5" r="0.9" fill="#ffffff" />

                  {/* Eyebrow Highlights */}
                  <ellipse cx="38" cy="35" rx="2.5" ry="1.2" fill="#fef08a" />
                  <ellipse cx="62" cy="35" rx="2.5" ry="1.2" fill="#fef08a" />

                  {/* Red Collar with Golden Tag */}
                  <path d="M 32 72 Q 50 78 68 72" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                  <circle cx="50" cy="76" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
                  <circle cx="50" cy="76" r="1.2" fill="#ffffff" />

                  {/* Front Paws */}
                  <ellipse cx="30" cy="84" rx="8.5" ry="6.5" fill="#d97706" stroke="#b45309" strokeWidth="0.8" />
                  <ellipse cx="70" cy="84" rx="8.5" ry="6.5" fill="#d97706" stroke="#b45309" strokeWidth="0.8" />

                  {/* Unique Accessory Layer for active animation */}
                  {renderCornerAccessory()}
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS Keyframes for 5.8s Crossing and 6.2s Bottom-Left Corner */}
      <style>{`
        @keyframes quorraCrossSmooth {
          0% {
            transform: translateX(-220px);
            opacity: 0;
          }
          6% {
            transform: translateX(-20px);
            opacity: 1;
          }
          90% {
            transform: translateX(calc(100% - 40px));
            opacity: 1;
          }
          100% {
            transform: translateX(calc(100% + 220px));
            opacity: 0;
          }
        }

        @keyframes quorraCornerPeekLeft {
          0% {
            transform: translateY(100px) scale(0.85);
            opacity: 0;
          }
          4% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          93% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(100px) scale(0.85);
            opacity: 0;
          }
        }

        @keyframes quorraCrossingTailWag {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-14deg);
          }
        }

        @keyframes quorraCrossingTailWagFast {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-18deg);
          }
        }

        @keyframes quorraCornerTailWag {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(16deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .quorra-crossing-item {
            animation: quorraFadeInTop 5.8s ease-in-out forwards !important;
            transform: none !important;
            margin: 0 auto;
          }
          .quorra-corner-item {
            animation: quorraFadeInCorner 14s ease-in-out forwards !important;
            transform: none !important;
          }
          .quorra-tail-wag {
            animation: none !important;
          }
          @keyframes quorraFadeInTop {
            0% { opacity: 0; transform: translateY(-8px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-8px); }
          }
          @keyframes quorraFadeInCorner {
            0% { opacity: 0; }
            4% { opacity: 1; }
            93% { opacity: 1; }
            100% { opacity: 0; }
          }
        }
      `}</style>
    </>
  );
};
