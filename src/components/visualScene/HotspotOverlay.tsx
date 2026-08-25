import React, { useState } from 'react';
import { VisualSceneHotspot } from '../../types';
import { useAudio } from '../../hooks/useAudio';
import { useMotorDebounce } from '../../hooks/useMotorDebounce';

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
  const { speakHotspot } = useAudio();
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  const handleHotspotClick = useMotorDebounce((hotspot: VisualSceneHotspot) => {
    setActiveHotspotId(hotspot.id);

    // Speak hotspot text using global speech language setting
    speakHotspot(hotspot);

    onHotspotTrigger?.(hotspot);

    setTimeout(() => {
      setActiveHotspotId((cur) => (cur === hotspot.id ? null : cur));
    }, 1000);
  }, debounceMs);

  return (
    <div className="absolute inset-0 pointer-events-auto select-none">
      {hotspots.map((hs) => {
        const isActive = activeHotspotId === hs.id;
        const borderColor = hs.color || '#3B82F6';

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
                  ? 'bg-yellow-400/40 scale-105 ring-4 ring-yellow-400 shadow-2xl z-20 animate-pulse'
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
    </div>
  );
};
