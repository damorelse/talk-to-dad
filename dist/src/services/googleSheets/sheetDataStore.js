/**
 * In-memory transient store for AAC Cards pulled from Google Sheets.
 * These items are held in memory during the active session and are NOT persisted to IndexedDB.
 */
class SheetDataStore {
    sheetCards = [];
    listeners = new Set();
    getSheetCards() {
        return this.sheetCards;
    }
    setSheetData(cards) {
        this.sheetCards = cards;
        this.notify();
    }
    setSheetCards(cards) {
        this.sheetCards = cards;
        this.notify();
    }
    clear() {
        this.sheetCards = [];
        this.notify();
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }
    notify() {
        this.listeners.forEach((listener) => {
            try {
                listener();
            }
            catch (err) {
                console.error('Error in sheetDataStore listener:', err);
            }
        });
    }
}
export const sheetDataStore = new SheetDataStore();
