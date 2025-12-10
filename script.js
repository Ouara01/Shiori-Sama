// ------------------------
// Définition des carousels
// ------------------------
const carousels = [
  { id: 'carousel-reprendre', type: 'ANIME', fromStorage: true },
  { id: 'carousel-sorties-jour', type: 'ANIME', daily: true, perPage: 50 },
  { id: 'carousel-episodes', type: 'ANIME', filter: 'POPULARITY_DESC', perPage: 12 },
  { id: 'carousel-scans', type: 'MANGA', filter: 'POPULARITY_DESC', perPage: 12 },
  { id: 'carousel-classiques', type: 'ANIME', filter: 'SCORE_DESC', perPage: 12 }
];

// ------------------------
// GraphQL query AniList
// ------------------------
function getAniListQuery(type = 'ANIME') {
  return `
query ($page: Int, $perPage: Int, $sort: [MediaSort]) {
  Page(page: $page, perPage: $perPage) {
    media(type: ${type}, sort: $sort) {
      id
      title { userPreferred }
      coverImage { large medium }
      startDate { year month day }
      averageScore
      popularity
      season
      episodes
      type
      staff { edges { node { language } } }
    }
  }
}`;
}

// ------------------------
// Fetch AniList
// ------------------------
async function fetchAniList(type = 'ANIME', sort = ['SCORE_DESC'], page = 1, perPage = 12) {
  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        query: getAniListQuery(type),
        variables: { page, perPage, sort }
      })
    });

    const data = await response.json();
    if (data.errors) return [];

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

// ------------------------
// Fetch Jikan sorties du jour
// ------------------------
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
        startDate: {
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate()
        },
        averageScore: m.score ? m.score * 10 : 0,
        popularity: m.members || 0,
        seasonEpisode: m.episodes ? `E${m.episodes}` : "",
        type: m.type.toUpperCase(),
        language: "JP"
      }))
      .filter(item => item.averageScore >= 70 && item.popularity >= 1000);

  } catch (err) {
    console.error('Erreur fetch Jikan:', err);
    return [];
  }
}

// ------------------------
// Drapeaux
// ------------------------
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

// ------------------------
// Créer une card
// ------------------------
function createCard(item) {
  const card = document.createElement('div');
  card.className = 'shiori-card';

  card.innerHTML = `
      <img src="${item.image_url}" alt="${item.title}">
      <div class="card-title">${item.title}</div>
      <div class="card-type">${item.type || "ANIME"}</div>
      <div class="card-language">${getFlagEmoji(item.language || "JP")}</div>
      ${item.seasonEpisode ? `<div class="card-info"><span class="season-episode">${item.seasonEpisode}</span></div>` : ""}
  `;

  return card;
}

// ------------------------
// Date du jour
// ------------------------
function setDateTitle() {
  const dateTitle = document.getElementById('date-title');
  const now = new Date();

  const jours = ['DIMANCHE','LUNDI','MARDI','MERCREDI','JEUDI','VENDREDI','SAMEDI'];

  const jour = jours[now.getDay()];
  const jourNum = String(now.getDate()).padStart(2,'0');
  const mois = String(now.getMonth() + 1).padStart(2,'0');

  dateTitle.textContent = `SORTIES DU ${jour} - ${jourNum}/${mois}`;
}

// ------------------------
// Remplir les carousels
// ------------------------
async function fillCarousels() {

  setDateTitle();

  for (const c of carousels) {

    const container = document.getElementById(c.id);

    if (c.fromStorage) {
      const stored = localStorage.getItem('lastWatched');
      if (!stored) {
        container.parentElement.style.display = 'none';
        continue;
      }
    }

    let items = [];

    if (c.daily) {
      items = await fetchJikanDaily();
    } else {
      let sort = ['SCORE_DESC'];

      if (c.id === 'carousel-episodes' || c.id === 'carousel-scans')
        sort = ['POPULARITY_DESC'];

      const data = await fetchAniList(c.type, sort, 1, c.perPage || 12);

      items = data.filter(item =>
        item.averageScore >= 70 && item.popularity >= 500
      );

      if (c.id === 'carousel-classiques') {
        items = items.filter(item => item.popularity >= 5000);
      }
    }

    items.forEach(item => container.appendChild(createCard(item)));
  }
}

// ------------------------
// Bannière de la saison
// ------------------------
async function fetchSeasonBanner() {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;

    let season;
    if (month >= 3 && month <= 5) season = 'SPRING';
    else if (month >= 6 && month <= 8) season = 'SUMMER';
    else if (month >= 9 && month <= 11) season = 'FALL';
    else season = 'WINTER';

    const year = today.getFullYear();

    const query = `
      query ($year: Int, $season: MediaSeason, $perPage: Int) {
        Page(page: 1, perPage: $perPage) {
          media(seasonYear: $year, season: $season, sort: POPULARITY_DESC, type: ANIME) {
            title { userPreferred }
            coverImage { large }
            siteUrl
          }
        }
      }
    `;

    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { year, season, perPage: 6 }
      })
    });

    const data = await response.json();

    const bannerContainer = document.getElementById('season-banner-images');
    bannerContainer.innerHTML = '';

    data.data.Page.media.forEach(anime => {
      const img = document.createElement('img');
      img.src = anime.coverImage.large;
      img.alt = anime.title.userPreferred;
      img.loading = "lazy";
      img.decoding = "async";

      img.onclick = () => window.open(anime.siteUrl, '_blank');

      bannerContainer.appendChild(img);
    });

  } catch (err) {
    console.error("Erreur fetch season banner:", err);
  }
}

// ------------------------
// MENU BURGER MOBILE (CORRIGÉ)
// ------------------------
document.addEventListener("DOMContentLoaded", () => {

    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.querySelector('.mobile-menu--top'); // <<<<< CORRIGÉ
    const overlay = document.querySelector('.menu-overlay');

    if (!burgerBtn || !mobileMenu) return;

    burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.toggle('burger-open');
        mobileMenu.classList.toggle('open');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener("click", () => {
        burgerBtn.classList.remove("burger-open");
        mobileMenu.classList.remove("open");
        overlay.classList.remove("active");
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            burgerBtn.classList.remove('burger-open');
            overlay.classList.remove('active');
        });
    });

});

// ------------------------
// Lancement
// ------------------------
window.addEventListener('DOMContentLoaded', () => {
  fillCarousels();
  fetchSeasonBanner();
  document.getElementById('date-copyright').textContent =
    new Date().getFullYear();
});