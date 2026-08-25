import { db } from '../db/AppDatabase.js';
import { DEFAULT_SETTINGS } from '../db/defaultData.js';
import { googleSheetsService } from './googleSheetsService.js';
import { sheetDataStore } from './sheetDataStore.js';
/**
 * Extracts Google Sheet URL from window location search query params (?sheet=... or ?sheetUrl=...)
 */
export function getInitialGoogleSheetUrlFromParams() {
    if (typeof window === 'undefined' || !window.location || !window.location.search) {
        return null;
    }
    try {
        const params = new URLSearchParams(window.location.search);
        const candidate = params.get('sheet') ||
            params.get('sheetUrl') ||
            params.get('sheet_url') ||
            params.get('googleSheet') ||
            params.get('googlesheet') ||
            params.get('url');
        if (candidate && candidate.trim()) {
            return candidate.trim();
        }
    }
    catch {
        // Ignore query parsing errors
    }
    return null;
}
/**
 * Automatically syncs Cards from the configured Google Sheet on startup.
 * NOTE: Sheet items are stored strictly in-memory in sheetDataStore and are NOT persisted to IndexedDB.
 */
export async function syncGoogleSheetOnStartup(options = {}) {
    try {
        const settings = await db.settings.get('current');
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
        }
        else if (!settings.googleSheetSyncUrl && DEFAULT_SETTINGS.googleSheetSyncUrl) {
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
        const errors = [];
        const accumulatedCards = [];
        // 3. Tab-based or single URL fetch
        const cardsTab = settings.googleSheetSyncCardsTab?.trim();
        try {
            const csvText = await googleSheetsService.fetchGoogleSheetCsv(effectiveUrl, {
                sheetName: cardsTab || undefined,
            });
            const parsed = googleSheetsService.parseSheetData(csvText, {
                categories,
                targetType: 'cards',
            });
            if (parsed.cards.length > 0) {
                accumulatedCards.push(...parsed.cards);
                totalImportedCards += parsed.cards.length;
            }
            if (parsed.errors.length > 0) {
                errors.push(...parsed.errors);
            }
        }
        catch (err) {
            errors.push(`Sync error: ${err instanceof Error ? err.message : String(err)}`);
        }
        // Set into in-memory non-persistent store (never written to IndexedDB)
        sheetDataStore.setSheetData(accumulatedCards);
        const now = Date.now();
        settings.lastGoogleSheetSyncTime = now;
        if (totalImportedCards > 0) {
            settings.lastGoogleSheetSyncStatus = `Synced ${totalImportedCards} Cards at ${new Date(now).toLocaleTimeString()}`;
        }
        else if (errors.length > 0) {
            settings.lastGoogleSheetSyncStatus = `Sync notice: ${errors.join(', ')}`;
        }
        else {
            settings.lastGoogleSheetSyncStatus = `Checked at ${new Date(now).toLocaleTimeString()} (No new rows)`;
        }
        await db.settings.put(settings);
        return {
            synced: totalImportedCards > 0,
            importedCards: totalImportedCards,
            sheetUrl: effectiveUrl,
            message: settings.lastGoogleSheetSyncStatus,
        };
    }
    catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.warn('Initial Google Sheet Auto-Sync skipped or failed:', errorMsg);
        try {
            const settings = await db.settings.get('current');
            if (settings) {
                settings.lastGoogleSheetSyncStatus = `Failed: ${errorMsg}`;
                await db.settings.put(settings);
            }
        }
        catch { }
        return {
            synced: false,
            importedCards: 0,
            error: errorMsg,
            message: `Sync failed: ${errorMsg}`,
        };
    }
}
