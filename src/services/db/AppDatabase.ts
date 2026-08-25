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
        } else {
          let catUpdated = false;
          if (!existing.nameZh && cat.nameZh) {
            existing.nameZh = cat.nameZh;
            catUpdated = true;
          }
          if (cat.id === 'cat-family' && existing.name !== 'Family') {
            existing.name = 'Family';
            catUpdated = true;
          }
          if (cat.id === 'cat-health' && existing.name !== 'Health') {
            existing.name = 'Health';
            catUpdated = true;
          }
          if (cat.id === 'cat-time' && existing.name !== 'Date & Time') {
            existing.name = 'Date & Time';
            catUpdated = true;
          }
          if (catUpdated) {
            await this.categories.put(existing);
          }
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
          if (card.clue && existing.clue !== card.clue) {
            existing.clue = card.clue;
            updated = true;
          }
          if (card.clueZh && existing.clueZh !== card.clueZh) {
            existing.clueZh = card.clueZh;
            updated = true;
          }
          if (card.id.startsWith('card-num-') && (existing.label.includes(' / ') || (existing.labelZh && existing.labelZh.includes(' / ')))) {
            existing.label = card.label;
            existing.labelZh = card.labelZh;
            updated = true;
          }
          if (card.id.startsWith('card-num-') && existing.icon === '🔢') {
            existing.icon = card.icon;
            updated = true;
          }
          if (card.id === 'card-num-100' && existing.icon === '💯') {
            existing.icon = card.icon;
            updated = true;
          }
          if (card.id === 'card-family-spouse' && existing.label.includes(' / ')) {
            existing.label = card.label;
            existing.labelZh = card.labelZh;
            existing.spokenText = card.spokenText;
            existing.spokenTextZh = card.spokenTextZh;
            existing.phoneticSyllables = card.phoneticSyllables;
            existing.icon = card.icon;
            updated = true;
          }
          if (existing.icon !== card.icon) {
            existing.icon = card.icon;
            updated = true;
          }
          if (card.categoryId === 'cat-food' && existing.order !== card.order) {
            existing.order = card.order;
            updated = true;
          }
          if (card.id === 'card-milk' || card.id === 'card-fruit') {
            existing.label = card.label;
            existing.labelZh = card.labelZh;
            existing.spokenText = card.spokenText;
            existing.spokenTextZh = card.spokenTextZh;
            existing.phoneticSyllables = card.phoneticSyllables;
            updated = true;
          }
          if (updated) {
            await this.cards.put(existing);
          }
        }
      }

      // Remove obsolete default food cards if present
      const removedFoodCardIds = ['card-juice', 'card-bread', 'card-porridge', 'card-noodles'];
      for (const removedId of removedFoodCardIds) {
        const toRemove = await this.cards.get(removedId);
        if (toRemove && toRemove.categoryId === 'cat-food') {
          await this.cards.delete(removedId);
        }
      }

      // Purge legacy persisted sheet cards so database remains strictly persistent custom/default items
      const allDbCards = await this.cards.toArray();
      const legacySheetCardIds = allDbCards.filter(c => c.id.startsWith('card-sheet-')).map(c => c.id);
      if (legacySheetCardIds.length > 0) {
        await this.cards.bulkDelete(legacySheetCardIds);
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
        } else {
          let updated = false;
          if (existing.id === 'scene-kitchen' && (existing.title === 'Kitchen & Dining' || existing.description !== scene.description)) {
            existing.title = scene.title;
            existing.titleZh = scene.titleZh;
            existing.description = scene.description;
            existing.descriptionZh = scene.descriptionZh;
            updated = true;
          }
          if (existing.id === 'scene-livingroom' && existing.description !== scene.description) {
            existing.description = scene.description;
            existing.descriptionZh = scene.descriptionZh;
            updated = true;
          }
          if (!existing.titleZh && scene.titleZh) {
            existing.titleZh = scene.titleZh;
            existing.descriptionZh = scene.descriptionZh;
            updated = true;
          }
          if (updated) {
            await this.visualScenes.put(existing);
          }
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
          if (hs.id === 'hs-chair' && existing.label !== hs.label) {
            existing.label = hs.label;
            existing.labelZh = hs.labelZh;
            existing.spokenText = hs.spokenText;
            existing.spokenTextZh = hs.spokenTextZh;
            await this.hotspots.put(existing);
          } else if ((hs.sceneId === 'scene-kitchen' || hs.sceneId === 'scene-bedroom' || hs.sceneId === 'scene-garden') && (existing.x !== hs.x || existing.y !== hs.y || existing.width !== hs.width || existing.height !== hs.height)) {
            existing.x = hs.x;
            existing.y = hs.y;
            existing.width = hs.width;
            existing.height = hs.height;
            existing.label = hs.label;
            existing.labelZh = hs.labelZh;
            existing.spokenText = hs.spokenText;
            existing.spokenTextZh = hs.spokenTextZh;
            existing.color = hs.color;
            await this.hotspots.put(existing);
          } else if (!existing.labelZh || !existing.spokenTextZh) {
            existing.labelZh = existing.labelZh || hs.labelZh;
            existing.spokenTextZh = existing.spokenTextZh || hs.spokenTextZh;
            await this.hotspots.put(existing);
          }
        }
      }

      // Clean up removed dining chair hotspots if present
      await this.hotspots.delete('hs-chair-left');
      await this.hotspots.delete('hs-chair-right');
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
