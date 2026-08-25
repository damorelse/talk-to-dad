import { iosAudioUnlock } from './iOSAudioUnlock.ts';

export class RecordedAudioEngine {
  private currentAudio: HTMLAudioElement | null = null;

  /**
   * Plays a base64 encoded audio string.
   */
  playBase64(base64Data: string, mimeType = 'audio/webm'): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve();
        return;
      }

      iosAudioUnlock.unlock();
      this.stop();

      try {
        let srcUrl = base64Data;
        if (!base64Data.startsWith('data:')) {
          srcUrl = `data:${mimeType};base64,${base64Data}`;
        }

        const audio = new Audio(srcUrl);
        this.currentAudio = audio;

        audio.onended = () => {
          this.currentAudio = null;
          resolve();
        };

        audio.onerror = () => {
          this.currentAudio = null;
          resolve();
        };

        audio.play().catch(() => {
          this.currentAudio = null;
          resolve();
        });
      } catch {
        this.currentAudio = null;
        resolve();
      }
    });
  }

  stop(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }
  }

  isPlaying(): boolean {
    return this.currentAudio !== null && !this.currentAudio.paused;
  }
}

export const recordedAudioEngine = new RecordedAudioEngine();
