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
  const { speakHotspot, playPuppyBark } = useAudio();
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [hearts, setHearts] = useState<HeartParticle[]>([]);

  const handleHotspotClick = useMotorDebounce((hotspot: VisualSceneHotspot) => {
    setActiveHotspotId(hotspot.id);

    // If tapping Quorra mascot pet hotspot, play cheerful puppy bark and trigger floating hearts
    const isQuorraHotspot =
      hotspot.id === 'hs-pet-quorra' ||
      hotspot.id.toLowerCase().includes('quorra') ||
      hotspot.label.toLowerCase().includes('quorra');

    if (isQuorraHotspot) {
      try {
        playPuppyBark();
      } catch (err) {
        console.warn('Unable to play puppy bark sound:', err);
      }

      const now = Date.now();
      const newHearts: HeartParticle[] = [
        { id: now + 1, x: hotspot.x + hotspot.width * 0.25, y: hotspot.y + hotspot.height * 0.1, emoji: '💖', delayMs: 0 },
        { id: now + 2, x: hotspot.x + hotspot.width * 0.55, y: hotspot.y + hotspot.height * 0.05, emoji: '🐾', delayMs: 120 },
        { id: now + 3, x: hotspot.x + hotspot.width * 0.38, y: hotspot.y + hotspot.height * 0.35, emoji: '✨', delayMs: 240 },
        { id: now + 4, x: hotspot.x + hotspot.width * 0.68, y: hotspot.y + hotspot.height * 0.22, emoji: '❤️', delayMs: 360 },
      ];
      setHearts((prev) => [...prev, ...newHearts]);

      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
      }, 1600);
    }

    // Speak hotspot text using global speech language setting
    speakHotspot(hotspot);

    onHotspotTrigger?.(hotspot);

    setTimeout(() => {
      setActiveHotspotId((cur) => (cur === hotspot.id ? null : cur));
    }, 1000);
  }, debounceMs);

  return (
    <div className="absolute inset-0 pointer-events-auto select-none overflow-hidden">
      {hotspots.map((hs) => {
        const isActive = activeHotspotId === hs.id;
        const borderColor = hs.color || '#3B82F6';
        const isQuorra = hs.id === 'hs-pet-quorra';

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
              absolute rounded-2xl border-4 transition-all duration-150 flex items-end justify-center p-1.5
              cursor-pointer focus:outline-none focus:ring-4 focus:ring-yellow-300
              ${
                isActive
                  ? isQuorra
                    ? 'bg-amber-400/45 scale-105 ring-4 ring-amber-400 shadow-2xl z-20 animate-pulse'
                    : 'bg-yellow-400/40 scale-105 ring-4 ring-yellow-400 shadow-2xl z-20 animate-pulse'
                  : isQuorra
                  ? 'bg-amber-500/20 hover:bg-amber-500/35 active:scale-95 shadow-lg backdrop-blur-[1px] hover:border-amber-300'
                  : 'bg-black/30 hover:bg-black/40 active:scale-95 shadow-lg backdrop-blur-[1px] hover:border-white'
              }
            `}
            aria-label={`Hotspot: ${hs.label}. Speaks: ${hs.spokenText}`}
          >
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

