/**
 * Service pour récupérer les données des animes
 * Appelle directement AniList GraphQL (pas besoin de routes API intermédiaires)
 * 
 * Cela évite les problèmes d'export statique avec Next.js
 */

import { Anime, SearchResult, AniListAnime } from '@/types';
import { CACHE_DURATION } from '@/lib/constants';
import { cacheWithTimestamp } from '@/lib/utils';

const ANILIST_API = 'https://graphql.anilist.co';

/**
 * Effectue une requête GraphQL à AniList avec retry
 */
const fetchAniListGraphQL = async (query: string, variables?: Record<string, unknown>) => {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(ANILIST_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.errors) {
        throw new Error(`GraphQL error: ${data.errors[0]?.message}`);
      }

      return data.data;
    } catch (error) {
      lastError = error as Error;
      // Attendre avant retry (exponential backoff)
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  throw lastError || new Error('Failed to fetch from AniList after retries');
};

/**
 * Transforme les données AniList au format standardisé de l'app
 */
const transformAniListAnime = (anilistAnime: AniListAnime): Anime => {
  const formatTypeMap: Record<string, 'TV' | 'Movie' | 'OVA' | 'Special' | 'ONA'> = {
    TV: 'TV',
    MOVIE: 'Movie',
    OVA: 'OVA',
    SPECIAL: 'Special',
    ONA: 'ONA',
  };

  const statusMap: Record<string, 'Ongoing' | 'Completed' | 'Not yet aired'> = {
    RELEASING: 'Ongoing',
    FINISHED: 'Completed',
    NOT_YET_RELEASED: 'Not yet aired',
  };

  return {
    id: anilistAnime.id,
    title: anilistAnime.title.romaji || anilistAnime.title.english || 'Anime inconnu',
    englishTitle: anilistAnime.title.english,
    image: anilistAnime.coverImage.large,
    description: anilistAnime.description || 'No description available',
    type: formatTypeMap[anilistAnime.format] || 'TV',
    status: statusMap[anilistAnime.status] || 'Completed',
    episodes: anilistAnime.episodes || 0,
    score: anilistAnime.meanScore || 0,
    season: {
      year: anilistAnime.seasonYear,
      season: (anilistAnime.season as string) as 'Winter' | 'Spring' | 'Summer' | 'Fall',
    },
    genres: anilistAnime.genres || [],
    studios: (anilistAnime.studios as { nodes: { name: string }[] } | undefined)?.nodes?.map(s => s.name) || [],
    aired: {
      from: formatDateFromAnilist(anilistAnime.startDate),
      to: formatDateFromAnilist(anilistAnime.endDate),
    },
  };
};

/**
 * Formate une date AniList au format ISO
 */
const formatDateFromAnilist = (dateObj: AniListAnime['startDate']): string => {
  if (!dateObj || !dateObj.year) return '';
  const month = String(dateObj.month || 1).padStart(2, '0');
  const day = String(dateObj.day || 1).padStart(2, '0');
  return `${dateObj.year}-${month}-${day}`;
};

/**
 * Query GraphQL pour les animes tendance
 */
const TRENDING_QUERY = `
  query {
    Page(perPage: 12, sort: TRENDING_DESC) {
      media(type: ANIME) {
        id
        title { romaji english }
        coverImage { large }
        description
        format
        status
        episodes
        meanScore
        seasonYear
        season
        genres
        startDate { year month day }
        endDate { year month day }
        studios(isMain: true) { nodes { name } }
      }
    }
  }
`;

/**
 * Récupère les animes tendance actuels
 * @returns Liste des animes en tendance
 */
export const fetchTrendingAnimes = async (): Promise<Anime[]> => {
  const cached = cacheWithTimestamp.get<Anime[]>('trending_animes');
  if (cached) return cached;

  try {
    const data = await fetchAniListGraphQL(TRENDING_QUERY);
    const animes = data.Page.media.map((anime: AniListAnime) =>
      transformAniListAnime(anime)
    );

    cacheWithTimestamp.set('trending_animes', animes, CACHE_DURATION.CAROUSELS);
    return animes;
  } catch (error) {
    console.error('Erreur lors de la récupération des animes tendance:', error);
    return [];
  }
};

/**
 * Query GraphQL pour les animes d'une saison
 */
const SEASONAL_QUERY = `
  query GetSeasonal($season: MediaSeason!, $year: Int!) {
    Page(perPage: 12) {
      media(season: $season, seasonYear: $year, type: ANIME) {
        id
        title { romaji english }
        coverImage { large }
        description
        format
        status
        episodes
        meanScore
        seasonYear
        season
        genres
        startDate { year month day }
        endDate { year month day }
        studios(isMain: true) { nodes { name } }
      }
    }
  }
`;

/**
 * Récupère les animes d'une saison spécifique
 * @param season - Saison (Winter, Spring, Summer, Fall)
 * @param year - Année
 * @returns Liste des animes de la saison
 */
export const fetchSeasonalAnimes = async (
  season: 'Winter' | 'Spring' | 'Summer' | 'Fall',
  year: number
): Promise<Anime[]> => {
  const cacheKey = `seasonal_${season}_${year}`;
  const cached = cacheWithTimestamp.get<Anime[]>(cacheKey);
  if (cached) return cached;

  try {
    const seasonUpper = season.toUpperCase() as 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';
    const data = await fetchAniListGraphQL(SEASONAL_QUERY, {
      season: seasonUpper,
      year,
    });

    const animes = data.Page.media.map((anime: AniListAnime) =>
      transformAniListAnime(anime)
    );

    cacheWithTimestamp.set(cacheKey, animes, CACHE_DURATION.CAROUSELS);
    return animes;
  } catch (error) {
    console.error(`Erreur lors de la récupération des animes ${season} ${year}:`, error);
    return [];
  }
};

/**
 * Query GraphQL pour la recherche
 */
const SEARCH_QUERY = `
  query SearchAnime($query: String!, $page: Int!) {
    Page(perPage: 12, page: $page) {
      pageInfo { total }
      media(search: $query, type: ANIME) {
        id
        title { romaji english }
        coverImage { large }
        description
        format
        status
        episodes
        meanScore
        seasonYear
        season
        genres
        startDate { year month day }
        endDate { year month day }
        studios(isMain: true) { nodes { name } }
      }
    }
  }
`;

/**
 * Recherche des animes par requête
 * @param query - Requête de recherche
 * @param page - Numéro de la page
 * @returns Résultats de recherche
 */
export const searchAnimes = async (query: string, page = 1): Promise<SearchResult> => {
  if (!query.trim()) return { total: 0, animes: [], query };

  const cacheKey = `search_${query}_${page}`;
  const cached = cacheWithTimestamp.get<SearchResult>(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchAniListGraphQL(SEARCH_QUERY, {
      query,
      page,
    });

    const result: SearchResult = {
      total: data.Page.pageInfo.total || 0,
      animes: data.Page.media.map((anime: AniListAnime) =>
        transformAniListAnime(anime)
      ),
      query,
    };

    cacheWithTimestamp.set(cacheKey, result, CACHE_DURATION.SEARCH);
    return result;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return { total: 0, animes: [], query };
  }
};
