import type { AACCard } from '../../types/index.ts';

/**
 * In-memory transient store for AAC Cards pulled from Google Sheets.
 * These items are held in memory during the active session and are NOT persisted to IndexedDB.
 */
class SheetDataStore {
  private sheetCards: AACCard[] = [];
  private listeners: Set<() => void> = new Set();

  getSheetCards(): AACCard[] {
    return this.sheetCards;
  }

  setSheetCards(cards: AACCard[]): void {
    this.sheetCards = cards;
    this.notify();
  }

  setSheetData(cards: AACCard[]): void {
    this.setSheetCards(cards);
  }

  clear(): void {
    this.sheetCards = [];
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in sheetDataStore listener:', err);
      }
    });
  }
}

export const sheetDataStore = new SheetDataStore();
