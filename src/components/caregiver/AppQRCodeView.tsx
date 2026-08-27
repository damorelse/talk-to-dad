import React, { useState, useMemo, useCallback } from "react";
import { generateQRMatrix, QRErrorCorrectionLevel } from "../../services/qrcode/qrCodeGenerator";
import { useAudio } from "../../hooks/useAudio";
import { DebouncedTouchable } from "../common/DebouncedTouchable";
import {
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Download,
  Sparkles,
  Smartphone,
  Heart,
  Share2,
  Info,
} from "lucide-react";

export interface AppQRCodeViewProps {
  appUrl?: string;
}

const DEFAULT_APP_URL = "https://damorelse.github.io/talk-to-dad/";

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

interface FlowerDetail {
  id: string;
  nameEn: string;
  nameZh: string;
  meaningEn: string;
  meaningZh: string;
  color: string;
  icon: string;
}

const GARDEN_FLOWERS: FlowerDetail[] = [
  {
    id: "sunflower",
    nameEn: "Sunflower",
    nameZh: "向日葵",
    meaningEn: "Warmth, loyalty & bright optimism",
    meaningZh: "溫暖、忠誠與充滿希望的光芒",
    color: "#eab308",
    icon: "🌻",
  },
  {
    id: "sakura",
    nameEn: "Cherry Blossom (Sakura)",
    nameZh: "櫻花",
    meaningEn: "Renewal, gentleness & peace",
    meaningZh: "新生、溫柔與心靈寧靜",
    color: "#f472b6",
    icon: "🌸",
  },
  {
    id: "tulip",
    nameEn: "Tulip",
    nameZh: "鬱金香",
    meaningEn: "Unconditional love & comfort",
    meaningZh: "無條件的愛與體貼關懷",
    color: "#ef4444",
    icon: "🌷",
  },
  {
    id: "daisy",
    nameEn: "Daisy",
    nameZh: "雛菊",
    meaningEn: "Purity, cheerfulness & new beginnings",
    meaningZh: "純真、開朗與美好的新起點",
    color: "#facc15",
    icon: "🌼",
  },
  {
    id: "forgetmenot",
    nameEn: "Forget-Me-Not",
    nameZh: "勿忘我",
    meaningEn: "Cherished memories & enduring connection",
    meaningZh: "永恆的記憶與珍貴的牽絆",
    color: "#38bdf8",
    icon: "🩵",
  },
  {
    id: "rose",
    nameEn: "Garden Rose",
    nameZh: "玫瑰花",
    meaningEn: "Gratitude, healing & deep devotion",
    meaningZh: "感激、療癒與深切的情感",
    color: "#fb7185",
    icon: "🌹",
  },
];

export const AppQRCodeView: React.FC<AppQRCodeViewProps> = ({
  appUrl = DEFAULT_APP_URL,
}) => {
  const { playQuorraPetTone, playPuppyBark, playSuccess } = useAudio();
  const [copied, setCopied] = useState(false);
  const [isQuorraPet, setIsQuorraPet] = useState(false);
  const [activeFlower, setActiveFlower] = useState<FlowerDetail | null>(null);
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [ecLevel] = useState<QRErrorCorrectionLevel>("M");

  // Generate deterministic QR Code matrix
  const qrResult = useMemo(() => {
    return generateQRMatrix(appUrl, ecLevel);
  }, [appUrl, ecLevel]);

  // Trigger burst of floating hearts / flowers / sparkles
  const triggerBurst = useCallback((emojis = ["💖", "🌸", "✨", "🐾", "🌻"]) => {
    const now = Date.now();
    const newParticles: FloatingParticle[] = emojis.map((emoji, index) => ({
      id: now + index,
      x: (Math.random() - 0.5) * 80,
      y: -20 - Math.random() * 35,
      emoji,
    }));
    setParticles((prev) => [...prev.slice(-12), ...newParticles]);

    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id))
      );
    }, 1800);
  }, []);

  // Handle petting Quorra mascot
  const handlePetQuorra = useCallback(() => {
    setIsQuorraPet(true);
    playPuppyBark();
    playQuorraPetTone();
    triggerBurst(["💖", "🐾", "🌸", "✨", "❤️"]);

    setTimeout(() => {
      setIsQuorraPet(false);
    }, 2800);
  }, [playPuppyBark, playQuorraPetTone, triggerBurst]);

  // Handle flower click in the botanical garden
  const handleFlowerClick = useCallback(
    (flower: FlowerDetail) => {
      setActiveFlower(flower);
      playQuorraPetTone();
      triggerBurst([flower.icon, "✨", "💖", "🍃"]);
    },
    [playQuorraPetTone, triggerBurst]
  );

  // Copy app URL to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      playSuccess();
      triggerBurst(["📋", "✨", "✅", "🎉"]);
      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = appUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      playSuccess();
      setTimeout(() => {
        setCopied(false);
      }, 2500);
    }
  };

  // Download QR Code as an SVG file
  const handleDownloadSVG = () => {
    const matrix = qrResult.matrix;
    const size = qrResult.size;
    const margin = 4;
    const totalDim = size + margin * 2;
    const scale = 10;
    const pixelDim = totalDim * scale;

    let pathD = "";
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (matrix[r][c]) {
          const x = (c + margin) * scale;
          const y = (r + margin) * scale;
          pathD += "M" + x + "," + y + "h" + scale + "v" + scale + "h-" + scale + "z ";
        }
      }
    }

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pixelDim} ${pixelDim}" width="${pixelDim}" height="${pixelDim}">
  <rect width="100%" height="100%" fill="#ffffff" rx="24" />
  <path d="${pathD.trim()}" fill="#0f172a" />
</svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "talk-to-dad-qr-code.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    playSuccess();
  };

  return (
    <div className="w-full flex flex-col gap-4 overflow-y-auto scrollbar-thin pb-8">
      {/* Top Banner: Quorra & The Botanical Garden */}
      <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-100 via-rose-100 to-pink-100 dark:from-slate-900 dark:via-amber-950/40 dark:to-rose-950/40 border-2 border-amber-300/50 dark:border-amber-500/30 p-4 sm:p-6 shadow-lg">
        {/* Floating Petal & Sparkle Particles */}
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute text-xl pointer-events-none animate-ping z-30 select-none"
            style={{
              left: "50%",
              top: "35%",
              transform: "translate(calc(-50% + " + p.x + "px), " + p.y + "px)",
            }}
          >
            {p.emoji}
          </span>
        ))}

        {/* Ambient Decorative Flowers in background */}
        <div className="absolute -right-4 -bottom-4 text-7xl opacity-25 dark:opacity-15 pointer-events-none select-none">
          🌻
        </div>
        <div className="absolute left-3 top-2 text-4xl opacity-25 dark:opacity-15 pointer-events-none select-none">
          🌸
        </div>
        <div className="absolute right-1/4 top-1 text-3xl opacity-20 dark:opacity-10 pointer-events-none select-none">
          🌷
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Left: Quorra Mascot & Speech Bubble */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Interactive Quorra Golden Retriever Illustration */}
            <div
              onClick={handlePetQuorra}
              className="relative cursor-pointer group shrink-0 transition-transform active:scale-95"
              role="button"
              tabIndex={0}
              title="Quorra the Golden Retriever · Tap to pet!"
              aria-label="Quorra the Golden Retriever wearing a flower crown. Tap to pet."
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handlePetQuorra();
                }
              }}
            >
              {/* Petting Glow Ring */}
              <div
                className={"w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-400 via-pink-400 to-yellow-300 p-1 shadow-md transition-transform duration-300 " +
                  (isQuorraPet ? "scale-110 ring-4 ring-pink-400/60 animate-bounce" : "group-hover:scale-105")
                }
              >
                <div className="w-full h-full rounded-full bg-amber-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden relative">
                  {/* Quorra SVG with Flower Crown */}
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
                    <defs>
                      <linearGradient id="goldFur" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                      <linearGradient id="earFur" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#b45309" />
                      </linearGradient>
                      <linearGradient id="snoutShade" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fef3c7" />
                        <stop offset="100%" stopColor="#fde68a" />
                      </linearGradient>
                    </defs>

                    {/* Dog Body */}
                    <ellipse cx="50" cy="78" rx="28" ry="18" fill="url(#goldFur)" />

                    {/* Dog Chest fluff */}
                    <ellipse cx="50" cy="74" rx="16" ry="11" fill="#fef3c7" />

                    {/* Wagging Tail */}
                    <path
                      d="M24 74 Q12 60 16 48 Q20 56 26 70 Z"
                      fill="url(#goldFur)"
                      className={isQuorraPet ? "animate-pulse" : ""}
                    />

                    {/* Left & Right Ears */}
                    <ellipse cx="30" cy="46" rx="8" ry="16" transform="rotate(-15 30 46)" fill="url(#earFur)" />
                    <ellipse cx="70" cy="46" rx="8" ry="16" transform="rotate(15 70 46)" fill="url(#earFur)" />

                    {/* Head */}
                    <circle cx="50" cy="45" r="22" fill="url(#goldFur)" />

                    {/* Cute Eyes */}
                    {isQuorraPet ? (
                      <>
                        {/* Happy curved eyes (^_^) */}
                        <path d="M40 42 Q44 38 48 42" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        <path d="M52 42 Q56 38 60 42" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      </>
                    ) : (
                      <>
                        <circle cx="43" cy="42" r="3.2" fill="#451a03" />
                        <circle cx="57" cy="42" r="3.2" fill="#451a03" />
                        {/* Eye sparkles */}
                        <circle cx="44.2" cy="40.8" r="1.1" fill="#ffffff" />
                        <circle cx="58.2" cy="40.8" r="1.1" fill="#ffffff" />
                      </>
                    )}

                    {/* Rosy Cheeks */}
                    <ellipse cx="36" cy="48" rx="4" ry="2.5" fill="#f43f5e" opacity="0.4" />
                    <ellipse cx="64" cy="48" rx="4" ry="2.5" fill="#f43f5e" opacity="0.4" />

                    {/* Snout */}
                    <ellipse cx="50" cy="52" rx="9" ry="6.5" fill="url(#snoutShade)" />
                    {/* Cute Nose */}
                    <ellipse cx="50" cy="48.5" rx="3.5" ry="2.5" fill="#1e293b" />
                    <circle cx="49" cy="47.8" r="0.8" fill="#ffffff" opacity="0.8" />

                    {/* Smile / Mouth */}
                    {isQuorraPet ? (
                      <>
                        {/* Open happy panting smile */}
                        <path d="M46 53 Q50 59 54 53" fill="#dc2626" stroke="#451a03" strokeWidth="1.5" />
                        <path d="M48 56 Q50 61 52 56" fill="#fb7185" />
                      </>
                    ) : (
                      <path d="M47 52 Q50 55 53 52" stroke="#451a03" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                    )}

                    {/* Botanical Flower Crown / Wreath on Quorra Head */}
                    <g transform="translate(0, -2)">
                      {/* Leaf Band */}
                      <path d="M30 28 Q50 22 70 28" stroke="#15803d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <circle cx="34" cy="27" r="2.5" fill="#4ade80" />
                      <circle cx="66" cy="27" r="2.5" fill="#4ade80" />

                      {/* Flower 1: Pink Sakura (Left) */}
                      <circle cx="38" cy="26" r="4" fill="#f472b6" />
                      <circle cx="38" cy="26" r="1.5" fill="#fef08a" />

                      {/* Flower 2: Mini Golden Sunflower (Center) */}
                      <circle cx="50" cy="24" r="5.5" fill="#facc15" />
                      <circle cx="50" cy="24" r="2.2" fill="#78350f" />

                      {/* Flower 3: Blue Forget-Me-Not (Right) */}
                      <circle cx="62" cy="26" r="4" fill="#38bdf8" />
                      <circle cx="62" cy="26" r="1.5" fill="#ffffff" />

                      {/* Sparkle top */}
                      <path d="M50 14 L51 17 L54 18 L51 19 L50 22 L49 19 L46 18 L49 17 Z" fill="#fbbf24" />
                    </g>
                  </svg>
                </div>
              </div>

              {/* Tap Mascot Pill */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap flex items-center gap-1 border border-amber-300/40">
                <Heart className="w-2.5 h-2.5 fill-current" />
                <span>Pet Me!</span>
              </div>
            </div>

            {/* Speech Bubble & Greeting */}
            <div className="flex flex-col gap-1 max-w-sm sm:max-w-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-black self-start">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quorra the Therapy Dog Companion</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Share & Scan TalkWithDad AAC
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                {isQuorraPet
                  ? "Woof! 🐾 Good job! Scan the QR code below on an iPad or phone to open TalkWithDad instantly!"
                  : "Scan with any iPhone, iPad, or Android camera to use this assistive communication app anywhere. Completely offline & private!"}
              </p>
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
            <DebouncedTouchable
              onPress={handleCopyLink}
              minTouchSize="sm"
              className={"px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer border " +
                (copied
                  ? "bg-emerald-600 text-white border-emerald-400"
                  : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700")
              }
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-blue-500" />}
              <span>{copied ? "Copied Link! ✓" : "Copy App Link"}</span>
            </DebouncedTouchable>

            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 transition-all shadow-md border border-blue-400 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in New Tab</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid: QR Code Card & Interactive Botanical Garden */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: The Central QR Code Card (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 shadow-xl relative">
          <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Direct Web App QR Code
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  ISO/IEC 18004 Standard · High Contrast Vector
                </p>
              </div>
            </div>

            <DebouncedTouchable
              onPress={handleDownloadSVG}
              minTouchSize="sm"
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 cursor-pointer"
              title="Download clean printable SVG QR code"
            >
              <Download className="w-3.5 h-3.5 text-pink-500" />
              <span>Save SVG</span>
            </DebouncedTouchable>
          </div>

          {/* QR Code Container with High-Contrast White Background & 4-Module Quiet Zone */}
          <div className="p-4 sm:p-6 bg-white rounded-3xl shadow-xl border-4 border-amber-400/60 dark:border-amber-500/40 relative flex items-center justify-center">
            {/* SVG QR Code Rendering with Full Quiet Zone */}
            {(() => {
              const margin = 4;
              const totalSize = qrResult.size + margin * 2;
              return (
                <svg
                  viewBox={`0 0 ${totalSize} ${totalSize}`}
                  className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 select-none"
                  shapeRendering="crispEdges"
                >
                  <rect width="100%" height="100%" fill="#ffffff" />
                  {qrResult.matrix.map((row, r) =>
                    row.map((isDark, c) => {
                      if (!isDark) return null;
                      return (
                        <rect
                          key={`${r}-${c}`}
                          x={c + margin}
                          y={r + margin}
                          width={1}
                          height={1}
                          fill="#000000"
                        />
                      );
                    })
                  )}
                </svg>
              );
            })()}
          </div>

          {/* URL Tag / Badge */}
          <div className="mt-4 flex flex-col items-center gap-1.5 text-center">
            <code className="text-xs sm:text-sm font-mono font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-pink-600 dark:text-pink-400 border border-slate-200 dark:border-slate-700 select-all">
              {appUrl}
            </code>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Point your smartphone or tablet camera at the QR code above.
            </p>
          </div>
        </div>

        {/* Right Column: Variety of Cute Garden Flowers & PWA Installation Guide (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Botanical Garden Card (Flowers Variety) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border-2 border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">💐</span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Quorra’s Healing Flower Garden
                </h4>
              </div>
              <span className="text-[11px] font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/60 px-2 py-0.5 rounded-full border border-pink-200 dark:border-pink-800">
                Tap a flower!
              </span>
            </div>

            {/* Flower Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {GARDEN_FLOWERS.map((flower) => {
                const isSelected = activeFlower?.id === flower.id;
                return (
                  <button
                    key={flower.id}
                    type="button"
                    onClick={() => handleFlowerClick(flower)}
                    className={"p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1 active:scale-95 cursor-pointer relative overflow-hidden " +
                      (isSelected
                        ? "bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-500 shadow-md ring-2 ring-amber-400/30"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800")
                    }
                  >
                    <span className="text-2xl transition-transform hover:scale-125 duration-150">
                      {flower.icon}
                    </span>
                    <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {flower.nameEn}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                      {flower.nameZh}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Flower Meaning / Affirmation */}
            {activeFlower && (
              <div className="mt-1 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 flex items-start gap-2.5 animate-fadeIn">
                <span className="text-2xl">{activeFlower.icon}</span>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-amber-900 dark:text-amber-200">
                    {activeFlower.nameEn} ({activeFlower.nameZh})
                  </span>
                  <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    {activeFlower.meaningEn} · {activeFlower.meaningZh}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick PWA Installation Guide for Loved Ones & Caregivers */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border-2 border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-500" />
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                How to Save App on iPad / Phone
              </h4>
            </div>

            <div className="flex flex-col gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              {/* Apple iOS step */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-2.5">
                <span className="text-base font-bold text-slate-900 dark:text-white">🍎</span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-slate-900 dark:text-slate-100">Apple iPad & iPhone (Safari):</span>
                  <span>Scan QR Code → Tap Safari Share button (<Share2 className="inline w-3 h-3 text-blue-500" />) → Select <strong>"Add to Home Screen"</strong>.</span>
                </div>
              </div>

              {/* Android step */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-2.5">
                <span className="text-base font-bold text-slate-900 dark:text-white">🤖</span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-slate-900 dark:text-slate-100">Android & Tablets (Chrome):</span>
                  <span>Scan QR Code → Tap Menu (<strong>⋮</strong>) → Select <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.</span>
                </div>
              </div>

              {/* 100% Offline & Private Info Note */}
              <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold px-2">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>100% Offline Capable · No Cloud Login Required · Privacy Preserved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
