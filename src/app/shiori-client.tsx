'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * SHIORI-CLIENT - Composant Client d'Initialisation
 * ═════════════════════════════════════════════════════════════════════════════
 * 
 * Architecture & Philosophie:
 * ──────────────────────────
 * Ce composant React gère TOUTE la logique côté client pour l'application Shiori-Sama.
 * Il utilise une approche hybride:
 * 
 *  1. DOM MANIPULATION directe (comme l'original JavaScript)
 *     - Les cartes (cards) d'anime sont créées via createElement()
 *     - Injection directe dans le DOM via containers trouvés par ID
 *     - Maximise la compatibilité avec le style CSS original
 *     - Aucune dépendance React pour le rendu des cartes
 * 
 *  2. REACT useEffect pour l'initialisation
 *     - S'exécute une seule fois au montage du composant
 *     - Lancements des fonctions d'initialisation côté client
 *     - Garantit que le DOM est disponible (client-side rendering)
 * 
 * Structure des Carousels:
 * ───────────────────────
 * Chaque carousel est défini avec:
 *  - id: Identifiant unique pour sélectionner l'élément HTML
 *  - type: 'ANIME' ou 'MANGA'
 *  - filter: Critère de tri (SCORE_DESC, POPULARITY_DESC, etc.)
 *  - daily: Si true, utilise l'API Jikan pour les sorties du jour
 *  - fromStorage: Si true, charge depuis localStorage
 * 
 * APIs Utilisées:
 * ──────────────
 *  - AniList GraphQL (graphql.anilist.co): Animes, Mangas, Infos détaillées
 *  - Jikan REST API (api.jikan.moe): Sorties du jour, données alternatives
 * 
 * Commandes Principales:
 * ─────────────────────
 *  - fillCarousels(): Remplit tous les carousels avec données API
 *  - fetchSeasonBanner(): Charge les 6 top animes de la saison
 *  - initBurgerMenu(): Initialise le menu mobile
 *  - initSearch(): Initialise la barre de recherche
 * 
 * @see page.tsx - Structure HTML principale avec tous les carousels
 * @see AnimeCard.tsx - Composant React optionnel pour les cartes (non-utilisé actuellement)
 */

import { useEffect } from 'react';

/**
 * Type pour les données transformées d'un anime
 * Utilisé en interne pour manipuler les données avant insertion au DOM
 */
interface AnimeData {
  title: string;
  image_url: string;
  startDate?: { year: number; month: number; day: number };
  averageScore: number;
  popularity: number;
  seasonEpisode: string;
  type: string;
  language: string;
}

/**
 * SHIORI-CLIENT COMPONENT
 * 
 * Convertit l'intégralité du JavaScript d'origine en composant React
 * Contient TOUS les noms d'origine et la même logique
 * 
 * Gère:
 * - Affichage des carousels (fillCarousels, createCard)
 * - API AniList et Jikan (fetchAniList, fetchJikanDaily)
 * - Menu burger mobile (gestion du DOM)
 * - Recherche (gestion de l'input)
 * - Bannière de saison (fetchSeasonBanner)
 */

/**
 * ===============================================================
 *              CONFIGURATION DES CAROUSELS
 * ===============================================================
 * 
 * Définition de tous les carousels présents sur la page.
 * Chaque carousel a un ID unique et des paramètres spécifiques
 */
const carousels = [
  {
    id: 'carousel-reprendre',
    type: 'ANIME',
    fromStorage: true // Charge l'historique de visionnage depuis localStorage
  },
  {
    id: 'carousel-sorties-jour',
    type: 'ANIME',
    daily: true, // Utilise l'API Jikan pour obtenir les sorties du jour
    perPage: 50
  },
  {
    id: 'carousel-episodes',
    type: 'ANIME',
    filter: 'POPULARITY_DESC',
    perPage: 50
  },
  {
    id: 'carousel-scans',
    type: 'MANGA',
    filter: 'POPULARITY_DESC',
    perPage: 50
  },
  {
    id: 'carousel-classiques',
    type: 'ANIME',
    filter: 'SCORE_DESC',
    perPage: 50
  }
];

/**
 * ===============================================================
 *          REQUÊTE GRAPHQL ANILIST
 * ===============================================================
 * 
 * Génère une requête GraphQL pour l'API AniList.
 * AniList est une base de données communautaire d'animes et mangas.
 */
function getAniListQuery(type = 'ANIME') {
  return `query ($page: Int, $perPage: Int, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      media(type: ${type}, sort: $sort) {
        id
        title {
          userPreferred
          romaji
        }
        coverImage {
          large
          medium
        }
        startDate {
          year
          month
          day
        }
        season
        episodes
        averageScore
        popularity
        type
        staff(page: 1, perPage: 1) {
          edges {
            node {
              language
            }
          }
        }
      }
    }
  }`;
}

/**
 * ===============================================================
 *          FETCH API ANILIST
 * ===============================================================
 * 
 * Récupère les données depuis l'API AniList via GraphQL.
 * 
 * @param {string} type - Type de média : 'ANIME' ou 'MANGA'
 * @param {Array} sort - Critères de tri (ex: ['SCORE_DESC'])
 * @param {number} page - Numéro de page (pagination)
 * @param {number} perPage - Nombre d'éléments par page
 * @returns {Array} Tableau d'objets contenant les infos des médias
 */
async function fetchAniList(type = 'ANIME', sort = ['SCORE_DESC'], page = 1, perPage = 12) {
  try {
    // Requête POST vers l'API GraphQL d'AniList
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query: getAniListQuery(type),
        variables: { page, perPage, sort }
      })
    });
    
    const data = await response.json() as Record<string, any>;
    
    // Gestion des erreurs API
    if (data.errors) {
      console.error('Erreur API AniList:', data.errors);
      return [];
    }
    
    // Transformation des données pour un format unifié
    const media = (data.data?.Page?.media as Array<Record<string, any>>) || [];
    return media.map((m: Record<string, any>) => ({
      title: (m.title as Record<string, any>)?.userPreferred || (m.title as Record<string, any>)?.romaji || 'N/A',
      image_url: (m.coverImage as Record<string, any>)?.large || (m.coverImage as Record<string, any>)?.medium || '',
      startDate: m.startDate as AnimeData['startDate'],
      averageScore: (m.averageScore as number) || 0,
      popularity: (m.popularity as number) || 0,
      seasonEpisode: (m.season && m.episodes) ? `${m.season}${m.episodes}` : "",
      type: (m.type as string) || "ANIME",
      language: (((m.staff as Record<string, any>)?.edges as Array<any>)?.[0]?.node as Record<string, any>)?.language as string || "JP"
    } as AnimeData));

  } catch (err) {
    console.error('Erreur fetch AniList:', err);
    return [];
  }
}

/**
 * ===============================================================
 *       FETCH API JIKAN (SORTIES DU JOUR)
 * ===============================================================
 * 
 * Récupère les animes diffusés aujourd'hui via l'API Jikan.
 * Jikan est une API REST non officielle de MyAnimeList.
 * 
 * @returns {Array} Tableau d'animes diffusés aujourd'hui
 */
async function fetchJikanDaily() {
  try {
    const today = new Date();
    const weekday = today.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
    
    // Correspondance entre numéro de jour et nom en anglais pour l'API
    const jikanWeekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    // Requête vers l'endpoint des sorties par jour
    const response = await fetch(`https://api.jikan.moe/v4/schedules/${jikanWeekdays[weekday]}`);
    const data = await response.json() as Record<string, any>;
    
    if (!data.data) return [];
    
    // Filtrage et transformation des données
    const results = (data.data as Array<Record<string, any>>)
      .filter((item: Record<string, any>) => item.rating !== "Rx") // Exclut le contenu adulte (Rx = hentai)
      .map((m: Record<string, any>) => ({
        title: (m.title as string) || 'N/A',
        image_url: ((m.images as Record<string, any>)?.jpg as Record<string, any>)?.image_url || '',
        startDate: {
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate()
        },
        averageScore: (m.score as number) ? (m.score as number) * 10 : 0, // Conversion note/10 vers note/100
        popularity: (m.members as number) || 0,
        seasonEpisode: (m.episodes as number) ? `E${m.episodes}` : "",
        type: ((m.type as string) || 'ANIME').toUpperCase(),
        language: "JP"
      } as AnimeData));
    
    // Filtre pour garder les animes bien notés et populaires
    return results.filter((item: AnimeData) =>
        item.averageScore >= 70 && item.popularity >= 1000
      );

  } catch (err) {
    console.error('Erreur fetch Jikan:', err);
    return [];
  }
}

/**
 * ===============================================================
 *          GESTION DES DRAPEAUX (LANGUES)
 * ===============================================================
 * 
 * Convertit un code de langue en classe drapeau pour flag-icons.
 * 
 * @param {string} language - Code langue (ex: "JAPANESE", "JP")
 * @returns {string} Classe du drapeau correspondant
 */
function getFlagClass(language: string) {
  const map: Record<string, string> = {
    "JAPANESE": "fi fi-jp",
    "ENGLISH": "fi fi-us",
    "FRENCH": "fi fi-fr",
    "JP": "fi fi-jp",
    "EN": "fi fi-us",
    "FR": "fi fi-fr"
  };
  return map[language.toUpperCase()] || "fi fi-xx"; // drapeau générique si inconnu
}

/**
 * ===============================================================
 *       CRÉATION D'UNE CARD (CARTE ANIME)
 * ===============================================================
 * 
 * Génère une carte HTML pour afficher un anime/manga.
 * Utilise les mêmes classes CSS que l'original pour compatibilité DOM.
 * 
 * @param {AnimeData} item - Objet contenant les données du média
 * @returns {HTMLElement} Élément div.shiori-card à insérer dans le DOM
 */
function createCard(item: AnimeData) {
  const card = document.createElement('div');
  card.className = 'shiori-card';

  // Construction du HTML de la carte avec les classes CSS originales
  card.innerHTML = `
    <img src="${item.image_url}" alt="${item.title}" loading="lazy">
    <div class="card-title">${item.title}</div>
    <div class="card-type">${item.type || "ANIME"}</div>
    <div class="card-language"><span class="${getFlagClass(item.language)}"></span></div>
    <div class="card-info">
      <span>${item.seasonEpisode || "N/A"}</span>
    </div>
  `;
  return card;
}

/**
 * ===============================================================
 *       AFFICHAGE DE LA DATE DU JOUR
 * ===============================================================
 * 
 * Met à jour le titre de la section "Sorties du jour" avec la date actuelle.
 * Format : "SORTIES DU LUNDI - 10/12"
 */
function setDateTitle() {
  const dateTitle = document.getElementById('date-title');
  if (!dateTitle) return;

  const now = new Date();
  const jours = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];

  const jour = jours[now.getDay()];
  const jourNum = String(now.getDate()).padStart(2, '0');
  const mois = String(now.getMonth() + 1).padStart(2, '0');

  dateTitle.textContent = `SORTIES DU ${jour} - ${jourNum}/${mois}`;
}

/**
 * ===============================================================
 *          REMPLISSAGE DES CAROUSELS
 * ===============================================================
 * 
 * Fonction principale qui remplit tous les carousels définis.
 * Pour chaque carousel :
 * - Vérifie la source de données (API ou localStorage)
 * - Récupère les données
 * - Filtre selon les critères
 * - Génère et insère les cards dans le DOM
 */
async function fillCarousels() {

  // Mise à jour de la date pour "Sorties du jour"
  setDateTitle();

  // Boucle sur chaque carousel défini dans la configuration
  for (const c of carousels) {

    const container = document.getElementById(c.id);
    if (!container) continue;

    // Gestion du carousel "Reprenez votre visionnage"
    if ((c as Record<string, unknown>).fromStorage) {
      const stored = localStorage.getItem('lastWatched');
      
      // Si aucun historique, masque toute la section
      if (!stored) {
        const parent = container.parentElement;
        if (parent) parent.style.display = 'none';
        continue;
      }
      
      // TODO: Implémenter la logique de récupération depuis localStorage
      // Format attendu : JSON array d'objets anime
    }

    let items: AnimeData[] = [];

    // Si carousel "Sorties du jour", utilise l'API Jikan
    if ((c as Record<string, unknown>).daily) {
      items = await fetchJikanDaily();
    } 
    // Sinon, utilise AniList avec les filtres appropriés
    else {
      let sort = ['SCORE_DESC']; // Tri par défaut

      // Tri par popularité pour les nouveautés
      if (c.id === 'carousel-episodes' || c.id === 'carousel-scans') {
        sort = ['POPULARITY_DESC'];
      }

      const data = await fetchAniList(c.type, sort, 1, ((c as Record<string, unknown>).perPage as number) || 12);

      // Filtrage de qualité : note >= 70/100 et popularité >= 500
      items = data.filter((item) => 
        item.averageScore >= 70 && item.popularity >= 500
      ) as AnimeData[];

      // Filtrage renforcé pour les classiques
      if (c.id === 'carousel-classiques') {
        items = items.filter((item) => item.popularity >= 5000) as AnimeData[];
      }
    }

    // Génération et insertion des cards dans le DOM
    items.forEach((item: AnimeData) => container.appendChild(createCard(item)));

  }
}

/**
 * ===============================================================
 *       BANNIÈRE DE LA SAISON ACTUELLE
 * ===============================================================
 * 
 * Récupère et affiche les animes populaires de la saison en cours.
 * Les saisons sont :
 * - WINTER (Hiver) : Janvier à Mars
 * - SPRING (Printemps) : Avril à Juin
 * - SUMMER (Été) : Juillet à Septembre
 * - FALL (Automne) : Octobre à Décembre
 */
async function fetchSeasonBanner() {
  try {
    const today = new Date();
    const month = today.getMonth() + 1; // getMonth() retourne 0-11
  
    // Détermination de la saison actuelle
    let season;
    if (month >= 3 && month <= 5) season = 'SPRING';
    else if (month >= 6 && month <= 8) season = 'SUMMER';
    else if (month >= 9 && month <= 11) season = 'FALL';
    else season = 'WINTER';
  
    const year = today.getFullYear();
  
    // Requête GraphQL pour les animes de la saison
    const query = `query ($year: Int, $season: MediaSeason, $perPage: Int) {
      Page(page: 1, perPage: $perPage) {
        media(seasonYear: $year, season: $season, sort: POPULARITY_DESC, type: ANIME) {
          title {
            userPreferred
            romaji
          }
          coverImage {
            large
          }
          siteUrl
        }
      }
    }`;
  
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { year, season, perPage: 6 } // Top 6 de la saison
      })
    });
  
    const data = await response.json() as Record<string, any>;
  
    // Insertion des images dans le conteneur de la bannière
    const bannerContainer = document.getElementById('season-banner-images');
    if (!bannerContainer) return;
    
    bannerContainer.innerHTML = ''; // Vidage du conteneur
  
    (data?.data?.Page?.media as Array<Record<string, any>> || []).forEach((anime: Record<string, any>) => {
      const img = document.createElement('img');
      img.src = ((anime.coverImage as Record<string, any>)?.large as string) || '';
      img.alt = ((anime.title as Record<string, any>)?.userPreferred as string) || ((anime.title as Record<string, any>)?.romaji as string) || 'Anime';
      img.loading = "lazy"; // Optimisation du chargement
      img.decoding = "async";
      
      // Clic sur l'image = ouverture de la page AniList dans un nouvel onglet
      img.onclick = () => {
        const siteUrl = anime.siteUrl as string;
        if (siteUrl) window.open(siteUrl, '_blank');
      };
      
      bannerContainer.appendChild(img);
    });

  } catch (err) {
    console.error("Erreur fetch season banner:", err);
  }
}

/**
 * ===============================================================
 *       GESTION DU MENU BURGER MOBILE
 * ===============================================================
 * 
 * Gestion complète du menu burger mobile:
 * - Toggle du menu au clic sur le bouton
 * - Fermeture au clic sur l'overlay
 * - Fermeture au clic sur un lien
 * - Blocage du scroll du body quand le menu est ouvert
 */
function initBurgerMenu() {
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.querySelector('.mobile-menu-top');
  const overlay = document.querySelector('.menu-overlay');
  
  // Vérification de l'existence des éléments (prévention d'erreurs)
  if (!burgerBtn || !mobileMenu || !overlay) {
    console.warn('Elements du menu burger non trouvés');
    return;
  }
  
  // Toggle du menu au clic sur le burger
  burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('burger-open');
    mobileMenu.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });
  
  // Fermeture du menu au clic sur l'overlay (zone sombre)
  overlay.addEventListener("click", () => {
    burgerBtn.classList.remove("burger-open");
    mobileMenu.classList.remove("open");
    overlay.classList.remove("active");
    document.body.classList.remove('no-scroll');
  });
  
  // Fermeture du menu au clic sur un lien de navigation
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burgerBtn.classList.remove('burger-open');
      overlay.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });
}

/**
 * ===============================================================
 *       GESTION DE LA BARRE DE RECHERCHE
 * ===============================================================
 * 
 * Gestion complète de la barre de recherche:
 * - Affichage des résultats au focus et à la saisie
 * - Masquage des résultats au clic en dehors
 * - TODO: Logique de recherche réelle dans les APIs
 */
function initSearch() {
  const searchInput = document.querySelector('.shiori-desktop-search input') as HTMLInputElement;
  const resultBox = document.getElementById('shiori-result-desktop');
  
  if (!searchInput || !resultBox) return;
  
  // Affichage des résultats au focus (si l'input n'est pas vide)
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length > 0) {
      resultBox.style.display = 'block';
    }
  });
  
  // Affichage/masquage des résultats pendant la saisie
  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim().length > 0) {
      resultBox.style.display = 'block';
      
      // TODO: Implémenter la recherche réelle via AniList ou Jikan
      // Exemple : fetchAniList('ANIME', ['SEARCH'], 1, 10, searchInput.value)
    } else {
      resultBox.style.display = 'none';
    }
  });
  
  // Fermeture des résultats au clic en dehors de la zone de recherche
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target as Node) && !resultBox.contains(e.target as Node)) {
      resultBox.style.display = 'none';
    }
  });
}

/**
 * ===============================================================
 *       COMPOSANT REACT - SHIORI CLIENT
 * ===============================================================
 * 
 * Composant client qui initialise toute la logique au montage
 * Utilise useEffect pour s'exécuter côté client uniquement
 */
export default function ShioriClient() {
  useEffect(() => {
    // Initialisation au montage du composant
    
    // 1) Remplissage des carousels
    fillCarousels();

    // 2) Chargement de la bannière de saison
    fetchSeasonBanner();

    // 3) Mise à jour de l'année du copyright
    const copyrightYear = document.getElementById('date-copyright');
    if (copyrightYear) {
      copyrightYear.textContent = new Date().getFullYear().toString();
    }

    // 4) Initialisation du menu burger
    initBurgerMenu();

    // 5) Initialisation de la recherche
    initSearch();

  }, []); // Dependencies vide = s'exécute une seule fois au montage

  // Le composant ne rend rien visuellement
  // Toute la logique se passe en manipulation du DOM
  return null;
}

