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
      x: (Math.random() - 0.5) * 60,
      y: -16 - Math.random() * 28,
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
    const scale = 10;
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
    <div className="w-full flex flex-col gap-4 overflow-y-auto scrollbar-thin pb-6 max-w-4xl mx-auto">
      {/* Sleek Hero Header Card: Mascot Quorra & Quick Actions */}
      <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-100 via-rose-50 to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/30 border border-amber-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-md">
        {/* Floating Particles */}
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute text-lg pointer-events-none animate-ping z-30 select-none"
            style={{
              left: "50%",
              top: "30%",
              transform: `translate(calc(-50% + ${p.x}px), ${p.y}px)`,
            }}
          >
            {p.emoji}
          </span>
        ))}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          {/* Quorra Mascot & Greeting */}
          <div className="flex items-center gap-4 text-center sm:text-left">
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
                  "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 p-0.5 shadow-md transition-transform duration-200 " +
                  (isQuorraPet ? "scale-110 ring-4 ring-pink-400/50 animate-bounce" : "group-hover:scale-105")
                }
              >
                <div className="w-full h-full rounded-2xl bg-amber-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                    <defs>
                      <linearGradient id="qrGoldFur" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                      <linearGradient id="qrEarFur" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#b45309" />
                      </linearGradient>
                      <linearGradient id="qrSnout" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fef3c7" />
                        <stop offset="100%" stopColor="#fde68a" />
                      </linearGradient>
                    </defs>

                    {/* Dog Body */}
                    <ellipse cx="50" cy="78" rx="28" ry="18" fill="url(#qrGoldFur)" />
                    <ellipse cx="50" cy="74" rx="16" ry="11" fill="#fef3c7" />

                    {/* Wagging Tail */}
                    <path
                      d="M24 74 Q12 60 16 48 Q20 56 26 70 Z"
                      fill="url(#qrGoldFur)"
                      className={isQuorraPet ? "animate-pulse" : ""}
                    />

                    {/* Ears */}
                    <ellipse cx="30" cy="46" rx="8" ry="16" transform="rotate(-15 30 46)" fill="url(#qrEarFur)" />
                    <ellipse cx="70" cy="46" rx="8" ry="16" transform="rotate(15 70 46)" fill="url(#qrEarFur)" />

                    {/* Head */}
                    <circle cx="50" cy="45" r="22" fill="url(#qrGoldFur)" />

                    {/* Eyes */}
                    {isQuorraPet ? (
                      <>
                        <path d="M40 42 Q44 38 48 42" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        <path d="M52 42 Q56 38 60 42" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      </>
                    ) : (
                      <>
                        <circle cx="43" cy="42" r="3.2" fill="#451a03" />
                        <circle cx="57" cy="42" r="3.2" fill="#451a03" />
                        <circle cx="44.2" cy="40.8" r="1.1" fill="#ffffff" />
                        <circle cx="58.2" cy="40.8" r="1.1" fill="#ffffff" />
                      </>
                    )}

                    {/* Cheeks */}
                    <ellipse cx="36" cy="48" rx="4" ry="2.5" fill="#f43f5e" opacity="0.4" />
                    <ellipse cx="64" cy="48" rx="4" ry="2.5" fill="#f43f5e" opacity="0.4" />

                    {/* Snout & Nose */}
                    <ellipse cx="50" cy="52" rx="9" ry="6.5" fill="url(#qrSnout)" />
                    <ellipse cx="50" cy="48.5" rx="3.5" ry="2.5" fill="#1e293b" />
                    <circle cx="49" cy="47.8" r="0.8" fill="#ffffff" opacity="0.8" />

                    {/* Mouth */}
                    {isQuorraPet ? (
                      <path d="M46 53 Q50 59 54 53" fill="#dc2626" stroke="#451a03" strokeWidth="1.5" />
                    ) : (
                      <path d="M47 52 Q50 55 53 52" stroke="#451a03" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                    )}
                  </svg>
                </div>
              </div>

              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow flex items-center gap-0.5 whitespace-nowrap pointer-events-none">
                <Heart className="w-2 h-2 fill-current" />
                <span>Pet</span>
              </div>
            </div>

            {/* Title & Speech */}
            <div className="flex flex-col gap-0.5">
              <div className="inline-flex items-center gap-1 text-amber-800 dark:text-amber-300 text-xs font-bold self-center sm:self-start">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quorra Therapy Companion</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Share TalkWithDad
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isQuorraPet
                  ? "Woof! 🐾 Scan the QR code below on an iPad or phone to start talking!"
                  : "Scan with any iPad, iPhone, or Android camera to open this app."}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <DebouncedTouchable
              onPress={handleCopyLink}
              minTouchSize="sm"
              className={
                "px-3.5 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer border " +
                (copied
                  ? "bg-emerald-600 text-white border-emerald-400"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700")
              }
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-blue-500" />}
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </DebouncedTouchable>

            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-sm border border-blue-400 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Card: High-Contrast QR Code & Clear Instructions */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col md:flex-row items-center gap-6 sm:gap-8">
        {/* Left: QR Code Canvas */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div className="p-4 bg-white rounded-2xl shadow-md border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center">
            {(() => {
              const margin = 4;
              const totalSize = qrResult.size + margin * 2;
              return (
                <svg
                  viewBox={`0 0 ${totalSize} ${totalSize}`}
                  className="w-52 h-52 sm:w-60 sm:h-60 select-none"
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
            minTouchSize="sm"
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
            title="Download printable SVG QR code"
          >
            <Download className="w-3.5 h-3.5 text-pink-500" />
            <span>Download Printable QR</span>
          </DebouncedTouchable>
        </div>

        {/* Right: Link & Simple Setup Guide */}
        <div className="flex flex-col gap-4 flex-1">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Web App Address</span>
            <div className="mt-1">
              <code className="text-xs sm:text-sm font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-pink-600 dark:text-pink-400 border border-slate-200 dark:border-slate-700 select-all block break-all">
                {appUrl}
              </code>
            </div>
          </div>

          {/* Simple 2-Step Setup */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-blue-500" />
              <span>How to Save to Home Screen</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col gap-1">
                <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                  <span>🍎</span> iPad / iPhone (Safari)
                </span>
                <span className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Scan QR code → Tap Safari Share (<Share2 className="inline w-3 h-3 text-blue-500" />) → Tap <strong>Add to Home Screen</strong>.
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col gap-1">
                <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                  <span>🤖</span> Android / Tablet (Chrome)
                </span>
                <span className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Scan QR code → Tap Menu (<strong>⋮</strong>) → Tap <strong>Install App</strong> or <strong>Add to Home Screen</strong>.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
