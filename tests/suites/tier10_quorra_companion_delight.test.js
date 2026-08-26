/**
 * Tier 10: Quorra Companion & Emotional Delight Test Suite
 * 
 * Verifies Quorra's dynamic time-of-day companion poses, 28-permutation bilingual
 * daily postcard cheer messages (7 weekdays x 4 time periods), WebAudio petting
 * tone synthesis, and visual scene petting response invariants.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import '../setup.js';

import {
  getQuorraPeriod,
  getQuorraCouchPose,
  getQuorraDailyGreeting,
} from '../../src/services/quorra/quorraMessages.ts';
import { toneEngine } from '../../src/services/audio/WebAudioToneEngine.ts';
import { audioService } from '../../src/services/audio/AudioService.ts';
import { DEFAULT_HOTSPOTS } from '../../src/services/db/defaultData.ts';

describe('Tier 10: Quorra Companion & Emotional Delight Invariants', () => {

  describe('1. Diurnal Period & Time-of-Day Resolution', () => {
    it('should map hours 5..11 to morning', () => {
      for (let h = 5; h < 12; h++) {
        assert.equal(getQuorraPeriod(h), 'morning', `Hour ${h} should be morning`);
      }
    });

    it('should map hours 12..16 to afternoon', () => {
      for (let h = 12; h < 17; h++) {
        assert.equal(getQuorraPeriod(h), 'afternoon', `Hour ${h} should be afternoon`);
      }
    });

    it('should map hours 17..20 to evening', () => {
      for (let h = 17; h < 21; h++) {
        assert.equal(getQuorraPeriod(h), 'evening', `Hour ${h} should be evening`);
      }
    });

    it('should map hours 21..23 and 0..4 to night', () => {
      const nightHours = [21, 22, 23, 0, 1, 2, 3, 4];
      for (const h of nightHours) {
        assert.equal(getQuorraPeriod(h), 'night', `Hour ${h} should be night`);
      }
    });
  });

  describe('2. Dynamic Living Room Couch Pose Selection', () => {
    it('should assign morning-sun pose between 05:00 and 11:59', () => {
      const morningDate = new Date(2026, 7, 26, 9, 30); // 9:30 AM
      assert.equal(getQuorraCouchPose(morningDate), 'morning-sun');
    });

    it('should assign afternoon-nap pose between 12:00 and 17:59', () => {
      const afternoonDate = new Date(2026, 7, 26, 14, 15); // 2:15 PM
      assert.equal(getQuorraCouchPose(afternoonDate), 'afternoon-nap');
    });

    it('should assign evening-blanket pose at night and early morning', () => {
      const eveningDate = new Date(2026, 7, 26, 20, 0); // 8:00 PM
      const nightDate = new Date(2026, 7, 26, 23, 45); // 11:45 PM
      const earlyAmDate = new Date(2026, 7, 26, 3, 30); // 3:30 AM

      assert.equal(getQuorraCouchPose(eveningDate), 'evening-blanket');
      assert.equal(getQuorraCouchPose(nightDate), 'evening-blanket');
      assert.equal(getQuorraCouchPose(earlyAmDate), 'evening-blanket');
    });
  });

  describe('3. Exhaustive 28-Permutation Daily Postcard Message Invariant', () => {
    const testHours = [8, 14, 18, 22]; // Morning, Afternoon, Evening, Night
    const expectedWeekdaysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const expectedWeekdaysZh = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

    it('should generate valid, rich bilingual greetings for all 7 weekdays x 4 day periods (28 cases)', () => {
      let count = 0;

      // Sweep all 7 weekdays: Aug 23, 2026 is Sunday (day 0) through Aug 29, 2026 (Saturday)
      for (let day = 0; day < 7; day++) {
        for (const hour of testHours) {
          count++;
          const testDate = new Date(2026, 7, 23 + day, hour, 15);
          const greeting = getQuorraDailyGreeting(testDate);

          // Weekday integrity
          assert.equal(greeting.weekdayIndex, day);
          assert.equal(greeting.weekdayName, expectedWeekdaysEn[day]);
          assert.equal(greeting.weekdayNameZh, expectedWeekdaysZh[day]);

          // Bilingual text presence
          assert.ok(greeting.messageEn.length > 20, `messageEn should be rich: ${greeting.messageEn}`);
          assert.ok(greeting.messageZh.length > 10, `messageZh should be rich: ${greeting.messageZh}`);
          assert.ok(greeting.spokenEn.includes(expectedWeekdaysEn[day]), `spokenEn should contain weekday: ${greeting.spokenEn}`);
          assert.ok(greeting.spokenZh.includes(expectedWeekdaysZh[day]), `spokenZh should contain weekday: ${greeting.spokenZh}`);

          // Postcard metadata
          assert.ok(greeting.titleEn.includes('Quorra'));
          assert.ok(greeting.titleZh.includes('Quorra'));
          assert.ok(greeting.moodEmoji.length > 0);
          assert.ok(greeting.stampLabel.length > 0);
        }
      }

      assert.equal(count, 28, 'Must verify exactly 28 unique combinations');
    });
  });

  describe('4. Audio Engine Petting Chime Invariants', () => {
    it('should expose playQuorraPetTone on toneEngine without runtime exceptions', () => {
      assert.equal(typeof toneEngine.playQuorraPetTone, 'function');
      assert.doesNotThrow(() => {
        toneEngine.playQuorraPetTone();
      });
    });

    it('should expose playQuorraPetTone on audioService and execute cleanly', () => {
      assert.equal(typeof audioService.playQuorraPetTone, 'function');
      assert.doesNotThrow(() => {
        audioService.playQuorraPetTone();
      });
    });
  });

  describe('5. Default Living Room Hotspots & Petting Hotspot Integrity', () => {
    it('should contain Quorra hotspot in Living Room scene', () => {
      const quorraHotspot = DEFAULT_HOTSPOTS.find((hs) => hs.id === 'hs-pet-quorra');
      assert.ok(quorraHotspot, 'hs-pet-quorra must exist in default hotspots');
      assert.equal(quorraHotspot.sceneId, 'scene-livingroom');
      assert.equal(quorraHotspot.label, 'Quorra');
      assert.equal(quorraHotspot.labelZh, '狗兒 Quorra 🐕');
      assert.ok(quorraHotspot.spokenText.length > 0);
      assert.ok(quorraHotspot.spokenTextZh.length > 0);
    });

    it('should maintain spatial separation between Couch and Pet Quorra hotspots', () => {
      const couch = DEFAULT_HOTSPOTS.find((hs) => hs.id === 'hs-chair' && hs.sceneId === 'scene-livingroom');
      const quorra = DEFAULT_HOTSPOTS.find((hs) => hs.id === 'hs-pet-quorra' && hs.sceneId === 'scene-livingroom');
      assert.ok(couch && quorra, 'Both couch and quorra hotspots must exist');
      
      // Couch hotspot sits in top backrest area (y + height <= quorra.y + 1)
      assert.ok(
        couch.y + couch.height <= quorra.y + 2,
        `Couch bottom (${couch.y + couch.height}) must not overlap Quorra top (${quorra.y})`
      );
    });
  });
});
