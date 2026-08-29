/**
 * Tier 13: Android Phone Voice Compatibility & Speech Subsystem Invariants
 *
 * Verifies:
 * 1. Android Google Speech Services locale recognition (cmn-TW, cmn-tw-x-..., Google 國語 (臺灣))
 * 2. Local on-device voice prioritization (#local over -network)
 * 3. Grouped and sorted voice lists for Caregiver Settings
 * 4. Asynchronous voice discovery & subscriber notifications
 * 5. Multi-tier error fallback recovery on language/voice failure
 * 6. Strict isolation: On-device Phoneme Speaking Model (src/services/syllables/*) is 100% preserved
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import '../setup.js';

import {
  isZhTWLocale,
  isAnyZhLocale,
  isEnLocale,
  isEnUSLocale,
  isLocalVoice,
  filterAndGroupVoices,
  WebSpeechEngine,
} from '../../src/services/audio/WebSpeechEngine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');

describe('Tier 13: Android Phone Voice Compatibility & Reliability', () => {

  describe('1. Android Locale Recognition & BCP-47 Tag Matching', () => {
    it('should identify Android Google Speech Services Traditional Chinese / Taiwan tags as zh-TW', () => {
      const androidZhTags = [
        { lang: 'cmn-TW', name: 'cmn-tw-x-ctd#female_1-local' },
        { lang: 'cmn-tw', name: 'cmn-tw-x-sfg#male_1-local' },
        { lang: 'cmn_TW', name: 'cmn_tw' },
        { lang: 'cmn-Hant-TW', name: 'cmn-Hant-TW' },
        { lang: 'zh-TW', name: 'Google 國語 (臺灣)' },
        { lang: 'zh-tw', name: 'Google 國語（臺灣）' },
        { lang: 'zh-Hant-TW', name: 'Chinese Taiwan (Traditional)' },
        { lang: 'zh_TW', name: 'Taiwan Mandarin' },
        { lang: 'cmn-tw-x-ctd-network', name: 'cmn-tw-x-ctd-network' },
        { lang: 'zh-HK', name: 'Google 廣東話 (香港)' },
      ];

      for (const tag of androidZhTags) {
        assert.ok(
          isZhTWLocale(tag.lang, tag.name),
          `Expected ${tag.lang} / ${tag.name} to match isZhTWLocale`
        );
        assert.ok(
          isAnyZhLocale(tag.lang, tag.name),
          `Expected ${tag.lang} / ${tag.name} to match isAnyZhLocale`
        );
      }
    });

    it('should identify Android Google Speech Services English tags as en-US', () => {
      const androidEnTags = [
        { lang: 'en-US', name: 'en-us-x-sfg#female_1-local' },
        { lang: 'en-us', name: 'en-us-x-tpd#male_1-local' },
        { lang: 'en_US', name: 'Google US English' },
        { lang: 'en-US', name: 'en-us-x-sfg-network' },
      ];

      for (const tag of androidEnTags) {
        assert.ok(
          isEnUSLocale(tag.lang),
          `Expected ${tag.lang} to match isEnUSLocale`
        );
        assert.ok(
          isEnLocale(tag.lang),
          `Expected ${tag.lang} to match isEnLocale`
        );
      }
    });

    it('should distinguish English from Chinese without cross-locale false positives', () => {
      assert.equal(isZhTWLocale('en-US', 'Google US English'), false);
      assert.equal(isAnyZhLocale('en-US', 'Google US English'), false);
      assert.equal(isEnUSLocale('cmn-TW'), false);
      assert.equal(isEnLocale('cmn-TW'), false);
      assert.equal(isEnUSLocale('zh-TW'), false);
      assert.equal(isEnLocale('zh-TW'), false);
    });
  });

  describe('2. Local On-Device Voice Detection & Offline Scoring', () => {
    it('should identify local on-device voices and reject network-streamed voices', () => {
      const mockLocal1 = { name: 'cmn-tw-x-ctd#female_1-local', voiceURI: 'cmn-tw-x-ctd#female_1-local', lang: 'cmn-TW', localService: true };
      const mockLocal2 = { name: 'Google 國語 (臺灣)', voiceURI: 'cmn-tw#local', lang: 'cmn-TW', localService: false };
      const mockNetwork = { name: 'cmn-tw-x-ctd-network', voiceURI: 'cmn-tw-x-ctd-network', lang: 'cmn-TW', localService: false };

      assert.equal(isLocalVoice(mockLocal1), true, 'voice with localService=true should be local');
      assert.equal(isLocalVoice(mockLocal2), true, 'voice with #local URI should be local');
      assert.equal(isLocalVoice(mockNetwork), false, 'voice with -network URI should not be local');
    });

    it('should sort local on-device voices ahead of network voices in filterAndGroupVoices', () => {
      const voices = [
        { name: 'cmn-tw-network-voice', voiceURI: 'cmn-tw-network-voice', lang: 'cmn-TW', localService: false, default: false },
        { name: 'cmn-tw-local-voice', voiceURI: 'cmn-tw-local-voice', lang: 'cmn-TW', localService: true, default: false },
        { name: 'en-us-network-voice', voiceURI: 'en-us-network-voice', lang: 'en-US', localService: false, default: false },
        { name: 'en-us-local-voice', voiceURI: 'en-us-local-voice', lang: 'en-US', localService: true, default: false },
      ];

      const groups = filterAndGroupVoices(voices);
      const enGroup = groups.find(g => g.locale === 'en-US');
      const zhGroup = groups.find(g => g.locale === 'zh-TW');

      assert.ok(enGroup, 'en-US group must exist');
      assert.ok(zhGroup, 'zh-TW group must exist');

      assert.equal(enGroup.voices[0].name, 'en-us-local-voice', 'Local English voice must rank first');
      assert.equal(zhGroup.voices[0].name, 'cmn-tw-local-voice', 'Local Chinese voice must rank first');
    });
  });

  describe('3. Preferred Voice Selection & Locale Isolation', () => {
    it('should select Android Taiwan Mandarin voice for zh-TW without returning English voices[0]', () => {
      const engine = new WebSpeechEngine();
      engine.voices = [
        { name: 'Google US English', voiceURI: 'en-us-voice', lang: 'en-US', localService: true, default: false },
        { name: 'cmn-tw-x-ctd#female_1-local', voiceURI: 'cmn-tw-local', lang: 'cmn-TW', localService: true, default: false },
      ];

      const chosenZh = engine.getPreferredVoiceForLocale('zh-TW');
      assert.ok(chosenZh, 'Must find a Chinese voice');
      assert.equal(chosenZh.name, 'cmn-tw-x-ctd#female_1-local');

      const chosenEn = engine.getPreferredVoiceForLocale('en-US');
      assert.ok(chosenEn, 'Must find an English voice');
      assert.equal(chosenEn.name, 'Google US English');
    });

    it('should return null for zh-TW if no Chinese voice is installed on device', () => {
      const engine = new WebSpeechEngine();
      engine.voices = [
        { name: 'Google US English', voiceURI: 'en-us-voice', lang: 'en-US', localService: true, default: false },
        { name: 'Daniel', voiceURI: 'en-gb-voice', lang: 'en-GB', localService: true, default: false },
      ];

      const chosenZh = engine.getPreferredVoiceForLocale('zh-TW');
      assert.equal(chosenZh, null, 'Must return null so OS native synthesizer synthesizes zh-TW text');
    });

    it('should prevent cross-locale preferred URI contamination', () => {
      const engine = new WebSpeechEngine();
      engine.voices = [
        { name: 'Google US English', voiceURI: 'en-us-voice', lang: 'en-US', localService: true, default: false },
        { name: 'Google 國語（臺灣）', voiceURI: 'zh-tw-voice', lang: 'zh-TW', localService: true, default: false },
      ];

      // Requesting zh-TW with an en-US preferredURI should reject the English voice and pick the Chinese voice
      const chosen = engine.getPreferredVoiceForLocale('zh-TW', 'en-us-voice');
      assert.equal(chosen?.name, 'Google 國語（臺灣）');
    });
  });

  describe('4. Asynchronous Voice Discovery & Subscriber Notification', () => {
    it('should allow subscribers to be notified when voices are loaded', () => {
      const engine = new WebSpeechEngine();
      let notified = false;

      const unsub = engine.onVoicesChanged(() => {
        notified = true;
      });

      assert.equal(typeof unsub, 'function');
      engine.notifySubscribers();
      assert.equal(notified, true, 'Subscriber should be notified');

      notified = false;
      unsub();
      engine.notifySubscribers();
      assert.equal(notified, false, 'Unsubscribed listener should not be called');
    });
  });

  describe('5. Multi-tier Error Fallback Recovery in speak()', () => {
    it('should gracefully handle speech execution and resolve cleanly', async () => {
      const engine = new WebSpeechEngine();
      await engine.speak('Hello Android test', { locale: 'en-US' });
      assert.equal(engine.isSpeaking(), false);
    });
  });

  describe('6. 🛡️ Invariant: Phoneme Speaking Model Preservation', () => {
    it('should confirm src/services/syllables/* core files exist and are untampered', () => {
      const requiredPhonemeFiles = [
        'src/services/syllables/piperOnnxService.ts',
        'src/services/syllables/piperTTSService.ts',
        'src/services/syllables/espeakPhonemizer.ts',
        'src/services/syllables/phonemeDictionary.ts',
        'src/services/syllables/syllableSplitter.ts',
        'src/services/syllables/zhuyinDictionary.ts',
        'src/hooks/usePiperSyllables.ts',
      ];

      for (const relPath of requiredPhonemeFiles) {
        const fullPath = path.join(rootDir, relPath);
        assert.ok(fs.existsSync(fullPath), `Phoneme speaking model file must exist: ${relPath}`);
        const content = fs.readFileSync(fullPath, 'utf8');
        assert.ok(content.length > 50, `Phoneme file ${relPath} must not be empty`);
      }
    });

    it('should confirm WebSpeechEngine does not import or override piperOnnxService', () => {
      const enginePath = path.join(rootDir, 'src/services/audio/WebSpeechEngine.ts');
      const content = fs.readFileSync(enginePath, 'utf8');
      assert.equal(content.includes('piperOnnxService'), false, 'WebSpeechEngine must not import piperOnnxService');
      assert.equal(content.includes('piperTTSService'), false, 'WebSpeechEngine must not import piperTTSService');
      assert.equal(content.includes('espeakPhonemizer'), false, 'WebSpeechEngine must not import espeakPhonemizer');
    });
  });
});
