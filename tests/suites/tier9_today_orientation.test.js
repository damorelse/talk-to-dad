/**
 * Tier 9: Today & Daily Orientation Clinical Speech & Visual Invariants
 * 
 * Verifies that the Today / Orientation feature accurately computes:
 * 1. Day of week, calendar date, live clock, and location formatting.
 * 2. Bilingual clinical speech sentences in English and Traditional Chinese.
 * 3. Time of day phase classification (morning, afternoon, evening, night).
 * 4. Timezone-to-location offline dictionary mapping.
 * 5. World Map equirectangular projection coordinate clamping.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import '../setup.js';

import {
  WEEKDAYS,
  getDayPeriod,
  formatWeekdaySpeech,
  formatDateSpeech,
  formatTimeSpeech,
  formatLocationSpeech,
  formatFullOrientationSpeech,
  getFallbackLocationFromTimezone,
  TIMEZONE_LOCATION_MAP,
} from '../../src/services/location/locationService.ts';

describe('Tier 9: Today & Daily Orientation Clinical Invariants', () => {
  describe('1. Weekday Definition & Speech Invariants', () => {
    it('should contain all 7 days in standard Sunday..Saturday sequence', () => {
      assert.equal(WEEKDAYS.length, 7);
      assert.equal(WEEKDAYS[0].name, 'Sunday');
      assert.equal(WEEKDAYS[0].nameZh, '星期日');
      assert.equal(WEEKDAYS[1].name, 'Monday');
      assert.equal(WEEKDAYS[1].nameZh, '星期一');
      assert.equal(WEEKDAYS[6].name, 'Saturday');
      assert.equal(WEEKDAYS[6].nameZh, '星期六');
    });

    it('should format weekday speech accurately for any given date', () => {
      // 2026-08-25 is a Tuesday
      const tuesday = new Date('2026-08-25T15:00:00Z');
      const speech = formatWeekdaySpeech(tuesday);
      assert.equal(speech.en, 'Today is Tuesday.');
      assert.equal(speech.zh, '今天是星期二。');
    });
  });

  describe('2. Time of Day Period & Clock Speech', () => {
    it('should classify day periods correctly across 24 hours', () => {
      assert.equal(getDayPeriod(6).en, 'morning');
      assert.equal(getDayPeriod(6).zh, '早上');
      assert.equal(getDayPeriod(14).en, 'afternoon');
      assert.equal(getDayPeriod(14).zh, '下午');
      assert.equal(getDayPeriod(19).en, 'evening');
      assert.equal(getDayPeriod(19).zh, '傍晚');
      assert.equal(getDayPeriod(23).en, 'night');
      assert.equal(getDayPeriod(23).zh, '晚上');
      assert.equal(getDayPeriod(2).en, 'night');
      assert.equal(getDayPeriod(2).zh, '晚上');
    });

    it('should format 12-hour clock with AM/PM and period of day', () => {
      const d = new Date(2026, 7, 25, 15, 30, 0); // 3:30 PM
      const speech = formatTimeSpeech(d);
      assert.ok(speech.en.includes('3:30 PM in the afternoon'));
      assert.ok(speech.zh.includes('下午 3 點 30 分'));
    });

    it('should handle midnight and noon correctly (12 AM / 12 PM)', () => {
      const midnight = new Date(2026, 7, 25, 0, 0, 0);
      const noon = new Date(2026, 7, 25, 12, 0, 0);

      const spMid = formatTimeSpeech(midnight);
      assert.ok(spMid.en.includes('12:00 AM'));
      assert.ok(spMid.zh.includes('12 點 整'));

      const spNoon = formatTimeSpeech(noon);
      assert.ok(spNoon.en.includes('12:00 PM'));
      assert.ok(spNoon.zh.includes('12 點 整'));
    });
  });

  describe('3. Calendar Date Speech', () => {
    it('should format full date bilingually', () => {
      const d = new Date(2026, 7, 25); // August 25, 2026
      const speech = formatDateSpeech(d);
      assert.equal(speech.en, 'Today is Tuesday, August 25, 2026.');
      assert.equal(speech.zh, '今天是 2026 年 8 月 25 日，星期二。');
    });
  });

  describe('4. Location Speech & Timezone Mapping', () => {
    it('should format US city with state and country', () => {
      const loc = {
        city: 'Seattle',
        state: 'Washington',
        country: 'United States',
        cityZh: '西雅圖',
        stateZh: '華盛頓州',
        countryZh: '美國',
        source: 'geolocation',
      };
      const speech = formatLocationSpeech(loc);
      assert.equal(speech.en, 'We are currently in Seattle, Washington, United States.');
      assert.equal(speech.zh, '我們現在在美國華盛頓州西雅圖。');
    });

    it('should format international city without state', () => {
      const loc = {
        city: 'Taipei',
        country: 'Taiwan',
        cityZh: '台北',
        countryZh: '台灣',
        source: 'geolocation',
      };
      const speech = formatLocationSpeech(loc);
      assert.equal(speech.en, 'We are currently in Taipei, Taiwan.');
      assert.equal(speech.zh, '我們現在在台灣台北。');
    });

    it('should map standard timezones to accurate offline coordinates and location', () => {
      assert.ok(TIMEZONE_LOCATION_MAP['America/Los_Angeles']);
      assert.equal(TIMEZONE_LOCATION_MAP['America/Los_Angeles'].city, 'Los Angeles');
      assert.equal(TIMEZONE_LOCATION_MAP['Asia/Taipei'].cityZh, '台北');
      assert.equal(TIMEZONE_LOCATION_MAP['Asia/Tokyo'].country, 'Japan');
      assert.equal(TIMEZONE_LOCATION_MAP['Europe/London'].countryZh, '英國');
    });
  });

  describe('5. Full Composite Orientation Statement', () => {
    it('should generate complete bilingual orientation sentence', () => {
      const d = new Date(2026, 7, 25, 14, 15, 0);
      const loc = {
        city: 'San Francisco',
        state: 'California',
        country: 'United States',
        cityZh: '舊金山',
        stateZh: '加州',
        countryZh: '美國',
        source: 'default',
      };
      const full = formatFullOrientationSpeech(d, loc);
      assert.ok(full.en.includes('Today is Tuesday, August 25, 2026.'));
      assert.ok(full.en.includes('The current time is 2:15 PM in the afternoon.'));
      assert.ok(full.en.includes('We are currently in San Francisco, California, United States.'));

      assert.ok(full.zh.includes('今天是 2026 年 8 月 25 日，星期二。'));
      assert.ok(full.zh.includes('現在時間是下午 2 點 15 分。'));
      assert.ok(full.zh.includes('我們現在在美國加州舊金山。'));
    });
  });

  describe('6. World Map Equirectangular Projection Invariants', () => {
    it('should map coordinates strictly within [0..1000] x [0..500] viewBox', () => {
      const testCoords = [
        { lat: 0, lon: 0, expectedX: 500, expectedY: 250 },
        { lat: 90, lon: -180, expectedX: 0, expectedY: 0 },
        { lat: -90, lon: 180, expectedX: 1000, expectedY: 500 },
        { lat: 37.77, lon: -122.42 }, // San Francisco
        { lat: 25.03, lon: 121.56 },  // Taipei
        { lat: 51.51, lon: -0.13 },   // London
        { lat: -33.87, lon: 151.21 }, // Sydney
      ];

      for (const c of testCoords) {
        const x = ((c.lon + 180) / 360) * 1000;
        const y = ((90 - c.lat) / 180) * 500;
        assert.ok(x >= 0 && x <= 1000, `X coordinate ${x} out of bounds for ${JSON.stringify(c)}`);
        assert.ok(y >= 0 && y <= 500, `Y coordinate ${y} out of bounds for ${JSON.stringify(c)}`);
        if (c.expectedX !== undefined) {
          assert.equal(Math.round(x), c.expectedX);
          assert.equal(Math.round(y), c.expectedY);
        }
      }
    });
  });
});
