/**
 * Constantes globales du projet
 * Utilisées pour la configuration, les URLs, les clés, etc.
 */

// Configuration API - Adapter selon votre backend
export const API_CONFIG = {
  // URL du backend - À adapter avec votre domaine en prod
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000, // 10 secondes
  RETRY_ATTEMPTS: 3,
};

// Configuration AniList GraphQL - API anime externe
export const ANILIST_CONFIG = {
  API_URL: 'https://graphql.anilist.co',
  API_VERSION: '0.1',
};

// Configuration Jikan (Alternative à AniList)
export const JIKAN_CONFIG = {
  API_URL: 'https://api.jikan.moe/v4',
};

// Paramètres de l'application
export const APP_CONFIG = {
  APP_NAME: 'Shiori-Sama',
  APP_VERSION: '1.0.0',
  AUTHOR: 'Votre Nom',
  GITHUB_REPO: 'https://github.com/votre-username/shiori-sama',
};

// Configuration des carrousels
export const CAROUSEL_CONFIG = {
  ITEM_WIDTH: 175, // pixels
  ITEM_HEIGHT: 275, // pixels
  GAP: 24, // pixels
  ITEMS_PER_PAGE: 6,
};

// Configuration du stockage local
export const STORAGE_KEYS = {
  WATCH_HISTORY: 'shiori_watch_history',
  FAVORITES: 'shiori_favorites',
  USER_PREFERENCES: 'shiori_preferences',
  CACHE_CAROUSELS: 'shiori_cache_carousels',
};

// Délai de cache pour les données (en minutes)
export const CACHE_DURATION = {
  CAROUSELS: 60, // 1 heure
  ANIME_DETAILS: 24 * 60, // 24 heures
  SEARCH: 5, // 5 minutes
};

// Genres d'anime populaires
export const GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Supernatural',
  'Thriller',
];

// Statuts possibles
export const STATUSES = ['Ongoing', 'Completed', 'Not yet aired'];

// Types d'anime
export const ANIME_TYPES = ['TV', 'Movie', 'OVA', 'Special', 'ONA'];

// Saisons
export const SEASONS = ['Winter', 'Spring', 'Summer', 'Fall'];
