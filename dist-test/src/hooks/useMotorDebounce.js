import { useCallback, useRef } from 'react';
/**
 * Clamps debounce delay between 200ms and 500ms for anti-tremor motor accessibility.
 */
export function clampDebounceMs(ms) {
    if (typeof ms !== 'number' || isNaN(ms))
        return 300;
    return Math.max(200, Math.min(500, ms));
}
/**
 * Custom hook to prevent accidental rapid re-triggers caused by stroke-induced tremors.
 */
export function useMotorDebounce(callback, delayMs = 300) {
    const lastCallTimeRef = useRef(0);
    const clampedDelay = clampDebounceMs(delayMs);
    return useCallback((...args) => {
        const now = Date.now();
        if (now - lastCallTimeRef.current >= clampedDelay) {
            lastCallTimeRef.current = now;
            callback(...args);
        }
    }, [callback, clampedDelay]);
}
