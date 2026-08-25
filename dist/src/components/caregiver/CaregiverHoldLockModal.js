import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Lock, Unlock, X } from 'lucide-react';
import { audioService } from '../../services/audio/AudioService.js';
export const CaregiverHoldLockModal = ({ onSuccess, onCancel, }) => {
    const [holdProgress, setHoldProgress] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const holdTimerRef = useRef(null);
    const holdIntervalRef = useRef(null);
    const startTimeRef = useRef(0);
    const HOLD_DURATION_MS = 3000;
    const startHold = (e) => {
        e.preventDefault();
        if (isUnlocked)
            return;
        setIsHolding(true);
        setHoldProgress(0);
        startTimeRef.current = Date.now();
        if (holdIntervalRef.current)
            clearInterval(holdIntervalRef.current);
        if (holdTimerRef.current)
            clearTimeout(holdTimerRef.current);
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
    const cancelHold = (e) => {
        if (e)
            e.preventDefault();
        if (isUnlocked)
            return;
        if (isHolding && holdProgress < 100) {
            audioService.playError();
        }
        clearHoldTimers();
        setIsHolding(false);
        setHoldProgress(0);
    };
    const clearHoldTimers = () => {
        if (holdTimerRef.current)
            clearTimeout(holdTimerRef.current);
        if (holdIntervalRef.current)
            clearInterval(holdIntervalRef.current);
        holdTimerRef.current = null;
        holdIntervalRef.current = null;
    };
    useEffect(() => {
        return () => {
            clearHoldTimers();
        };
    }, []);
    const remainingSeconds = Math.max(0, Math.ceil((HOLD_DURATION_MS * (1 - holdProgress / 100)) / 1000));
    return (_jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-fadeIn cursor-pointer", role: "dialog", "aria-modal": "true", "aria-labelledby": "settings-modal-title", onClick: (e) => {
            if (e.target === e.currentTarget) {
                onCancel();
            }
        }, children: _jsxs("div", { className: "w-full max-w-sm bg-white dark:bg-slate-900 border-2 border-pink-500/40 dark:border-pink-500/40 rounded-3xl p-6 flex flex-col items-center gap-5 shadow-2xl shadow-pink-950/40 transition-all cursor-default", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx("div", { className: `
              w-16 h-16 rounded-3xl flex items-center justify-center border-2 transition-all duration-300
              ${isUnlocked
                                ? 'bg-green-500/20 border-green-500 text-green-500 scale-110'
                                : isHolding
                                    ? 'bg-pink-600/30 border-pink-500 text-pink-400 scale-105 shadow-lg shadow-pink-900/50'
                                    : 'bg-pink-600/20 border-pink-500 text-pink-500'}
            `, children: isUnlocked ? (_jsx(Unlock, { className: "w-8 h-8 stroke-[2.5]" })) : (_jsx(Lock, { className: "w-8 h-8 stroke-[2.5]" })) }), _jsx("h2", { id: "settings-modal-title", className: "text-xl font-black text-slate-900 dark:text-white", children: "Caregiver Settings Access" })] }), _jsxs("div", { className: "w-full flex flex-col items-center gap-3", children: [_jsxs("button", { type: "button", onMouseDown: startHold, onMouseUp: cancelHold, onMouseLeave: cancelHold, onTouchStart: startHold, onTouchEnd: cancelHold, onTouchCancel: cancelHold, disabled: isUnlocked, className: `
              relative w-full h-24 rounded-2xl border-4 overflow-hidden flex flex-col items-center justify-center
              shadow-lg cursor-pointer select-none transition-all duration-150 active:scale-98
              ${isUnlocked
                                ? 'bg-green-600 border-green-400 text-white font-black'
                                : isHolding
                                    ? 'bg-pink-950/80 border-pink-400 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border-pink-500/50'}
            `, "aria-label": "Press and hold 3 seconds to unlock settings mode", children: [_jsx("div", { className: `
                absolute left-0 top-0 bottom-0 transition-all ease-linear
                ${isUnlocked ? 'bg-green-500' : 'bg-pink-600/80'}
              `, style: { width: `${holdProgress}%` } }), _jsx("div", { className: "relative z-10 flex flex-col items-center justify-center gap-1 pointer-events-none", children: isUnlocked ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ShieldCheck, { className: "w-6 h-6 animate-bounce" }), _jsx("span", { className: "text-base font-black uppercase tracking-wider", children: "Unlocked!" })] })) : isHolding ? (_jsxs(_Fragment, { children: [_jsxs("span", { className: "text-sm font-black uppercase tracking-wider text-pink-100 drop-shadow", children: ["Hold for ", remainingSeconds, " SECONDS..."] }), _jsxs("span", { className: "text-xs font-bold text-pink-200", children: [Math.round(holdProgress), "% complete"] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Lock, { className: "w-4 h-4 text-pink-600 dark:text-pink-400" }), _jsx("span", { className: "text-sm font-black uppercase tracking-wider", children: "Hold 3 SECONDS to Unlock" })] }), _jsx("span", { className: "text-[11px] opacity-75 font-semibold", children: "Touch & keep holding" })] })) })] }), _jsxs("button", { type: "button", onClick: onCancel, className: "text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-2 px-4 rounded-xl flex items-center gap-1 cursor-pointer transition-colors", children: [_jsx(X, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Cancel" })] })] })] }) }));
};
