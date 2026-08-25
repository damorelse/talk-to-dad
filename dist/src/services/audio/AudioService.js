import { speechEngine } from './WebSpeechEngine.js';
import { toneEngine } from './WebAudioToneEngine.js';
import { recordedAudioEngine } from './RecordedAudioEngine.js';
import { iosAudioUnlock } from './iOSAudioUnlock.js';
import { db } from '../db/AppDatabase.js';
export class AudioService {
    /**
     * Plays positive reinforcement fanfare (therapy success).
     */
    playSuccess() {
        iosAudioUnlock.ensureUnlockedAndResumed();
        toneEngine.playSuccessFanfare();
    }
    /**
     * Plays alert tone for warning or emergency escalation.
     */
    playAlert() {
        iosAudioUnlock.ensureUnlockedAndResumed();
        toneEngine.playAlertTone();
    }
    /**
     * Plays error tone for PIN entry errors.
     */
    playError() {
        iosAudioUnlock.ensureUnlockedAndResumed();
        toneEngine.playErrorBuzz();
    }
    /**
     * Stops all active audio outputs (speech synthesis, recorded audio, etc.).
     */
    stopAll() {
        speechEngine.cancel();
        recordedAudioEngine.stop();
    }
    /**
     * Speaks or plays recorded audio for an AAC card or phrase.
     * If `audioBlobId` is present, retrieves recorded voice clip from database;
     * otherwise speaks text via Web Speech API.
     */
    async speakCardOrText(text, audioBlobId, options) {
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
            }
            catch {
                // Fallback to speech synthesis if DB retrieval fails
            }
        }
        await speechEngine.speak(text, options);
    }
    /**
     * Urgent emergency speech with alert chime and immediate interruption.
     */
    async triggerEmergency(phrase, speechRate = 0.9) {
        this.stopAll();
        iosAudioUnlock.ensureUnlockedAndResumed();
        this.playAlert();
        // Short 120ms pause to let alert tone lead, then speak phrase
        await new Promise(r => setTimeout(r, 120));
        await speechEngine.speak(phrase, { rate: speechRate, pitch: 1.1 });
    }
}
export const audioService = new AudioService();
