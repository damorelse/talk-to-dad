import { iosAudioUnlock } from './iOSAudioUnlock';

export class WebAudioToneEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        iosAudioUnlock.init(this.ctx);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /**
   * 800Hz gentle tactile UI tap confirmation tone (50ms).
   */
  playTapChime(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // AudioContext unavailable or suppressed
    }
  }

  /**
   * 520Hz urgent alert siren pulse for Emergency bar or pain escalation.
   */
  playAlertTone(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.linearRampToValueAtTime(780, now + 0.15);
      osc.frequency.linearRampToValueAtTime(520, now + 0.3);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * 1046Hz (C6) + E6 + G6 positive reinforcement fanfare for speech therapy.
   */
  playSuccessFanfare(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [
        { freq: 1046.5, time: 0, dur: 0.12 },     // C6
        { freq: 1318.51, time: 0.12, dur: 0.12 },  // E6
        { freq: 1567.98, time: 0.24, dur: 0.35 },  // G6
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.2, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Playful synthesized puppy yip sound (cheerful double pitch chirp with warm resonance).
   */
  playPuppyBark(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // First quick yip
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      osc1.frequency.exponentialRampToValueAtTime(550, now + 0.14);

      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.14);

      // Second higher happy chirp
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(600, now + 0.12);
      osc2.frequency.exponentialRampToValueAtTime(1100, now + 0.20);
      osc2.frequency.exponentialRampToValueAtTime(700, now + 0.28);

      gain2.gain.setValueAtTime(0.2, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.28);
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Warm acoustic petting chime for Quorra (double soft resonant thuds + gentle pentatonic C5-E5 chord).
   */
  playQuorraPetTone(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Soft carpet/cushion tail thump 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(130, now);
      osc1.frequency.exponentialRampToValueAtTime(70, now + 0.08);
      gain1.gain.setValueAtTime(0.22, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.08);

      // Soft tail thump 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(140, now + 0.1);
      osc2.frequency.exponentialRampToValueAtTime(75, now + 0.18);
      gain2.gain.setValueAtTime(0.25, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.18);

      // Sweet pentatonic chime notes (C5: 523.25Hz, E5: 659.25Hz, G5: 783.99Hz)
      const chimes = [
        { freq: 523.25, time: 0.16, dur: 0.22, gain: 0.15 },
        { freq: 659.25, time: 0.22, dur: 0.28, gain: 0.18 },
        { freq: 783.99, time: 0.28, dur: 0.35, gain: 0.14 },
      ];

      chimes.forEach(({ freq, time, dur, gain }) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);
        g.gain.setValueAtTime(gain, now + time);
        g.gain.exponentialRampToValueAtTime(0.001, now + time + dur);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Low 220Hz buzz for PIN errors or invalid actions.
   */
  playErrorBuzz(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.2);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // AudioContext unavailable
    }
  }
}

export const toneEngine = new WebAudioToneEngine();
