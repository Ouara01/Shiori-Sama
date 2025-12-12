/* =============================================================== */
/*                   CONFIGURATION DES CAROUSELS                   */
/* =============================================================== */

/**
- Définition de tous les carousels présents sur la page.
- Chaque carousel a un ID unique et des paramètres spécifiques :
- - id: Identifiant DOM du conteneur
- - type: Type de média (ANIME ou MANGA)
- - fromStorage: Si true, charge depuis localStorage (historique utilisateur)
- - daily: Si true, utilise l'API Jikan pour les sorties du jour
- - filter: Critère de tri (POPULARITY_DESC, SCORE_DESC, etc.)
- - perPage: Nombre d'éléments à récupérer
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

/* =============================================================== */
/*                   REQUÊTE GRAPHQL ANILIST                       */
/* =============================================================== */

/**
- Génère une requête GraphQL pour l'API AniList.
- AniList est une base de données communautaire d'animes et mangas.
- 
- @param {string} type - Type de média : 'ANIME' ou 'MANGA'
- @returns {string} Requête GraphQL formatée
*/
function getAniListQuery(type = 'ANIME') {
  return `query ($page: Int, $perPage: Int, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      media(type: ${type}, sort: $sort) {
        id
        title {
          userPreferred
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

/* =============================================================== */
/*                   FETCH API ANILIST                             */
/* =============================================================== */

/**
- Récupère les données depuis l'API AniList via GraphQL.
- 
- @param {string} type - Type de média : 'ANIME' ou 'MANGA'
- @param {Array} sort - Critères de tri (ex: ['SCORE_DESC'])
- @param {number} page - Numéro de page (pagination)
- @param {number} perPage - Nombre d'éléments par page
- @returns {Array} Tableau d'objets contenant les infos des médias
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
    
    const data = await response.json();
    
    // Gestion des erreurs API
    if (data.errors) {
      console.error('Erreur API AniList:', data.errors);
      return [];
    }
    
    // Transformation des données pour un format unifié
    return data.data.Page.media.map(m => ({
      title: m.title.userPreferred,
      image_url: m.coverImage.large || m.coverImage.medium,
      startDate: m.startDate,
      averageScore: m.averageScore,
      popularity: m.popularity,
      seasonEpisode: m.season && m.episodes ? `S${m.season}E${m.episodes}` : "",
      type: m.type,
      language: m.staff?.edges[0]?.node.language || "JP"
    }));

  } catch (err) {
    console.error('Erreur fetch AniList:', err);
    return [];
  }
}

/* =============================================================== */
/*                   FETCH API JIKAN (SORTIES DU JOUR)             */
/* =============================================================== */

/**
- Récupère les animes diffusés aujourd'hui via l'API Jikan.
- Jikan est une API REST non officielle de MyAnimeList.
- 
- @returns {Array} Tableau d'animes diffusés aujourd'hui
*/
async function fetchJikanDaily() {
  try {
    const today = new Date();
    const weekday = today.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
    
    // Correspondance entre numéro de jour et nom en anglais pour l'API
    const jikanWeekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    // Requête vers l'endpoint des sorties par jour
    const response = await fetch(`https://api.jikan.moe/v4/schedules/${jikanWeekdays[weekday]}`);
    const data = await response.json();
    
    if (!data.data) return [];
    
    // Filtrage et transformation des données
    return data.data
      .filter(item => item.rating !== "Rx") // Exclut le contenu adulte (Rx = hentai)
      .map(m => ({
        title: m.title,
        image_url: m.images.jpg.image_url,
        startDate: {
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate()
        },
        averageScore: m.score ? m.score * 10 : 0, // Conversion note/10 vers note/100
        popularity: m.members || 0,
        seasonEpisode: m.episodes ? `E${m.episodes}` : "",
        type: m.type.toUpperCase(),
        language: "JP"
      }))
      .filter(item =>
        item.averageScore >= 70 && // Ne garde que les animes bien notés
        item.popularity >= 1000     // Et populaires
      );

  } catch (err) {
    console.error('Erreur fetch Jikan:', err);
    return [];
  }
}

/* =============================================================== */
/*                   GESTION DES DRAPEAUX (LANGUES)                */
/* =============================================================== */

/**
- Convertit un code de langue en emoji drapeau.
- 
- @param {string} language - Code langue (ex: "JAPANESE", "JP")
- @returns {string} Emoji du drapeau correspondant
*/
function getFlagClass(language) {
  const map = {
    "JAPANESE": "fi fi-jp",
    "ENGLISH": "fi fi-us",
    "FRENCH": "fi fi-fr",
    "JP": "fi fi-jp",
    "EN": "fi fi-us",
    "FR": "fi fi-fr"
  };
  return map[language.toUpperCase()] || "fi fi-xx"; // drapeau générique si inconnu
}


/* =============================================================== */
/*                   CRÉATION D'UNE CARD (CARTE ANIME)             */
/* =============================================================== */

/**
- Génère une carte HTML pour afficher un anime/manga.
- 
- @param {Object} item - Objet contenant les données du média
- @returns {HTMLElement} Élément div.shiori-card à insérer dans le DOM
*/
function createCard(item) {
  const card = document.createElement('div');
  card.className = 'shiori-card';

  // Construction du HTML de la carte
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

/* =============================================================== */
/*                   AFFICHAGE DE LA DATE DU JOUR                  */
/* =============================================================== */

/**
- Met à jour le titre de la section "Sorties du jour" avec la date actuelle.
- Format : "SORTIES DU LUNDI - 10/12"
*/
function setDateTitle() {
  const dateTitle = document.getElementById('date-title');
  const now = new Date();

  const jours = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];

  const jour = jours[now.getDay()];
  const jourNum = String(now.getDate()).padStart(2, '0');
  const mois = String(now.getMonth() + 1).padStart(2, '0');

  dateTitle.textContent = `SORTIES DU ${jour} - ${jourNum}/${mois}`;
}

/* =============================================================== */
/*                   REMPLISSAGE DES CAROUSELS                     */
/* =============================================================== */

/**
- Fonction principale qui remplit tous les carousels définis.
- Pour chaque carousel :
- - Vérifie la source de données (API ou localStorage)
- - Récupère les données
- - Filtre selon les critères
- - Génère et insère les cards dans le DOM
*/
async function fillCarousels() {

  // Mise à jour de la date pour "Sorties du jour"
  setDateTitle();

  // Boucle sur chaque carousel défini dans la configuration
  for (const c of carousels) {

    const container = document.getElementById(c.id);

    // Gestion du carousel "Reprenez votre visionnage"
    if (c.fromStorage) {
      const stored = localStorage.getItem('lastWatched');
      
      // Si aucun historique, masque toute la section
      if (!stored) {
        container.parentElement.style.display = 'none';
        continue;
      }
      
      // TODO: Implémenter la logique de récupération depuis localStorage
      // Format attendu : JSON array d'objets anime
    }

    let items = [];

    // Si carousel "Sorties du jour", utilise l'API Jikan
    if (c.daily) {
      items = await fetchJikanDaily();
    } 
    // Sinon, utilise AniList avec les filtres appropriés
    else {
      let sort = ['SCORE_DESC']; // Tri par défaut

      // Tri par popularité pour les nouveautés
      if (c.id === 'carousel-episodes' || c.id === 'carousel-scans') {
        sort = ['POPULARITY_DESC'];
      }

      const data = await fetchAniList(c.type, sort, 1, c.perPage || 12);

      // Filtrage de qualité : note >= 70/100 et popularité >= 500
      items = data.filter(item =>
        item.averageScore >= 70 && 
        item.popularity >= 500
      );

      // Filtrage renforcé pour les classiques
      if (c.id === 'carousel-classiques') {
        items = items.filter(item => item.popularity >= 5000);
      }
    }

    // Génération et insertion des cards dans le DOM
    items.forEach(item => container.appendChild(createCard(item)));

  }
}

/* =============================================================== */
/*                   BANNIÈRE DE LA SAISON ACTUELLE                */
/* =============================================================== */

/**
- Récupère et affiche les animes populaires de la saison en cours.
- Les saisons sont :
- - WINTER (Hiver) : Janvier à Mars
- - SPRING (Printemps) : Avril à Juin
- - SUMMER (Été) : Juillet à Septembre
- - FALL (Automne) : Octobre à Décembre
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
  
    const data = await response.json();
  
    // Insertion des images dans le conteneur de la bannière
    const bannerContainer = document.getElementById('season-banner-images');
    bannerContainer.innerHTML = ''; // Vidage du conteneur
  
    data.data.Page.media.forEach(anime => {
      const img = document.createElement('img');
      img.src = anime.coverImage.large;
      img.alt = anime.title.userPreferred;
      img.loading = "lazy"; // Optimisation du chargement
      img.decoding = "async";
      
      // Clic sur l'image = ouverture de la page AniList dans un nouvel onglet
      img.onclick = () => window.open(anime.siteUrl, '_blank');
      
      bannerContainer.appendChild(img);
    });

  } catch (err) {
    console.error("Erreur fetch season banner:", err);
  }
}

/* =============================================================== */
/*                   GESTION DU MENU BURGER MOBILE                 */
/* =============================================================== */

/**
- - CORRECTION : Gestion complète du menu burger mobile.
- - Toggle du menu au clic sur le bouton
- - Fermeture au clic sur l'overlay
- - Fermeture au clic sur un lien
- - Blocage du scroll du body quand le menu est ouvert
*/
document.addEventListener("DOMContentLoaded", () => {
  
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

});

/* =============================================================== */
/*                   GESTION DE LA BARRE DE RECHERCHE              */
/* =============================================================== */

/**
- - AJOUT : Gestion complète de la barre de recherche.
- - Affichage des résultats au focus et à la saisie
- - Masquage des résultats au clic en dehors
- - À COMPLÉTER : Logique de recherche réelle dans les APIs
*/
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.shiori-desktop-search input');
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
    if (!searchInput.contains(e.target) && !resultBox.contains(e.target)) {
      resultBox.style.display = 'none';
    }
  });
});

/* ===============================================================
   SHIORI-SAMA - SPA MAIN SCRIPT
   - Remplace entièrement l'ancien script.js par celui-ci.
   - Tout est commenté pour l'apprentissage.
   - Architecture :
     * Router hash-based
     * Renderers : home, catalogue, planning, profil, detail
     * localStorage : profile, lastWatched, favorites, history
     * Integration optionally with backend at /api/releases
   =============================================================== */

/* ==========================
   CONFIG / CONST
   ========================== */

// Optional backend base URL. Si tu déploies un backend (FastAPI) mets l'URL ici.
// Exemple: const BACKEND_API_BASE = "https://mon-backend.example.com";
const BACKEND_API_BASE = ""; // vide => pas de backend (on utilise AniList/Jikan côté client)

// localStorage keys (centralisé pour éviter erreurs)
const LS_KEYS = {
  PROFILE: "shiori_profile",
  LAST_WATCHED: "shiori_lastWatched", // array, ordre récent -> front
  FAVORITES: "shiori_favorites",
  HISTORY: "shiori_history"
};

// Timeout pour refresh local (ms) — utilisé côté front pour éviter fetchs répétés
const CLIENT_CACHE_TTL = 1000 * 60 * 5; // 5 minutes

// Petit cache in-memory pour la session (évite requests redondants)
const sessionCache = {};

/* ==========================
   UTILITAIRES STORAGE
   ========================== */

function lsGet(key, fallback = null) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch (e) {
    console.warn("lsGet parse error", e);
    return fallback;
  }
}

function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("lsSet error", e);
  }
}

// get or init list
function lsGetOrInit(key) {
  const val = lsGet(key);
  if (!val) {
    lsSet(key, []);
    return [];
  }
  return val;
}

/* ==========================
   ROUTER (hash-based)
   ========================== */

// route parsing: #/catalogue, #/anime/123, #/profil
function getRoute() {
  const hash = location.hash || "#/";
  // normalize
  const clean = hash.replace(/^#/, "");
  return clean;
}

function navigateTo(hash) {
  if (!hash.startsWith("#")) hash = "#" + hash;
  location.hash = hash;
  // scroll to top of main
  window.scrollTo(0, 0);
}

/* ==========================
   SMALL UI HELPERS
   ========================== */

function clearMain() {
  // On injecte dans le <main> existant ; on nettoie son contenu à chaque route
  const main = document.querySelector("main");
  if (!main) return;
  // keep header/footer intact
  // Nous vidons tout le contenu du main (ce que l'HTML d'origine fait déjà).
  main.innerHTML = "";
  return main;
}

function createContainer(title = "") {
  const wrapper = document.createElement("div");
  wrapper.className = "spa-page-wrapper";
  if (title) {
    const h = document.createElement("h2");
    h.textContent = title;
    wrapper.appendChild(h);
  }
  return wrapper;
}

/* ==========================
   CARD CREATION (réutilise .shiori-card)
   ========================== */

/**
 * createCard - génère une card DOM réutilisable
 * item: {
 *   id, type('ANIME'|'MANGA'), title, image_url, averageScore, popularity,
 *   seasonEpisode, languageTag (FR|VOSTFR|EN|JP), source: 'ANILIST'|'BACKEND'
 * }
 */
function createCard(item) {
  const card = document.createElement("div");
  card.className = "shiori-card";
  // stock metadata pour click
  card.dataset.item = JSON.stringify(item);

  // image (fallback)
  const imgSrc = item.image_url || "src/assets/icons/cards.svg";

  card.innerHTML = `
    <img src="${imgSrc}" alt="${escapeHtml(item.title)}" loading="lazy">
    <div class="card-title">${escapeHtml(item.title)}</div>
    <div class="card-type">${item.type || "ANIME"}</div>
    <div class="card-language"><span class="${getFlagClass(item.languageTag || 'EN')}"></span></div>
    <div class="card-info">
      <span>${item.seasonEpisode || "N/A"}</span>
    </div>
  `;

  // click handler : ouvre la page detail SPA et enregistre lastWatched
  card.addEventListener("click", () => {
    // enregistrement local : on sauvegarde l'objet minimal pour "reprenez"
    addToLastWatched({
      id: item.id || generateFauxId(item.title),
      type: item.type || "ANIME",
      title: item.title,
      image_url: imgSrc,
      progress: 0, // par défaut, peut être modifié dans la page détail si tu veux
      language: item.languageTag || "EN",
      timestamp: Date.now()
    });
    // navigation vers la page détail
    const safeId = encodeURIComponent(item.id || generateFauxId(item.title));
    navigateTo(`/detail/${safeId}`);
    // on stocke la lastOpenedData pour que la page détail sache quoi afficher sans re-fetch
    sessionCache["lastOpenedData"] = item;
    routeHandler(); // render immediately
  });

  return card;
}

/* ==========================
   CONTINUE / LAST WATCHED
   ========================== */

function addToLastWatched(entry) {
  // entry minimal attendu : {id, type, title, image_url, progress, language, timestamp}
  const list = lsGetOrInit(LS_KEYS.LAST_WATCHED);
  // supprimer doublons sur id
  const filtered = list.filter(it => it.id !== entry.id);
  // push en tête
  filtered.unshift(entry);
  // limiter taille
  const limited = filtered.slice(0, 20);
  lsSet(LS_KEYS.LAST_WATCHED, limited);
  // mettre à jour visuellement si on est sur la home
  renderHome(); // safe: will re-render the parts needed
}

/* ==========================
   PROFILE (localStorage)
   ========================== */

function getProfile() {
  return lsGet(LS_KEYS.PROFILE, {
    username: "",
    avatar: "", // URL ou base64 si tu veux
    theme: "dark"
  });
}

function setProfile(profile) {
  lsSet(LS_KEYS.PROFILE, profile);
}

/* ==========================
   HELPERS DIVERS
   ========================== */

function escapeHtml(str) {
  return (str + "").replace(/[&<>"']/g, s => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[s]);
}

function generateFauxId(title) {
  // simple slug fallback
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/* ==========================
   FLAG CLASS MAPPING (réutilise ton getFlagClass)
   ========================== */

function getFlagClass(language) {
  const map = {
    "JAPANESE": "fi fi-jp",
    "ENGLISH": "fi fi-us",
    "FRENCH": "fi fi-fr",
    "JP": "fi fi-jp",
    "EN": "fi fi-us",
    "FR": "fi fi-fr",
    "VOSTFR": "fi fi-fr"
  };
  return map[(language || "").toUpperCase()] || "fi fi-xx";
}

/* ==========================
   DATA FETCHING (AniList / Jikan / Optional Backend)
   - On tente d'utiliser le backend si configuré (ex: /api/releases)
   - Sinon on utilise AniList + Jikan (comme dans ton code existant)
   - IMPORTANT : on ne tente jamais de scraper Nyaa depuis le front-end
   ========================== */

async function fetchFromBackendReleases(params = {}) {
  if (!BACKEND_API_BASE) return null;
  const url = BACKEND_API_BASE.replace(/\/$/, "") + "/api/releases";
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (e) {
    console.warn("Backend fetch failed", e);
    return null;
  }
}

// Réutilise ta fonction getAniListQuery si besoin (on garde simple ici)
async function fetchAniListSimple(type = 'ANIME', sort = ['SCORE_DESC'], page = 1, perPage = 12) {
  // On garde exactement la logique que tu avais : GraphQL vers AniList
  const query = getAniListQuery(type);
  try {
    const resp = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { page, perPage, sort }
      })
    });
    const json = await resp.json();
    if (json.errors) {
      console.warn("AniList errors", json.errors);
      return [];
    }
    const mapped = json.data.Page.media.map(m => ({
      id: m.id,
      title: m.title.userPreferred,
      image_url: m.coverImage.large || m.coverImage.medium,
      startDate: m.startDate,
      averageScore: m.averageScore || 0,
      popularity: m.popularity || 0,
      seasonEpisode: m.season && m.episodes ? `S${m.season}E${m.episodes}` : "",
      type: m.type,
      languageTag: m.staff?.edges?.[0]?.node?.language || "JP",
      source: "ANILIST"
    }));
    return mapped;
  } catch (e) {
    console.error("fetchAniListSimple error", e);
    return [];
  }
}

/* ==========================
   RENDERERS - Home / Catalogue / Planning / Profil / Detail
   ========================== */

async function renderHome() {
  // Recréation du main mais en gardant header/footer (clearMain gère ça)
  const main = clearMain();

  // 1) on recrée la season-banner d'origine (on peut cloner HTML original or reuse existing)
  const bannerHTML = `
    <section class="season-banner-wrapper">
      <section class="season-banner">
        <div class="season-banner-images" id="season-banner-images"></div>
        <div class="season-banner-text">
          <h2>NOUVELLE SAISON</h2>
          <p>Montez dans le train pour suivre les pépites du moment !</p>
        </div>
      </section>
    </section>
  `;
  main.insertAdjacentHTML('beforeend', bannerHTML);

  // container for "Reprenez votre visionnage"
  const repriseSection = document.createElement("section");
  repriseSection.className = "section-reprendre";
  repriseSection.innerHTML = `
    <div class="rep-visio">
      <img class="h2-icons" src="src/assets/icons/clock.svg" alt="Icône horloge"/>
      <h2 class="h2-visio">REPRENEZ VOTRE VISIONNAGE</h2>
    </div>
    <div class="carousel-anime" id="carousel-reprendre"></div>
  `;
  main.appendChild(repriseSection);

  // container for "Sorties du jour"
  const sortiesSection = document.createElement("section");
  sortiesSection.className = "section-sorties-jour";
  sortiesSection.innerHTML = `
    <div class="sorties-jour">
      <img class="h2-icons" src="src/assets/icons/arrow-left-04.svg" alt="Précédent"/>
      <h2 class="h2-sorties" id="date-title"></h2>
      <img class="h2-icons" src="src/assets/icons/arrow-right-04.svg" alt="Suivant"/>
    </div>
    <div class="carousel-anime" id="carousel-sorties-jour"></div>
  `;
  main.appendChild(sortiesSection);

  // autres sections : derniers épisodes, scans, classiques (on réutilise tes ids)
  const others = [
    { id: "carousel-episodes", title: "DERNIERS ÉPISODES AJOUTÉS", icon: "directbox-receive" },
    { id: "carousel-scans", title: "DERNIERS SCANS AJOUTÉS", icon: "directbox-receive" },
    { id: "carousel-classiques", title: "LES CLASSIQUES", icon: "verify" }
  ];
  for (const o of others) {
    const s = document.createElement("section");
    s.className = o.id === "carousel-scans" ? "section-derniers-scans" : (o.id === "carousel-classiques" ? "section-classiques" : "section-derniers-episodes");
    s.innerHTML = `
      <div class="${o.id === "carousel-scans" ? "derniers-scans" : (o.id === "carousel-classiques" ? "les-classiques" : "derniers-episodes")}">
        <img class="h2-icons" src="src/assets/icons/${o.icon}.svg" alt="Icône"/>
        <h2 class="h2-episodes">${o.title}</h2>
      </div>
      <div class="carousel-anime" id="${o.id}"></div>
    `;
    main.appendChild(s);
  }

  // Render "lastWatched" from localStorage into #carousel-reprendre
  const last = lsGet(LS_KEYS.LAST_WATCHED, []);
  const carouselReprendre = document.getElementById("carousel-reprendre");
  if (!last || last.length === 0) {
    // hide section if empty
    carouselReprendre.parentElement.style.display = "none";
  } else {
    carouselReprendre.parentElement.style.display = ""; // ensure visible
    carouselReprendre.innerHTML = "";
    last.forEach(entry => {
      const item = {
        id: entry.id,
        title: entry.title,
        image_url: entry.image_url,
        type: entry.type,
        seasonEpisode: "", // on ne stocke pas forcément l'EP
        languageTag: entry.language
      };
      carouselReprendre.appendChild(createCard(item));
    });
  }

  // Fill other carousels by fetching data (attempt backend first)
  await fillCarouselsFromHome();

  // Set date title (fonction réutilisée)
  setDateTitle();
}

/**
 * fillCarouselsFromHome - remplit les carousels sur la home
 * - tente backend
 * - sinon AniList/Jikan
 */
async function fillCarouselsFromHome() {
  // Attempt backend call
  let backendData = null;
  if (BACKEND_API_BASE) {
    backendData = await fetchFromBackendReleases();
  }

  // carousel-sorties-jour : prefer backend if present (which should include language info)
  const sortiesContainer = document.getElementById("carousel-sorties-jour");
  sortiesContainer.innerHTML = "";
  if (backendData && Array.isArray(backendData) && backendData.length > 0) {
    // backend should return items with upload_date, title, score, popularity, release_type (VOSTFR/VF/EN)
    // Prioritisation: keep VOSTFR/VF first
    const prioritized = backendData
      .filter(i => i.title && (i.type === "ANIME" || i.type === "MANGA"))
      .sort((a, b) => {
        // priority on language
        const scoreLang = langPriority(a.release_type) - langPriority(b.release_type);
        if (scoreLang !== 0) return scoreLang;
        // then by upload date desc
        return new Date(b.upload_date) - new Date(a.upload_date);
      });
    for (const it of prioritized.slice(0, 50)) {
      const mapped = {
        id: it.id || generateFauxId(it.title),
        title: it.title,
        image_url: it.cover || it.image || "",
        type: it.type || "ANIME",
        seasonEpisode: it.episode ? `E${it.episode}` : "",
        languageTag: it.release_type || "EN",
        source: "BACKEND"
      };
      sortiesContainer.appendChild(createCard(mapped));
    }
  } else {
    // fallback : use Jikan daily API (you already have function fetchJikanDaily in original script)
    const jikanItems = await fetchJikanDaily();
    sortiesContainer.innerHTML = "";
    jikanItems.slice(0, 50).forEach(it => {
      const mapped = {
        id: generateFauxId(it.title),
        title: it.title,
        image_url: it.image_url,
        type: it.type || "ANIME",
        seasonEpisode: it.seasonEpisode,
        languageTag: it.language || "JP",
        source: "JIKAN"
      };
      sortiesContainer.appendChild(createCard(mapped));
    });
  }

  // Fill other carousels using AniList (popularity/score)
  const episodesContainer = document.getElementById("carousel-episodes");
  const scansContainer = document.getElementById("carousel-scans");
  const classiquesContainer = document.getElementById("carousel-classiques");

  // episodes: popular
  const episodes = await fetchAniListSimple('ANIME', ['POPULARITY_DESC'], 1, 24);
  episodesContainer.innerHTML = "";
  episodes.slice(0, 24).forEach(it => episodesContainer.appendChild(createCard(it)));

  // scans: manga popularity
  const mangas = await fetchAniListSimple('MANGA', ['POPULARITY_DESC'], 1, 24);
  scansContainer.innerHTML = "";
  mangas.slice(0, 24).forEach(it => scansContainer.appendChild(createCard(it)));

  // classiques: score desc
  const classiques = await fetchAniListSimple('ANIME', ['SCORE_DESC'], 1, 24);
  classiquesContainer.innerHTML = "";
  classiques.slice(0, 24).forEach(it => classiquesContainer.appendChild(createCard(it)));
}

/* language priority helper:
   VOSTFR -> highest (returns negative to sort before), VF next, EN after, others last */
function langPriority(tag) {
  if (!tag) return 99;
  const t = ("" + tag).toUpperCase();
  if (t.includes("VOST") && t.includes("FR")) return -30;
  if (t === "VOSTFR") return -30;
  if (t.includes("VF") || t === "FRENCH" || t === "FR") return -20;
  if (t === "EN" || t.includes("ENGLISH") || t.includes("SUB")) return 0;
  return 50;
}

/* ==========================
   RENDER: Catalogue (full)
   ========================== */

async function renderCatalogue() {
  const main = clearMain();
  const wrapper = createContainer("CATALOGUE");
  // add filters UI
  const filtersHTML = `
    <div class="spa-filters">
      <label>Type:
        <select id="spa-filter-type">
          <option value="ALL">TOUT</option>
          <option value="ANIME">ANIME</option>
          <option value="MANGA">MANGA</option>
        </select>
      </label>
      <label>Langue:
        <select id="spa-filter-lang">
          <option value="ALL">TOUT</option>
          <option value="VOSTFR">VOSTFR</option>
          <option value="VF">VF</option>
          <option value="EN">EN</option>
        </select>
      </label>
      <label>Score min:
        <select id="spa-filter-score">
          <option value="0">0+</option>
          <option value="7">7+</option>
          <option value="8">8+</option>
          <option value="9">9+</option>
        </select>
      </label>
      <button id="spa-refresh-catalogue">Rafraîchir</button>
    </div>
    <div id="spa-catalogue-grid" class="carousel-anime"></div>
  `;
  wrapper.insertAdjacentHTML("beforeend", filtersHTML);
  main.appendChild(wrapper);

  // attach listeners
  document.getElementById("spa-refresh-catalogue").addEventListener("click", async () => {
    await loadCatalogueData();
  });

  // initial load
  await loadCatalogueData();
}

async function loadCatalogueData() {
  const grid = document.getElementById("spa-catalogue-grid");
  grid.innerHTML = "";
  // read filters
  const typeFilter = document.getElementById("spa-filter-type")?.value || "ALL";
  const langFilter = document.getElementById("spa-filter-lang")?.value || "ALL";
  const scoreFilter = Number(document.getElementById("spa-filter-score")?.value || 0);

  // If backend available, get enriched releases
  let items = [];
  const backend = BACKEND_API_BASE ? await fetchFromBackendReleases() : null;
  if (backend && Array.isArray(backend) && backend.length > 0) {
    items = backend.map(i => ({
      id: i.id || generateFauxId(i.title),
      title: i.title,
      image_url: i.cover || i.image || "",
      type: i.type || "ANIME",
      averageScore: i.score || 0,
      popularity: i.popularity || 0,
      seasonEpisode: i.episode ? `E${i.episode}` : "",
      languageTag: i.release_type || "EN",
      source: "BACKEND"
    }));
  } else {
    // fallback: use AniList top lists for catalogue
    const anilistData = await fetchAniListSimple('ANIME', ['POPULARITY_DESC'], 1, 100);
    const anilistM = await fetchAniListSimple('MANGA', ['POPULARITY_DESC'], 1, 100);
    items = anilistData.concat(anilistM);
  }

  // apply filters
  const filtered = items.filter(it => {
    if (typeFilter !== "ALL" && it.type !== typeFilter) return false;
    if (langFilter !== "ALL") {
      // keep if languageTag includes selection OR release_type equals
      if (!( (it.languageTag && it.languageTag.toUpperCase().includes(langFilter)) || (it.release_type && it.release_type.toUpperCase().includes(langFilter)) )) {
        // If backend not present, languageTag often JP/EN so keep if filter is EN or ALL
        if (langFilter === "EN" && (!it.languageTag || it.languageTag.toUpperCase() === "JP")) {
          // we allow EN only if AniList tag not JP (best effort)
          // fallback: accept
        } else {
          return false;
        }
      }
    }
    if ((it.averageScore || 0) < (scoreFilter * 10)) { // averageScore on AniList is /100
      return false;
    }
    return true;
  });

  // sort: popularity desc
  filtered.sort((a,b) => (b.popularity || 0) - (a.popularity || 0));

  // render up to 100
  filtered.slice(0, 100).forEach(it => grid.appendChild(createCard(it)));
}

/* ==========================
   RENDER: Planning
   - Montre planning journalier / hebdo selon upload_date si backend present
   - sinon utilise Jikan daily
   ========================== */

async function renderPlanning() {
  const main = clearMain();
  const wrapper = createContainer("PLANNING");
  wrapper.innerHTML += `
    <div id="spa-planning-filters">
      <label>Vue:
        <select id="spa-planning-view">
          <option value="daily">Quotidien</option>
          <option value="weekly">Hebdomadaire</option>
        </select>
      </label>
    </div>
    <div id="spa-planning-list"></div>
  `;
  main.appendChild(wrapper);

  document.getElementById("spa-planning-view").addEventListener("change", () => {
    loadPlanning();
  });

  await loadPlanning();
}

async function loadPlanning() {
  const view = document.getElementById("spa-planning-view").value;
  const container = document.getElementById("spa-planning-list");
  container.innerHTML = "<p>Chargement...</p>";

  // try backend with precise upload_date
  let backend = null;
  if (BACKEND_API_BASE) {
    backend = await fetchFromBackendReleases();
  }

  if (backend && backend.length > 0) {
    // group by day
    const byDay = {};
    backend.forEach(it => {
      const d = it.upload_date ? (new Date(it.upload_date)).toISOString().slice(0,10) : "unknown";
      if (!byDay[d]) byDay[d] = [];
      byDay[d].push(it);
    });

    // render
    container.innerHTML = "";
    const keys = Object.keys(byDay).sort().reverse();
    for (const day of keys) {
      const dayDiv = document.createElement("div");
      dayDiv.className = "spa-planning-day";
      const dt = new Date(day);
      dayDiv.innerHTML = `<h3>${isNaN(dt.getTime()) ? day : dt.toLocaleDateString()}</h3>`;
      const row = document.createElement("div");
      row.className = "carousel-anime";
      byDay[day].forEach(it => {
        const mapped = {
          id: it.id || generateFauxId(it.title),
          title: it.title,
          image_url: it.cover || it.image || "",
          type: it.type || "ANIME",
          seasonEpisode: it.episode ? `E${it.episode}` : "",
          languageTag: it.release_type || "EN",
          source: "BACKEND"
        };
        row.appendChild(createCard(mapped));
      });
      dayDiv.appendChild(row);
      container.appendChild(dayDiv);
      if (view === "daily") break; // only show latest day when daily
    }
  } else {
    // fallback: show today's Jikan schedule
    const items = await fetchJikanDaily();
    container.innerHTML = "";
    const row = document.createElement("div"); row.className = "carousel-anime";
    items.forEach(it => {
      row.appendChild(createCard({
        id: generateFauxId(it.title),
        title: it.title,
        image_url: it.image_url,
        type: it.type,
        seasonEpisode: it.seasonEpisode,
        languageTag: it.language || "JP",
        source: "JIKAN"
      }));
    });
    container.appendChild(row);
  }
}

/* ==========================
   RENDER: Profil
   - form profile, favorites, history, clear buttons
   ========================== */

function renderProfile() {
  const main = clearMain();
  const wrapper = createContainer("PROFIL");
  const profile = getProfile();
  wrapper.innerHTML += `
    <div class="spa-profile">
      <div class="spa-profile-left">
        <div class="spa-avatar">
          <img id="spa-avatar-img" src="${profile.avatar || 'src/assets/icons/user-square.svg'}" alt="avatar" width="120" height="120">
        </div>
        <div>
          <label>Pseudo: <input id="spa-profile-username" value="${escapeHtml(profile.username || '')}"></label>
        </div>
        <div>
          <label>Theme:
            <select id="spa-profile-theme">
              <option value="dark" ${profile.theme === 'dark' ? 'selected' : ''}>Dark</option>
              <option value="light" ${profile.theme === 'light' ? 'selected' : ''}>Light</option>
            </select>
          </label>
        </div>
        <div>
          <button id="spa-save-profile">Enregistrer</button>
          <button id="spa-clear-data">Effacer historique</button>
        </div>
      </div>
      <div class="spa-profile-right">
        <h3>Reprenez votre visionnage</h3>
        <div id="spa-profile-lastWatched" class="carousel-anime"></div>
        <h3>Favoris</h3>
        <div id="spa-profile-favorites" class="carousel-anime"></div>
      </div>
    </div>
  `;
  main.appendChild(wrapper);

  // listeners
  document.getElementById("spa-save-profile").addEventListener("click", () => {
    const newProfile = {
      username: document.getElementById("spa-profile-username").value.trim(),
      avatar: document.getElementById("spa-avatar-img").src,
      theme: document.getElementById("spa-profile-theme").value
    };
    setProfile(newProfile);
    alert("Profil sauvegardé !");
  });

  document.getElementById("spa-clear-data").addEventListener("click", () => {
    if (!confirm("Effacer tout l'historique local (lastWatched, history, favorites) ?")) return;
    lsSet(LS_KEYS.LAST_WATCHED, []);
    lsSet(LS_KEYS.HISTORY, []);
    lsSet(LS_KEYS.FAVORITES, []);
    renderProfile(); // rerender
  });

  // fill lastWatched and favorites
  const last = lsGet(LS_KEYS.LAST_WATCHED, []);
  const favs = lsGet(LS_KEYS.FAVORITES, []);
  const lwContainer = document.getElementById("spa-profile-lastWatched");
  const favContainer = document.getElementById("spa-profile-favorites");
  lwContainer.innerHTML = "";
  favContainer.innerHTML = "";
  (last || []).forEach(it => lwContainer.appendChild(createCard(it)));
  (favs || []).forEach(it => favContainer.appendChild(createCard(it)));
}

/* ==========================
   RENDER: Detail (anime/manga)
   - utilise sessionCache.lastOpenedData si présent pour éviter re-fetch
   - sinon tente AniList fetch by id
   ========================== */

async function renderDetail(id) {
  const main = clearMain();
  const wrapper = createContainer("");
  wrapper.classList.add("spa-detail-wrapper");
  main.appendChild(wrapper);

  // try session cache first
  const session = sessionCache["lastOpenedData"];
  let item = null;
  if (session && ("" + (session.id || generateFauxId(session.title))) === decodeURIComponent(id)) {
    item = session;
  }

  // otherwise try backend if configured (search by id)
  if (!item && BACKEND_API_BASE) {
    try {
      const res = await fetch(`${BACKEND_API_BASE.replace(/\/$/, "")}/api/releases/${encodeURIComponent(id)}`);
      if (res.ok) item = await res.json();
    } catch (e) { /* ignore */ }
  }

  // fallback: try AniList by id if numeric
  if (!item && !isNaN(Number(id))) {
    // call AniList media query by id
    try {
      const q = `query ($id: Int) { Media(id: $id) { id title {romaji english native userPreferred} description format episodes averageScore popularity coverImage { large } } }`;
      const resp = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query: q, variables: {id: Number(id)}})
      });
      const j = await resp.json();
      if (j.data && j.data.Media) {
        const m = j.data.Media;
        item = {
          id: m.id,
          title: m.title.userPreferred,
          image_url: m.coverImage.large,
          averageScore: m.averageScore,
          popularity: m.popularity,
          episodes: m.episodes,
          description: (m.description || "").replace(/<\/?[^>]+(>|$)/g, ""), // strip HTML
          type: m.format || "ANIME",
          source: "ANILIST"
        };
      }
    } catch (e) { console.warn(e); }
  }

  if (!item) {
    wrapper.innerHTML = `<p>Impossible de trouver les informations pour cet item.</p>`;
    return;
  }

  // Render main detail layout respecting header/footer and site CSS
  const html = `
    <div class="spa-detail">
      <div class="spa-detail-left">
        <img src="${item.image_url || 'src/assets/icons/cards.svg'}" alt="${escapeHtml(item.title)}" width="260">
        <div class="spa-detail-actions">
          <button id="spa-add-fav">Ajouter aux favoris</button>
        </div>
      </div>
      <div class="spa-detail-right">
        <h1>${escapeHtml(item.title)}</h1>
        <p><strong>Score:</strong> ${ (item.averageScore ? (item.averageScore/10).toFixed(1) + "/10" : "N/A") } &nbsp; <strong>Popularité:</strong> ${item.popularity || "N/A"}</p>
        <p>${escapeHtml(item.description || "")}</p>
        <div id="spa-detail-releases" class="carousel-anime"></div>
      </div>
    </div>
  `;
  wrapper.innerHTML = html;

  // Favoris handler
  document.getElementById("spa-add-fav").addEventListener("click", () => {
    const favs = lsGetOrInit(LS_KEYS.FAVORITES);
    // dedupe
    if (favs.some(f => f.id === (item.id || generateFauxId(item.title)))) {
      alert("Déjà en favoris !");
      return;
    }
    favs.unshift({
      id: item.id || generateFauxId(item.title),
      title: item.title,
      image_url: item.image_url
    });
    lsSet(LS_KEYS.FAVORITES, favs.slice(0, 100));
    alert("Ajouté aux favoris !");
  });

  // Releases : if backend available, show releases from backend for this anime (language prioritized)
  const relContainer = document.getElementById("spa-detail-releases");
  relContainer.innerHTML = "";
  if (BACKEND_API_BASE) {
    try {
      const r = await fetch(`${BACKEND_API_BASE.replace(/\/$/, "")}/api/releases?title=${encodeURIComponent(item.title)}`);
      if (r.ok) {
        const dat = await r.json();
        // sort by language priority
        dat.sort((a,b) => langPriority(a.release_type) - langPriority(b.release_type));
        dat.slice(0, 20).forEach(rs => {
          relContainer.appendChild(createCard({
            id: rs.id || generateFauxId(rs.title + "-" + rs.upload_date),
            title: rs.title,
            image_url: rs.cover || item.image_url,
            type: rs.type,
            seasonEpisode: rs.episode ? `E${rs.episode}` : "",
            languageTag: rs.release_type || "EN",
            source: "BACKEND"
          }));
        });
      } else {
        relContainer.innerHTML = "<p>Aucune release trouvée via le backend.</p>";
      }
    } catch (e) {
      relContainer.innerHTML = "<p>Erreur en récupérant les releases.</p>";
    }
  } else {
    // no backend: can't get Nyaa releases from client (security/CORS). We inform user.
    relContainer.innerHTML = "<p>Pas d'informations de releases locales (déployer backend pour les releases VOSTFR/VF précises).</p>";
  }

  // Record to history
  const history = lsGetOrInit(LS_KEYS.HISTORY);
  history.unshift({ id: item.id || generateFauxId(item.title), title: item.title, date: Date.now() });
  lsSet(LS_KEYS.HISTORY, history.slice(0, 200));
}

/* ==========================
   BROAD ROUTE HANDLER
   ========================== */

async function routeHandler() {
  const route = getRoute();
  // route examples:
  // "/" or "" -> home
  // "/catalogue" -> catalogue
  // "/planning"
  // "/profil"
  // "/detail/:id" or "/anime/:id" or "/manga/:id"
  if (route === "/" || route === "" || route === "/home") {
    await renderHome();
    return;
  }
  if (route.startsWith("/catalogue") || route.toLowerCase() === "/catalog") {
    await renderCatalogue();
    return;
  }
  if (route.startsWith("/planning")) {
    await renderPlanning();
    return;
  }
  if (route.startsWith("/profil") || route.startsWith("/profile")) {
    renderProfile();
    return;
  }
  if (route.startsWith("/detail/")) {
    const id = route.split("/")[2];
    await renderDetail(decodeURIComponent(id));
    return;
  }
  // fallback: try detail with prefix /anime/:id or /manga/:id
  if (route.startsWith("/anime/") || route.startsWith("/manga/")) {
    const id = route.split("/")[2];
    await renderDetail(decodeURIComponent(id));
    return;
  }
  // unknown -> home
  await renderHome();
}

/* ==========================
   BOOT / NAV BINDING
   ========================== */

function bindNavLinks() {
  // desktop nav anchors
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const href = a.getAttribute('href') || "#/";
      // convert hashlike anchors (#Catalogue) to lower-case route
      if (href.startsWith("#")) {
        const route = href.replace(/^#/, "").toLowerCase();
        navigateTo("/" + route);
      } else {
        navigateTo("/" + href);
      }
      routeHandler();
    });
  });

  // mobile links
  document.querySelectorAll('.mobile-link').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const text = a.textContent.trim().toLowerCase();
      if (text.includes("catalog")) navigateTo("/catalogue");
      else if (text.includes("plan")) navigateTo("/planning");
      else if (text.includes("profil") || text.includes("profile")) navigateTo("/profil");
      routeHandler();
      // close mobile menu if present
      document.querySelector('.mobile-menu-top')?.classList.remove('open');
      document.getElementById('burgerBtn')?.classList.remove('burger-open');
      document.querySelector('.menu-overlay')?.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });

  // search input listeners (desktop/mobile) - we keep minimal
  const desktopSearch = document.querySelector('.shiori-desktop-search input');
  if (desktopSearch) {
    desktopSearch.addEventListener('keydown', (e) => {
      if (e.key === "Enter") {
        const q = desktopSearch.value.trim();
        if (q) {
          // navigate to catalogue + query param stored in sessionCache
          sessionCache['lastQuery'] = q;
          navigateTo("/catalogue");
          routeHandler();
        }
      }
    });
  }

  const mobileSearch = document.querySelector('.shiori-mobile-search input');
  if (mobileSearch) {
    mobileSearch.addEventListener('keydown', (e) => {
      if (e.key === "Enter") {
        const q = mobileSearch.value.trim();
        if (q) {
          sessionCache['lastQuery'] = q;
          navigateTo("/catalogue");
          routeHandler();
        }
      }
    });
  }
}

// initial boot
window.addEventListener('DOMContentLoaded', async () => {
  // Bind nav and other UI (burger etc exist in your code)
  bindNavLinks();

  // Hash change -> routeHandler
  window.addEventListener('hashchange', routeHandler);

  // Run initial route
  await routeHandler();

  // Footer year update (tu avais déjà)
  const copyrightYear = document.getElementById('date-copyright');
  if (copyrightYear) copyrightYear.textContent = new Date().getFullYear();

  // Keep other startup tasks you already had: bind burger, search, etc.
});

/* ===============================================================
   END OF MAIN SCRIPT
   - functions below are referenced from original script: getAniListQuery, fetchJikanDaily, setDateTitle
   - I assume your original definitions exist; if not, they are included below as minimal versions.
   =============================================================== */

/* ------------ Minimal fallback implementations (only if not present) ------------- */
if (typeof getAniListQuery === "undefined") {
  function getAniListQuery(type = 'ANIME') {
    return `query ($page: Int, $perPage: Int, $sort: [MediaSort]) {
      Page(page: $page, perPage: $perPage) {
        media(type: ${type}, sort: $sort) {
          id
          title { userPreferred }
          coverImage { large medium }
          startDate { year month day }
          season
          episodes
          averageScore
          popularity
          type
          staff(page: 1, perPage: 1) {
            edges { node { language } }
          }
        }
      }
    }`;
  }
}

if (typeof fetchJikanDaily === "undefined") {
  async function fetchJikanDaily() {
    try {
      const today = new Date();
      const weekday = today.getDay();
      const jikanWeekdays = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
      const response = await fetch(`https://api.jikan.moe/v4/schedules/${jikanWeekdays[weekday]}`);
      const data = await response.json();
      if (!data.data) return [];
      return data.data
        .filter(item => item.rating !== "Rx")
        .map(m => ({
          title: m.title,
          image_url: m.images.jpg.image_url,
          startDate: { year: today.getFullYear(), month: today.getMonth()+1, day: today.getDate() },
          averageScore: m.score ? m.score * 10 : 0,
          popularity: m.members || 0,
          seasonEpisode: m.episodes ? `E${m.episodes}` : "",
          type: m.type ? m.type.toUpperCase() : "ANIME",
          language: "JP"
        }));
    } catch (e) {
      console.error("fetchJikanDaily fallback error", e);
      return [];
    }
  }
}

if (typeof setDateTitle === "undefined") {
  function setDateTitle() {
    const dateTitle = document.getElementById('date-title');
    const now = new Date();
    const jours = ['DIMANCHE','LUNDI','MARDI','MERCREDI','JEUDI','VENDREDI','SAMEDI'];
    const jour = jours[now.getDay()];
    const jourNum = String(now.getDate()).padStart(2,'0');
    const mois = String(now.getMonth()+1).padStart(2,'0');
    if (dateTitle) dateTitle.textContent = `SORTIES DU ${jour} - ${jourNum}/${mois}`;
  }
}

/* =============================================================== */
/*                   INITIALISATION AU CHARGEMENT                  */
/* =============================================================== */

/**
- Point d'entrée principal du script.
- Lancé quand le DOM est complètement chargé.
- - Remplit tous les carousels
- - Charge la bannière de saison
- - Met à jour l'année du copyright dans le footer
*/
window.addEventListener('DOMContentLoaded', () => {

  // Remplissage des carousels
  fillCarousels();

  // Chargement de la bannière de saison
  fetchSeasonBanner();

  // Mise à jour de l'année du copyright
  const copyrightYear = document.getElementById('date-copyright');
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }

});