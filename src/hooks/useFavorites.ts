import { useState, useEffect, useCallback } from "react";

export type FavoriteType = "dua" | "name" | "verse";

export interface FavoriteItem {
  id: string;
  type: FavoriteType;
  title: string;
  arabic: string;
  transliteration?: string;
  translation?: string;
  meaning?: string;
  category?: string;
  surahNumber?: number;
  verseNumber?: number;
}

const STORAGE_KEY = "muslim_al_muslim_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse favorites:", e);
      }
    }
  }, []);

  const saveFavorites = useCallback((items: FavoriteItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    setFavorites(items);
  }, []);

  const addFavorite = useCallback((item: FavoriteItem) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === item.id);
      if (exists) return prev;
      const updated = [...prev, item];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback((id: string) => {
    return favorites.some((f) => f.id === id);
  }, [favorites]);

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  }, [isFavorite, removeFavorite, addFavorite]);

  const getFavoritesByType = useCallback((type: FavoriteType) => {
    return favorites.filter((f) => f.type === type);
  }, [favorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    getFavoritesByType,
  };
};
