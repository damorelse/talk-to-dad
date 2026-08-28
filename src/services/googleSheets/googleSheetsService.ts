import type { 
  AACCard, 
  AACCategory, 
  FitzgeraldCategory 
} from '../../types/index.ts';
import { 
  formatWithMiddleDot 
} from '../syllables/syllableSplitter.ts';
import { isChineseText } from '../audio/WebSpeechEngine.ts';

export interface GoogleSheetUrlInfo {
  spreadsheetId: string | null;
  gid: string | null;
  sheetName?: string;
  isPublished: boolean;
  csvExportUrl: string;
  gvizUrl: string;
}

export interface ParsedCsvTable {
  headers: string[];
  rows: string[][];
}

export interface SheetImportResult {
  type: 'cards';
  cards: AACCard[];
  errors: string[];
  totalRows: number;
}

const VALID_FITZGERALD_ROLES: Set<FitzgeraldCategory> = new Set([
  'people', 'verbs', 'nouns', 'adjectives', 'social', 'questions', 'places', 'emergency'
]);

const ROLE_ALIASES: Record<string, FitzgeraldCategory> = {
  person: 'people',
  who: 'people',
  pronoun: 'people',
  action: 'verbs',
  verb: 'verbs',
  do: 'verbs',
  thing: 'nouns',
  object: 'nouns',
  noun: 'nouns',
  what: 'nouns',
  descriptor: 'adjectives',
  feeling: 'adjectives',
  emotion: 'adjectives',
  adjective: 'adjectives',
  adj: 'adjectives',
  social: 'social',
  polite: 'social',
  greeting: 'social',
  question: 'questions',
  questions: 'questions',
  ask: 'questions',
  place: 'places',
  places: 'places',
  location: 'places',
  where: 'places',
  urgent: 'emergency',
  medical: 'emergency',
  emergency: 'emergency',
  help: 'emergency',
  pain: 'emergency',
};

export class GoogleSheetsService {
  /**
   * Parses a Google Sheets URL or Spreadsheet ID into structured metadata & CSV endpoints.
   */
  parseGoogleSheetUrl(urlOrId: string, sheetName?: string, gidOverride?: string): GoogleSheetUrlInfo {
    const trimmed = urlOrId.trim();

    // Direct published URL e.g. /spreadsheets/d/e/2PACX-.../pubhtml or /pub?output=csv
    if (trimmed.includes('/spreadsheets/d/e/')) {
      const match = trimmed.match(/\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)/);
      const pubId = match ? match[1] : '';
      const gidMatch = trimmed.match(/[#&?]gid=([0-9]+)/);
      const gid = gidOverride || (gidMatch ? gidMatch[1] : null);
      
      const csvExportUrl = `https://docs.google.com/spreadsheets/d/e/${pubId}/pub?output=csv${gid ? `&gid=${gid}` : ''}`;
      return {
        spreadsheetId: pubId,
        gid,
        sheetName,
        isPublished: true,
        csvExportUrl,
        gvizUrl: csvExportUrl,
      };
    }

    // Standard Google Sheet URL e.g. /spreadsheets/d/SPREADSHEET_ID/...
    const sheetIdMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    let spreadsheetId = sheetIdMatch ? sheetIdMatch[1] : null;

    // If string itself looks like a raw ID
    if (!spreadsheetId && /^[a-zA-Z0-9-_]{20,}$/.test(trimmed)) {
      spreadsheetId = trimmed;
    }

    const gidMatch = trimmed.match(/[#&?]gid=([0-9]+)/);
    const gid = gidOverride || (gidMatch ? gidMatch[1] : null);

    const baseExportUrl = spreadsheetId 
      ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv${gid ? `&gid=${gid}` : ''}`
      : trimmed;

    const gvizUrl = spreadsheetId
      ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv${sheetName ? `&sheet=${encodeURIComponent(sheetName)}` : gid ? `&gid=${gid}` : ''}`
      : trimmed;

    return {
      spreadsheetId,
      gid,
      sheetName,
      isPublished: false,
      csvExportUrl: sheetName ? gvizUrl : baseExportUrl,
      gvizUrl,
    };
  }

  /**
   * Fetches CSV data from a Google Sheet URL, Gviz endpoint, or published link.
   */
  async fetchGoogleSheetCsv(
    urlOrId: string, 
    options: { sheetName?: string; gid?: string; timeoutMs?: number; accessToken?: string } = {}
  ): Promise<string> {
    const { sheetName, gid, timeoutMs = 12000, accessToken } = options;
    const urlInfo = this.parseGoogleSheetUrl(urlOrId, sheetName, gid);
    
    // Choose most appropriate target URL
    const targetUrl = sheetName ? urlInfo.gvizUrl : urlInfo.csvExportUrl;
    console.info(`[GoogleSheetsService] Fetching CSV from: ${targetUrl}`);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const headers: Record<string, string> = {
      'Accept': 'text/csv, text/plain, */*',
    };
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        signal: controller.signal,
        headers,
      });

      clearTimeout(timer);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            `Access Denied (${response.status}). This Google Sheet is private and requires Google Account authorization.`
          );
        }
        throw new Error(
          `Failed to fetch Google Sheet (${response.status} ${response.statusText}). ` +
          `Please ensure the sheet has sharing set to "Anyone with the link can view" or sign in with Google.`
        );
      }

      const text = await response.text();

      // Check if Google returned an HTML login page instead of CSV
      if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
        if (text.includes('accounts.google.com') || text.includes('ServiceLogin')) {
          throw new Error(
            'The Google Sheet is private and requires Google Login. Please sign in with Google in Settings or set sharing permissions to ' +
            '"Anyone with the link can view" (or File > Share > Publish to web).'
          );
        }
      }

      return text;
    } catch (err: unknown) {
      clearTimeout(timer);
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          throw new Error('Request to fetch Google Sheet timed out. Please check your internet connection.');
        }
        throw err;
      }
      throw new Error(`Failed to fetch Google Sheet: ${String(err)}`);
    }
  }

  /**
   * Fetches spreadsheet rows using the official Google Sheets API v4 with an OAuth Bearer token.
   */
  async fetchSpreadsheetValuesViaApi(
    spreadsheetId: string,
    accessToken: string,
    options: { sheetName?: string; gid?: string; timeoutMs?: number } = {}
  ): Promise<ParsedCsvTable> {
    const { sheetName, gid, timeoutMs = 15000 } = options;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      let targetRange = sheetName?.trim() || '';

      // If sheetName is not provided, resolve sheet title from metadata (matching gid if provided)
      if (!targetRange) {
        const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=sheets.properties`;
        const metaResponse = await fetch(metaUrl, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        });

        if (!metaResponse.ok) {
          if (metaResponse.status === 401 || metaResponse.status === 403) {
            throw new Error(
              `Google authorization error (${metaResponse.status}). Please check your Google permissions or sign in again.`
            );
          }
          if (metaResponse.status === 404) {
            throw new Error(`Google Spreadsheet not found (ID: ${spreadsheetId}). Please verify the Sheet URL.`);
          }
          const errBody = await metaResponse.text().catch(() => '');
          throw new Error(`Google Sheets API metadata request failed (${metaResponse.status}): ${errBody}`);
        }

        const metaData = await metaResponse.json();
        const sheetsList = metaData.sheets || [];

        if (sheetsList.length === 0) {
          throw new Error('No sheets/tabs found in the specified Google Spreadsheet.');
        }

        if (gid) {
          const matched = sheetsList.find((s: any) => String(s.properties?.sheetId) === String(gid));
          targetRange = matched?.properties?.title || sheetsList[0]?.properties?.title || 'Sheet1';
        } else {
          targetRange = sheetsList[0]?.properties?.title || 'Sheet1';
        }
      }

      // Fetch cell values from range
      const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(targetRange)}`;
      console.info(`[GoogleSheetsService] Fetching API v4 values from: ${valuesUrl}`);

      const valuesResponse = await fetch(valuesUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      clearTimeout(timer);

      if (!valuesResponse.ok) {
        if (valuesResponse.status === 401 || valuesResponse.status === 403) {
          throw new Error(
            `Google authorization expired or insufficient permissions (${valuesResponse.status}). Please sign in again in Settings.`
          );
        }
        const errText = await valuesResponse.text().catch(() => '');
        throw new Error(`Google Sheets API values request failed (${valuesResponse.status}): ${errText}`);
      }

      const valuesData = await valuesResponse.json();
      const rawValues: unknown[][] = valuesData.values || [];

      if (rawValues.length === 0) {
        return { headers: [], rows: [] };
      }

      // Normalize row values to string matrix
      const headers = (rawValues[0] || []).map(cell => String(cell ?? '').trim());
      const rows = rawValues.slice(1).map(row => 
        (row || []).map(cell => String(cell ?? '').trim())
      );

      return { headers, rows };
    } catch (err: unknown) {
      clearTimeout(timer);
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          throw new Error('Request to Google Sheets API timed out.');
        }
        throw err;
      }
      throw new Error(`Failed to fetch spreadsheet via Google API: ${String(err)}`);
    }
  }

  /**
   * Robust RFC 4180 CSV and TSV parser supporting quotes, newlines, and escaping.
   */
  parseCsvOrTsv(rawText: string): ParsedCsvTable {
    if (!rawText || !rawText.trim()) {
      return { headers: [], rows: [] };
    }

    const cleanText = rawText.replace(/^\uFEFF/, ''); // Strip UTF-8 BOM if present
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let inQuotes = false;

    // Detect primary delimiter: examine first line for tab vs comma
    const firstLine = cleanText.split(/\r?\n/)[0] || '';
    const delimiter = (firstLine.includes('\t') && !firstLine.includes(',')) ? '\t' : ',';

    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i];
      const nextChar = cleanText[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentCell += '"';
          i++; // Skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++; // Skip \n in CRLF
        }
        currentRow.push(currentCell.trim());
        if (currentRow.some(c => c.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }

    // Flush remaining cell/row
    if (currentCell.length > 0 || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(c => c.length > 0)) {
        rows.push(currentRow);
      }
    }

    if (rows.length === 0) {
      return { headers: [], rows: [] };
    }

    const headers = rows[0].map(h => h.trim());
    const dataRows = rows.slice(1);

    return { headers, rows: dataRows };
  }

  /**
   * Determines content type (returns 'cards').
   */
  detectContentType(): 'cards' {
    return 'cards';
  }

  /**
   * Parses AAC Card objects from table rows and headers.
   */
  parseCardsData(
    rows: string[][],
    headers: string[],
    categories: AACCategory[],
    defaultCategoryId?: string
  ): { cards: AACCard[]; errors: string[] } {
    const errors: string[] = [];
    const cards: AACCard[] = [];

    const normHeaders = headers.map(h => h.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, ''));

    // Find column indexes
    const findIndex = (keywords: string[]): number => {
      return normHeaders.findIndex(h => keywords.some(k => h.includes(k)));
    };

    const labelIdx = findIndex(['label', 'word', 'name', 'card', 'title', 'text', '標籤', '名稱', '單字', '詞彙']);
    const spokenIdx = findIndex(['spokentext', 'spoken', 'speech', 'phrase', 'sentence', '朗讀', '語音']);
    const labelZhIdx = findIndex(['labelzh', 'chinese', 'zhlabel', 'chineselabel', '中文標籤', '中文名稱', '中文']);
    const spokenZhIdx = findIndex(['spokenzh', 'spokentextzh', 'chinesespoken', 'zhspoken', '中文朗讀', '中文語音']);
    const roleIdx = findIndex(['role', 'fitzgerald', 'partofspeech', 'pos', 'type', '詞性', '角色']);
    const iconIdx = findIndex(['emoji', 'icon', 'symbol', '圖示', '表情']);
    const syllablesIdx = findIndex(['syllable', 'phonetic', 'breakdown', '音節', '發音']);
    const catIdx = findIndex(['category', 'cat', 'folder', '分類', '類別']);

    const defaultCatId = defaultCategoryId || categories[0]?.id || 'cat-needs';
    const now = Date.now();

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      if (row.length === 0 || row.every(c => !c)) continue;

      // Extract label
      let label = (labelIdx !== -1 ? row[labelIdx] : row[0]) || '';
      if (!label) continue;

      // Extract spoken text
      let spokenText = (spokenIdx !== -1 ? row[spokenIdx] : (row[1] || label)) || label;

      // Traditional Chinese label & spoken
      let labelZh = labelZhIdx !== -1 ? row[labelZhIdx] : undefined;
      let spokenTextZh = spokenZhIdx !== -1 ? row[spokenZhIdx] : undefined;

      // Auto-detect Chinese if primary label is Chinese
      if (!labelZh && isChineseText(label)) {
        labelZh = label;
      }
      if (!spokenTextZh && spokenText && isChineseText(spokenText)) {
        spokenTextZh = spokenText;
      }

      // Fitzgerald Role
      let role: FitzgeraldCategory = 'nouns';
      if (roleIdx !== -1 && row[roleIdx]) {
        const rawRole = row[roleIdx].toLowerCase().trim();
        if (VALID_FITZGERALD_ROLES.has(rawRole as FitzgeraldCategory)) {
          role = rawRole as FitzgeraldCategory;
        } else if (ROLE_ALIASES[rawRole]) {
          role = ROLE_ALIASES[rawRole];
        }
      }

      // Icon / Emoji
      let icon = (iconIdx !== -1 ? row[iconIdx] : (row[3] || '💬')) || '💬';

      // Syllables
      let syllables = syllablesIdx !== -1 ? row[syllablesIdx] : '';
      if (!syllables) {
        if (!isChineseText(label)) {
          syllables = formatWithMiddleDot(label);
        } else {
          syllables = label;
        }
      }

      // Category matching
      let categoryId = defaultCatId;
      if (catIdx !== -1 && row[catIdx]) {
        const catStr = row[catIdx].toLowerCase().trim();
        const matched = categories.find(c => 
          c.id.toLowerCase() === catStr ||
          c.name.toLowerCase() === catStr ||
          (c.nameZh && c.nameZh.toLowerCase() === catStr) ||
          c.name.toLowerCase().includes(catStr)
        );
        if (matched) {
          categoryId = matched.id;
        }
      }

      cards.push({
        id: `card-sheet-${now}-${r}-${Math.random().toString(36).slice(2, 6)}`,
        categoryId,
        label,
        labelZh,
        spokenText,
        spokenTextZh,
        phoneticSyllables: syllables,
        fitzgeraldCategory: role,
        icon,
        order: r + 1,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { cards, errors };
  }

  /**
   * Master parsing method: handles AAC Cards Google Sheet / CSV data.
   */
  parseSheetData(
    csvText: string,
    options: {
      categories: AACCategory[];
      defaultCategoryId?: string;
      defaultLanguage?: 'en' | 'zh';
      targetType?: 'cards' | 'auto';
    }
  ): SheetImportResult {
    const { categories, defaultCategoryId } = options;
    const { headers, rows } = this.parseCsvOrTsv(csvText);

    if (rows.length === 0) {
      return {
        type: 'cards',
        cards: [],
        errors: ['No valid data rows found in the sheet.'],
        totalRows: 0,
      };
    }

    const { cards, errors } = this.parseCardsData(rows, headers, categories, defaultCategoryId);
    return {
      type: 'cards',
      cards,
      errors,
      totalRows: rows.length,
    };
  }

  /**
   * Unified fetch and parse method: handles both OAuth-authenticated Google Sheets API v4
   * (for private sheets) and CSV/Gviz export endpoints (for public sheets).
   */
  async fetchAndParseSheet(
    urlOrId: string,
    options: {
      categories: AACCategory[];
      sheetName?: string;
      gid?: string;
      accessToken?: string;
      defaultCategoryId?: string;
      timeoutMs?: number;
    }
  ): Promise<SheetImportResult> {
    const { categories, sheetName, gid, accessToken, defaultCategoryId, timeoutMs } = options;
    const urlInfo = this.parseGoogleSheetUrl(urlOrId, sheetName, gid);

    // If an OAuth access token is provided and we have a spreadsheet ID, use the official Sheets API v4
    if (accessToken && urlInfo.spreadsheetId && !urlInfo.isPublished) {
      console.info(`[GoogleSheetsService] Using Google Sheets API v4 with OAuth token for ID: ${urlInfo.spreadsheetId}`);
      const { headers, rows } = await this.fetchSpreadsheetValuesViaApi(
        urlInfo.spreadsheetId,
        accessToken,
        { sheetName: sheetName || urlInfo.sheetName, gid: urlInfo.gid || gid, timeoutMs }
      );

      if (rows.length === 0) {
        return {
          type: 'cards',
          cards: [],
          errors: ['No valid data rows found in Google Sheet.'],
          totalRows: 0,
        };
      }

      const { cards, errors } = this.parseCardsData(rows, headers, categories, defaultCategoryId);
      return {
        type: 'cards',
        cards,
        errors,
        totalRows: rows.length,
      };
    }

    // Otherwise, fetch via CSV endpoint (public sheets)
    const csvText = await this.fetchGoogleSheetCsv(urlOrId, {
      sheetName,
      gid,
      timeoutMs,
      accessToken,
    });

    return this.parseSheetData(csvText, {
      categories,
      defaultCategoryId,
    });
  }
}

export const googleSheetsService = new GoogleSheetsService();
