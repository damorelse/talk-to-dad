import React, { useState, useEffect, useRef } from 'react';
import { VisualScene, VisualSceneHotspot } from '../../types';
import { HotspotOverlay } from './HotspotOverlay';
import { DebouncedTouchable } from '../common/DebouncedTouchable';
import { getQuorraCouchPose } from '../../services/quorra/quorraMessages';

interface VisualSceneViewerProps {
  scenes: VisualScene[];
  hotspots: VisualSceneHotspot[];
  debounceMs?: number;
}

export const VisualSceneViewer: React.FC<VisualSceneViewerProps> = ({
  scenes,
  hotspots,
  debounceMs = 300,
}) => {
  const [selectedSceneId, setSelectedSceneId] = useState<string>(scenes[0]?.id || '');
  const [lastSpokenHotspot, setLastSpokenHotspot] = useState<string>('');
  const [isQuorraPetted, setIsQuorraPetted] = useState(false);
  const [couchPose, setCouchPose] = useState(() => getQuorraCouchPose());
  const petTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep couch pose updated every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCouchPose(getQuorraCouchPose());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleHotspotTrigger = (hs: VisualSceneHotspot) => {
    setLastSpokenHotspot(hs.spokenText || hs.label);

    const isQuorra =
      hs.id === 'hs-pet-quorra' ||
      hs.id.toLowerCase().includes('quorra') ||
      hs.label.toLowerCase().includes('quorra');

    if (isQuorra) {
      setIsQuorraPetted(true);
      if (petTimeoutRef.current) clearTimeout(petTimeoutRef.current);
      petTimeoutRef.current = setTimeout(() => {
        setIsQuorraPetted(false);
      }, 3500);
    }
  };

  const currentScene = scenes.find((s) => s.id === selectedSceneId) || scenes[0];
  const sceneHotspots = hotspots.filter((hs) => hs.sceneId === currentScene?.id);

  return (
    <div className="w-full h-full flex flex-col gap-2 overflow-hidden select-none">
      {/* Scene Navigation Bar */}
      <div className="w-full flex items-center justify-between gap-2 shrink-0 bg-slate-900 p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-thin py-0.5 scroll-smooth">
          {scenes.map((scene) => (
            <DebouncedTouchable
              key={scene.id}
              onPress={() => setSelectedSceneId(scene.id)}
              minTouchSize="md"
              aria-label={scene.titleZh ? `${scene.title} ${scene.titleZh}` : scene.title}
              title={scene.titleZh ? `${scene.title} ${scene.titleZh}` : scene.title}
              className={`
                px-3.5 sm:px-4 py-2 rounded-xl sm:rounded-2xl border-2 min-h-[40px] sm:min-h-[44px] shadow-sm transition-all shrink-0 flex items-center justify-center gap-1.5 sm:gap-2
                ${
                  currentScene?.id === scene.id
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-900/30 ring-2 ring-amber-400/40 font-black'
                    : 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-500'
                }
              `}
            >
              <span className="text-sm sm:text-base font-black whitespace-nowrap leading-none">
                {scene.title}
              </span>
              {scene.titleZh && (
                <span className={`text-xs sm:text-sm font-bold whitespace-nowrap leading-none ${currentScene?.id === scene.id ? 'text-slate-900/90' : 'text-amber-300'}`}>
                  {scene.titleZh}
                </span>
              )}
            </DebouncedTouchable>
          ))}
        </div>

        {lastSpokenHotspot && (
          <div className="hidden md:flex items-center gap-2 text-xs text-blue-300 bg-blue-950/60 border border-blue-800 px-3 py-1.5 rounded-xl">
            <span>🗣️</span>
            <span className="font-semibold">{lastSpokenHotspot}</span>
          </div>
        )}
      </div>

      {/* Visual Scene Display Area */}
      <div className="flex-1 w-full bg-slate-900 border-2 border-slate-700 rounded-3xl relative overflow-hidden flex items-center justify-center p-2">
        {currentScene ? (
          <div className="relative w-full h-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex items-center justify-center">
            {/* Background SVG / Illustration Scene */}
            {currentScene.id === 'scene-livingroom' ? (
              <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
                {/* Living room background */}
                <defs>
                  <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                  <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                  <linearGradient id="couchBackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1d4ed8" />
                    <stop offset="100%" stopColor="#1e40af" />
                  </linearGradient>
                  <linearGradient id="couchSeatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  <linearGradient id="goldFurSleep" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                  <linearGradient id="earFurSleep" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                </defs>
                {/* Wall & Floor */}
                <rect width="800" height="350" fill="url(#wallGrad)" />
                <rect y="350" width="800" height="150" fill="url(#floorGrad)" />

                {/* Window with sunlight */}
                <rect x="50" y="45" width="160" height="170" rx="10" fill="#38bdf8" fillOpacity="0.2" stroke="#64748b" strokeWidth="6" />
                <line x1="130" y1="45" x2="130" y2="215" stroke="#64748b" strokeWidth="4" />
                <line x1="50" y1="130" x2="210" y2="130" stroke="#64748b" strokeWidth="4" />

                {/* Couch Structure */}
                {/* Couch Backrest */}
                <rect x="100" y="175" width="280" height="110" rx="20" fill="url(#couchBackGrad)" stroke="#1e3a8a" strokeWidth="4" />
                {/* Couch Armrests */}
                <rect x="85" y="215" width="38" height="185" rx="16" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="4" />
                <rect x="357" y="215" width="38" height="185" rx="16" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="4" />
                {/* Main Seat Cushion */}
                <rect x="110" y="255" width="260" height="150" rx="24" fill="url(#couchSeatGrad)" stroke="#1d4ed8" strokeWidth="4" />

                {/* Cozy Pillow */}
                <rect x="120" y="260" width="45" height="40" rx="10" fill="#f43f5e" stroke="#e11d48" strokeWidth="2" />

                {/* ============================================================== */}
                {/* QUORRA THE GOLDEN RETRIEVER ON THE COUCH (DYNAMIC POSES)       */}
                {/* ============================================================== */}
                <g id="quorra-sleeping-couch">
                  {/* Sunbeam in Morning Mode */}
                  {!isQuorraPetted && couchPose === 'morning-sun' && (
                    <polygon points="120,70 180,70 320,380 200,380" fill="#fef08a" fillOpacity="0.08" />
                  )}

                  {/* Curled Golden Body */}
                  <ellipse cx="255" cy="315" rx="55" ry="32" fill="url(#goldFurSleep)" />

                  {/* Tail: Wags rapidly when petted, curled when resting */}
                  {isQuorraPetted ? (
                    <path
                      d="M 305 315 Q 338 310 320 280 Q 295 285 295 315"
                      fill="url(#goldFurSleep)"
                      className="animate-tail-wag"
                    />
                  ) : (
                    <path
                      d="M 305 315 Q 328 332 300 344 Q 275 348 260 338"
                      fill="none"
                      stroke="url(#goldFurSleep)"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Evening Blanket Draped Over Back */}
                  {!isQuorraPetted && couchPose === 'evening-blanket' && (
                    <g id="quorra-cozy-blanket">
                      <path
                        d="M 215 292 Q 260 280 295 300 Q 308 335 255 342 Q 215 340 215 292 Z"
                        fill="#dc2626"
                        stroke="#b91c1c"
                        strokeWidth="2"
                      />
                      <path
                        d="M 220 296 Q 260 285 290 304"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        strokeDasharray="5,4"
                        fill="none"
                      />
                    </g>
                  )}

                  {/* Paws */}
                  <ellipse cx="205" cy="336" rx="9" ry="6" fill="#d97706" />
                  <ellipse cx="225" cy="338" rx="9" ry="6" fill="#d97706" />

                  {/* Golden Head */}
                  <circle cx="198" cy={isQuorraPetted ? 296 : 304} r="26" fill="url(#goldFurSleep)" />

                  {/* Floppy Golden Ears */}
                  <path
                    d={
                      isQuorraPetted
                        ? 'M 174 278 Q 158 296 168 312 Q 180 306 178 286 Z'
                        : 'M 180 290 Q 166 308 174 322 Q 186 318 184 298 Z'
                    }
                    fill="url(#earFurSleep)"
                  />
                  <path
                    d={
                      isQuorraPetted
                        ? 'M 220 278 Q 236 296 226 312 Q 214 306 216 286 Z'
                        : 'M 216 290 Q 230 308 222 322 Q 210 318 212 298 Z'
                    }
                    fill="url(#earFurSleep)"
                  />

                  {/* Soft Muzzle & Nose */}
                  <ellipse cx="196" cy={isQuorraPetted ? 307 : 313} rx="12" ry="9" fill="#fef3c7" />
                  <polygon points={isQuorraPetted ? '196,303 190,298 202,298' : '196,309 190,304 202,304'} fill="#0f172a" />
                  <path
                    d={isQuorraPetted ? 'M 196 303 Q 196 310 192 312 M 196 303 Q 196 310 200 312' : 'M 196 309 Q 196 316 192 318 M 196 309 Q 196 316 200 318'}
                    stroke="#0f172a"
                    strokeWidth="1.5"
                    fill="none"
                  />

                  {/* Smiling Tongue when Petted */}
                  {isQuorraPetted && (
                    <path d="M 193 310 Q 196 318 199 310" fill="#f43f5e" stroke="#0f172a" strokeWidth="1" />
                  )}

                  {/* Eyes: Happy bright open when petted or morning; closed when napping */}
                  {isQuorraPetted || couchPose === 'morning-sun' ? (
                    <>
                      <circle cx="187" cy={isQuorraPetted ? 293 : 299} r="3.2" fill="#0f172a" />
                      <circle cx="188" cy={isQuorraPetted ? 292 : 298} r="1" fill="#ffffff" />
                      <circle cx="205" cy={isQuorraPetted ? 293 : 299} r="3.2" fill="#0f172a" />
                      <circle cx="206" cy={isQuorraPetted ? 292 : 298} r="1" fill="#ffffff" />
                    </>
                  ) : (
                    <>
                      <path d="M 184 301 Q 189 306 194 301" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
                      <path d="M 202 301 Q 207 306 212 301" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </>
                  )}

                  {/* Red Collar with Shiny Gold Tag */}
                  <path d={isQuorraPetted ? 'M 180 320 Q 198 326 216 320' : 'M 180 326 Q 198 332 216 326'} stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                  <circle cx="198" cy={isQuorraPetted ? 324 : 330} r="3.2" fill="#facc15" />

                  {/* Speech Bubble / Floating Dream Cloud */}
                  {isQuorraPetted ? (
                    <g className="animate-bounce">
                      <rect x="180" y="240" width="85" height="26" rx="8" fill="#facc15" stroke="#ffffff" strokeWidth="2" />
                      <text x="222" y="257" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="900">Woof! 💖</text>
                    </g>
                  ) : couchPose === 'evening-blanket' ? (
                    <g className="animate-pulse" opacity="0.95">
                      <circle cx="178" cy="275" r="3.5" fill="#93c5fd" />
                      <circle cx="168" cy="260" r="5.5" fill="#93c5fd" />
                      <circle cx="154" cy="240" r="10" fill="#60a5fa" />
                      <text x="154" y="244" textAnchor="middle" fill="#ffffff" fontSize="9">🌙</text>
                    </g>
                  ) : (
                    <g className="animate-pulse" opacity="0.95">
                      <circle cx="178" cy="275" r="3.5" fill="#93c5fd" />
                      <circle cx="168" cy="260" r="5.5" fill="#93c5fd" />
                      <circle cx="154" cy="240" r="10" fill="#60a5fa" />
                      <text x="154" y="244" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900">Zzz</text>
                    </g>
                  )}
                </g>

                {/* Couch Label */}
                <text x="240" y="388" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="bold">
                  {isQuorraPetted
                    ? '🛋️ Couch · Happy Quorra 🐕💖'
                    : couchPose === 'morning-sun'
                    ? '🛋️ Couch · Quorra Morning Sun 🐕☀️'
                    : couchPose === 'evening-blanket'
                    ? '🛋️ Couch · Quorra Sweet Dreams 🐕🌙'
                    : '🛋️ Couch · Quorra Afternoon Nap 🐕💤'}
                </text>

                {/* TV Table & Screen */}
                <rect x="420" y="180" width="180" height="130" rx="10" fill="#1e1e2e" stroke="#475569" strokeWidth="5" />
                <text x="510" y="250" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="bold">📺 TV</text>
                <rect x="440" y="310" width="140" height="80" rx="8" fill="#475569" />

                {/* Side Table with Water */}
                <ellipse cx="680" cy="350" rx="70" ry="30" fill="#d97706" />
                <text x="680" y="320" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="bold">💧 Water Cup</text>
              </svg>
            ) : currentScene.id === 'scene-kitchen' ? (
              <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
                {/* Kitchen Scene */}
                <defs>
                  <linearGradient id="kitchenWall" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                  <linearGradient id="kitchenFloor" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                  <linearGradient id="counterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>
                  <linearGradient id="tableGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#b45309" />
                    <stop offset="100%" stopColor="#78350f" />
                  </linearGradient>
                </defs>
                <rect width="800" height="330" fill="url(#kitchenWall)" />
                <rect y="330" width="800" height="170" fill="url(#kitchenFloor)" />
                {/* Kitchen Window */}
                <rect x="170" y="30" width="180" height="95" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="4" />
                <rect x="176" y="36" width="168" height="83" rx="4" fill="#38bdf8" fillOpacity="0.25" />
                <line x1="260" y1="30" x2="260" y2="125" stroke="#475569" strokeWidth="3" />
                <line x1="170" y1="77" x2="350" y2="77" stroke="#475569" strokeWidth="3" />

                {/* Refrigerator */}
                <rect x="28" y="70" width="112" height="280" rx="14" fill="#0284c7" fillOpacity="0.9" stroke="#0369a1" strokeWidth="5" />
                <line x1="28" y1="180" x2="140" y2="180" stroke="#0369a1" strokeWidth="4" />
                <rect x="36" y="115" width="8" height="45" rx="3" fill="#ffffff" opacity="0.9" />
                <rect x="36" y="205" width="8" height="55" rx="3" fill="#ffffff" opacity="0.9" />
                <text x="84" y="235" textAnchor="middle" fill="#ffffff" fontSize="17" fontWeight="bold">🧊 Fridge</text>

                {/* Countertop Section */}
                <rect x="148" y="220" width="236" height="130" fill="url(#counterGrad)" stroke="#64748b" strokeWidth="3" />
                <rect x="148" y="216" width="236" height="10" fill="#94a3b8" rx="2" />

                {/* Coffee Maker */}
                <rect x="152" y="120" width="104" height="120" rx="12" fill="#7c3aed" fillOpacity="0.9" stroke="#6d28d9" strokeWidth="4" />
                <rect x="162" y="145" width="84" height="75" rx="8" fill="#1e1e2e" stroke="#6d28d9" strokeWidth="2" />
                <circle cx="204" cy="180" r="14" fill="#4c1d95" />
                <text x="204" y="186" textAnchor="middle" fill="#fbbf24" fontSize="13">☕</text>
                <text x="204" y="215" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">Coffee</text>

                {/* Kitchen Sink */}
                <rect x="264" y="135" width="112" height="120" rx="12" fill="#0891b2" fillOpacity="0.9" stroke="#0e7490" strokeWidth="4" />
                <ellipse cx="320" cy="205" rx="42" ry="22" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
                <path d="M 320 185 Q 320 145 310 145" fill="none" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
                <circle cx="310" cy="145" r="4" fill="#38bdf8" />
                <text x="320" y="210" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">🚰 Sink</text>

                {/* Dining Table */}
                <rect x="420" y="220" width="345" height="180" rx="18" fill="url(#tableGrad)" stroke="#78350f" strokeWidth="5" />
                <rect x="438" y="235" width="310" height="22" rx="6" fill="#d97706" opacity="0.35" />

                {/* Tabletop Items: Fruit Bowl & Table Label */}
                <circle cx="505" cy="285" r="22" fill="#451a03" />
                <text x="505" y="293" textAnchor="middle" fill="#ffffff" fontSize="20">🍎</text>
                <circle cx="565" cy="285" r="20" fill="#451a03" />
                <text x="565" y="292" textAnchor="middle" fill="#ffffff" fontSize="18">🥣</text>
                <text x="535" y="355" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="bold">🍽️ Dining Table</text>

                {/* Water Cup on Dining Table */}
                <rect x="662" y="235" width="92" height="145" rx="14" fill="#0284c7" fillOpacity="0.85" stroke="#0369a1" strokeWidth="4" />
                <ellipse cx="708" cy="260" rx="24" ry="10" fill="#38bdf8" />
                <rect x="692" y="258" width="32" height="42" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                <rect x="696" y="268" width="24" height="28" rx="4" fill="#38bdf8" fillOpacity="0.75" />
                <text x="708" y="287" textAnchor="middle" fill="#ffffff" fontSize="15">💧</text>
                <text x="708" y="340" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">Water Cup</text>
              </svg>
            ) : currentScene.id === 'scene-bedroom' ? (
              <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
                {/* Bedroom Scene */}
                <defs>
                  <linearGradient id="bedroomWall" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e1b4b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                  <linearGradient id="bedroomFloor" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#451a03" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                  <linearGradient id="bedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#4338ca" />
                  </linearGradient>
                  <linearGradient id="laptopScreen" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                  <linearGradient id="ipadScreen" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                </defs>
                <rect width="800" height="340" fill="url(#bedroomWall)" />
                <rect y="340" width="800" height="160" fill="url(#bedroomFloor)" />
                {/* Bedroom Window */}
                <rect x="110" y="40" width="160" height="130" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="5" />
                <circle cx="190" cy="90" r="28" fill="#fbbf24" opacity="0.8" />
                <line x1="190" y1="40" x2="190" y2="170" stroke="#475569" strokeWidth="3" />
                <line x1="110" y1="105" x2="270" y2="105" stroke="#475569" strokeWidth="3" />
                {/* Headboard */}
                <rect x="40" y="170" width="340" height="90" rx="12" fill="#334155" stroke="#475569" strokeWidth="4" />
                {/* Bed Mattress & Quilt */}
                <rect x="40" y="240" width="340" height="190" rx="20" fill="url(#bedGrad)" stroke="#4f46e5" strokeWidth="6" />
                {/* Pillows */}
                <rect x="60" y="200" width="130" height="60" rx="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
                <rect x="220" y="200" width="130" height="60" rx="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
                <text x="210" y="340" textAnchor="middle" fill="#ffffff" fontSize="24" fontWeight="bold">🛏️ Bed</text>
                {/* Study Desk */}
                <rect x="425" y="240" width="340" height="190" rx="12" fill="#78350f" fillOpacity="0.9" stroke="#92400e" strokeWidth="5" />
                <rect x="440" y="290" width="100" height="120" rx="6" fill="#451a03" stroke="#78350f" strokeWidth="3" />
                <rect x="645" y="290" width="100" height="120" rx="6" fill="#451a03" stroke="#78350f" strokeWidth="3" />
                <text x="595" y="380" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="bold">🪑 Desk</text>
                {/* Laptop on Desk */}
                <polygon points="450,245 570,245 560,254 460,254" fill="#334155" stroke="#475569" strokeWidth="2" />
                <rect x="452" y="150" width="124" height="95" rx="8" fill="#0f172a" stroke="#475569" strokeWidth="3" />
                <rect x="458" y="156" width="112" height="78" rx="4" fill="url(#laptopScreen)" />
                <line x1="468" y1="172" x2="540" y2="172" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                <line x1="468" y1="186" x2="520" y2="186" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                <text x="514" y="220" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">💻 Laptop</text>
                {/* iPad Tablet on Desk */}
                <rect x="605" y="158" width="125" height="92" rx="10" fill="#0f172a" stroke="#0284c7" strokeWidth="4" />
                <rect x="613" y="165" width="109" height="78" rx="6" fill="url(#ipadScreen)" />
                <circle cx="630" cy="180" r="5" fill="#ffffff" opacity="0.9" />
                <circle cx="650" cy="180" r="5" fill="#ffffff" opacity="0.9" />
                <circle cx="670" cy="180" r="5" fill="#ffffff" opacity="0.9" />
                <circle cx="690" cy="180" r="5" fill="#ffffff" opacity="0.9" />
                <text x="668" y="220" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">📱 iPad</text>
              </svg>
            ) : currentScene.id === 'scene-bathroom' ? (
              <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
                {/* Bathroom Scene */}
                <defs>
                  <linearGradient id="bathWall" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0f2b38" />
                    <stop offset="100%" stopColor="#082f49" />
                  </linearGradient>
                  <linearGradient id="bathFloor" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                  <linearGradient id="mirrorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#e0f2fe" />
                    <stop offset="100%" stopColor="#bae6fd" />
                  </linearGradient>
                </defs>
                <rect width="800" height="360" fill="url(#bathWall)" />
                <rect y="360" width="800" height="140" fill="url(#bathFloor)" />
                {/* Wall Tiles Grid */}
                <line x1="0" y1="120" x2="800" y2="120" stroke="#155e75" strokeWidth="1" strokeDasharray="12,12" opacity="0.35" />
                <line x1="0" y1="240" x2="800" y2="240" stroke="#155e75" strokeWidth="1" strokeDasharray="12,12" opacity="0.35" />
                {/* Toilet */}
                <rect x="40" y="155" width="145" height="265" rx="16" fill="#0284c7" fillOpacity="0.85" stroke="#0369a1" strokeWidth="5" />
                <rect x="52" y="170" width="120" height="90" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
                <ellipse cx="112" cy="330" rx="55" ry="50" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
                <ellipse cx="112" cy="330" rx="35" ry="30" fill="#bae6fd" opacity="0.7" />
                <text x="112" y="280" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="bold">🚽 Toilet</text>
                {/* Shower Stall */}
                <rect x="210" y="55" width="225" height="370" rx="16" fill="#06b6d4" fillOpacity="0.2" stroke="#0891b2" strokeWidth="5" />
                <path d="M 230 75 L 300 75 L 300 110" fill="none" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
                <ellipse cx="300" cy="115" rx="20" ry="8" fill="#94a3b8" />
                {/* Shower Water Drops */}
                <line x1="290" y1="125" x2="280" y2="220" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6,8" />
                <line x1="300" y1="125" x2="300" y2="230" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6,8" />
                <line x1="310" y1="125" x2="320" y2="220" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6,8" />
                <text x="322" y="270" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="bold">🚿 Shower</text>
                {/* Vanity Wash Sink */}
                <rect x="460" y="165" width="295" height="260" rx="16" fill="#059669" fillOpacity="0.85" stroke="#047857" strokeWidth="5" />
                {/* Mirror */}
                <rect x="495" y="45" width="160" height="110" rx="12" fill="url(#mirrorGrad)" stroke="#64748b" strokeWidth="4" />
                {/* Basin & Faucet */}
                <ellipse cx="575" cy="235" rx="80" ry="40" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
                <path d="M 575 195 Q 575 165 565 165" fill="none" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
                <text x="575" y="325" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="bold">🚰 Wash Sink</text>
                {/* Toothbrush & Cup on Vanity */}
                <rect x="665" y="120" width="95" height="115" rx="12" fill="#db2777" fillOpacity="0.9" stroke="#be185d" strokeWidth="4" />
                <rect x="680" y="155" width="36" height="50" rx="6" fill="#f43f5e" />
                <line x1="693" y1="130" x2="693" y2="175" stroke="#ec4899" strokeWidth="6" strokeLinecap="round" />
                <rect x="688" y="125" width="10" height="16" rx="2" fill="#ffffff" />
                <text x="712" y="215" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">🪥 Brush</text>
              </svg>
            ) : currentScene.id === 'scene-garden' ? (
              <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
                {/* Garden Scene */}
                <defs>
                  <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="60%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#bae6fd" />
                  </linearGradient>
                  <linearGradient id="grassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#16a34a" />
                    <stop offset="100%" stopColor="#15803d" />
                  </linearGradient>
                  <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                  <linearGradient id="treeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#15803d" />
                  </linearGradient>
                </defs>
                {/* Sky */}
                <rect width="800" height="300" fill="url(#skyGrad)" />
                {/* Rolling Grass Hills */}
                <path d="M 0 300 Q 200 270 400 290 T 800 270 L 800 500 L 0 500 Z" fill="#15803d" opacity="0.6" />
                <rect y="300" width="800" height="200" fill="url(#grassGrad)" />

                {/* Fluffy Clouds */}
                <ellipse cx="260" cy="80" rx="60" ry="25" fill="#ffffff" opacity="0.85" />
                <ellipse cx="290" cy="70" rx="45" ry="30" fill="#ffffff" opacity="0.85" />
                <ellipse cx="500" cy="110" rx="70" ry="25" fill="#ffffff" opacity="0.8" />

                {/* Sun */}
                <circle cx="680" cy="85" r="45" fill="url(#sunGrad)" />
                <line x1="680" y1="25" x2="680" y2="12" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <line x1="680" y1="145" x2="680" y2="158" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <line x1="620" y1="85" x2="607" y2="85" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <line x1="740" y1="85" x2="753" y2="85" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <line x1="638" y1="43" x2="628" y2="33" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <line x1="722" y1="127" x2="732" y2="137" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <line x1="638" y1="127" x2="628" y2="137" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <line x1="722" y1="43" x2="732" y2="33" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <text x="680" y="93" textAnchor="middle" fill="#78350f" fontSize="18" fontWeight="bold">☀️ Sun</text>

                {/* Trees */}
                <rect x="130" y="210" width="40" height="150" rx="6" fill="#78350f" stroke="#451a03" strokeWidth="3" />
                <circle cx="150" cy="140" r="75" fill="url(#treeGrad)" stroke="#166534" strokeWidth="4" />
                <circle cx="100" cy="170" r="55" fill="url(#treeGrad)" stroke="#166534" strokeWidth="3" />
                <circle cx="200" cy="170" r="55" fill="url(#treeGrad)" stroke="#166534" strokeWidth="3" />
                <text x="150" y="150" textAnchor="middle" fill="#ffffff" fontSize="24" fontWeight="bold">🌳 Trees</text>

                {/* Flowers Bed */}
                <rect x="340" y="250" width="200" height="150" rx="16" fill="#047857" fillOpacity="0.8" stroke="#065f46" strokeWidth="3" />
                <circle cx="375" cy="300" r="18" fill="#f43f5e" />
                <circle cx="375" cy="300" r="7" fill="#fef08a" />
                <line x1="375" y1="318" x2="375" y2="360" stroke="#15803d" strokeWidth="4" />
                <circle cx="440" cy="285" r="22" fill="#ec4899" />
                <circle cx="440" cy="285" r="8" fill="#fef08a" />
                <line x1="440" y1="307" x2="440" y2="360" stroke="#15803d" strokeWidth="4" />
                <circle cx="505" cy="295" r="18" fill="#a855f7" />
                <circle cx="505" cy="295" r="7" fill="#fef08a" />
                <line x1="505" y1="313" x2="505" y2="360" stroke="#15803d" strokeWidth="4" />
                <text x="440" y="380" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="bold">🌷 Flowers</text>

                {/* Grass Lawn Area */}
                <rect x="560" y="280" width="210" height="150" rx="16" fill="#15803d" fillOpacity="0.8" stroke="#166534" strokeWidth="3" />
                <text x="665" y="340" textAnchor="middle" fill="#ffffff" fontSize="28">🌿</text>
                <text x="665" y="380" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="bold">Grass Lawn</text>
              </svg>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                {currentScene.title}
              </div>
            )}

            {/* Hotspot Interactive Overlay */}
            <HotspotOverlay
              hotspots={sceneHotspots}
              debounceMs={debounceMs}
              onHotspotTrigger={handleHotspotTrigger}
            />
          </div>
        ) : (
          <div className="text-slate-400">No visual scenes configured.</div>
        )}
      </div>
    </div>
  );
};
