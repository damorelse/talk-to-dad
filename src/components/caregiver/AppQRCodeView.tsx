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
  Smartphone,
  Heart,
  Share2,
  Camera,
  Globe,
  Sparkles,
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

  // Trigger burst of floating hearts & sparkles
  const triggerBurst = useCallback((emojis = ["💖", "🐾", "✨", "❤️", "⭐"]) => {
    const now = Date.now();
    const newParticles: FloatingParticle[] = emojis.map((emoji, index) => ({
      id: now + index,
      x: (Math.random() - 0.5) * 88,
      y: -24 - Math.random() * 38,
      emoji,
    }));
    setParticles((prev) => [...prev.slice(-10), ...newParticles]);

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
    triggerBurst(["💖", "🐾", "✨", "❤️", "🐶"]);

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
    <div className="w-full flex flex-col gap-6 overflow-y-auto scrollbar-none pb-8 max-w-4xl mx-auto">
      {/* Hero Header Card: Quorra Mascot & Quick Actions */}
      <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-100 via-rose-50 to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/40 border-2 border-amber-300 dark:border-slate-700 p-5 sm:p-6 shadow-lg">
        {/* Floating Hearts Particles */}
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute text-2xl pointer-events-none animate-float-heart z-30 select-none"
            style={{
              left: "50%",
              top: "35%",
              transform: `translate(calc(-50% + ${p.x}px), ${p.y}px)`,
            }}
          >
            {p.emoji}
          </span>
        ))}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
          {/* Quorra Mascot & Title */}
          <div className="flex items-center gap-5 text-center sm:text-left">
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
                  <svg
                    viewBox="0 0 100 100"
                    className={`w-full h-full drop-shadow-sm transition-transform duration-300 ${
                      isQuorraPet ? "scale-105" : "animate-quorra-breathe"
                    }`}
                  >
                    <defs>
                      <linearGradient id="qrGoldFur2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                      <linearGradient id="qrEarFur2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#b45309" />
                      </linearGradient>
                      <linearGradient id="qrSnout2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fef3c7" />
                        <stop offset="100%" stopColor="#fde68a" />
                      </linearGradient>
                    </defs>

                    {/* Dog Body */}
                    <ellipse cx="50" cy="78" rx="28" ry="18" fill="url(#qrGoldFur2)" />
                    <ellipse cx="50" cy="74" rx="16" ry="11" fill="#fef3c7" />

                    {/* Animated Wagging Tail */}
                    <path
                      d="M24 74 Q10 58 14 46 Q20 54 26 70 Z"
                      fill="url(#qrGoldFur2)"
                      className={isQuorraPet ? "animate-quorra-wag-excited" : "animate-quorra-wag-gentle"}
                    />

                    {/* Fluffy Golden Retriever Floppy Ears */}
                    <g className={isQuorraPet ? "animate-bounce" : "animate-quorra-ear-bob"}>
                      <ellipse cx="28" cy="46" rx="8.5" ry="17" transform="rotate(-18 28 46)" fill="url(#qrEarFur2)" />
                      <ellipse cx="72" cy="46" rx="8.5" ry="17" transform="rotate(18 72 46)" fill="url(#qrEarFur2)" />
                    </g>

                    {/* Dog Head */}
                    <circle cx="50" cy="44" r="23" fill="url(#qrGoldFur2)" />

                    {/* Rosy Cheeks */}
                    <ellipse cx="34" cy="48" rx="4.5" ry="3" fill="#f43f5e" opacity="0.45" />
                    <ellipse cx="66" cy="48" rx="4.5" ry="3" fill="#f43f5e" opacity="0.45" />

                    {/* Eyes */}
                    {isQuorraPet ? (
                      /* Happy squinting smiling eyes (^ ^) with playful sparkles */
                      <>
                        <path d="M38 42 Q43 36 48 42" stroke="#451a03" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                        <path d="M52 42 Q57 36 62 42" stroke="#451a03" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                        {/* Sparkle stars above eyes */}
                        <circle cx="43" cy="34" r="1" fill="#f59e0b" />
                        <circle cx="57" cy="34" r="1" fill="#f59e0b" />
                      </>
                    ) : (
                      /* Big friendly golden retriever eyes with light reflections */
                      <>
                        <circle cx="43" cy="41" r="3.6" fill="#291305" />
                        <circle cx="57" cy="41" r="3.6" fill="#291305" />
                        <circle cx="44.2" cy="39.8" r="1.3" fill="#ffffff" />
                        <circle cx="58.2" cy="39.8" r="1.3" fill="#ffffff" />
                        <circle cx="42.2" cy="42.2" r="0.6" fill="#ffffff" />
                        <circle cx="56.2" cy="42.2" r="0.6" fill="#ffffff" />
                      </>
                    )}

                    {/* Snout & Shiny Button Nose */}
                    <ellipse cx="50" cy="53" rx="10.5" ry="7.5" fill="url(#qrSnout2)" />
                    <ellipse cx="50" cy="49" rx="3.8" ry="2.6" fill="#1e293b" />
                    <circle cx="48.8" cy="48.2" r="0.9" fill="#ffffff" opacity="0.95" />

                    {/* Mouth & Tongue */}
                    {isQuorraPet ? (
                      /* Joyful open mouth with pink tongue */
                      <path d="M45 54 Q50 63 55 54" fill="#f43f5e" stroke="#451a03" strokeWidth="1.6" strokeLinecap="round" />
                    ) : (
                      /* Sweet happy smile curve */
                      <path d="M46 53 Q50 56.5 54 53" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />
                    )}

                    {/* Red Collar & Golden Tag */}
                    <path d="M33 63 Q50 71 67 63" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <circle cx="50" cy="68" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
                    <circle cx="50" cy="68" r="1.5" fill="#ffffff" opacity="0.7" />

                    {/* Front Paws */}
                    <ellipse cx="36" cy="84" rx="6.5" ry="4.5" fill="url(#qrGoldFur2)" stroke="#b45309" strokeWidth="0.8" />
                    <ellipse cx="64" cy="84" rx="6.5" ry="4.5" fill="url(#qrGoldFur2)" stroke="#b45309" strokeWidth="0.8" />
                  </svg>
                </div>
              </div>

              {/* Pet Me Badge */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 whitespace-nowrap pointer-events-none border border-amber-300">
                <Heart className="w-3 h-3 fill-current" />
                <span>Pet Me!</span>
              </div>
            </div>

            {/* Title & Speech Content */}
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Scan to Open TalkWithDad
              </h2>

              <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug">
                {isQuorraPet
                  ? "🐕 Woof! Good girl! Point your camera at the QR code below."
                  : "Point any smartphone or iPad camera at the code below to open this app."}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row sm:flex-col gap-3 shrink-0 w-full sm:w-auto">
            <DebouncedTouchable
              onPress={handleCopyLink}
              minTouchSize="md"
              className={
                "flex-1 sm:flex-none px-6 py-3.5 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer border-2 " +
                (copied
                  ? "bg-emerald-600 text-white border-emerald-400"
                  : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600")
              }
            >
              {copied ? (
                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[3]" />
              ) : (
                <Copy className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 stroke-[2.5]" />
              )}
              <span>{copied ? "Copied Link! ✓" : "Copy Link"}</span>
            </DebouncedTouchable>

            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl font-black text-base sm:text-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2.5 transition-all shadow-md border-2 border-blue-400 cursor-pointer"
            >
              <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              <span>Open Link</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Card: QR Code and Step-by-Step Instructions Side-by-Side */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-slate-300 dark:border-slate-700 shadow-xl flex flex-col lg:flex-row items-center lg:items-start gap-8">
        {/* Left Side: QR Code, Camera Instruction & Download Button */}
        <div className="flex flex-col items-center gap-4 shrink-0 w-full lg:w-auto">
          {/* Instruction Text Right Above the QR Code */}
          <div className="w-full flex items-center justify-center">
            <div className="inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-500/15 dark:bg-amber-400/20 text-amber-950 dark:text-amber-100 border-2 border-amber-400/60 shadow-sm font-black text-base sm:text-lg text-center">
              <Camera className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse stroke-[2.5]" />
              <span>Point your camera here to open this app</span>
            </div>
          </div>

          {/* QR Code Container */}
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

          {/* Download Button */}
          <DebouncedTouchable
            onPress={handleDownloadSVG}
            minTouchSize="md"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm sm:text-base font-black flex items-center justify-center gap-2 border-2 border-slate-300 dark:border-slate-600 shadow-sm cursor-pointer"
            title="Download printable SVG QR code"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600 dark:text-pink-400" />
            <span>Download Printable QR Code</span>
          </DebouncedTouchable>
        </div>

        {/* Right Side: Web Address (Single-Line) and Instructions */}
        <div className="flex flex-col gap-6 flex-1 w-full">
          {/* Web Address Box — Single Line Guaranteed without Wrapping */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400 stroke-[2.5]" />
                <span>Web App Address:</span>
              </label>
              <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
                Direct Link
              </span>
            </div>

            <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border-2 border-slate-300 dark:border-slate-600 shadow-inner">
              <div className="flex-1 min-w-0 px-3 py-1 overflow-x-auto scrollbar-none">
                <code className="text-base sm:text-lg md:text-xl font-mono font-black text-pink-700 dark:text-pink-300 select-all whitespace-nowrap block">
                  {appUrl}
                </code>
              </div>

              <DebouncedTouchable
                onPress={handleCopyLink}
                minTouchSize="md"
                className={
                  "shrink-0 px-4 py-2 rounded-xl font-black text-sm sm:text-base flex items-center gap-1.5 transition-all shadow-sm border-2 cursor-pointer " +
                  (copied
                    ? "bg-emerald-600 text-white border-emerald-400"
                    : "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-600 border-slate-300 dark:border-slate-500")
                }
                title="Copy Web Address"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-blue-600 dark:text-blue-400 stroke-[2.5]" />
                    <span>Copy</span>
                  </>
                )}
              </DebouncedTouchable>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="flex flex-col gap-3.5">
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400 stroke-[2.5]" />
              <span>How to Scan & Save to Home Screen:</span>
            </span>

            <div className="grid grid-cols-1 gap-3.5">
              {/* iPad & iPhone Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-600 flex items-start gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700 flex items-center justify-center text-2xl shrink-0">
                  🍎
                </div>
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Apple iPad & iPhone (Safari)
                  </span>
                  <ol className="space-y-1.5 text-sm sm:text-base font-bold text-slate-700 dark:text-slate-200">
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <span>Open your device's <strong>Camera</strong> app and point it at the QR code.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <span>When the page opens in Safari, tap the <strong>Share</strong> button (<Share2 className="inline w-4 h-4 text-blue-600 dark:text-blue-400" />).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <span>Scroll down and tap <strong>"Add to Home Screen"</strong>.</span>
                    </li>
                  </ol>
                </div>
              </div>

              {/* Android Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-600 flex items-start gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-2xl shrink-0">
                  🤖
                </div>
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Android Tablets & Phones (Chrome)
                  </span>
                  <ol className="space-y-1.5 text-sm sm:text-base font-bold text-slate-700 dark:text-slate-200">
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <span>Open your <strong>Camera</strong> app and point it at the QR code.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <span>In Chrome, tap the <strong>Menu</strong> (<strong>⋮</strong>) button in the top corner.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <span>Tap <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Helpful Offline / Fullscreen Tip */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/60 border-2 border-amber-200 dark:border-slate-700 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 leading-snug">
              <strong>One-Tap Offline Access:</strong> Saving TalkWithDad to your Home Screen launches it in distraction-free full screen and ensures it works seamlessly 100% offline anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
