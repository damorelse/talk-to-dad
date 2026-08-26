import { Dexie, type Table } from 'dexie';
import type {
  AACCategory,
  AACCard,
  VisualScene,
  VisualSceneHotspot,
  AppSettings,
  MediaBlobRecord,
} from '../../types/index.ts';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_CARDS,
  DEFAULT_VISUAL_SCENES,
  DEFAULT_HOTSPOTS,
  DEFAULT_SETTINGS,
} from './defaultData.ts';

export class AppDatabase extends Dexie {
  categories!: Table<AACCategory, string>;
  cards!: Table<AACCard, string>;
  visualScenes!: Table<VisualScene, string>;
  hotspots!: Table<VisualSceneHotspot, string>;
  settings!: Table<AppSettings, string>;
  mediaBlobs!: Table<MediaBlobRecord, string>;

  constructor(dbName = 'TalkWithDadDB') {
    super(dbName);

    this.version(1).stores({
      categories: 'id, name, order, isDefault',
      cards: 'id, categoryId, fitzgeraldCategory, order, label, isFavorite',
      visualScenes: 'id, title, createdAt',
      hotspots: 'id, sceneId, label',
      settings: 'id',
      mediaBlobs: 'id, type, createdAt',
    });

    this.version(2).stores({
      categories: 'id, name, order, isDefault',
      cards: 'id, categoryId, fitzgeraldCategory, order, label, isFavorite',
      visualScenes: 'id, title, createdAt',
      hotspots: 'id, sceneId, label',
      settings: 'id',
      mediaBlobs: 'id, type, createdAt',
    }).upgrade(async tx => {
      // 1. Purge deprecated legacy food cards
      const removedFoodCardIds = ['card-juice', 'card-bread', 'card-porridge', 'card-noodles'];
      await tx.table('cards').where('id').anyOf(removedFoodCardIds).delete();

      // 2. Purge legacy persisted sheet cards
      const allCards = await tx.table('cards').toArray();
      const legacySheetCardIds = allCards.filter((c: any) => c.id && c.id.startsWith('card-sheet-')).map((c: any) => c.id);
      if (legacySheetCardIds.length > 0) {
        await tx.table('cards').bulkDelete(legacySheetCardIds);
      }

      // 3. Clean up removed dining chair hotspots
      await tx.table('hotspots').where('id').anyOf(['hs-chair-left', 'hs-chair-right']).delete();
    });
  }

  async initializeDefaults(): Promise<void> {
    const categoryCount = await this.categories.count();
    if (categoryCount === 0) {
      await this.categories.bulkAdd(DEFAULT_CATEGORIES);
    } else {
      for (const cat of DEFAULT_CATEGORIES) {
        const existing = await this.categories.get(cat.id);
        if (!existing) {
          await this.categories.put(cat);
        } else if (!existing.nameZh && cat.nameZh) {
          existing.nameZh = cat.nameZh;
          await this.categories.put(existing);
        }
      }
    }

    const cardCount = await this.cards.count();
    if (cardCount === 0) {
      await this.cards.bulkAdd(DEFAULT_CARDS);
    } else {
      for (const card of DEFAULT_CARDS) {
        const existing = await this.cards.get(card.id);
        if (!existing) {
          await this.cards.put(card);
        } else {
          let updated = false;
          if (!existing.labelZh || !existing.spokenTextZh) {
            existing.labelZh = existing.labelZh || card.labelZh;
            existing.spokenTextZh = existing.spokenTextZh || card.spokenTextZh;
            updated = true;
          }
          if (existing.clue === undefined && card.clue) {
            existing.clue = card.clue;
            updated = true;
          }
          if (existing.clueZh === undefined && card.clueZh) {
            existing.clueZh = card.clueZh;
            updated = true;
          }
          if (updated) {
            await this.cards.put(existing);
          }
        }
      }
    }

    const sceneCount = await this.visualScenes.count();
    if (sceneCount === 0) {
      await this.visualScenes.bulkAdd(DEFAULT_VISUAL_SCENES);
    } else {
      for (const scene of DEFAULT_VISUAL_SCENES) {
        const existing = await this.visualScenes.get(scene.id);
        if (!existing) {
          await this.visualScenes.put(scene);
        } else if (!existing.titleZh && scene.titleZh) {
          existing.titleZh = scene.titleZh;
          existing.descriptionZh = scene.descriptionZh;
          await this.visualScenes.put(existing);
        }
      }
    }

    const hotspotCount = await this.hotspots.count();
    if (hotspotCount === 0) {
      await this.hotspots.bulkAdd(DEFAULT_HOTSPOTS);
    } else {
      for (const hs of DEFAULT_HOTSPOTS) {
        const existing = await this.hotspots.get(hs.id);
        if (!existing) {
          await this.hotspots.put(hs);
        } else {
          let updated = false;
          if (!existing.labelZh || !existing.spokenTextZh) {
            existing.labelZh = existing.labelZh || hs.labelZh;
            existing.spokenTextZh = existing.spokenTextZh || hs.spokenTextZh;
            updated = true;
          }
          // If hs-chair has legacy coordinates, update to new coordinates so couch and pet quorra don't overlap
          if (existing.id === 'hs-chair' && existing.height === 50) {
            existing.x = hs.x;
            existing.y = hs.y;
            existing.width = hs.width;
            existing.height = hs.height;
            existing.labelZh = hs.labelZh;
            existing.spokenText = hs.spokenText;
            existing.spokenTextZh = hs.spokenTextZh;
            updated = true;
          }
          if (updated) {
            await this.hotspots.put(existing);
          }
        }
      }
    }

    const currentSettings = await this.settings.get('current');
    if (!currentSettings) {
      await this.settings.put(DEFAULT_SETTINGS);
    } else {
      let settingsUpdated = false;
      if (!currentSettings.cardSpeechLanguage) {
        currentSettings.cardSpeechLanguage = 'en';
        settingsUpdated = true;
      }
      if (!currentSettings.googleSheetSyncUrl && DEFAULT_SETTINGS.googleSheetSyncUrl) {
        currentSettings.googleSheetSyncUrl = DEFAULT_SETTINGS.googleSheetSyncUrl;
        currentSettings.googleSheetAutoSyncOnLoad = DEFAULT_SETTINGS.googleSheetAutoSyncOnLoad;
        currentSettings.googleSheetSyncCardsTab = DEFAULT_SETTINGS.googleSheetSyncCardsTab;
        settingsUpdated = true;
      }
      if (typeof currentSettings.weeklyFocusCardsPerCategory !== 'number') {
        currentSettings.weeklyFocusCardsPerCategory = DEFAULT_SETTINGS.weeklyFocusCardsPerCategory ?? 2;
        settingsUpdated = true;
      }
      if (settingsUpdated) {
        await this.settings.put(currentSettings);
      }
    }
  }

  async resetToDefaults(): Promise<void> {
    await this.transaction('rw', [
      this.categories,
      this.cards,
      this.visualScenes,
      this.hotspots,
      this.settings,
      this.mediaBlobs,
    ], async () => {
      await this.categories.clear();
      await this.cards.clear();
      await this.visualScenes.clear();
      await this.hotspots.clear();
      await this.settings.clear();
      await this.mediaBlobs.clear();

      await this.categories.bulkAdd(DEFAULT_CATEGORIES);
      await this.cards.bulkAdd(DEFAULT_CARDS);
      await this.visualScenes.bulkAdd(DEFAULT_VISUAL_SCENES);
      await this.hotspots.bulkAdd(DEFAULT_HOTSPOTS);
      await this.settings.put(DEFAULT_SETTINGS);
    });
  }
}

export const db = new AppDatabase();
