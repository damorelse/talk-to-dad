/**
 * iOS Web Audio & Speech Touch Unlock Utility
 * iOS Safari requires user gesture interaction to unlock and maintain active
 * AudioContext and SpeechSynthesis states. Persistent listeners ensure audio
 * auto-resumes after device sleep, split-view, or idle periods.
 */

class IOSAudioUnlock {
  private unlocked = false;
  private audioCtx: AudioContext | null = null;
  private listenersAttached = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.attachPersistentGestureListeners();
    }
  }

  init(context?: AudioContext): void {
    if (context) {
      this.audioCtx = context;
    }
    this.attachPersistentGestureListeners();
  }

  attachPersistentGestureListeners(): void {
    if (this.listenersAttached) return;
    this.listenersAttached = true;

    const gestureResumeHandler = () => {
      this.ensureUnlockedAndResumed();
    };

    // Listen on capture and passive for immediate responsiveness on any interaction
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      const gestureEvents = ['pointerdown', 'touchstart', 'touchend', 'click', 'keydown'];
      gestureEvents.forEach(evt => {
        try {
          window.addEventListener(evt, gestureResumeHandler, { capture: true, passive: true });
        } catch {}
      });
    }

    // Auto-resume whenever app returns from sleep, tab switch, or split-view
    if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
      try {
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            this.ensureUnlockedAndResumed();
          }
        });
      } catch {}
    }
  }

  /**
   * Resumes suspended AudioContext and unpauses/primes SpeechSynthesis.
   * Called on every user interaction and before any audio/speech playback.
   */
  ensureUnlockedAndResumed(): boolean {
    try {
      if (typeof window === 'undefined') return false;

      // 1. Unlock & Resume AudioContext
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        if (!this.audioCtx) {
          this.audioCtx = new AudioContextClass();
        }
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().catch(() => {});
        }

        // Play silent 1-sample buffer to warm hardware pipeline if first run
        if (!this.unlocked && this.audioCtx.state === 'running') {
          try {
            const buffer = this.audioCtx.createBuffer(1, 1, 22050);
            const source = this.audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(this.audioCtx.destination);
            source.start(0);
          } catch {}
        }
      }

      // 2. Prime & Resume SpeechSynthesis
      if ('speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }

      this.unlocked = true;
      return true;
    } catch {
      return false;
    }
  }

  unlock(): boolean {
    this.ensureUnlockedAndResumed();
    return true;
  }

  isUnlocked(): boolean {
    return this.unlocked;
  }

  getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    return this.audioCtx;
  }
}

export const iosAudioUnlock = new IOSAudioUnlock();

