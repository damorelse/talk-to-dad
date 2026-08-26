import React, { useState } from 'react';
import { VisualSceneHotspot } from '../../types';
import { useAudio } from '../../hooks/useAudio';
import { useMotorDebounce } from '../../hooks/useMotorDebounce';

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  delayMs: number;
}

interface HotspotOverlayProps {
  hotspots: VisualSceneHotspot[];
  onHotspotTrigger?: (hotspot: VisualSceneHotspot) => void;
  debounceMs?: number;
}

export const HotspotOverlay: React.FC<HotspotOverlayProps> = ({
  hotspots,
  onHotspotTrigger,
  debounceMs = 300,
}) => {
  const { speakHotspot, playQuorraPetTone } = useAudio();
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [hearts, setHearts] = useState<HeartParticle[]>([]);

  const handleHotspotClick = useMotorDebounce((hotspot: VisualSceneHotspot) => {
    setActiveHotspotId(hotspot.id);

    // If tapping Quorra mascot pet hotspot, play acoustic tail-thump chime and trigger floating hearts
    const isQuorraHotspot =
      hotspot.id === 'hs-pet-quorra' ||
      hotspot.id.toLowerCase().includes('quorra') ||
      hotspot.label.toLowerCase().includes('quorra');

    if (isQuorraHotspot) {
      try {
        playQuorraPetTone();
      } catch (err) {
        console.warn('Unable to play Quorra pet tone:', err);
      }

      const now = Date.now();
      const newHearts: HeartParticle[] = [
        { id: now + 1, x: hotspot.x + hotspot.width * 0.25, y: hotspot.y + hotspot.height * 0.05, emoji: '💖', delayMs: 0 },
        { id: now + 2, x: hotspot.x + hotspot.width * 0.55, y: hotspot.y + hotspot.height * 0.02, emoji: '🐾', delayMs: 100 },
        { id: now + 3, x: hotspot.x + hotspot.width * 0.38, y: hotspot.y + hotspot.height * 0.25, emoji: '✨', delayMs: 200 },
        { id: now + 4, x: hotspot.x + hotspot.width * 0.68, y: hotspot.y + hotspot.height * 0.15, emoji: '❤️', delayMs: 300 },
        { id: now + 5, x: hotspot.x + hotspot.width * 0.45, y: hotspot.y + hotspot.height * 0.10, emoji: '⭐', delayMs: 400 },
      ];
      setHearts((prev) => [...prev, ...newHearts]);

      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
      }, 1800);
    }

    // Speak hotspot text using global speech language setting
    speakHotspot(hotspot);

    onHotspotTrigger?.(hotspot);

    setTimeout(() => {
      setActiveHotspotId((cur) => (cur === hotspot.id ? null : cur));
    }, 1000);
  }, debounceMs);

  return (
    <div className="absolute inset-0 pointer-events-auto select-none overflow-visible">
      {hotspots.map((hs) => {
        const isActive = activeHotspotId === hs.id;
        const borderColor = hs.color || '#3B82F6';
        const isQuorra =
          hs.id === 'hs-pet-quorra' ||
          hs.id.toLowerCase().includes('quorra') ||
          hs.label.toLowerCase().includes('quorra');
        const isChair = hs.id === 'hs-chair';

        return (
          <button
            key={hs.id}
            type="button"
            onClick={() => handleHotspotClick(hs)}
            style={{
              left: `${hs.x}%`,
              top: `${hs.y}%`,
              width: `${hs.width}%`,
              height: `${hs.height}%`,
              borderColor: borderColor,
            }}
            className={`
              absolute transition-all duration-150 cursor-pointer focus:outline-none focus:ring-4
              ${
                isQuorra
                  ? `rounded-3xl border-2 border-dashed border-amber-400/60 hover:border-amber-300 focus:ring-amber-300 flex items-center justify-center ${
                      isActive
                        ? 'bg-amber-400/35 ring-4 ring-amber-400 scale-105 shadow-2xl z-20 animate-pulse'
                        : 'bg-amber-400/5 hover:bg-amber-400/20 active:scale-95 shadow-md backdrop-blur-[0.5px]'
                    }`
                  : `rounded-2xl border-4 focus:ring-yellow-300 ${
                      isChair ? 'flex items-start justify-start p-1.5' : 'flex items-end justify-center p-1.5'
                    } ${
                      isActive
                        ? 'bg-yellow-400/40 scale-105 ring-4 ring-yellow-400 shadow-2xl z-20 animate-pulse'
                        : 'bg-black/30 hover:bg-black/40 active:scale-95 shadow-lg backdrop-blur-[1px] hover:border-white'
                    }`
              }
            `}
            aria-label={`Hotspot: ${hs.label}. Speaks: ${hs.spokenText}`}
          >
            {isQuorra ? (
              <div className="absolute -bottom-3.5 translate-y-full bg-amber-950/90 text-amber-100 border border-amber-400/70 px-2.5 py-0.5 rounded-full text-center shadow-lg flex items-center gap-1.5 whitespace-nowrap z-20 pointer-events-none">
                <span className="text-xs sm:text-sm font-black text-amber-200">
                  {hs.label}
                </span>
                {hs.labelZh && (
                  <span className="text-[10px] sm:text-xs font-bold text-amber-300/80">
                    ({hs.labelZh})
                  </span>
                )}
              </div>
            ) : (
              <div className="bg-slate-950/90 text-white border border-slate-700 px-2.5 py-1 rounded-lg text-center max-w-full shadow-md flex flex-col items-center justify-center">
                <div className="text-xs sm:text-sm font-black text-white leading-tight truncate">
                  {hs.label}
                </div>
                {hs.labelZh && (
                  <div className="text-[11px] sm:text-xs font-bold text-amber-300 leading-tight mt-0.5">
                    {hs.labelZh}
                  </div>
                )}
              </div>
            )}
          </button>
        );
      })}

      {/* Floating hearts / sparkles on petting Quorra */}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute pointer-events-none text-2xl sm:text-3xl animate-float-heart drop-shadow-md z-30 select-none"
          style={{
            left: `${h.x}%`,
            top: `${h.y}%`,
            animationDelay: `${h.delayMs}ms`,
          }}
        >
          {h.emoji}
        </div>
      ))}
    </div>
  );
};

