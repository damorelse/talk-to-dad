import React, { useState } from 'react';
import { UserLocationInfo } from '../../types';
import { getCountryFlag } from '../../services/location/locationService';
import { Globe, ZoomIn } from 'lucide-react';

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
  // Toggle between high-contrast Regional/Country Zoom and full World View
  const [viewMode, setViewMode] = useState<'regional' | 'world'>('regional');

  // Equirectangular projection: viewBox 0 0 1000 500
  const lat = location.latitude ?? 37.77;
  const lon = location.longitude ?? -122.42;

  // Clamped coordinates
  const clampedLat = Math.max(-85, Math.min(85, lat));
  const clampedLon = Math.max(-180, Math.min(180, lon));

  const pinX = ((clampedLon + 180) / 360) * 1000;
  const pinY = ((90 - clampedLat) / 180) * 500;

  const flag = getCountryFlag(location.country);

  // Country detection for focus highlighting
  const countryLower = (location.country || '').toLowerCase();
  const isUSA =
    countryLower.includes('united states') ||
    countryLower.includes('usa') ||
    location.country === 'US' ||
    location.countryZh === '美國';
  const isTaiwan = countryLower.includes('taiwan') || location.countryZh === '台灣';
  const isCanada = countryLower.includes('canada') || location.countryZh === '加拿大';
  const isJapan = countryLower.includes('japan') || location.countryZh === '日本';
  const isUK = countryLower.includes('united kingdom') || countryLower.includes('uk') || location.countryZh === '英國';

  // Specific coordinates for Seattle and San Francisco in World Map
  const worldSeattleX = (( -122.33 + 180) / 360) * 1000; // ~160.2
  const worldSeattleY = (( 90 - 47.61) / 180) * 500;    // ~117.8
  const worldSfX = (( -122.42 + 180) / 360) * 1000;      // ~160.0
  const worldSfY = (( 90 - 37.77) / 180) * 500;         // ~145.1

  // Check if active user pin matches Seattle or SF (within 15px radius)
  const isUserAtSeattle = isUSA && Math.hypot(pinX - worldSeattleX, pinY - worldSeattleY) < 15;
  const isUserAtSF = isUSA && !isUserAtSeattle && Math.hypot(pinX - worldSfX, pinY - worldSfY) < 15;

  // Specific coordinates for Seattle and San Francisco in Regional USA Zoom (800x500)
  const regSeattleX = 125;
  const regSeattleY = 95;
  const regSfX = 105;
  const regSfY = 235;

  // On-map floating label calculations for user location
  const cityLabel = location.city || location.country || 'You Are Here';
  const pillWidth = Math.max(90, Math.min(180, cityLabel.length * 8.5 + 30));
  const calloutX = Math.max(pillWidth / 2 + 12, Math.min(1000 - pillWidth / 2 - 12, pinX));
  const isNearTop = pinY < 80;
  const calloutY = isNearTop ? pinY + 54 : pinY - 48;
  const pointerOffset = Math.max(-pillWidth / 2 + 12, Math.min(pillWidth / 2 - 12, pinX - calloutX));

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
        relative w-full h-full min-h-[170px] sm:min-h-[210px] flex flex-col justify-between bg-slate-950 rounded-2xl border px-2 sm:px-3 py-1 sm:py-1.5 overflow-hidden shadow-inner cursor-pointer select-none group transition-all duration-300
        ${
          isSpeakingLocation
            ? 'border-rose-400 ring-4 ring-rose-400/50 shadow-2xl shadow-rose-950/60 scale-[1.01]'
            : 'border-slate-800 hover:border-rose-500/60'
        }
      `}
      role="button"
      aria-label={`Current location on map: ${location.city}, ${location.country}. Tap to hear.`}
      tabIndex={0}
    >
      {/* Interactive View Toggle Pill (Regional Zoom ↔ World Map) */}
      <div className="absolute top-2 right-2 z-20 flex items-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setViewMode((m) => (m === 'regional' ? 'world' : 'regional'));
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 active:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 shadow-md text-xs font-bold transition-all cursor-pointer backdrop-blur-md"
          aria-label={viewMode === 'regional' ? 'Switch to World Map View' : 'Switch to Regional Zoom View'}
          title={viewMode === 'regional' ? 'Switch to World Map' : 'Switch to Regional Zoom'}
        >
          {viewMode === 'regional' ? (
            <>
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>World Map</span>
            </>
          ) : (
            <>
              <ZoomIn className="w-3.5 h-3.5 text-rose-400" />
              <span>{isUSA ? 'USA Zoom' : isTaiwan ? 'Taiwan Zoom' : 'Regional Zoom'}</span>
            </>
          )}
        </button>
      </div>

      {/* =================================================================== */}
      {/* MODE A: REGIONAL / COUNTRY ZOOM VIEW                                */}
      {/* =================================================================== */}
      {viewMode === 'regional' && isUSA && (
        <svg
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid meet"
          className="w-full flex-1 filter drop-shadow"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="oceanRegionalGlow" cx="45%" cy="50%" r="75%">
              <stop offset="0%" stopColor="#0b1329" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>

            <linearGradient id="usLandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
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

            <filter id="regionalGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
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
          <rect x="0" y="0" width="800" height="500" fill="url(#oceanRegionalGlow)" rx="16" />

          {/* Ocean Watermark Text Labels */}
          <text x="50" y="440" fill="#334155" fontSize="13" fontWeight="900" letterSpacing="1" opacity="0.6">
            PACIFIC OCEAN · 太平洋
          </text>
          <text x="630" y="440" fill="#334155" fontSize="13" fontWeight="900" letterSpacing="1" opacity="0.6">
            ATLANTIC OCEAN · 大西洋
          </text>
          <text x="400" y="32" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="800" letterSpacing="2" opacity="0.7">
            CANADA · 加拿大
          </text>

          {/* Neighboring Canada Border Line */}
          <path d="M 80 50 L 350 50 L 460 50 L 520 70 L 640 120 L 690 80 L 750 40" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.5" />

          {/* Neighboring Mexico Border Line */}
          <path d="M 180 360 L 240 370 L 320 380 L 360 380 L 410 430 L 460 460" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.5" />

          {/* USA Mainland Landmass Contour */}
          <g filter="url(#regionalGlow)">
            <path
              d="
                M 80 50
                L 70 70 L 130 95 L 70 85 L 80 150 L 75 175 L 85 200 L 105 235 L 115 265
                L 140 310 L 160 330 L 180 360 L 240 370 L 320 380 L 360 380 L 410 430
                L 460 460 L 480 410 L 520 390 L 590 390 L 630 380 L 680 370 L 720 420
                L 745 470 L 740 390 L 720 350 L 710 310 L 735 255 L 715 215 L 725 180
                L 730 160 L 755 130 L 770 75 L 750 40 L 690 80 L 640 120 L 580 100
                L 520 70 L 460 50 L 380 50 L 230 50 Z
              "
              fill="url(#usLandGrad)"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </g>

          {/* West Coast Internal State Boundary Lines */}
          <g stroke="#475569" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" fill="none">
            {/* WA / OR border (Columbia River) */}
            <path d="M 75 125 L 180 125" />
            {/* OR / CA border */}
            <path d="M 80 190 L 190 190" />
            {/* CA / NV border */}
            <path d="M 190 190 L 220 320 L 180 360" />
            {/* WA / ID & OR / ID border */}
            <path d="M 180 50 L 180 190" />
            {/* NV / UT border */}
            <path d="M 240 190 L 240 310" />
            {/* AZ / UT border */}
            <path d="M 200 310 L 320 310" />
            {/* Rocky Mountain / Midwest boundary */}
            <path d="M 360 50 L 360 380" />
            {/* Mississippi River corridor */}
            <path d="M 520 70 L 530 180 L 590 390" />
          </g>

          {/* State Text Accents */}
          <text x="145" y="75" fill="#64748b" fontSize="11" fontWeight="800">WA</text>
          <text x="135" y="160" fill="#64748b" fontSize="11" fontWeight="800">OR</text>
          <text x="125" y="290" fill="#64748b" fontSize="12" fontWeight="900">CA</text>
          <text x="210" y="240" fill="#64748b" fontSize="11" fontWeight="800">NV</text>
          <text x="250" y="345" fill="#64748b" fontSize="11" fontWeight="800">AZ</text>
          <text x="440" y="340" fill="#64748b" fontSize="12" fontWeight="900">TEXAS</text>
          <text x="700" y="140" fill="#64748b" fontSize="11" fontWeight="800">NY</text>
          <text x="690" y="420" fill="#64748b" fontSize="11" fontWeight="800">FL</text>

          {/* West Coast Connecting Flight/Highway Arc (Seattle <-> San Francisco) */}
          <g opacity="0.85">
            <path
              d={`M ${regSeattleX} ${regSeattleY} Q 60 165 ${regSfX} ${regSfY}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />
            {/* Route Distance Label Badge */}
            <rect x="36" y="153" width="62" height="18" rx="9" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <text x="67" y="165" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="800">
              ✈️ 800 mi
            </text>
          </g>

          {/* ================================================================= */}
          {/* PIN 1: SEATTLE (WASHINGTON)                                       */}
          {/* ================================================================= */}
          <g transform={`translate(${regSeattleX}, ${regSeattleY})`} filter="url(#pinShadow)">
            {/* Static Halo Ring */}
            <circle
              cx="0"
              cy="0"
              r={isUserAtSeattle ? 22 : 14}
              fill={isUserAtSeattle ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.15)'}
              stroke={isUserAtSeattle ? '#ef4444' : '#38bdf8'}
              strokeWidth="1.5"
              opacity="0.8"
            />
            <ellipse cx="0" cy="1" rx="8" ry="3" fill="#000000" opacity="0.5" />
            <path
              d="M 0 0 C -3 -5, -12 -12, -12 -22 A 12 12 0 1 1 12 -22 C 12 -12, 3 -5, 0 0 Z"
              fill={isUserAtSeattle ? 'url(#redPinGrad)' : 'url(#cyanPinGrad)'}
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="0" cy="-22" r="4.5" fill="#ffffff" />
            <circle cx="0" cy="-22" r="2" fill={isUserAtSeattle ? '#dc2626' : '#0284c7'} />
          </g>

          {/* Seattle Callout Pill Badge */}
          <g transform={`translate(${regSeattleX}, ${regSeattleY - 26})`}>
            <polygon points="0,2 -5,-3 5,-3" fill={isUserAtSeattle ? '#ef4444' : '#0284c7'} stroke="#ffffff" strokeWidth="1.2" />
            <rect
              x="-68"
              y="-24"
              width="136"
              height="24"
              rx="12"
              fill={isUserAtSeattle ? '#ef4444' : '#0284c7'}
              stroke="#ffffff"
              strokeWidth="1.8"
              filter="url(#regionalGlow)"
            />
            <text x="0" y="-8" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900" letterSpacing="0.4" pointerEvents="none">
              🌲 Seattle · 西雅圖
            </text>
          </g>

          {/* ================================================================= */}
          {/* PIN 2: SAN FRANCISCO (CALIFORNIA)                                 */}
          {/* ================================================================= */}
          <g transform={`translate(${regSfX}, ${regSfY})`} filter="url(#pinShadow)">
            {/* Static Halo Ring */}
            <circle
              cx="0"
              cy="0"
              r={!isUserAtSeattle ? 22 : 14}
              fill={!isUserAtSeattle ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.15)'}
              stroke={!isUserAtSeattle ? '#ef4444' : '#38bdf8'}
              strokeWidth="1.5"
              opacity="0.8"
            />
            <ellipse cx="0" cy="1" rx="8" ry="3" fill="#000000" opacity="0.5" />
            <path
              d="M 0 0 C -3 -5, -12 -12, -12 -22 A 12 12 0 1 1 12 -22 C 12 -12, 3 -5, 0 0 Z"
              fill={!isUserAtSeattle ? 'url(#redPinGrad)' : 'url(#cyanPinGrad)'}
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="0" cy="-22" r="4.5" fill="#ffffff" />
            <circle cx="0" cy="-22" r="2" fill={!isUserAtSeattle ? '#dc2626' : '#0284c7'} />
          </g>

          {/* San Francisco Callout Pill Badge */}
          <g transform={`translate(${regSfX}, ${regSfY + 28})`}>
            <polygon points="0,-22 -5,-17 5,-17" fill={!isUserAtSeattle ? '#ef4444' : '#0284c7'} stroke="#ffffff" strokeWidth="1.2" />
            <rect
              x="-82"
              y="-19"
              width="164"
              height="24"
              rx="12"
              fill={!isUserAtSeattle ? '#ef4444' : '#0284c7'}
              stroke="#ffffff"
              strokeWidth="1.8"
              filter="url(#regionalGlow)"
            />
            <text x="0" y="-3" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900" letterSpacing="0.4" pointerEvents="none">
              🌉 San Francisco · 舊金山
            </text>
          </g>
        </svg>
      )}

      {/* =================================================================== */}
      {/* MODE B: GLOBAL WORLD MAP (or non-USA regional default)             */}
      {/* =================================================================== */}
      {(viewMode === 'world' || !isUSA) && (
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

          {/* Focus Highlight: USA Landmass Glow Overlay when user is in the USA */}
          {isUSA && (
            <g filter="url(#countryGlow)">
              <path
                d="
                  M 140 115
                  L 190 110 L 250 115 L 260 140 L 250 180 L 230 185 L 210 160 L 195 210
                  L 210 245 L 200 240 L 170 180 L 140 150 Z
                "
                fill="rgba(56, 189, 248, 0.14)"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeDasharray="6 3"
              />
            </g>
          )}

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

          {/* Seattle Auxiliary Pin in World Map */}
          {isUSA && !isUserAtSeattle && (
            <g>
              <g transform={`translate(${worldSeattleX}, ${worldSeattleY})`} filter="url(#pinShadow)">
                <circle cx="0" cy="0" r="10" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeWidth="1.5" opacity="0.7" />
                <ellipse cx="0" cy="1" rx="6" ry="2.2" fill="#000000" opacity="0.4" />
                <path d="M 0 0 C -2.5 -4, -8 -10, -8 -18 A 8 8 0 1 1 8 -18 C 8 -10, 2.5 -4, 0 0 Z" fill="url(#cyanPinGrad)" stroke="#ffffff" strokeWidth="1.6" strokeLinejoin="round" />
                <circle cx="0" cy="-18" r="3" fill="#ffffff" />
                <circle cx="0" cy="-18" r="1.4" fill="#0284c7" />
              </g>
              <g transform={`translate(${worldSeattleX}, 94)`}>
                <polygon points="0,2 -4,-3 4,-3" fill="#0284c7" stroke="#ffffff" strokeWidth="1.2" />
                <rect x="-48" y="-21" width="96" height="19" rx="9.5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.6" filter="url(#pinGlow)" />
                <text x="0" y="-8" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="800" letterSpacing="0.3" pointerEvents="none">
                  Seattle · 西雅圖
                </text>
              </g>
            </g>
          )}

          {/* San Francisco Auxiliary Pin in World Map */}
          {isUSA && !isUserAtSF && (
            <g>
              <g transform={`translate(${worldSfX}, ${worldSfY})`} filter="url(#pinShadow)">
                <circle cx="0" cy="0" r="10" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeWidth="1.5" opacity="0.7" />
                <ellipse cx="0" cy="1" rx="6" ry="2.2" fill="#000000" opacity="0.4" />
                <path d="M 0 0 C -2.5 -4, -8 -10, -8 -18 A 8 8 0 1 1 8 -18 C 8 -10, 2.5 -4, 0 0 Z" fill="url(#cyanPinGrad)" stroke="#ffffff" strokeWidth="1.6" strokeLinejoin="round" />
                <circle cx="0" cy="-18" r="3" fill="#ffffff" />
                <circle cx="0" cy="-18" r="1.4" fill="#0284c7" />
              </g>
              <g transform={`translate(${worldSfX}, 168)`}>
                <polygon points="0,-21 -4,-16 4,-16" fill="#0284c7" stroke="#ffffff" strokeWidth="1.2" />
                <rect x="-64" y="-19" width="128" height="19" rx="9.5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.6" filter="url(#pinGlow)" />
                <text x="0" y="-6" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="800" letterSpacing="0.3" pointerEvents="none">
                  San Francisco · 舊金山
                </text>
              </g>
            </g>
          )}

          {/* Primary Active User Location Pin in World Map */}
          <g transform={`translate(${pinX}, ${pinY})`} filter="url(#pinShadow)">
            <circle cx="0" cy="0" r="18" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.5" opacity="0.8" />
            <ellipse cx="0" cy="1" rx="10" ry="3.5" fill="#000000" opacity="0.5" />
            <path d="M 0 0 C -3 -6, -14 -16, -14 -28 A 14 14 0 1 1 14 -28 C 14 -16, 3 -6, 0 0 Z" fill="url(#redPinGrad)" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
            <ellipse cx="-3" cy="-34" rx="4" ry="2" fill="#ffffff" opacity="0.6" transform="rotate(-30, -3, -34)" pointerEvents="none" />
            <circle cx="0" cy="-28" r="5.5" fill="#ffffff" pointerEvents="none" />
            <circle cx="0" cy="-28" r="2.5" fill="#dc2626" pointerEvents="none" />
            <circle cx="0" cy="0" r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
          </g>

          {/* Active Callout in World Map */}
          <g transform={`translate(${calloutX}, ${calloutY})`}>
            {!isNearTop ? (
              <polygon points={`${pointerOffset},2 ${pointerOffset - 5},-3 ${pointerOffset + 5},-3`} fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            ) : (
              <polygon points={`${pointerOffset},-26 ${pointerOffset - 5},-21 ${pointerOffset + 5},-21`} fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            )}
            <rect x={-pillWidth / 2} y="-24" width={pillWidth} height="22" rx="11" fill="#ef4444" stroke="#ffffff" strokeWidth="2" filter="url(#pinGlow)" />
            <text x="0" y="-9" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900" letterSpacing="0.4" pointerEvents="none">
              {cityLabel}
            </text>
          </g>
        </svg>
      )}

      {/* Clean Floating Badge Over Map */}
      <div className="absolute bottom-2 left-2 right-2 bg-slate-900/95 backdrop-blur-md border border-rose-500/30 rounded-xl px-3 py-1.5 sm:px-3.5 sm:py-2 flex items-center shadow-xl text-white">
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
    </div>
  );
};
