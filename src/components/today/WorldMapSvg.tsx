import React from 'react';
import { UserLocationInfo } from '../../types';
import { getCountryFlag } from '../../services/location/locationService';
import { Volume2 } from 'lucide-react';

interface WorldMapSvgProps {
  location: UserLocationInfo;
  onSelectLocation?: () => void;
  isSpeakingLocation?: boolean;
}

export const WorldMapSvg: React.FC<WorldMapSvgProps> = ({
  location,
  onSelectLocation,
  isSpeakingLocation = false,
}) => {
  // Equirectangular projection: viewBox 0 0 1000 500
  const lat = location.latitude ?? 37.77;
  const lon = location.longitude ?? -122.42;

  // Clamped coordinates
  const clampedLat = Math.max(-85, Math.min(85, lat));
  const clampedLon = Math.max(-180, Math.min(180, lon));

  const pinX = ((clampedLon + 180) / 360) * 1000;
  const pinY = ((90 - clampedLat) / 180) * 500;

  const flag = getCountryFlag(location.country);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onSelectLocation) {
      e.preventDefault();
      onSelectLocation();
    }
  };

  return (
    <div
      onClick={onSelectLocation}
      onKeyDown={handleKeyDown}
      className={`
        relative w-full h-full min-h-[300px] sm:min-h-[360px] flex flex-col justify-between bg-slate-950 rounded-2xl border px-2.5 sm:px-3.5 py-1.5 sm:py-2 overflow-hidden shadow-inner cursor-pointer select-none group transition-all duration-300
        ${
          isSpeakingLocation
            ? 'border-purple-400 ring-4 ring-purple-400/50 shadow-2xl shadow-purple-950/60 scale-[1.01]'
            : 'border-slate-800 hover:border-purple-500/60'
        }
      `}
      role="button"
      aria-label={`Current location on world map: ${location.city}, ${location.country}. Tap to hear.`}
      tabIndex={0}
    >
      <svg
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid meet"
        className="w-full flex-1 filter drop-shadow"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="oceanGlow" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ocean Background */}
        <rect x="0" y="0" width="1000" height="500" fill="url(#oceanGlow)" rx="16" />

        {/* Continent Landmass Outlines */}
        <g fill="url(#landGrad)" stroke="#475569" strokeWidth="1.5" strokeLinejoin="round" opacity="0.95">
          {/* North America */}
          <path d="
            M 115 50
            L 190 40 L 250 55 L 290 90 L 260 140 L 240 170 L 250 200 L 220 230
            L 200 240 L 195 270 L 225 285 L 240 250 L 210 245 L 230 215 L 240 220
            L 260 190 L 250 180 L 230 185 L 210 160 L 170 180 L 140 150 L 120 100
            L 80 85 L 70 60 Z
          " />

          {/* Greenland */}
          <path d="M 360 40 L 420 35 L 430 75 L 380 90 L 350 70 Z" />

          {/* Central America & Caribbean */}
          <path d="M 200 270 L 225 285 L 245 295 L 260 305 L 240 310 L 220 295 Z" />
          <circle cx="265" cy="270" r="4" />
          <circle cx="280" cy="275" r="3" />

          {/* South America */}
          <path d="
            M 245 305
            L 285 300 L 330 310 L 370 335 L 385 370 L 355 425 L 325 470 L 305 470
            L 300 440 L 285 390 L 270 340 L 245 315 Z
          " />

          {/* Europe */}
          <path d="
            M 480 90
            L 530 80 L 580 90 L 590 130 L 550 140 L 515 155 L 475 145 L 460 120
            L 480 105 Z
          " />
          {/* British Isles */}
          <path d="M 465 95 L 485 90 L 480 115 L 460 115 Z" />
          <circle cx="450" cy="105" r="4" />

          {/* Africa */}
          <path d="
            M 470 170
            L 530 160 L 585 180 L 610 230 L 590 290 L 560 350 L 530 380 L 505 380
            L 480 330 L 450 250 L 450 200 Z
          " />
          {/* Madagascar */}
          <path d="M 615 320 L 625 330 L 615 365 L 605 355 Z" />

          {/* Asia & Russia */}
          <path d="
            M 580 80
            L 650 60 L 750 50 L 850 55 L 900 80 L 880 120 L 840 140 L 870 170
            L 850 210 L 800 220 L 760 270 L 730 260 L 720 220 L 660 210 L 630 180
            L 600 170 L 585 130 Z
          " />
          {/* India Subcontinent */}
          <path d="M 680 200 L 730 210 L 710 265 L 685 240 Z" />
          {/* Southeast Asia */}
          <path d="M 750 240 L 790 240 L 810 290 L 775 300 L 760 270 Z" />
          {/* Japan */}
          <path d="M 890 140 L 910 160 L 895 190 L 880 180 Z" />
          {/* Taiwan */}
          <circle cx="815" cy="225" r="4.5" fill="#60a5fa" stroke="#93c5fd" />

          {/* Australia & New Zealand */}
          <path d="
            M 790 350
            L 860 340 L 890 380 L 870 425 L 810 430 L 780 395 Z
          " />
          <path d="M 915 410 L 930 425 L 910 450 L 900 440 Z" />

          {/* Antarctica */}
          <path d="
            M 50 480
            L 200 470 L 400 475 L 600 470 L 800 475 L 950 480 L 950 500 L 50 500 Z
          " />
        </g>

        {/* User Location Beacon & Ripple Effect */}
        <g filter="url(#pinGlow)">
          {/* Animated Expanding Ripple 1 */}
          <circle
            cx={pinX}
            cy={pinY}
            r="16"
            fill="none"
            stroke="#c084fc"
            strokeWidth="2"
            className="animate-ping origin-center opacity-75"
            style={{ animationDuration: '2.5s' }}
          />

          {/* Animated Expanding Ripple 2 */}
          <circle
            cx={pinX}
            cy={pinY}
            r="9"
            fill="#9333ea"
            className="opacity-60"
          />

          {/* Center Target Core */}
          <circle
            cx={pinX}
            cy={pinY}
            r="5"
            fill="#facc15"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        </g>
      </svg>

      {/* Clean Floating Badge Over Map */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-lg text-white">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl sm:text-3xl shrink-0 drop-shadow">
            {flag}
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base font-black text-white truncate">
              {location.city}{location.state ? `, ${location.state}` : ''}, {location.country}
            </span>
            <span className="text-xs sm:text-sm font-bold text-purple-300 truncate">
              {location.countryZh}{location.stateZh ? location.stateZh : ''}{location.cityZh ? location.cityZh : ''}
            </span>
          </div>
        </div>

        <div className="shrink-0 ml-2 text-purple-300 group-hover:text-white transition-colors">
          <Volume2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
