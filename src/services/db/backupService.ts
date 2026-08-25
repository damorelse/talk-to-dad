import { db, AppDatabase } from './AppDatabase';
import { 
  ExportDataPackage, 
} from '../../types/index';
import { googleSheetsService } from '../googleSheets/googleSheetsService';

export interface ImportResult {
  success: boolean;
  message: string;
  cardCount?: number;
}

export interface CsvImportResult {
  importedCount: number;
  errors: string[];
}

export interface GoogleSheetSyncResult {
  success: boolean;
  importedCardsCount: number;
  type: 'cards';
  errors: string[];
  message: string;
}

export class BackupService {
  private database: AppDatabase;

  constructor(customDb?: AppDatabase) {
    this.database = customDb || db;
  }

  /**
   * Generates a complete serialized backup object containing all database tables.
   */
  async exportData(): Promise<ExportDataPackage> {
    const [
      categories,
      cards,
      visualScenes,
      hotspots,
      settingsRecord,
      mediaBlobs,
    ] = await Promise.all([
      this.database.categories.toArray(),
      this.database.cards.toArray(),
      this.database.visualScenes.toArray(),
      this.database.hotspots.toArray(),
      this.database.settings.get('current'),
      this.database.mediaBlobs.toArray(),
    ]);

    const backupPackage: ExportDataPackage = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      categories,
      cards,
      visualScenes,
      hotspots,
      settings: settingsRecord || (await this.database.settings.get('current'))!,
      mediaBlobs,
    };

    return backupPackage;
  }

  /**
   * Exports backup package to a downloadable JSON file string.
   */
  async exportToJsonString(): Promise<string> {
    const data = await this.exportData();
    return JSON.stringify(data, null, 2);
  }

  /**
   * Validates and imports a JSON backup package into the database.
   */
  async importFromJson(jsonString: string): Promise<ImportResult> {
    try {
      if (!jsonString || typeof jsonString !== 'string') {
        return { success: false, message: 'Invalid or empty backup content.' };
      }

      const data = JSON.parse(jsonString);

      // Schema validation
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Invalid backup structure: not a valid object.' };
      }

      if (!Array.isArray(data.categories) || !Array.isArray(data.cards)) {
        return { success: false, message: 'Backup file missing required categories or cards collections.' };
      }

      const tablesToLock: any[] = [
        this.database.categories,
        this.database.cards,
        this.database.visualScenes,
        this.database.hotspots,
        this.database.settings,
        this.database.mediaBlobs,
      ];

      await this.database.transaction('rw', tablesToLock, async () => {
        // Clear existing tables
        await this.database.categories.clear();
        await this.database.cards.clear();
        await this.database.visualScenes.clear();
        await this.database.hotspots.clear();
        await this.database.settings.clear();
        await this.database.mediaBlobs.clear();

        // Restore tables
        if (data.categories.length > 0) {
          await this.database.categories.bulkAdd(data.categories);
        }
        if (data.cards.length > 0) {
          await this.database.cards.bulkAdd(data.cards);
        }
        if (Array.isArray(data.visualScenes) && data.visualScenes.length > 0) {
          await this.database.visualScenes.bulkAdd(data.visualScenes);
        }
        if (Array.isArray(data.hotspots) && data.hotspots.length > 0) {
          await this.database.hotspots.bulkAdd(data.hotspots);
        }
        if (data.settings && typeof data.settings === 'object') {
          await this.database.settings.put({ ...data.settings, id: 'current' });
        }
        if (Array.isArray(data.mediaBlobs) && data.mediaBlobs.length > 0) {
          await this.database.mediaBlobs.bulkAdd(data.mediaBlobs);
        }
      });

      return { 
        success: true, 
        message: `Backup restored successfully with ${data.cards.length} cards and ${data.categories.length} categories.`,
        cardCount: data.cards.length,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return { success: false, message: `Failed to restore backup: ${errorMsg}` };
    }
  }

  /**
   * Resets the database to factory clinical defaults.
   */
  async factoryReset(): Promise<void> {
    await this.database.resetToDefaults();
  }

  /**
   * Parses CSV / TSV text (e.g. from Google Sheets export or copy-paste)
   * Format headers: Category, Label, Spoken Text, Fitzgerald Role, Emoji, Syllables
   */
  async parseAndImportCsv(
    csvText: string, 
    targetCategoryId?: string
  ): Promise<CsvImportResult> {
    const categories = await this.database.categories.toArray();
    const result = googleSheetsService.parseSheetData(csvText, {
      categories,
      defaultCategoryId: targetCategoryId,
      targetType: 'cards',
    });

    if (result.cards.length > 0) {
      await this.database.cards.bulkAdd(result.cards);
    }

    return { importedCount: result.cards.length, errors: result.errors };
  }

  /**
   * Pulls and imports Cards directly from a Google Sheet URL.
   */
  async pullAndImportFromGoogleSheet(options: {
    sheetUrl: string;
    sheetName?: string;
    gid?: string;
    targetCategoryId?: string;
    targetType?: 'cards' | 'auto';
  }): Promise<GoogleSheetSyncResult> {
    const { sheetUrl, sheetName, gid, targetCategoryId, targetType = 'auto' } = options;

    try {
      const csvText = await googleSheetsService.fetchGoogleSheetCsv(sheetUrl, { sheetName, gid });
      const categories = await this.database.categories.toArray();

      const parsed = googleSheetsService.parseSheetData(csvText, {
        categories,
        defaultCategoryId: targetCategoryId,
        targetType,
      });

      let importedCardsCount = 0;

      if (parsed.cards.length > 0) {
        await this.database.cards.bulkAdd(parsed.cards);
        importedCardsCount = parsed.cards.length;
      }

      if (importedCardsCount === 0) {
        return {
          success: false,
          importedCardsCount: 0,
          type: parsed.type,
          errors: parsed.errors.length > 0 ? parsed.errors : ['No valid card rows were found in the sheet.'],
          message: 'No valid data rows found to import.',
        };
      }

      return {
        success: true,
        importedCardsCount,
        type: parsed.type,
        errors: parsed.errors,
        message: `Successfully imported ${importedCardsCount} AAC Cards from Google Sheet!`,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        importedCardsCount: 0,
        type: 'cards',
        errors: [errorMsg],
        message: `Google Sheet pull failed: ${errorMsg}`,
      };
    }
  }
}

export const backupService = new BackupService();

