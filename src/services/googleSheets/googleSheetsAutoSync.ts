import { db } from '../db/AppDatabase.ts';
import { DEFAULT_SETTINGS } from '../db/defaultData.ts';
import { googleSheetsService } from './googleSheetsService.ts';
import { googleAuthService } from './googleAuthService.ts';
import { sheetDataStore } from './sheetDataStore.ts';
import type { AACCard, AppSettings } from '../../types/index.ts';

export interface AutoSyncResult {
  synced: boolean;
  importedCards: number;
  sheetUrl?: string;
  message?: string;
  error?: string;
}

/**
 * Extracts Google Sheet URL from window location search query params (?sheet=... or ?sheetUrl=...)
 */
export function getInitialGoogleSheetUrlFromParams(): string | null {
  if (typeof window === 'undefined' || !window.location || !window.location.search) {
    return null;
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const candidate = 
      params.get('sheet') || 
      params.get('sheetUrl') || 
      params.get('sheet_url') || 
      params.get('googleSheet') ||
      params.get('googlesheet') ||
      params.get('url');

    if (candidate && candidate.trim()) {
      return candidate.trim();
    }
  } catch {
    // Ignore query parsing errors
  }

  return null;
}

/**
 * Automatically syncs Cards from the configured Google Sheet on startup.
 * Supports OAuth access token for private Google Sheets.
 * NOTE: Sheet items are stored strictly in-memory in sheetDataStore and are NOT persisted to IndexedDB.
 */
export async function syncGoogleSheetOnStartup(options: {
  force?: boolean;
  accessToken?: string;
  onProgress?: (status: string) => void;
} = {}): Promise<AutoSyncResult> {
  try {
    const settings: AppSettings | undefined = await db.settings.get('current');
    if (!settings) {
      console.log('[GoogleSheetsAutoSync] Settings not yet initialized in database.');
      return { synced: false, importedCards: 0, message: 'Settings not initialized yet.' };
    }

    // 1. Check if a sheet URL was provided via query parameter or settings fallback
    const queryUrl = getInitialGoogleSheetUrlFromParams();
    let effectiveUrl = queryUrl || settings.googleSheetSyncUrl || DEFAULT_SETTINGS.googleSheetSyncUrl || '';

    // If query param provided a new URL or settings was empty, persist it into settings
    if (queryUrl && queryUrl !== settings.googleSheetSyncUrl) {
      settings.googleSheetSyncUrl = queryUrl;
      settings.googleSheetAutoSyncOnLoad = true;
      await db.settings.put(settings);
    } else if (!settings.googleSheetSyncUrl && DEFAULT_SETTINGS.googleSheetSyncUrl) {
      settings.googleSheetSyncUrl = DEFAULT_SETTINGS.googleSheetSyncUrl;
      settings.googleSheetAutoSyncOnLoad = true;
      settings.googleSheetSyncCardsTab = DEFAULT_SETTINGS.googleSheetSyncCardsTab;
      await db.settings.put(settings);
    }

    // 2. Check if auto-sync is enabled or forced
    const isAutoSyncEnabled = settings.googleSheetAutoSyncOnLoad !== false;
    if (!effectiveUrl.trim() || (!isAutoSyncEnabled && !options.force)) {
      console.log('[GoogleSheetsAutoSync] Auto-sync skipped (no URL or disabled):', { effectiveUrl, isAutoSyncEnabled });
      return {
        synced: false,
        importedCards: 0,
        message: 'Google Sheet auto-sync is either not configured or disabled.',
      };
    }

    console.info(`[GoogleSheetsAutoSync] Initiating sheet sync with URL: ${effectiveUrl}`);
    options.onProgress?.('Fetching Google Sheet...');

    const categories = await db.categories.toArray();
    let totalImportedCards = 0;
    const errors: string[] = [];
    const accumulatedCards: AACCard[] = [];

    // 3. Obtain OAuth Token if available
    const token = options.accessToken || googleAuthService.getValidAccessToken() || undefined;

    // 4. Tab-based or single URL fetch
    const cardsTab = settings.googleSheetSyncCardsTab?.trim();

    try {
      const parsed = await googleSheetsService.fetchAndParseSheet(effectiveUrl, {
        categories,
        sheetName: cardsTab || undefined,
        accessToken: token,
      });

      if (parsed.cards.length > 0) {
        accumulatedCards.push(...parsed.cards);
        totalImportedCards += parsed.cards.length;
      }

      if (parsed.errors.length > 0) {
        errors.push(...parsed.errors);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(msg);
    }

    // Set into in-memory non-persistent store (never written to IndexedDB)
    sheetDataStore.setSheetCards(accumulatedCards);

    const now = Date.now();
    settings.lastGoogleSheetSyncTime = now;
    const isOAuth = Boolean(token);

    if (totalImportedCards > 0) {
      settings.lastGoogleSheetSyncStatus = `Synced ${totalImportedCards} Cards${isOAuth ? ' (OAuth)' : ''} at ${new Date(now).toLocaleTimeString()}`;
    } else if (errors.length > 0) {
      settings.lastGoogleSheetSyncStatus = `Sync notice: ${errors.join(', ')}`;
    } else {
      settings.lastGoogleSheetSyncStatus = `Checked at ${new Date(now).toLocaleTimeString()} (No new rows)`;
    }

    await db.settings.put(settings);

    return {
      synced: totalImportedCards > 0,
      importedCards: totalImportedCards,
      sheetUrl: effectiveUrl,
      message: settings.lastGoogleSheetSyncStatus,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn('Initial Google Sheet Auto-Sync skipped or failed:', errorMsg);

    try {
      const settings = await db.settings.get('current');
      if (settings) {
        settings.lastGoogleSheetSyncStatus = `Failed: ${errorMsg}`;
        await db.settings.put(settings);
      }
    } catch {}

    return {
      synced: false,
      importedCards: 0,
      error: errorMsg,
      message: `Sync failed: ${errorMsg}`,
    };
  }
}
