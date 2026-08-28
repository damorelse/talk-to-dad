/**
 * Tier 7: Google Sheets & Sound It Out Pulling & Import Test Suite
 * Comprehensive verification of Google Sheets URL parsing, live CSV fetching,
 * Cards parsing, Sound It Out practice words segmentation, category mapping,
 * and database integration.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import '../setup.js';

import { googleSheetsService } from '../../src/services/googleSheets/googleSheetsService.ts';
import { BackupService } from '../../src/services/db/backupService.ts';
import { DEFAULT_CATEGORIES } from '../../src/services/db/defaultData.ts';

describe('Tier 7: Google Sheets Pull & Sound It Out Synchronization', () => {

  describe('1. Google Sheets URL & Endpoint Parsing', () => {
    it('should parse standard Google Sheets edit URL and extract spreadsheetId & gid', () => {
      const url = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=12345';
      const parsed = googleSheetsService.parseGoogleSheetUrl(url);

      assert.equal(parsed.spreadsheetId, '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
      assert.equal(parsed.gid, '12345');
      assert.equal(parsed.isPublished, false);
      assert.ok(parsed.csvExportUrl.includes('export?format=csv&gid=12345'));
    });

    it('should construct Gviz URL with sheet tab name when specified', () => {
      const url = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit';
      const parsed = googleSheetsService.parseGoogleSheetUrl(url, 'SoundItOut');

      assert.equal(parsed.spreadsheetId, '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
      assert.equal(parsed.sheetName, 'SoundItOut');
      assert.ok(parsed.csvExportUrl.includes('sheet=SoundItOut'));
      assert.ok(parsed.gvizUrl.includes('gviz/tq?tqx=out:csv&sheet=SoundItOut'));
    });

    it('should parse Google Sheets Publish-to-Web URLs (pubhtml / pub?output=csv)', () => {
      const pubUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1234567890abcdef/pubhtml?gid=9876&single=true';
      const parsed = googleSheetsService.parseGoogleSheetUrl(pubUrl);

      assert.equal(parsed.spreadsheetId, '2PACX-1vT1234567890abcdef');
      assert.equal(parsed.isPublished, true);
      assert.equal(parsed.gid, '9876');
      assert.ok(parsed.csvExportUrl.includes('/pub?output=csv&gid=9876'));
    });

    it('should handle raw spreadsheet IDs gracefully', () => {
      const rawId = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
      const parsed = googleSheetsService.parseGoogleSheetUrl(rawId);

      assert.equal(parsed.spreadsheetId, rawId);
      assert.ok(parsed.csvExportUrl.includes(`/${rawId}/export?format=csv`));
    });
  });

  describe('2. RFC 4180 CSV / TSV Parsing Engine', () => {
    it('should parse quoted fields containing commas and whitespace', () => {
      const csv = 'Label,Spoken Text,Role\n"Green Tea, hot","Please give me some hot, fresh green tea",nouns\nWater,I want water,nouns';
      const { headers, rows } = googleSheetsService.parseCsvOrTsv(csv);

      assert.equal(headers.length, 3);
      assert.equal(rows.length, 2);
      assert.equal(rows[0][0], 'Green Tea, hot');
      assert.equal(rows[0][1], 'Please give me some hot, fresh green tea');
      assert.equal(rows[1][0], 'Water');
    });

    it('should handle escaped double quotes ("") correctly', () => {
      const csv = 'Label,Spoken Text\n"The ""Special"" Book","I would like my special reading book"';
      const { rows } = googleSheetsService.parseCsvOrTsv(csv);

      assert.equal(rows[0][0], 'The "Special" Book');
      assert.equal(rows[0][1], 'I would like my special reading book');
    });

    it('should parse tab-separated values (TSV) copied directly from Google Sheets clipboard', () => {
      const tsv = 'Label\tSpoken Text\tRole\tEmoji\tSyllables\n' +
                  'Coffee\tI want coffee\tnouns\t☕\tCof · fee\n' +
                  'Walk\tTake a walk\tverbs\t🚶\tWalk';
      const { headers, rows } = googleSheetsService.parseCsvOrTsv(tsv);

      assert.equal(headers.length, 5);
      assert.equal(rows.length, 2);
      assert.equal(rows[0][0], 'Coffee');
      assert.equal(rows[0][3], '☕');
      assert.equal(rows[1][0], 'Walk');
    });

    it('should strip UTF-8 BOM and skip blank lines', () => {
      const bomCsv = '\uFEFFLabel,Spoken Text\n\nApple,I want an apple\n\n\nBanana,I want a banana\n';
      const { headers, rows } = googleSheetsService.parseCsvOrTsv(bomCsv);

      assert.equal(headers[0], 'Label');
      assert.equal(rows.length, 2);
    });
  });

  describe('3. AAC Cards Parsing & Category Mapping', () => {
    it('should map Fitzgerald Key roles and role aliases accurately', () => {
      const csv = 'Label,Spoken Text,Role,Emoji,Syllables\n' +
                  'Doctor,I need a doctor,urgent,👨‍⚕️,Doc · tor\n' +
                  'Hungry,I am feeling hungry,feeling,🍽️,Hun · gry\n' +
                  'Grandpa,Grandpa is here,who,👴,Grand · pa\n' +
                  'Run,Run in park,action,🏃,Run';

      const res = googleSheetsService.parseSheetData(csv, {
        categories: DEFAULT_CATEGORIES,
        targetType: 'cards',
      });

      assert.equal(res.cards.length, 4);
      assert.equal(res.cards[0].fitzgeraldCategory, 'emergency'); // 'urgent' alias -> emergency
      assert.equal(res.cards[1].fitzgeraldCategory, 'adjectives'); // 'feeling' alias -> adjectives
      assert.equal(res.cards[2].fitzgeraldCategory, 'people'); // 'who' alias -> people
      assert.equal(res.cards[3].fitzgeraldCategory, 'verbs'); // 'action' alias -> verbs
    });

    it('should match category names against existing clinical categories', () => {
      const csv = 'Label,Spoken Text,Role,Emoji,Syllables,Category\n' +
                  'Apple Juice,Drink apple juice,nouns,🧃,Ap · ple · juice,Food & Drink\n' +
                  'Take Medicine,Take pills,verbs,💊,Med · i · cine,Health\n' +
                  'Living Room,Go to living room,places,🛋️,Liv · ing · room,Places';

      const res = googleSheetsService.parseSheetData(csv, {
        categories: DEFAULT_CATEGORIES,
        targetType: 'cards',
      });

      assert.equal(res.cards.length, 3);
      assert.equal(res.cards[0].categoryId, 'cat-food');
      assert.equal(res.cards[1].categoryId, 'cat-health');
      assert.equal(res.cards[2].categoryId, 'cat-places');
    });

    it('should parse Traditional Chinese labels and spoken text with automatic character detection', () => {
      const csv = 'Label,Spoken Text,Role,Emoji,Syllables,Category,Label ZH,Spoken ZH\n' +
                  'Warm Tea,I would like warm tea,nouns,🍵,Warm · tea,Food & Drink,溫茶,我想喝一杯溫茶。\n' +
                  '散步,我想去外面散步,verbs,🚶,散 · 步,休閒活動,,';

      const res = googleSheetsService.parseSheetData(csv, {
        categories: DEFAULT_CATEGORIES,
        targetType: 'cards',
      });

      assert.equal(res.cards.length, 2);
      assert.equal(res.cards[0].labelZh, '溫茶');
      assert.equal(res.cards[0].spokenTextZh, '我想喝一杯溫茶。');
      
      // Auto-detected Chinese label
      assert.equal(res.cards[1].labelZh, '散步');
      assert.equal(res.cards[1].spokenTextZh, '我想去外面散步');
    });

    it('should automatically generate phonetic syllables if omitted in cards', () => {
      const csv = 'Label,Spoken Text,Role\n' +
                  'Hospital,I need to go to the hospital,emergency\n' +
                  'Butterfly,Look at the butterfly,nouns';

      const res = googleSheetsService.parseSheetData(csv, {
        categories: DEFAULT_CATEGORIES,
        targetType: 'cards',
      });

      assert.equal(res.cards.length, 2);
      assert.ok(res.cards[0].phoneticSyllables.includes('·') || res.cards[0].phoneticSyllables.includes('Hos'));
      assert.ok(res.cards[1].phoneticSyllables.includes('·') || res.cards[1].phoneticSyllables.includes('But'));
    });
  });

  describe('4. Database & BackupService Roundtrip with AAC Cards', () => {
    it('should export and restore cards in full backup package', async () => {
      const testStore = {
        categories: [{ id: 'cat-test', name: 'Test', icon: 'Star', color: '#ff0', order: 1 }],
        cards: [
          { id: 'card-1', categoryId: 'cat-test', label: 'Tea', spokenText: 'Tea', fitzgeraldCategory: 'nouns', order: 1, createdAt: 1, updatedAt: 1 },
          { id: 'card-2', categoryId: 'cat-test', label: 'Water', spokenText: 'Water', fitzgeraldCategory: 'nouns', order: 2, createdAt: 1, updatedAt: 1 },
        ],
        visualScenes: [],
        hotspots: [],
        therapyDecks: [],
        therapyCards: [],
        settings: { id: 'current', theme: 'dark' },
        mediaBlobs: [],
      };

      const mockDb = {
        categories: { toArray: async () => testStore.categories, clear: async () => {}, bulkAdd: async (i) => { testStore.categories = i; } },
        cards: { toArray: async () => testStore.cards, clear: async () => {}, bulkAdd: async (i) => { testStore.cards = i; } },
        visualScenes: { toArray: async () => testStore.visualScenes, clear: async () => {}, bulkAdd: async () => {} },
        hotspots: { toArray: async () => testStore.hotspots, clear: async () => {}, bulkAdd: async () => {} },
        therapyDecks: { toArray: async () => testStore.therapyDecks, clear: async () => {}, bulkAdd: async () => {} },
        therapyCards: { toArray: async () => testStore.therapyCards, clear: async () => {}, bulkAdd: async () => {} },
        settings: { get: async () => testStore.settings, clear: async () => {}, put: async (s) => { testStore.settings = s; } },
        mediaBlobs: { toArray: async () => testStore.mediaBlobs, clear: async () => {}, bulkAdd: async () => {} },
        transaction: async (mode, tables, fn) => fn(),
      };

      const svc = new BackupService(mockDb);

      // Export Data
      const pkg = await svc.exportData();
      assert.equal(pkg.cards.length, 2);
      assert.equal(pkg.cards[0].label, 'Tea');
      assert.equal(pkg.cards[1].label, 'Water');

      // Import JSON roundtrip
      const jsonStr = JSON.stringify(pkg);
      const res = await svc.importFromJson(jsonStr);
      assert.equal(res.success, true);
      assert.equal(res.cardCount, 2);
    });

    it('should import cards via BackupService methods', async () => {
      const mockDb = {
        categories: { toArray: async () => DEFAULT_CATEGORIES },
        cards: {
          toArray: async () => [],
          bulkAdd: async (cards) => {
            assert.equal(cards.length, 2);
            assert.equal(cards[0].label, 'Warm Soup');
          }
        },
      };

      const svc = new BackupService(mockDb);

      // Cards import
      const cardCsv = 'Label,Spoken Text,Role\nWarm Soup,I want soup,nouns\nCold Drink,I want drink,nouns';
      const cardRes = await svc.parseAndImportCsv(cardCsv);
      assert.equal(cardRes.importedCount, 2);
    });
  });

  describe('5. Error Handling & Edge Cases', () => {
    it('should gracefully handle empty or whitespace CSV text', () => {
      const res = googleSheetsService.parseSheetData('   \n  \n  ', {
        categories: DEFAULT_CATEGORIES,
      });

      assert.equal(res.cards.length, 0);
      assert.ok(res.errors.length > 0);
    });

    it('should handle rows with missing non-critical columns gracefully', () => {
      const csv = 'Label\nCoffee\nTea';
      const res = googleSheetsService.parseSheetData(csv, {
        categories: DEFAULT_CATEGORIES,
        targetType: 'cards',
      });

      assert.equal(res.cards.length, 2);
      assert.equal(res.cards[0].label, 'Coffee');
      assert.equal(res.cards[0].spokenText, 'Coffee');
      assert.equal(res.cards[0].fitzgeraldCategory, 'nouns');
    });
  });

  describe('6. Initial Page Load Auto-Sync Mechanism', () => {
    it('should extract sheet URL from query parameters', async () => {
      const { getInitialGoogleSheetUrlFromParams } = await import('../../src/services/googleSheets/googleSheetsAutoSync.js');
      
      // Mock window location search
      global.window.location = { search: '?sheet=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2FtestSheetId%2Fedit' };
      const url = getInitialGoogleSheetUrlFromParams();
      assert.equal(url, 'https://docs.google.com/spreadsheets/d/testSheetId/edit');

      // Test with sheetUrl parameter
      global.window.location = { search: '?sheetUrl=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2FanotherId' };
      const url2 = getInitialGoogleSheetUrlFromParams();
      assert.equal(url2, 'https://docs.google.com/spreadsheets/d/anotherId');

      // Clear search
      global.window.location = { search: '' };
    });

    it('should gracefully skip auto-sync on startup if no URL is configured', async () => {
      const { syncGoogleSheetOnStartup } = await import('../../src/services/googleSheets/googleSheetsAutoSync.js');
      const res = await syncGoogleSheetOnStartup();
      assert.equal(res.synced, false);
      assert.equal(res.importedCards, 0);
    });
  });

  describe('7. In-Memory Sheet Store & Non-Persistence Invariants', () => {
    it('should hold sheet cards in-memory without database writes', async () => {
      const { sheetDataStore } = await import('../../src/services/googleSheets/sheetDataStore.js');
      
      sheetDataStore.clear();
      assert.equal(sheetDataStore.getSheetCards().length, 0);

      const sampleCard = {
        id: 'sheet-card-1',
        categoryId: 'cat-needs',
        label: 'Smoothie',
        spokenText: 'I would like a smoothie.',
        fitzgeraldCategory: 'nouns',
        icon: '🥤',
        order: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      sheetDataStore.setSheetData([sampleCard]);

      assert.equal(sheetDataStore.getSheetCards().length, 1);
      assert.equal(sheetDataStore.getSheetCards()[0].label, 'Smoothie');

      // Test subscription listener
      let listenerFired = false;
      const unsubscribe = sheetDataStore.subscribe(() => {
        listenerFired = true;
      });

      sheetDataStore.clear();
      assert.equal(listenerFired, true);
      assert.equal(sheetDataStore.getSheetCards().length, 0);

      unsubscribe();
    });
  });

  describe('8. Google Identity Services (GIS) OAuth 2.0 Token Management', () => {
    it('should manage and validate OAuth session tokens with expiration safety window', async () => {
      const { googleAuthService } = await import('../../src/services/googleSheets/googleAuthService.js');

      // Set fresh token valid for 3600 seconds
      googleAuthService.setSession('mock-oauth-token-12345', 3600, 'caregiver@example.com', 'client-id-xyz');

      const token = googleAuthService.getValidAccessToken();
      assert.equal(token, 'mock-oauth-token-12345');

      const authState = googleAuthService.getAuthState();
      assert.equal(authState.isAuthenticated, true);
      assert.equal(authState.userEmail, 'caregiver@example.com');
      assert.equal(authState.clientId, 'client-id-xyz');
    });

    it('should treat expired tokens as invalid', async () => {
      const { googleAuthService } = await import('../../src/services/googleSheets/googleAuthService.js');

      // Set token with only 30s remaining (below 60s buffer)
      googleAuthService.setSession('mock-expiring-token', 30, 'user@example.com');

      const token = googleAuthService.getValidAccessToken();
      assert.equal(token, null);

      const authState = googleAuthService.getAuthState();
      assert.equal(authState.isAuthenticated, false);
    });

    it('should cleanly sign out and revoke active tokens', async () => {
      const { googleAuthService } = await import('../../src/services/googleSheets/googleAuthService.js');

      googleAuthService.setSession('active-token-to-revoke', 3600, 'test@example.com');
      assert.ok(googleAuthService.getValidAccessToken());

      let listenerNotified = false;
      const unsub = googleAuthService.subscribe(() => {
        listenerNotified = true;
      });

      await googleAuthService.signOut();

      assert.equal(googleAuthService.getValidAccessToken(), null);
      assert.equal(googleAuthService.getAuthState().isAuthenticated, false);
      assert.equal(listenerNotified, true);

      unsub();
    });
  });

  describe('9. Google Sheets API v4 Fetching with OAuth Bearer Token', () => {
    it('should fetch and parse cell values matrix via API v4 endpoint', async () => {
      const originalFetch = global.fetch;

      // Mock Google Sheets API v4 response
      global.fetch = async (url, options) => {
        const urlStr = String(url);
        assert.ok(options?.headers?.Authorization?.includes('Bearer test-token-abc'));

        if (urlStr.includes('/values/Cards') || urlStr.includes('/values/Sheet1')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              range: 'Cards!A1:H3',
              majorDimension: 'ROWS',
              values: [
                ['Label', 'Spoken Text', 'Role', 'Emoji', 'Syllables', 'Category', 'Label ZH', 'Spoken ZH'],
                ['Warm Blanket', 'Please give me a warm blanket.', 'nouns', '🛌', 'Warm · Blan · ket', 'Daily Needs', '保暖被子', '請給我一件保暖被子。'],
                ['Call Nurse', 'Please call the nurse.', 'emergency', '👩‍⚕️', 'Call · Nurse', 'Health', '呼叫護理師', '請幫我呼叫護理師。'],
              ],
            }),
          };
        }

        return { ok: false, status: 404 };
      };

      try {
        const { headers, rows } = await googleSheetsService.fetchSpreadsheetValuesViaApi(
          '1MsCXaC6F-uJiiYsqnS4-abW2nFTYFyTMd09hHRfwOwE',
          'test-token-abc',
          { sheetName: 'Cards' }
        );

        assert.equal(headers.length, 8);
        assert.equal(rows.length, 2);
        assert.equal(rows[0][0], 'Warm Blanket');
        assert.equal(rows[0][6], '保暖被子');
        assert.equal(rows[1][0], 'Call Nurse');
        assert.equal(rows[1][2], 'emergency');
      } finally {
        global.fetch = originalFetch;
      }
    });

    it('should resolve sheet title by gid from metadata when sheetName is omitted', async () => {
      const originalFetch = global.fetch;

      global.fetch = async (url) => {
        const urlStr = String(url);
        if (urlStr.includes('fields=sheets.properties')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              sheets: [
                { properties: { sheetId: 0, title: 'Overview' } },
                { properties: { sheetId: 123456, title: 'AAC_Vocab' } },
              ],
            }),
          };
        }
        if (urlStr.includes('/values/AAC_Vocab')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              range: 'AAC_Vocab!A1:C2',
              values: [
                ['Label', 'Spoken Text', 'Role'],
                ['Hot Soup', 'I want soup', 'nouns'],
              ],
            }),
          };
        }
        return { ok: false, status: 404 };
      };

      try {
        const { headers, rows } = await googleSheetsService.fetchSpreadsheetValuesViaApi(
          'spreadsheet-test-id',
          'mock-token',
          { gid: '123456' }
        );

        assert.equal(headers[0], 'Label');
        assert.equal(rows.length, 1);
        assert.equal(rows[0][0], 'Hot Soup');
      } finally {
        global.fetch = originalFetch;
      }
    });

    it('should handle API 401/403 authorization errors with informative message', async () => {
      const originalFetch = global.fetch;

      global.fetch = async () => ({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => 'Invalid Credentials',
      });

      try {
        await assert.rejects(
          () => googleSheetsService.fetchSpreadsheetValuesViaApi('spreadsheet-id', 'expired-token'),
          /Google authorization/
        );
      } finally {
        global.fetch = originalFetch;
      }
    });
  });

  describe('10. Unified fetchAndParseSheet Dispatcher & Private Sheet Handling', () => {
    it('should route to Sheets API v4 when accessToken is present and parse cards accurately', async () => {
      const originalFetch = global.fetch;

      global.fetch = async (url) => {
        const urlStr = String(url);
        if (urlStr.includes('/values/Cards')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              values: [
                ['Label', 'Spoken Text', 'Role', 'Emoji', 'Syllables', 'Category'],
                ['Green Tea', 'I want green tea', 'nouns', '🍵', 'Green · Tea', 'Food & Drink'],
              ],
            }),
          };
        }
        return { ok: false, status: 404 };
      };

      try {
        const res = await googleSheetsService.fetchAndParseSheet(
          'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
          {
            categories: DEFAULT_CATEGORIES,
            sheetName: 'Cards',
            accessToken: 'valid-oauth-token',
          }
        );

        assert.equal(res.cards.length, 1);
        assert.equal(res.cards[0].label, 'Green Tea');
        assert.equal(res.cards[0].categoryId, 'cat-food');
      } finally {
        global.fetch = originalFetch;
      }
    });

    it('should detect private sheet HTML login redirects and throw actionable auth error', async () => {
      const originalFetch = global.fetch;

      global.fetch = async () => ({
        ok: true,
        text: async () => '<!DOCTYPE html><html><title>Google Accounts: ServiceLogin</title></html>',
      });

      try {
        await assert.rejects(
          () => googleSheetsService.fetchGoogleSheetCsv('https://docs.google.com/spreadsheets/d/privateSheetId/edit'),
          /The Google Sheet is private and requires Google Login/
        );
      } finally {
        global.fetch = originalFetch;
      }
    });
  });
});
