/**
 * Types TypeScript globaux pour le projet Shiori-Sama
 * Utilisés par le frontend et backend pour assurer la cohérence des données
 */

/**
 * Données brutes d'AniList - Structure de réponse GraphQL
 */
export interface AniListAnime {
  id: number;
  title: {
    romaji?: string;
    english?: string;
    native?: string;
  };
  coverImage: {
    large: string;
  };
  description?: string;
  format: string;
  status: string;
  episodes: number | null;
  meanScore: number | null;
  seasonYear: number;
  season: string;
  genres?: string[];
  studios?: {
    nodes: Array<{
      name: string;
    }>;
  };
  startDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
  endDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
}

/**
 * Anime - Représente un anime avec toutes ses métadonnées
 */
export interface Anime {
  id: number;
  title: string;
  englishTitle?: string;
  image: string;
  description: string;
  type: 'TV' | 'Movie' | 'OVA' | 'Special' | 'ONA';
  status: 'Ongoing' | 'Completed' | 'Not yet aired';
  episodes: number;
  currentEpisode?: number;
  score: number;
  season: Season;
  genres: string[];
  studios: string[];
  aired: {
    from: string;
    to?: string;
  };
}

/**
 * Season - Saison anime (Hiver, Printemps, etc.)
 */
export interface Season {
  year: number;
  season: 'Winter' | 'Spring' | 'Summer' | 'Fall';
}

/**
 * Carousel - Structure des données d'un carrousel
 */
export interface Carousel {
  id: string;
  title: string;
  description: string;
  animes: Anime[];
  type: 'continuing' | 'recent' | 'episodes' | 'trending' | 'classics';
}

/**
 * UserPreferences - Préférences utilisateur stockées localement
 */
export interface UserPreferences {
  language: 'fr' | 'en' | 'ja';
  theme: 'dark' | 'light';
  watchHistory: WatchHistoryItem[];
  favorites: number[]; // IDs d'animes favoris
}

/**
 * WatchHistoryItem - Un élément de l'historique de visionnage
 */
export interface WatchHistoryItem {
  animeId: number;
  animeTitle: string;
  lastWatchedAt: string;
  currentEpisode: number;
  totalEpisodes: number;
  image: string;
}

/**
 * ApiResponse - Format standard pour les réponses API
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

/**
 * AnimeFilter - Paramètres de filtrage pour la recherche
 */
export interface AnimeFilter {
  genres?: string[];
  year?: number;
  season?: 'Winter' | 'Spring' | 'Summer' | 'Fall';
  status?: 'Ongoing' | 'Completed';
  type?: string;
  minScore?: number;
  limit?: number;
  offset?: number;
}

/**
 * SearchResult - Résultat de recherche
 */
export interface SearchResult {
  total: number;
  animes: Anime[];
  query: string;
}
