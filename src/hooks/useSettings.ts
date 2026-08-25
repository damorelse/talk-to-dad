import { useState, useEffect, useCallback } from 'react';
import { AppSettings } from '../types';
import { db } from '../services/db/AppDatabase';
import { DEFAULT_SETTINGS } from '../services/db/defaultData';

// Global shared state and listener registry for real-time reactivity across all components
let globalSettings: AppSettings = DEFAULT_SETTINGS;
let isLoaded = false;
const listeners = new Set<(s: AppSettings) => void>();

function applyThemeToDOM(theme: 'dark' | 'light') {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'high-contrast');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
  }
}

function notifyListeners(newSettings: AppSettings) {
  globalSettings = newSettings;
  applyThemeToDOM(newSettings.theme);
  listeners.forEach((fn) => {
    try {
      fn(newSettings);
    } catch {}
  });
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(globalSettings);
  const [loading, setLoading] = useState(!isLoaded);

  const loadSettings = useCallback(async () => {
    try {
      let saved = await db.settings.get('current');
      if (!saved) {
        await db.settings.put(DEFAULT_SETTINGS);
        saved = DEFAULT_SETTINGS;
      }
      isLoaded = true;
      notifyListeners(saved);
      setSettings(saved);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const listener = (newSettings: AppSettings) => {
      setSettings(newSettings);
      setLoading(false);
    };
    listeners.add(listener);

    if (!isLoaded) {
      loadSettings();
    } else {
      setSettings(globalSettings);
      setLoading(false);
      applyThemeToDOM(globalSettings.theme);
    }

    return () => {
      listeners.delete(listener);
    };
  }, [loadSettings]);

  const updateSettings = async (updates: Partial<AppSettings>) => {
    const updated: AppSettings = { ...globalSettings, ...updates, id: 'current' };
    notifyListeners(updated);
    setSettings(updated);
    try {
      await db.settings.put(updated);
    } catch (err) {
      console.warn('[Settings] Failed to persist to IndexedDB:', err);
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    refreshSettings: loadSettings,
  };
}
