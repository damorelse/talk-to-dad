# TalkWithDad AAC Project Rules & Guidelines

## Bilingual Label Hierarchy & Ordering

Whenever a UI component, Visual Scene Display hotspot, AAC card, Daily Postcard, navigation tab, or action button displays both English and Traditional Chinese text:

1. **English First Invariant**: English text MUST ALWAYS come first before Chinese text.
2. **Inline / Side-by-Side Labels**:
   - Format: `English (中文)` or `English · 中文`
   - Example: `Pet Quorra (摸摸 Quorra 🐕)` or `Pet Quorra · 摸摸 Quorra 🐕`
   - Never place Chinese before English (avoid `摸摸 Quorra 🐕 (Pet Quorra)`).
3. **Stacked / Multiline Badges & Cards**:
   - The primary top line must contain the English text (`label` / English title).
   - The secondary sub-line below must contain the Traditional Chinese text (`labelZh` / Chinese translation).

## Web Speech API & Audio Engine Guidelines

When modifying or calling speech synthesis (`WebSpeechEngine.ts`), Web Audio tone synthesis (`WebAudioToneEngine.ts`), or audio touch unlock utilities (`iOSAudioUnlock.ts`):

1. **No Empty Utterances for Priming**:
   - Never call `speechSynthesis.speak(new SpeechSynthesisUtterance(''))` to unlock audio. Chromium leaves empty utterances in `pending = true` indefinitely, deadlocking all subsequent speech calls.
   - Use the 1-sample silent Web Audio buffer and `speechSynthesis.resume()` for gesture unlocking.

2. **Asynchronous Cancellation IPC Yield**:
   - Never synchronously invoke `speechSynthesis.cancel()` immediately followed by `speechSynthesis.speak()` in the same event-loop tick.
   - Yield an asynchronous settling delay (~60ms) after `cancel()` so Chromium's IPC message flushes before the new utterance is queued.

3. **Utterance Garbage Collection Retention**:
   - Always retain active `SpeechSynthesisUtterance` instances in a class-level `Set<SpeechSynthesisUtterance>` until playback completes, preventing V8 from garbage-collecting utterances mid-speech.

4. **Locale-Strict Voice Matching & Fallbacks**:
   - Never assign an English voice (`en-US`) to a Chinese (`zh-TW`) utterance.
   - When no local voice is found for a locale (e.g. `zh-TW` on Linux), return `null` so `utterance.lang = targetLocale` enables the browser's native cloud/multilingual TTS backend.
   - Keep `selectedVoiceEnUS` and `selectedVoiceZhTW` isolated in settings without cross-polluting across languages.

5. **Unified `AudioContext` Singleton**:
   - Share a single singleton `AudioContext` across all tone engines and unlock utilities.
   - Verify `ctx.state === 'running'` before scheduling Web Audio oscillators.
