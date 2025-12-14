/**
 * Fonctions utilitaires réutilisables dans l'application
 * Helpers, formatters, validators, etc.
 */

/**
 * Formate une note score (0-100) en format lisible
 * @param score - Score entre 0 et 100
 * @returns Score formaté avec couleur (ex: "8.5/10")
 */
export const formatScore = (score: number): string => {
  return (score / 10).toFixed(1) + '/10';
};

/**
 * Formate une date pour affichage français
 * @param dateString - Date ISO string
 * @returns Date formatée (ex: "15 décembre 2024")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return formatter.format(date);
};

/**
 * Vérifie si une date est dans le passé
 * @param dateString - Date ISO string
 * @returns true si la date est passée
 */
export const isPastDate = (dateString: string): boolean => {
  return new Date(dateString) < new Date();
};

/**
 * Obtient le jour actuel au format français
 * @returns Jour au format "Sorties du Lundi 14 décembre"
 */
export const getTodayFormatted = (): string => {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  
  const today = new Date();
  const dayName = days[today.getDay()];
  const date = today.getDate();
  const month = months[today.getMonth()];
  
  return `SORTIES DU ${dayName.toUpperCase()} ${date} ${month.toUpperCase()}`;
};

/**
 * Obtient la saison actuelle
 * @returns Saison (Winter, Spring, Summer, Fall)
 */
export const getCurrentSeason = (): 'Winter' | 'Spring' | 'Summer' | 'Fall' => {
  const month = new Date().getMonth();
  if (month >= 11 || month <= 1) return 'Winter';
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  return 'Fall';
};

/**
 * Sauvegarde des données dans le localStorage avec gestion d'erreur
 * @param key - Clé de stockage
 * @param data - Données à sauvegarder
 */
export const saveToLocalStorage = (key: string, data: unknown): void => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
  }
};

/**
 * Récupère des données du localStorage avec gestion d'erreur
 * @param key - Clé de stockage
 * @returns Données désérialisées ou null
 */
export const getFromLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Erreur lors de la lecture de ${key}:`, error);
    return null;
  }
};

/**
 * Ajoute un anime à l'historique de visionnage
 * @param animeId - ID de l'anime
 * @param animeTitle - Titre de l'anime
 * @param currentEpisode - Épisode actuel
 * @param totalEpisodes - Total d'épisodes
 * @param image - URL de l'image
 */
export const addToWatchHistory = (
  animeId: number,
  animeTitle: string,
  currentEpisode: number,
  totalEpisodes: number,
  image: string
): void => {
  const historyData = getFromLocalStorage('shiori_watch_history');
  const history = Array.isArray(historyData) ? historyData : [];
  
  // Vérifie si l'anime est déjà dans l'historique
  const existingIndex = history.findIndex((item: unknown) => (item as Record<string, unknown>).animeId === animeId);
  
  const newItem = {
    animeId,
    animeTitle,
    lastWatchedAt: new Date().toISOString(),
    currentEpisode,
    totalEpisodes,
    image,
  };

  if (existingIndex !== -1) {
    // Met à jour l'entrée existante
    history[existingIndex] = newItem;
  } else {
    // Ajoute une nouvelle entrée
    history.unshift(newItem);
    // Limite à 30 éléments
    if (history.length > 30) {
      history.pop();
    }
  }

  saveToLocalStorage('shiori_watch_history', history);
};

/**
 * Récupère l'historique de visionnage
 * @returns Tableau d'éléments de l'historique
 */
export const getWatchHistory = (): unknown[] => {
  return getFromLocalStorage('shiori_watch_history') || [];
};

/**
 * Gère le cache avec timestamp
 */
export const cacheWithTimestamp = {
  /**
   * Sauvegarde des données en cache avec timestamp
   */
  set: (key: string, data: unknown, durationMinutes: number): void => {
    const cacheData = {
      data,
      timestamp: Date.now(),
      expiresIn: durationMinutes * 60 * 1000,
    };
    saveToLocalStorage(key, cacheData);
  },

  /**
   * Récupère des données en cache si toujours valides
   */
  get: <T>(key: string): T | null => {
    const cached = getFromLocalStorage<{
      data: T;
      timestamp: number;
      expiresIn: number;
    }>(key);

    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.expiresIn;
    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }

    return cached.data;
  },

  /**
   * Efface le cache d'une clé
   */
  clear: (key: string): void => {
    localStorage.removeItem(key);
  },
};

/**
 * Utilitaire pour les requêtes avec retry
 */
export const fetchWithRetry = async (
  url: string,
  options?: RequestInit,
  retries: number = 3
): Promise<Response> => {
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status === 404) throw new Error('Not found');
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
      if (i < retries - 1) {
        // Attente exponentielle: 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  throw lastError;
};

/**
 * Tronque un texte avec ellipsis
 * @param text - Texte à tronquer
 * @param maxLength - Longueur maximale
 * @returns Texte tronqué
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Débounce une fonction
 * @param func - Fonction à débouncer
 * @param delay - Délai en ms
 * @returns Fonction débouncer
 */
export function debounce<Args extends unknown[]>(
  func: (...args: Args) => void | Promise<void>,
  delay: number
): (...args: Args) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
