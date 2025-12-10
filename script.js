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
    perPage: 12
  },
  {
    id: 'carousel-scans',
    type: 'MANGA',
    filter: 'POPULARITY_DESC',
    perPage: 12
  },
  {
    id: 'carousel-classiques',
    type: 'ANIME',
    filter: 'SCORE_DESC',
    perPage: 12
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
function getFlagEmoji(language) {
  const map = {
    "JAPANESE": "🇯🇵",
    "ENGLISH": "🇺🇸",
    "FRENCH": "🇫🇷",
    "JP": "🇯🇵",
    "EN": "🇺🇸",
    "FR": "🇫🇷"
  };
  return map[language.toUpperCase()] || "🏳️";
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
    <div class="card-language">${getFlagEmoji(item.language)}</div>
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

    // ✅ Gestion du carousel "Reprenez votre visionnage"
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

    // ✅ Si carousel "Sorties du jour", utilise l'API Jikan
    if (c.daily) {
      items = await fetchJikanDaily();
    } 
    // ✅ Sinon, utilise AniList avec les filtres appropriés
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

      // ✅ Filtrage renforcé pour les classiques
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
- ✅ CORRECTION : Gestion complète du menu burger mobile.
- - Toggle du menu au clic sur le bouton
- - Fermeture au clic sur l'overlay
- - Fermeture au clic sur un lien
- - Blocage du scroll du body quand le menu est ouvert
*/
document.addEventListener("DOMContentLoaded", () => {
  
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.querySelector('.mobile-menu–top');
  const overlay = document.querySelector('.menu-overlay');
  
  // Vérification de l'existence des éléments (prévention d'erreurs)
  if (!burgerBtn || !mobileMenu || !overlay) {
    console.warn('Elements du menu burger non trouvés');
    return;
  }
  
  // ✅ Toggle du menu au clic sur le burger
  burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('burger-open');
    mobileMenu.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });
  
  // ✅ Fermeture du menu au clic sur l'overlay (zone sombre)
  overlay.addEventListener("click", () => {
    burgerBtn.classList.remove("burger-open");
    mobileMenu.classList.remove("open");
    overlay.classList.remove("active");
    document.body.classList.remove('no-scroll');
  });
  
  // ✅ Fermeture du menu au clic sur un lien de navigation
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
- ✅ AJOUT : Gestion complète de la barre de recherche.
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