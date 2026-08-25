import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Lock, Unlock, X } from 'lucide-react';
import { audioService } from '../../services/audio/AudioService';

interface PinLockModalProps {
  onSuccess: () => void;
  onCancel: () => void;
  correctPin?: string; // Optional for backward compatibility
}

export const PinLockModal: React.FC<PinLockModalProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const HOLD_DURATION_MS = 3000;

  const startHold = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (isUnlocked) return;

    setIsHolding(true);
    setHoldProgress(0);
    startTimeRef.current = Date.now();

    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);
      setHoldProgress(progress);
    }, 30);

    holdTimerRef.current = setTimeout(() => {
      clearHoldTimers();
      setHoldProgress(100);
      setIsUnlocked(true);
      audioService.playSuccess();
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.(100);
      }
      setTimeout(() => {
        onSuccess();
      }, 250);
    }, HOLD_DURATION_MS);
  };

  const cancelHold = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (isUnlocked) return;

    if (isHolding && holdProgress < 100) {
      audioService.playError();
    }
    clearHoldTimers();
    setIsHolding(false);
    setHoldProgress(0);
  };

  const clearHoldTimers = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    holdTimerRef.current = null;
    holdIntervalRef.current = null;
  };

  useEffect(() => {
    return () => {
      clearHoldTimers();
    };
  }, []);

  const remainingSeconds = Math.max(0, Math.ceil((HOLD_DURATION_MS * (1 - holdProgress / 100)) / 1000));

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-fadeIn cursor-pointer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-900 border-2 border-pink-500/40 dark:border-pink-500/40 rounded-3xl p-6 flex flex-col items-center gap-5 shadow-2xl shadow-pink-950/40 transition-all cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Icon */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`
              w-16 h-16 rounded-3xl flex items-center justify-center border-2 transition-all duration-300
              ${
                isUnlocked
                  ? 'bg-green-500/20 border-green-500 text-green-500 scale-110'
                  : isHolding
                  ? 'bg-pink-600/30 border-pink-500 text-pink-400 scale-105 shadow-lg shadow-pink-900/50'
                  : 'bg-pink-600/20 border-pink-500 text-pink-500'
              }
            `}
          >
            {isUnlocked ? (
              <Unlock className="w-8 h-8 stroke-[2.5]" />
            ) : (
              <Lock className="w-8 h-8 stroke-[2.5]" />
            )}
          </div>

          <h2 id="settings-modal-title" className="text-xl font-black text-slate-900 dark:text-white">
            Caregiver Settings Access
          </h2>
        </div>

        {/* 3-Second Hold Button */}
        <div className="w-full flex flex-col items-center gap-3">
          <button
            type="button"
            onMouseDown={startHold}
            onMouseUp={cancelHold}
            onMouseLeave={cancelHold}
            onTouchStart={startHold}
            onTouchEnd={cancelHold}
            onTouchCancel={cancelHold}
            disabled={isUnlocked}
            className={`
              relative w-full h-24 rounded-2xl border-4 overflow-hidden flex flex-col items-center justify-center
              shadow-lg cursor-pointer select-none transition-all duration-150 active:scale-98
              ${
                isUnlocked
                  ? 'bg-green-600 border-green-400 text-white font-black'
                  : isHolding
                  ? 'bg-pink-950/80 border-pink-400 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border-pink-500/50'
              }
            `}
            aria-label="Press and hold 3 seconds to unlock settings mode"
          >
            {/* Smooth animated progress fill */}
            <div
              className={`
                absolute left-0 top-0 bottom-0 transition-all ease-linear
                ${isUnlocked ? 'bg-green-500' : 'bg-pink-600/80'}
              `}
              style={{ width: `${holdProgress}%` }}
            />

            {/* Hold Button Text Content */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-1 pointer-events-none">
              {isUnlocked ? (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 animate-bounce" />
                  <span className="text-base font-black uppercase tracking-wider">Unlocked!</span>
                </div>
              ) : isHolding ? (
                <>
                  <span className="text-sm font-black uppercase tracking-wider text-pink-100 drop-shadow">
                    Hold for {remainingSeconds} SECONDS...
                  </span>
                  <span className="text-xs font-bold text-pink-200">
                    {Math.round(holdProgress)}% complete
                  </span>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                    <span className="text-sm font-black uppercase tracking-wider">
                      Hold 3 SECONDS to Unlock
                    </span>
                  </div>
                  <span className="text-[11px] opacity-75 font-semibold">
                    Touch & keep holding
                  </span>
                </>
              )}
            </div>
          </button>

          {/* Cancel button */}
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-2 px-4 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
