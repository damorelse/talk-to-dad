import React from 'react';
import { UserLocationInfo } from '../../types';
import { getCountryFlag } from '../../services/location/locationService';
import {
  USA_STATES,
  USA_MAP_VIEWBOX,
  STATE_CENTROIDS,
  STATE_NAME_TO_ID,
} from './usaMapData';

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
  // Equirectangular projection for world fallback: viewBox 0 0 1000 500
  const lat = location.latitude ?? 37.34;
  const lon = location.longitude ?? -121.89;

  // Clamped coordinates
  const clampedLat = Math.max(-85, Math.min(85, lat));
  const clampedLon = Math.max(-180, Math.min(180, lon));

  const pinX = ((clampedLon + 180) / 360) * 1000;
  const pinY = ((90 - clampedLat) / 180) * 500;

  const flag = getCountryFlag(location.country);

  // Country detection
  const countryLower = (location.country || '').toLowerCase();
  const isUSA =
    countryLower.includes('united states') ||
    countryLower.includes('usa') ||
    location.country === 'US' ||
    location.countryZh === '美國';
  const isTaiwan = countryLower.includes('taiwan') || location.countryZh === '台灣';
  const isJapan = countryLower.includes('japan') || location.countryZh === '日本';
  const isUK = countryLower.includes('united kingdom') || countryLower.includes('uk') || location.countryZh === '英國';

  // Known US cities for accurate positioning on Albers USA projection (viewBox 170 -20 1060 760)
  const KNOWN_US_CITIES: Record<string, { x: number; y: number }> = {
    'san jose': { x: 320, y: 256 },
    'san josé': { x: 320, y: 256 },
    'san francisco': { x: 318, y: 250 },
    'santa clara': { x: 320, y: 256 },
    'sunnyvale': { x: 320, y: 256 },
    'oakland': { x: 322, y: 248 },
    'los angeles': { x: 345, y: 350 },
    'san diego': { x: 360, y: 375 },
    'seattle': { x: 368, y: 44 },
    'portland': { x: 365, y: 85 },
    'las vegas': { x: 415, y: 290 },
    'phoenix': { x: 470, y: 375 },
    'salt lake city': { x: 490, y: 215 },
    'denver': { x: 600, y: 280 },
    'dallas': { x: 730, y: 410 },
    'austin': { x: 715, y: 460 },
    'houston': { x: 745, y: 475 },
    'san antonio': { x: 700, y: 480 },
    'minneapolis': { x: 805, y: 130 },
    'kansas city': { x: 775, y: 285 },
    'st. louis': { x: 835, y: 295 },
    'st louis': { x: 835, y: 295 },
    'chicago': { x: 885, y: 220 },
    'detroit': { x: 945, y: 195 },
    'nashville': { x: 935, y: 345 },
    'atlanta': { x: 995, y: 395 },
    'miami': { x: 1055, y: 565 },
    'orlando': { x: 1045, y: 505 },
    'tampa': { x: 1025, y: 515 },
    'washington': { x: 1092, y: 260 },
    'philadelphia': { x: 1105, y: 230 },
    'new york': { x: 1120, y: 205 },
    'boston': { x: 1165, y: 165 },
    'honolulu': { x: 599, y: 623 },
    'anchorage': { x: 336, y: 618 },
  };

  const cityLower = (location.city || '').toLowerCase();
  const userStateRaw = (location.state || '').toLowerCase().trim();
  const userStateId = STATE_NAME_TO_ID[userStateRaw] || (cityLower.includes('seattle') ? 'wa' : cityLower.includes('san') ? 'ca' : undefined);

  // Compute user position on USA Albers Map
  let userUsaX = 320;
  let userUsaY = 256;
  const cityMatch = Object.entries(KNOWN_US_CITIES).find(([k]) => cityLower.includes(k));
  if (cityMatch) {
    userUsaX = cityMatch[1].x;
    userUsaY = cityMatch[1].y;
  } else if (userStateId && STATE_CENTROIDS[userStateId]) {
    userUsaX = STATE_CENTROIDS[userStateId].x;
    userUsaY = STATE_CENTROIDS[userStateId].y;
  }

  return (
    <div
      onClick={onSelectLocation}
      className={`
        relative w-full h-full min-h-[260px] sm:min-h-[320px] lg:min-h-[360px] flex flex-col justify-between bg-slate-950 rounded-xl border border-slate-800/80 p-2 sm:p-2.5 overflow-hidden shadow-inner select-none transition-all duration-300
        ${
          isSpeakingLocation
            ? 'border-rose-400/80 shadow-rose-950/40 ring-2 ring-rose-400/40'
            : ''
        }
      `}
      aria-label={`Location map showing ${location.city || 'current location'}, ${location.country || ''}.`}
    >
      {/* Top Location Info Banner - Sleek and integrated above map canvas */}
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center justify-between shadow text-white shrink-0 mb-1.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl sm:text-2xl shrink-0 drop-shadow">
            {flag}
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-sm md:text-base font-black text-white truncate">
              {location.city}{location.state ? `, ${location.state}` : ''}, {location.country}
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-rose-300 truncate">
              {location.countryZh}{location.stateZh ? location.stateZh : ''}{location.cityZh ? location.cityZh : ''}
            </span>
          </div>
        </div>
      </div>

      {/* SVG Map Container */}
      <div className="w-full flex-1 min-h-0 flex items-center justify-center relative">
      {/* =================================================================== */}
      {/* USA DETAILED MAP (Albers Projection)                               */}
      {/* =================================================================== */}
      {isUSA && (
        <svg
          viewBox={USA_MAP_VIEWBOX}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full max-h-full filter drop-shadow"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="usaBgGlow" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>

            <linearGradient id="activeStateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.6" />
            </linearGradient>

            <linearGradient id="defaultStateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <linearGradient id="redPinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="40%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>

            <filter id="regionalGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.7" />
            </filter>
          </defs>

          {/* Deep Navy/Slate Map Canvas */}
          <rect x="170" y="-20" width="1060" height="760" fill="url(#usaBgGlow)" rx="16" />

          {/* 50 USA State Boundary Outlines */}
          <g stroke="#475569" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
            {USA_STATES.map((state) => {
              const isActive = state.id === userStateId;

              return (
                <path
                  key={state.id}
                  d={state.path}
                  fill={isActive ? 'url(#activeStateGrad)' : 'url(#defaultStateGrad)'}
                  stroke={isActive ? '#ef4444' : '#475569'}
                  strokeWidth={isActive ? '3' : '1.5'}
                  filter={isActive ? 'url(#regionalGlow)' : undefined}
                  className="transition-colors duration-300"
                />
              );
            })}
          </g>

          {/* Major State Code Text Accents */}
          <g fontSize="20" fontWeight="900" pointerEvents="none" textAnchor="middle" opacity="0.85">
            {Object.entries(STATE_CENTROIDS).map(([id, info]) => {
              const isActive = id === userStateId;
              const labelColor = isActive ? '#ef4444' : '#64748b';

              return (
                <text
                  key={id}
                  x={info.x}
                  y={info.y}
                  fill={labelColor}
                  fontSize={id === 'tx' ? '24' : '19'}
                >
                  {info.label}
                </text>
              );
            })}
          </g>

          {/* ================================================================= */}
          {/* USER LOCATION PIN                                                 */}
          {/* ================================================================= */}
          <g transform={`translate(${userUsaX}, ${userUsaY})`} filter="url(#pinShadow)">
            {/* Pulsing Radar Ring for High Visibility */}
            <circle cx="0" cy="0" r="32" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" strokeWidth="1.5" opacity="0.6">
              <animate attributeName="r" values="16;38;16" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="20" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" strokeWidth="2" opacity="0.9" />
            <ellipse cx="0" cy="2" rx="14" ry="5" fill="#000000" opacity="0.6" />
            <path
              d="M 0 0 C -4 -8, -16 -20, -16 -32 A 16 16 0 1 1 16 -32 C 16 -20, 4 -8, 0 0 Z"
              fill="url(#redPinGrad)"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <ellipse cx="-4" cy="-38" rx="4" ry="2" fill="#ffffff" opacity="0.6" transform="rotate(-30, -4, -38)" pointerEvents="none" />
            <circle cx="0" cy="-32" r="6.5" fill="#ffffff" pointerEvents="none" />
            <circle cx="0" cy="-32" r="3.2" fill="#dc2626" pointerEvents="none" />
            <circle cx="0" cy="0" r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
          </g>
        </svg>
      )}

      {/* =================================================================== */}
      {/* WORLD MAP (Equirectangular Projection)                             */}
      {/* =================================================================== */}
      {!isUSA && (
        <svg
          viewBox="0 0 1000 500"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full max-h-full filter drop-shadow"
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

            <linearGradient id="redPinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="40%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>

            <linearGradient id="cyanPinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="45%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="countryGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.6" />
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
            <path
              d="M 465 95 L 485 90 L 480 115 L 460 115 Z"
              stroke={isUK ? '#38bdf8' : '#475569'}
              strokeWidth={isUK ? 2.5 : 1.5}
              fill={isUK ? 'rgba(56, 189, 248, 0.25)' : 'url(#landGrad)'}
            />
            <circle cx="450" cy="105" r="4" />

            {/* Africa */}
            <path d="
              M 470 170
              L 530 160 L 585 180 L 610 230 L 590 290 L 560 350 L 530 380 L 505 380
              L 480 330 L 450 250 L 450 200 Z
            " />
            <path d="M 615 320 L 625 330 L 615 365 L 605 355 Z" />

            {/* Asia & Russia */}
            <path d="
              M 580 80
              L 650 60 L 750 50 L 850 55 L 900 80 L 880 120 L 840 140 L 870 170
              L 850 210 L 800 220 L 760 270 L 730 260 L 720 220 L 660 210 L 630 180
              L 600 170 L 585 130 Z
            " />
            <path d="M 680 200 L 730 210 L 710 265 L 685 240 Z" />
            <path d="M 750 240 L 790 240 L 810 290 L 775 300 L 760 270 Z" />
            {/* Japan */}
            <path
              d="M 890 140 L 910 160 L 895 190 L 880 180 Z"
              stroke={isJapan ? '#38bdf8' : '#475569'}
              strokeWidth={isJapan ? 2.5 : 1.5}
              fill={isJapan ? 'rgba(56, 189, 248, 0.3)' : 'url(#landGrad)'}
            />
            {/* Taiwan */}
            <circle
              cx="815"
              cy="225"
              r={isTaiwan ? 6 : 4.5}
              fill={isTaiwan ? '#38bdf8' : '#60a5fa'}
              stroke={isTaiwan ? '#ffffff' : '#93c5fd'}
              strokeWidth={isTaiwan ? 2 : 1}
            />

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

          {/* Focus Highlight: Taiwan Halo Ring */}
          {isTaiwan && (
            <circle
              cx="815"
              cy="225"
              r="14"
              fill="rgba(56, 189, 248, 0.2)"
              stroke="#38bdf8"
              strokeWidth="1.5"
              opacity="0.8"
            />
          )}

          {/* Primary Active User Location Pin in World Map */}
          <g transform={`translate(${pinX}, ${pinY})`} filter="url(#pinShadow)">
            <circle cx="0" cy="0" r="28" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" strokeWidth="1.5" opacity="0.6">
              <animate attributeName="r" values="14;34;14" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="16" fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" strokeWidth="1.5" opacity="0.8" />
            <ellipse cx="0" cy="1" rx="10" ry="3.5" fill="#000000" opacity="0.5" />
            <path d="M 0 0 C -3 -6, -14 -16, -14 -28 A 14 14 0 1 1 14 -28 C 14 -16, 3 -6, 0 0 Z" fill="url(#redPinGrad)" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
            <ellipse cx="-3" cy="-34" rx="4" ry="2" fill="#ffffff" opacity="0.6" transform="rotate(-30, -3, -34)" pointerEvents="none" />
            <circle cx="0" cy="-28" r="5.5" fill="#ffffff" pointerEvents="none" />
            <circle cx="0" cy="-28" r="2.5" fill="#dc2626" pointerEvents="none" />
            <circle cx="0" cy="0" r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
          </g>
        </svg>
      )}
      </div>
    </div>
  );
};
