import { useCallback, useRef } from 'react';

/**
 * Clamps debounce delay between 200ms and 500ms for anti-tremor motor accessibility.
 */
export function clampDebounceMs(ms?: number): number {
  if (typeof ms !== 'number' || isNaN(ms)) return 300;
  return Math.max(200, Math.min(500, ms));
}

export type DebounceCallback = (...args: any[]) => void;

/**
 * Custom hook to prevent accidental rapid re-triggers caused by stroke-induced tremors.
 */
export function useMotorDebounce<T extends DebounceCallback>(
  callback: T,
  delayMs = 300
): (...args: Parameters<T>) => void {
  const lastCallTimeRef = useRef<number>(0);
  const clampedDelay = clampDebounceMs(delayMs);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallTimeRef.current >= clampedDelay) {
        lastCallTimeRef.current = now;
        callback(...args);
      }
    },
    [callback, clampedDelay]
  );
}
