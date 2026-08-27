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

export const AppQRCodeView: React.FC<AppQRCodeViewProps> = ({
  appUrl = DEFAULT_APP_URL,
}) => {
  const { playQuorraPetTone, playPuppyBark, playSuccess } = useAudio();
  const [copied, setCopied] = useState(false);
  const [isQuorraPet, setIsQuorraPet] = useState(false);
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [ecLevel] = useState<QRErrorCorrectionLevel>("M");

  // Generate deterministic QR Code matrix
  const qrResult = useMemo(() => {
    return generateQRMatrix(appUrl, ecLevel);
  }, [appUrl, ecLevel]);

  // Trigger burst of floating hearts / sparkles
  const triggerBurst = useCallback((emojis = ["💖", "🐾", "✨", "❤️"]) => {
    const now = Date.now();
    const newParticles: FloatingParticle[] = emojis.map((emoji, index) => ({
      id: now + index,
      x: (Math.random() - 0.5) * 80,
      y: -20 - Math.random() * 35,
      emoji,
    }));
    setParticles((prev) => [...prev.slice(-8), ...newParticles]);

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
    triggerBurst(["💖", "🐾", "✨", "❤️"]);

    setTimeout(() => {
      setIsQuorraPet(false);
    }, 2500);
  }, [playPuppyBark, playQuorraPetTone, triggerBurst]);

  // Copy app URL to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      playSuccess();
      triggerBurst(["📋", "✨", "✅"]);
      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
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

  // Download QR Code as an SVG file for printing
  const handleDownloadSVG = () => {
    const matrix = qrResult.matrix;
    const size = qrResult.size;
    const margin = 4;
    const totalDim = size + margin * 2;
    const scale = 12;
    const pixelDim = totalDim * scale;

    let pathD = "";
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (matrix[r][c]) {
          const x = (c + margin) * scale;
          const y = (r + margin) * scale;
          pathD += `M${x},${y}h${scale}v${scale}h-${scale}z `;
        }
      }
    }

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pixelDim} ${pixelDim}" width="${pixelDim}" height="${pixelDim}">
  <rect width="100%" height="100%" fill="#ffffff" rx="24" />
  <path d="${pathD.trim()}" fill="#000000" />
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
    <div className="w-full flex flex-col gap-5 overflow-y-auto scrollbar-thin pb-8 max-w-4xl mx-auto">
      {/* Senior-Friendly Hero Card: Large Typography & Quorra Mascot */}
      <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-100 via-rose-50 to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/40 border-2 border-amber-300 dark:border-slate-700 p-5 sm:p-7 shadow-lg">
        {/* Floating Hearts Particles */}
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute text-2xl pointer-events-none animate-ping z-30 select-none"
            style={{
              left: "50%",
              top: "30%",
              transform: `translate(calc(-50% + ${p.x}px), ${p.y}px)`,
            }}
          >
            {p.emoji}
          </span>
        ))}

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Quorra Mascot & Large Speech Info */}
          <div className="flex items-center gap-5 text-center md:text-left">
            {/* Interactive Quorra Golden Retriever Illustration */}
            <div
              onClick={handlePetQuorra}
              className="relative cursor-pointer group shrink-0 transition-transform active:scale-95"
              role="button"
              tabIndex={0}
              title="Quorra the Golden Retriever · Tap to pet!"
              aria-label="Quorra the Golden Retriever mascot. Tap to pet."
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handlePetQuorra();
                }
              }}
            >
              <div
                className={
                  "w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-pink-400 to-amber-200 p-1 shadow-md transition-transform duration-200 " +
                  (isQuorraPet ? "scale-110 ring-4 ring-pink-400 animate-bounce" : "group-hover:scale-105")
                }
              >
                <div className="w-full h-full rounded-3xl bg-amber-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                    <defs>
                      <linearGradient id="seniorGoldFur" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                      <linearGradient id="seniorEarFur" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#b45309" />
                      </linearGradient>
                      <linearGradient id="seniorSnout" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fef3c7" />
                        <stop offset="100%" stopColor="#fde68a" />
                      </linearGradient>
                    </defs>

                    {/* Dog Body */}
                    <ellipse cx="50" cy="78" rx="28" ry="18" fill="url(#seniorGoldFur)" />
                    <ellipse cx="50" cy="74" rx="16" ry="11" fill="#fef3c7" />

                    {/* Wagging Tail */}
                    <path
                      d="M24 74 Q12 60 16 48 Q20 56 26 70 Z"
                      fill="url(#seniorGoldFur)"
                      className={isQuorraPet ? "animate-pulse" : ""}
                    />

                    {/* Ears */}
                    <ellipse cx="30" cy="46" rx="8" ry="16" transform="rotate(-15 30 46)" fill="url(#seniorEarFur)" />
                    <ellipse cx="70" cy="46" rx="8" ry="16" transform="rotate(15 70 46)" fill="url(#seniorEarFur)" />

                    {/* Head */}
                    <circle cx="50" cy="45" r="22" fill="url(#seniorGoldFur)" />

                    {/* Eyes */}
                    {isQuorraPet ? (
                      <>
                        <path d="M40 42 Q44 38 48 42" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        <path d="M52 42 Q56 38 60 42" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      </>
                    ) : (
                      <>
                        <circle cx="43" cy="42" r="3.4" fill="#451a03" />
                        <circle cx="57" cy="42" r="3.4" fill="#451a03" />
                        <circle cx="44.2" cy="40.8" r="1.2" fill="#ffffff" />
                        <circle cx="58.2" cy="40.8" r="1.2" fill="#ffffff" />
                      </>
                    )}

                    {/* Cheeks */}
                    <ellipse cx="36" cy="48" rx="4" ry="2.5" fill="#f43f5e" opacity="0.4" />
                    <ellipse cx="64" cy="48" rx="4" ry="2.5" fill="#f43f5e" opacity="0.4" />

                    {/* Snout & Nose */}
                    <ellipse cx="50" cy="52" rx="9" ry="6.5" fill="url(#seniorSnout)" />
                    <ellipse cx="50" cy="48.5" rx="3.5" ry="2.5" fill="#1e293b" />
                    <circle cx="49" cy="47.8" r="0.9" fill="#ffffff" opacity="0.9" />

                    {/* Mouth */}
                    {isQuorraPet ? (
                      <path d="M46 53 Q50 59 54 53" fill="#dc2626" stroke="#451a03" strokeWidth="1.5" />
                    ) : (
                      <path d="M47 52 Q50 55 53 52" stroke="#451a03" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    )}
                  </svg>
                </div>
              </div>

              {/* Large Pet Me Badge */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 whitespace-nowrap pointer-events-none border border-amber-300">
                <Heart className="w-3 h-3 fill-current" />
                <span>Pet Me!</span>
              </div>
            </div>

            {/* Large Text Content */}
            <div className="flex flex-col gap-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/90 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-sm sm:text-base font-black self-center md:self-start">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Quorra Therapy Companion</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Scan to Open TalkWithDad
              </h2>

              <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug">
                {isQuorraPet
                  ? "🐕 Woof! Good girl! Point your iPad or phone camera at the QR code below."
                  : "Point any smartphone or iPad camera at the code below to open this app."}
              </p>
            </div>
          </div>

          {/* Large Action Buttons */}
          <div className="flex flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
            <DebouncedTouchable
              onPress={handleCopyLink}
              minTouchSize="md"
              className={
                "flex-1 md:flex-none px-6 py-3.5 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer border-2 " +
                (copied
                  ? "bg-emerald-600 text-white border-emerald-400"
                  : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600")
              }
            >
              {copied ? (
                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[3]" />
              ) : (
                <Copy className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 stroke-[2.5]" />
              )}
              <span>{copied ? "Copied Link! ✓" : "Copy Link"}</span>
            </DebouncedTouchable>

            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none px-6 py-3.5 rounded-2xl font-black text-base sm:text-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2.5 transition-all shadow-md border-2 border-blue-400 cursor-pointer"
            >
              <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              <span>Open Link</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Display: Extra-Large High-Contrast QR Code & Senior Setup Steps */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-slate-300 dark:border-slate-700 shadow-xl flex flex-col md:flex-row items-center gap-8">
        {/* Left: Extra-Large QR Code Container */}
        <div className="flex flex-col items-center gap-4 shrink-0">
          <div className="p-5 sm:p-6 bg-white rounded-3xl shadow-lg border-4 border-amber-400 dark:border-amber-500 flex items-center justify-center">
            {(() => {
              const margin = 4;
              const totalSize = qrResult.size + margin * 2;
              return (
                <svg
                  viewBox={`0 0 ${totalSize} ${totalSize}`}
                  className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 select-none"
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

          <DebouncedTouchable
            onPress={handleDownloadSVG}
            minTouchSize="md"
            className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm sm:text-base font-black flex items-center gap-2 border-2 border-slate-300 dark:border-slate-600 shadow-sm cursor-pointer"
            title="Download printable SVG QR code"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
            <span>Download Printable QR Code</span>
          </DebouncedTouchable>
        </div>

        {/* Right: Large Web Address & Easy-to-Read Instructions */}
        <div className="flex flex-col gap-6 flex-1 w-full">
          <div>
            <label className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-pink-600" />
              <span>Web App Address:</span>
            </label>
            <div className="mt-2">
              <code className="text-base sm:text-lg md:text-xl font-mono font-black px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-pink-700 dark:text-pink-300 border-2 border-slate-300 dark:border-slate-600 select-all block break-all shadow-inner">
                {appUrl}
              </code>
            </div>
          </div>

          {/* Simple Step-by-Step Instructions with Large High-Contrast Text */}
          <div className="flex flex-col gap-3">
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <span>How to Save on iPad or Phone:</span>
            </span>

            <div className="grid grid-cols-1 gap-3.5">
              {/* iPad & iPhone */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-600 flex items-start gap-3.5">
                <span className="text-3xl shrink-0">🍎</span>
                <div className="flex flex-col gap-1">
                  <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Apple iPad & iPhone (Safari)
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-200 leading-relaxed">
                    1. Scan the QR code with your Camera.
                    <br />
                    2. In Safari, tap the <strong>Share</strong> button (<Share2 className="inline w-4 h-4 text-blue-600" />).
                    <br />
                    3. Tap <strong>"Add to Home Screen"</strong>.
                  </span>
                </div>
              </div>

              {/* Android */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-600 flex items-start gap-3.5">
                <span className="text-3xl shrink-0">🤖</span>
                <div className="flex flex-col gap-1">
                  <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Android Tablets & Phones (Chrome)
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-200 leading-relaxed">
                    1. Scan the QR code with your Camera.
                    <br />
                    2. In Chrome, tap the <strong>Menu</strong> (<strong>⋮</strong>) button.
                    <br />
                    3. Tap <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
