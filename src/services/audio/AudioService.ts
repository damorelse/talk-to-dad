import { speechEngine, SpeechOptions } from './WebSpeechEngine';
import { toneEngine } from './WebAudioToneEngine';
import { recordedAudioEngine } from './RecordedAudioEngine';
import { iosAudioUnlock } from './iOSAudioUnlock';
import { db } from '../db/AppDatabase';

export class AudioService {
  /**
   * Plays positive reinforcement fanfare (therapy success).
   */
  playSuccess(): void {
    iosAudioUnlock.ensureUnlockedAndResumed();
    toneEngine.playSuccessFanfare();
  }

  /**
   * Plays alert tone for warning or emergency escalation.
   */
  playAlert(): void {
    iosAudioUnlock.ensureUnlockedAndResumed();
    toneEngine.playAlertTone();
  }

  /**
   * Plays error tone for PIN entry errors.
   */
  playError(): void {
    iosAudioUnlock.ensureUnlockedAndResumed();
    toneEngine.playErrorBuzz();
  }

  /**
   * Stops all active audio outputs (speech synthesis, recorded audio, etc.).
   */
  stopAll(): void {
    speechEngine.cancel();
    recordedAudioEngine.stop();
  }

  /**
   * Speaks or plays recorded audio for an AAC card or phrase.
   * If `audioBlobId` is present, retrieves recorded voice clip from database;
   * otherwise speaks text via Web Speech API.
   */
  async speakCardOrText(
    text: string,
    audioBlobId?: string,
    options?: SpeechOptions
  ): Promise<void> {
    this.stopAll();
    iosAudioUnlock.ensureUnlockedAndResumed();

    if (audioBlobId) {
      try {
        const blobRecord = await db.mediaBlobs.get(audioBlobId);
        if (blobRecord && blobRecord.dataBase64) {
          options?.onStart?.();
          await recordedAudioEngine.playBase64(blobRecord.dataBase64, blobRecord.mimeType);
          options?.onEnd?.();
          return;
        }
      } catch {
        // Fallback to speech synthesis if DB retrieval fails
      }
    }

    await speechEngine.speak(text, options);
  }

  /**
   * Urgent emergency speech with alert chime and immediate interruption.
   */
  async triggerEmergency(phrase: string, speechRate = 0.9): Promise<void> {
    this.stopAll();
    iosAudioUnlock.ensureUnlockedAndResumed();
    this.playAlert();
    // Short 120ms pause to let alert tone lead, then speak phrase
    await new Promise(r => setTimeout(r, 120));
    await speechEngine.speak(phrase, { rate: speechRate, pitch: 1.1 });
  }
}

export const audioService = new AudioService();
