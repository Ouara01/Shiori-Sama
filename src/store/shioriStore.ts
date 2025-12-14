/**
 * Store Zustand - Gestion d'état globale de l'application
 * Gère les données anime, l'historique, les favoris, etc.
 */

import { create } from 'zustand';
import { Anime, Carousel, WatchHistoryItem } from '@/types';
import { getFromLocalStorage, saveToLocalStorage } from '@/lib/utils';
import { STORAGE_KEYS } from '@/lib/constants';

/**
 * Interface du Store
 */
interface ShioriStore {
  // État des données
  carousels: Carousel[];
  selectedAnime: Anime | null;
  watchHistory: WatchHistoryItem[];
  favorites: number[];
  isLoading: boolean;
  error: string | null;

  // Actions de chargement des données
  setCarousels: (carousels: Carousel[]) => void;
  setSelectedAnime: (anime: Anime | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Actions pour l'historique de visionnage
  addToWatchHistory: (item: WatchHistoryItem) => void;
  removeFromWatchHistory: (animeId: number) => void;
  clearWatchHistory: () => void;

  // Actions pour les favoris
  toggleFavorite: (animeId: number) => void;
  addFavorite: (animeId: number) => void;
  removeFavorite: (animeId: number) => void;
  isFavorite: (animeId: number) => boolean;

  // Actions de gestion du cache
  loadFromLocalStorage: () => void;
  saveToLocalStorage: () => void;
}

/**
 * Crée le store Zustand avec les actions définies
 */
export const useShioriStore = create<ShioriStore>((set, get) => ({
  // État initial
  carousels: [],
  selectedAnime: null,
  watchHistory: [],
  favorites: [],
  isLoading: false,
  error: null,

  // Setters simples pour l'état
  setCarousels: (carousels: Carousel[]) => set({ carousels }),
  setSelectedAnime: (anime: Anime | null) => set({ selectedAnime: anime }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),

  /**
   * Ajoute un anime à l'historique de visionnage
   * Déplace les animes récemment regardés en haut de la liste
   */
  addToWatchHistory: (item: WatchHistoryItem) =>
    set((state) => {
      // Filtre les anciens duplicatas
      const filtered = state.watchHistory.filter(
        (h) => h.animeId !== item.animeId
      );
      // Ajoute le nouvel élément en haut
      return {
        watchHistory: [item, ...filtered].slice(0, 30),
      };
    }),

  /**
   * Supprime un anime de l'historique
   */
  removeFromWatchHistory: (animeId: number) =>
    set((state) => ({
      watchHistory: state.watchHistory.filter((h) => h.animeId !== animeId),
    })),

  /**
   * Vide complètement l'historique
   */
  clearWatchHistory: () => set({ watchHistory: [] }),

  /**
   * Bascule un anime entre favori/non-favori
   */
  toggleFavorite: (animeId: number) =>
    set((state) => {
      if (state.favorites.includes(animeId)) {
        return {
          favorites: state.favorites.filter((id) => id !== animeId),
        };
      } else {
        return {
          favorites: [...state.favorites, animeId],
        };
      }
    }),

  /**
   * Ajoute un anime aux favoris
   */
  addFavorite: (animeId: number) =>
    set((state) => {
      if (!state.favorites.includes(animeId)) {
        return {
          favorites: [...state.favorites, animeId],
        };
      }
      return state;
    }),

  /**
   * Supprime un anime des favoris
   */
  removeFavorite: (animeId: number) =>
    set((state) => ({
      favorites: state.favorites.filter((id) => id !== animeId),
    })),

  /**
   * Vérifie si un anime est dans les favoris
   */
  isFavorite: (animeId: number) => {
    return get().favorites.includes(animeId);
  },

  /**
   * Charge les données depuis le localStorage
   * À appeler une fois au démarrage de l'app
   */
  loadFromLocalStorage: () => {
    const watchHistory =
      getFromLocalStorage<WatchHistoryItem[]>(STORAGE_KEYS.WATCH_HISTORY) || [];
    const favorites = getFromLocalStorage<number[]>(STORAGE_KEYS.FAVORITES) || [];

    set({
      watchHistory,
      favorites,
    });
  },

  /**
   * Sauvegarde les données dans le localStorage
   * À appeler à chaque modification des données persistantes
   */
  saveToLocalStorage: () => {
    const state = get();
    saveToLocalStorage(STORAGE_KEYS.WATCH_HISTORY, state.watchHistory);
    saveToLocalStorage(STORAGE_KEYS.FAVORITES, state.favorites);
  },
}));

/**
 * Hook pour utiliser le store dans les composants
 * Exemple: const { carousels, isLoading } = useShioriStore();
 */
export default useShioriStore;
