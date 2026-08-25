import { useState, useEffect, useCallback } from 'react';
import {
  AACCategory,
  AACCard,
  VisualScene,
  VisualSceneHotspot,
  MediaBlobRecord,
} from '../types';
import { db } from '../services/db/AppDatabase';
import { sheetDataStore } from '../services/googleSheets/sheetDataStore';

export function useDatabase() {
  const [isReady, setIsReady] = useState(false);
  const [categories, setCategories] = useState<AACCategory[]>([]);
  const [cards, setCards] = useState<AACCard[]>([]);
  const [visualScenes, setVisualScenes] = useState<VisualScene[]>([]);
  const [hotspots, setHotspots] = useState<VisualSceneHotspot[]>([]);

  const loadAll = useCallback(async () => {
    try {
      await db.initializeDefaults();
      const [cats, crds, scenes, hs] = await Promise.all([
        db.categories.orderBy('order').toArray(),
        db.cards.orderBy('order').toArray(),
        db.visualScenes.toArray(),
        db.hotspots.toArray(),
      ]);

      const inMemoryCards = sheetDataStore.getSheetCards();

      // Deduplicate Cards: Keep DB card if exists, otherwise add in-memory card
      const existingCardLabels = new Set(crds.map((c) => c.label.toLowerCase().trim()));
      const mergedCards = [...crds];
      for (const card of inMemoryCards) {
        if (!existingCardLabels.has(card.label.toLowerCase().trim())) {
          mergedCards.push(card);
          existingCardLabels.add(card.label.toLowerCase().trim());
        }
      }

      setCategories(cats);
      setCards(mergedCards);
      setVisualScenes(scenes);
      setHotspots(hs);
      setIsReady(true);
    } catch (err) {
      console.error('Failed to initialize database:', err);
    }
  }, []);

  useEffect(() => {
    loadAll();
    const unsubscribe = sheetDataStore.subscribe(() => {
      loadAll();
    });
    return () => unsubscribe();
  }, [loadAll]);

  // Card Operations
  const saveCard = async (card: AACCard) => {
    await db.cards.put(card);
    await loadAll();
  };

  const deleteCard = async (id: string) => {
    await db.cards.delete(id);
    await loadAll();
  };

  // Category Operations
  const saveCategory = async (category: AACCategory) => {
    await db.categories.put(category);
    await loadAll();
  };

  const deleteCategory = async (id: string) => {
    await db.transaction('rw', [db.categories, db.cards], async () => {
      await db.categories.delete(id);
      await db.cards.where('categoryId').equals(id).delete();
    });
    await loadAll();
  };

  // Visual Scene Operations
  const saveVisualScene = async (scene: VisualScene) => {
    await db.visualScenes.put(scene);
    await loadAll();
  };

  const deleteVisualScene = async (id: string) => {
    await db.transaction('rw', [db.visualScenes, db.hotspots], async () => {
      await db.visualScenes.delete(id);
      await db.hotspots.where('sceneId').equals(id).delete();
    });
    await loadAll();
  };

  // Hotspot Operations
  const saveHotspot = async (hotspot: VisualSceneHotspot) => {
    await db.hotspots.put(hotspot);
    await loadAll();
  };

  const deleteHotspot = async (id: string) => {
    await db.hotspots.delete(id);
    await loadAll();
  };

  // Media Blob Operations
  const saveMediaBlob = async (blob: MediaBlobRecord) => {
    await db.mediaBlobs.put(blob);
  };

  const getMediaBlob = async (id: string): Promise<MediaBlobRecord | undefined> => {
    return await db.mediaBlobs.get(id);
  };

  return {
    isReady,
    categories,
    cards,
    visualScenes,
    hotspots,
    refreshDatabase: loadAll,
    saveCard,
    deleteCard,
    saveCategory,
    deleteCategory,
    saveVisualScene,
    deleteVisualScene,
    saveHotspot,
    deleteHotspot,
    saveMediaBlob,
    getMediaBlob,
  };
}
