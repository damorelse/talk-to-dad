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

  // Normalize legacy aliases
  const resolvedType = React.useMemo<CornerAnimationType | CrossingAnimationType | null>(() => {
    if (!animationType) return null;
    if (animationType === "category-transition") return "cross-trot-banner";
    if (animationType === "corner-peek") return "corner-paw-wave";
    if (animationType === "ball-fetch") return "cross-tennis-chase";
    if (animationType === "spin-trophy") return "corner-golden-bone";
    return animationType as CornerAnimationType | CrossingAnimationType;
  }, [animationType]);

  const isCrossing = resolvedType && resolvedType.startsWith("cross-");

  // Play audio on initial entrance & handle auto-dismiss
  useEffect(() => {
    if (resolvedType) {
      setIsPetted(false);
      setPetHearts([]);
      playPuppyBark();

      // Crossing animations take 5.0s, corner animations take 3.0s
      const durationMs = isCrossing ? 5200 : 3200;
      const timer = setTimeout(() => {
        onComplete?.();
      }, durationMs);

      return () => clearTimeout(timer);
    }
  }, [resolvedType, isCrossing, onComplete, playPuppyBark]);

  // Handle tap-to-pet interaction
  const handlePet = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      setIsPetted(true);
      playPuppyBark();

      const newHeart = {
        id: Date.now() + Math.random(),
        x: (Math.random() - 0.5) * 50,
        y: -15 - Math.random() * 25,
      };
      setPetHearts((prev) => [...prev.slice(-4), newHeart]);

      setTimeout(() => {
        setIsPetted(false);
      }, 900);
    },
    [playPuppyBark]
  );

  if (!resolvedType) return null;

  // Render Corner Animation Accessory Overlay
  const renderCornerAccessory = () => {
    switch (resolvedType) {
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
    switch (resolvedType) {
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
      {/* ============================================================ */}
      {/* 1. TOP CROSSING ANIMATIONS (Left-to-Right, 5s, Non-blocking) */}
      {/* ============================================================ */}
      {isCrossing && (
        <div className="absolute top-0 left-0 right-0 h-16 z-30 pointer-events-none flex items-center overflow-hidden">
          <div
            onClick={handlePet}
            className="relative flex items-center gap-2 cursor-pointer select-none pointer-events-auto hover:scale-105 transition-transform"
            style={{
              animation: "quorraCross5s 5s cubic-bezier(0.25, 1, 0.5, 1) forwards",
            }}
          >
            {/* Tap-to-Pet Floating Hearts */}
            {petHearts.map((h) => (
              <span
                key={h.id}
                className="absolute text-xl pointer-events-none animate-ping z-20"
                style={{
                  left: "24px",
                  top: "10px",
                  transform: `translate(calc(-50% + ${h.x}px), ${h.y}px)`,
                }}
              >
                💖
              </span>
            ))}
            {/* Custom Crossing SVG by Type */}
            {resolvedType === "cross-skateboard" ? (
              <div className="relative w-16 h-16 shrink-0 drop-shadow-md">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="goldFurSkate" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                  {/* Skateboard */}
                  <rect x="10" y="78" width="80" height="7" rx="3" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
                  <circle cx="25" cy="88" r="5" fill="#0f172a" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="75" cy="88" r="5" fill="#0f172a" stroke="#ffffff" strokeWidth="1" />
                  {/* Quorra on Board */}
                  <ellipse cx="48" cy="55" rx="24" ry="16" fill="url(#goldFurSkate)" />
                  <circle cx="68" cy="38" r="16" fill="url(#goldFurSkate)" />
                  <path d="M 58 30 Q 52 44 56 52 Q 64 48 62 34 Z" fill="#b45309" />
                  <path d="M 76 30 Q 82 44 78 52 Q 72 48 72 34 Z" fill="#b45309" />
                  <ellipse cx="74" cy="43" rx="7" ry="5" fill="#fef3c7" />
                  <polygon points="74,40 71,37 77,37" fill="#0f172a" />
                  <circle cx="65" cy="36" r="2.5" fill="#0f172a" />
                  <circle cx="77" cy="36" r="2.5" fill="#0f172a" />
                  {/* Cool shades */}
                  <rect x="60" y="33" width="9" height="6" rx="2" fill="#0f172a" />
                  <rect x="71" y="33" width="9" height="6" rx="2" fill="#0f172a" />
                </svg>
              </div>
            ) : resolvedType === "cross-flying-cape" ? (
              <div className="relative w-16 h-16 shrink-0 drop-shadow-md">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="goldFurFly" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                  {/* Fluttering Red Cape */}
                  <path d="M 12 40 Q -8 50 4 70 Q 24 55 30 45 Z" fill="#ef4444" className="animate-pulse" />
                  {/* Flying Body */}
                  <ellipse cx="50" cy="46" rx="28" ry="14" fill="url(#goldFurFly)" transform="rotate(-10 50 46)" />
                  <circle cx="76" cy="38" r="15" fill="url(#goldFurFly)" />
                  <ellipse cx="82" cy="41" rx="6" ry="4" fill="#fef3c7" />
                  <polygon points="82,39 80,36 84,36" fill="#0f172a" />
                  <circle cx="73" cy="35" r="2.5" fill="#0f172a" />
                  <circle cx="81" cy="35" r="2.5" fill="#0f172a" />
                  <ellipse cx="90" cy="46" rx="6" ry="3" fill="#d97706" />
                </svg>
              </div>
            ) : resolvedType === "cross-balloon-float" ? (
              <div className="relative w-16 h-16 shrink-0 drop-shadow-md">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="goldFurFloat" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                  {/* Balloons */}
                  <circle cx="40" cy="12" r="8" fill="#f43f5e" />
                  <circle cx="56" cy="8" r="9" fill="#38bdf8" />
                  <circle cx="68" cy="14" r="8" fill="#facc15" />
                  <line x1="40" y1="20" x2="52" y2="35" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="56" y1="17" x2="52" y2="35" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="68" y1="22" x2="52" y2="35" stroke="#cbd5e1" strokeWidth="1" />
                  {/* Floating Quorra */}
                  <ellipse cx="50" cy="58" rx="20" ry="16" fill="url(#goldFurFloat)" />
                  <circle cx="50" cy="40" r="14" fill="url(#goldFurFloat)" />
                  <ellipse cx="50" cy="44" rx="6" ry="4" fill="#fef3c7" />
                  <circle cx="45" cy="38" r="2" fill="#0f172a" />
                  <circle cx="55" cy="38" r="2" fill="#0f172a" />
                </svg>
              </div>
            ) : resolvedType === "cross-tennis-chase" ? (
              <div className="relative w-20 h-16 shrink-0 drop-shadow-md flex items-center">
                <svg viewBox="0 0 120 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="goldFurChase" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                  {/* Bouncing Tennis Ball Ahead */}
                  <g className="animate-bounce">
                    <circle cx="106" cy="36" r="8" fill="#a3e635" stroke="#4d7c0f" strokeWidth="1.2" />
                    <path d="M 101 32 Q 106 36 101 40" stroke="#ffffff" strokeWidth="1" fill="none" />
                    <path d="M 111 32 Q 106 36 111 40" stroke="#ffffff" strokeWidth="1" fill="none" />
                  </g>
                  {/* Sprinting Dog */}
                  <path d="M 14 52 Q 4 36 12 24 Q 22 34 18 52 Z" fill="url(#goldFurChase)" className="animate-bounce" />
                  <ellipse cx="44" cy="58" rx="26" ry="16" fill="url(#goldFurChase)" />
                  <circle cx="68" cy="38" r="17" fill="url(#goldFurChase)" />
                  <path d="M 58 28 Q 50 42 56 52 Q 64 50 62 34 Z" fill="#b45309" />
                  <path d="M 76 28 Q 84 42 78 52 Q 72 50 72 34 Z" fill="#b45309" />
                  <ellipse cx="74" cy="44" rx="8" ry="6" fill="#fef3c7" />
                  <polygon points="74,41 71,38 77,38" fill="#0f172a" />
                  <circle cx="65" cy="36" r="2.8" fill="#0f172a" />
                  <circle cx="77" cy="36" r="2.8" fill="#0f172a" />
                </svg>
              </div>
            ) : resolvedType === "cross-butterfly-follow" ? (
              <div className="relative w-20 h-16 shrink-0 drop-shadow-md flex items-center">
                <svg viewBox="0 0 120 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="goldFurFlyFollow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                  {/* Fluttering Butterfly Ahead */}
                  <g transform="translate(104, 28)" className="animate-pulse">
                    <ellipse cx="-4" cy="-4" rx="6" ry="3.5" fill="#38bdf8" transform="rotate(-20 -4 -4)" />
                    <ellipse cx="4" cy="-4" rx="6" ry="3.5" fill="#38bdf8" transform="rotate(20 4 -4)" />
                    <ellipse cx="-3" cy="2" rx="4" ry="2.5" fill="#facc15" transform="rotate(-15 -3 2)" />
                    <ellipse cx="3" cy="2" rx="4" ry="2.5" fill="#facc15" transform="rotate(15 3 2)" />
                    <line x1="0" y1="-7" x2="0" y2="5" stroke="#0f172a" strokeWidth="1" />
                  </g>
                  {/* Trotting Dog Looking Up */}
                  <ellipse cx="44" cy="60" rx="26" ry="18" fill="url(#goldFurFlyFollow)" />
                  <circle cx="68" cy="38" r="18" fill="url(#goldFurFlyFollow)" />
                  <path d="M 58 28 Q 50 42 56 52 Q 64 50 62 34 Z" fill="#b45309" />
                  <path d="M 76 28 Q 84 42 78 52 Q 72 50 72 34 Z" fill="#b45309" />
                  <ellipse cx="74" cy="42" rx="8" ry="6" fill="#fef3c7" />
                  <polygon points="74,39 71,36 77,36" fill="#0f172a" />
                  <circle cx="65" cy="34" r="2.8" fill="#0f172a" />
                  <circle cx="77" cy="34" r="2.8" fill="#0f172a" />
                </svg>
              </div>
            ) : resolvedType === "cross-wagon" ? (
              <div className="relative w-24 h-16 shrink-0 drop-shadow-md flex items-center">
                <svg viewBox="0 0 140 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="goldFurWagon" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                  {/* Red Toy Wagon with Golden Stars */}
                  <rect x="8" y="56" width="42" height="18" rx="3" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
                  <circle cx="18" cy="78" r="5" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
                  <circle cx="40" cy="78" r="5" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
                  {/* Wagon Goods: Golden Bone & Star */}
                  <rect x="16" y="48" width="16" height="5" rx="2" fill="#facc15" />
                  <polygon points="34,42 36,48 42,48 37,51 39,57 34,53 29,57 31,51 26,48 32,48" fill="#fbbf24" />
                  {/* Tow Handle */}
                  <line x1="50" y1="62" x2="68" y2="60" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                  {/* Trotting Dog */}
                  <ellipse cx="94" cy="58" rx="24" ry="16" fill="url(#goldFurWagon)" />
                  <circle cx="114" cy="38" r="16" fill="url(#goldFurWagon)" />
                  <ellipse cx="120" cy="44" rx="7" ry="5" fill="#fef3c7" />
                  <polygon points="120,41 117,38 123,38" fill="#0f172a" />
                  <circle cx="111" cy="36" r="2.5" fill="#0f172a" />
                  <circle cx="123" cy="36" r="2.5" fill="#0f172a" />
                </svg>
              </div>
            ) : resolvedType === "cross-bicycle" ? (
              <div className="relative w-20 h-16 shrink-0 drop-shadow-md flex items-center">
                <svg viewBox="0 0 120 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="goldFurBike" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                  {/* Bicycle Frame & Wheels */}
                  <circle cx="30" cy="74" r="12" fill="none" stroke="#0284c7" strokeWidth="2.5" />
                  <circle cx="86" cy="74" r="12" fill="none" stroke="#0284c7" strokeWidth="2.5" />
                  <line x1="30" y1="74" x2="56" y2="74" stroke="#0284c7" strokeWidth="2" />
                  <line x1="56" y1="74" x2="48" y2="52" stroke="#0284c7" strokeWidth="2" />
                  <line x1="30" y1="74" x2="48" y2="52" stroke="#0284c7" strokeWidth="2" />
                  <line x1="56" y1="74" x2="82" y2="50" stroke="#0284c7" strokeWidth="2" />
                  <line x1="86" y1="74" x2="82" y2="50" stroke="#0284c7" strokeWidth="2" />
                  <line x1="78" y1="46" x2="86" y2="46" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
                  {/* Basket with Flower */}
                  <rect x="84" y="44" width="10" height="8" rx="2" fill="#d97706" stroke="#92400e" strokeWidth="1" />
                  <circle cx="89" cy="42" r="3" fill="#f43f5e" />
                  {/* Quorra Rider */}
                  <circle cx="58" cy="34" r="14" fill="url(#goldFurBike)" />
                  <ellipse cx="62" cy="38" rx="6" ry="4" fill="#fef3c7" />
                  <polygon points="62,36 60,33 64,33" fill="#0f172a" />
                  <circle cx="55" cy="32" r="2.2" fill="#0f172a" />
                  <circle cx="65" cy="32" r="2.2" fill="#0f172a" />
                </svg>
              </div>
            ) : resolvedType === "cross-duckling-parade" ? (
              <div className="relative w-24 h-16 shrink-0 drop-shadow-md flex items-center">
                <svg viewBox="0 0 140 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="goldFurDuck" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                  {/* Two Baby Ducklings Following */}
                  <g className="animate-bounce" style={{ animationDuration: "0.5s" }}>
                    <circle cx="12" cy="68" r="6" fill="#facc15" stroke="#eab308" strokeWidth="0.8" />
                    <circle cx="17" cy="63" r="4" fill="#facc15" stroke="#eab308" strokeWidth="0.8" />
                    <polygon points="21,63 24,64 21,65" fill="#f97316" />
                    <circle cx="16" cy="62" r="1" fill="#0f172a" />
                  </g>
                  <g className="animate-bounce" style={{ animationDuration: "0.55s", animationDelay: "0.15s" }}>
                    <circle cx="34" cy="66" r="7" fill="#facc15" stroke="#eab308" strokeWidth="0.8" />
                    <circle cx="40" cy="61" r="4.5" fill="#facc15" stroke="#eab308" strokeWidth="0.8" />
                    <polygon points="44.5,61 48,62 44.5,63" fill="#f97316" />
                    <circle cx="39" cy="60" r="1" fill="#0f172a" />
                  </g>
                  {/* Quorra Leading the Parade */}
                  <ellipse cx="88" cy="58" rx="24" ry="16" fill="url(#goldFurDuck)" />
                  <circle cx="108" cy="38" r="16" fill="url(#goldFurDuck)" />
                  <ellipse cx="114" cy="44" rx="7" ry="5" fill="#fef3c7" />
                  <polygon points="114,41 111,38 117,38" fill="#0f172a" />
                  <circle cx="105" cy="36" r="2.5" fill="#0f172a" />
                  <circle cx="117" cy="36" r="2.5" fill="#0f172a" />
                </svg>
              </div>
            ) : resolvedType === "cross-rainbow-trail" ? (
              <div className="relative w-24 h-16 shrink-0 drop-shadow-md flex items-center">
                <svg viewBox="0 0 140 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="goldFurRainbow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                  {/* Rainbow Sparkle Trail Streaming Behind */}
                  <path d="M 6 52 Q 35 48 68 56" stroke="#ef4444" strokeWidth="3" fill="none" opacity="0.9" />
                  <path d="M 6 55 Q 35 51 68 59" stroke="#f59e0b" strokeWidth="3" fill="none" opacity="0.9" />
                  <path d="M 6 58 Q 35 54 68 62" stroke="#22c55e" strokeWidth="3" fill="none" opacity="0.9" />
                  <path d="M 6 61 Q 35 57 68 65" stroke="#3b82f6" strokeWidth="3" fill="none" opacity="0.9" />
                  <polygon points="22,44 24,48 28,48 25,50 26,54 22,51 18,54 19,50 16,48 20,48" fill="#facc15" className="animate-spin" />
                  <polygon points="46,64 48,68 52,68 49,70 50,74 46,71 42,74 43,70 40,68 44,68" fill="#facc15" className="animate-spin" />
                  {/* Sprinting Dog */}
                  <ellipse cx="94" cy="58" rx="24" ry="16" fill="url(#goldFurRainbow)" />
                  <circle cx="114" cy="38" r="16" fill="url(#goldFurRainbow)" />
                  <ellipse cx="120" cy="44" rx="7" ry="5" fill="#fef3c7" />
                  <polygon points="120,41 117,38 123,38" fill="#0f172a" />
                  <circle cx="111" cy="36" r="2.5" fill="#0f172a" />
                  <circle cx="123" cy="36" r="2.5" fill="#0f172a" />
                </svg>
              </div>
            ) : (
              /* Default Trotting Quorra SVG */
              <div className="relative w-14 h-14 shrink-0 drop-shadow-md">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="goldFurTrot" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                  <path d="M 22 55 Q 10 40 18 28 Q 28 38 24 55 Z" fill="url(#goldFurTrot)" className="animate-bounce origin-bottom" />
                  <ellipse cx="48" cy="60" rx="26" ry="18" fill="url(#goldFurTrot)" />
                  <ellipse cx="32" cy="76" rx="6" ry="8" fill="#d97706" />
                  <ellipse cx="64" cy="76" rx="6" ry="8" fill="#d97706" />
                  <circle cx="70" cy="40" r="18" fill="url(#goldFurTrot)" />
                  <path d="M 60 30 Q 52 45 58 55 Q 66 52 64 36 Z" fill="#b45309" />
                  <path d="M 78 30 Q 86 45 80 55 Q 74 52 74 36 Z" fill="#b45309" />
                  <ellipse cx="76" cy="46" rx="8" ry="6" fill="#fef3c7" />
                  <polygon points="76,43 73,40 79,40" fill="#0f172a" />
                  <circle cx="67" cy="38" r="2.8" fill="#0f172a" />
                  <circle cx="79" cy="38" r="2.8" fill="#0f172a" />
                </svg>
              </div>
            )}

            {/* Crossing Banner / Message Pill */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-full shadow-xl border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
              <span>🐾</span>
              {categoryName ? (
                <span>{categoryName} {categoryNameZh && `(${categoryNameZh})`}</span>
              ) : resolvedType === "cross-skateboard" ? (
                <span>Cruising Along! 🛹</span>
              ) : resolvedType === "cross-tennis-chase" ? (
                <span>Great Fetch! 🎾</span>
              ) : resolvedType === "cross-butterfly-follow" ? (
                <span>Butterfly Chase! 🦋</span>
              ) : resolvedType === "cross-wagon" ? (
                <span>Rolling Wagon! 🛒</span>
              ) : resolvedType === "cross-flying-cape" ? (
                <span>Super Quorra! 🦸‍♀️</span>
              ) : resolvedType === "cross-bicycle" ? (
                <span>Bicycle Ride! 🚲</span>
              ) : resolvedType === "cross-balloon-float" ? (
                <span>Up and Away! 🎈</span>
              ) : resolvedType === "cross-duckling-parade" ? (
                <span>Duckling Parade! 🦆</span>
              ) : resolvedType === "cross-rainbow-trail" ? (
                <span>Rainbow Sprint! 🌈</span>
              ) : (
                <span>Keep Going, Dad! 🐾</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. BOTTOM-LEFT CORNER ANIMATIONS (25 Unique Types)          */}
      {/* ============================================================ */}
      {!isCrossing && (
        <div
          onClick={handlePet}
          className="absolute -bottom-1 left-2 sm:left-6 z-30 cursor-pointer select-none pointer-events-auto group"
          style={{
            animation: "quorraCornerPeekLeft 3.0s ease-in-out forwards",
          }}
        >
          {/* Main Dog Container with fixed width/height so base position never shifts */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24">
            {/* Speech Bubble Pill - Centered directly above the dog without affecting the dog's horizontal base position */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 pointer-events-none whitespace-nowrap z-10">
              <div className="bg-amber-400 text-slate-950 px-3 py-1 rounded-xl text-xs font-black shadow-lg border-2 border-white flex items-center gap-1 animate-bounce">
                <span>🐾</span>
                <span>{getCornerBubbleText()}</span>
              </div>
            </div>

            {/* Tap-to-Pet Floating Hearts */}
            {petHearts.map((h) => (
              <span
                key={h.id}
                className="absolute text-xl pointer-events-none animate-ping z-20"
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
                <defs>
                  <linearGradient id="goldFurLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                  <linearGradient id="earFurLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d97706" /><stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                </defs>

                {/* Wagging Tail at Right for left-corner balance */}
                <path
                  d="M 82 60 Q 96 45 88 32 Q 78 42 81 60 Z"
                  fill="url(#goldFurLeft)"
                  className="animate-spin origin-bottom-left opacity-90"
                  style={{ animationDuration: "0.6s" }}
                />

                {/* Head */}
                <circle cx="50" cy="46" r="28" fill="url(#goldFurLeft)" />

                {/* Floppy Golden Ears */}
                <path d="M 28 32 Q 16 52 24 66 Q 36 62 34 38 Z" fill="url(#earFurLeft)" />
                <path d="M 72 32 Q 84 52 76 66 Q 64 62 66 38 Z" fill="url(#earFurLeft)" />

                {/* White Muzzle & Nose */}
                <ellipse cx="50" cy="54" rx="13" ry="10" fill="#fef3c7" />
                <polygon points="50,50 44,45 56,45" fill="#0f172a" />
                <path d="M 50 50 Q 50 58 46 60 M 50 50 Q 50 58 54 60" stroke="#0f172a" strokeWidth="1.8" fill="none" />
                <path d="M 47 58 Q 50 67 53 58 Z" fill="#f43f5e" />

                {/* Cute Shiny Eyes */}
                <circle cx="39" cy="42" r="4.2" fill="#0f172a" />
                <circle cx="37.5" cy="40.5" r="1.6" fill="#ffffff" />
                <circle cx="61" cy="42" r="4.2" fill="#0f172a" />
                <circle cx="59.5" cy="40.5" r="1.6" fill="#ffffff" />

                {/* Red Collar with Golden Tag */}
                <path d="M 32 72 Q 50 78 68 72" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" fill="none" />
                <circle cx="50" cy="76" r="3" fill="#facc15" />

                {/* Front Paws */}
                <ellipse cx="30" cy="84" rx="8" ry="6" fill="#d97706" />
                <ellipse cx="70" cy="84" rx="8" ry="6" fill="#d97706" />

                {/* Unique Accessory Layer for active animation */}
                {renderCornerAccessory()}
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS Keyframes for 5s Crossing and Bottom-Left Corner */}
      <style>{`
        @keyframes quorraCross5s {
          0% {
            transform: translateX(-140px);
            opacity: 0;
          }
          10% {
            transform: translateX(10px);
            opacity: 1;
          }
          85% {
            transform: translateX(calc(100vw - 280px));
            opacity: 1;
          }
          100% {
            transform: translateX(calc(100vw - 120px));
            opacity: 0;
          }
        }

        @keyframes quorraCornerPeekLeft {
          0% {
            transform: translateY(85px) scale(0.85);
            opacity: 0;
          }
          15% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          85% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(90px) scale(0.85);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};
