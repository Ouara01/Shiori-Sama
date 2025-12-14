# 📘 Guide Technique Complet - Shiori-Sama

**Documentation d'apprentissage détaillée pour maîtriser la stack technique**  
*Cet ouvrage vous guidera à travers chaque technologie utilisée dans ce projet.*

---

## 📑 Table des matières

1. [Architecture globale](#architecture)
2. [Stack technologique](#stack)
3. [Flux de données](#flux-données)
4. [Frontend Next.js](#frontend)
5. [Zustand - Gestion d'état](#zustand)
6. [Services API](#services-api)
7. [TypeScript](#typescript)
8. [Tailwind CSS](#tailwind)
9. [Déploiement](#déploiement)
10. [Salaires IT](#salaires)

---

## <a name="architecture"></a>🏛️ Architecture Globale

### Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│              NAVIGATEUR (Client)                        │
│  ├─ React 19 Components                                 │
│  ├─ Zustand Store (État Global)                         │
│  ├─ TypeScript (Typage Strict)                          │
│  └─ Tailwind CSS (Design Responsive)                    │
└──────────────────┬──────────────────────────────────────┘
                   │
            FETCH API / HTTP (JSON)
                   │
┌──────────────────┴──────────────────────────────────────┐
│           NEXT.JS 16 (Fullstack)                        │
│  ├─ App Router (src/app/)                               │
│  ├─ API Routes (src/app/api/)                           │
│  ├─ Server Components                                   │
│  ├─ Static Export (output: 'export')                    │
│  └─ Optimisations (Image, Font)                         │
└──────────────────┬──────────────────────────────────────┘
                   │
        External APIs (HTTPS/GraphQL)
                   │
┌──────────────────┴──────────────────────────────────────┐
│          SERVICES EXTERNES                              │
│  ├─ AniList GraphQL (https://graphql.anilist.co)       │
│  └─ Jikan API REST (https://api.jikan.moe/v4)          │
└─────────────────────────────────────────────────────────┘
```

### Pourquoi cette architecture ?

- **Next.js 16 en export statique** : Parfait pour GitHub Pages (gratuit, aucun serveur)
- **Zustand** : Gestion d'état minimale, pas de boilerplate Redux
- **TypeScript** : Sécurité des types, meilleure expérience développeur
- **APIs externes** : Aucune base de données backend nécessaire
- **localStorage** : Persistance des données côté client

---

## <a name="stack"></a>🛠️ Stack Technologique Détaillé

### Frontend

| Technologie | Version | Rôle |
|---|---|---|
| **Next.js** | 16.0.10 | Framework React fullstack avec SSG/SSR |
| **React** | 19.2.1 | Bibliothèque UI moderne |
| **TypeScript** | 5.x | Typage statique JavaScript |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **Zustand** | 4.5.7 | Gestion d'état légère |

#### Pourquoi chaque technologie ?

**Next.js 16**
- ✅ App Router : système de routage basé sur fichiers
- ✅ Server Components : réduisent le JavaScript côté client
- ✅ Static Export : génère du HTML statique pour GitHub Pages
- ✅ Image Optimization : optimise automatiquement les images
- ✅ Font Optimization : améliore les Core Web Vitals
- ✅ TypeScript intégré

**React 19**
- ✅ Hooks modernes (useState, useEffect, useContext)
- ✅ Concurrent Features : meilleure performance
- ✅ Automatic batching : optimisation des re-renders
- ✅ Système de composants : réutilisabilité du code

**TypeScript**
```typescript
// Exemple: interface fortement typée
interface Anime {
  id: number;
  title: string;
  score: number;
  coverImage: { large: string };
}

// Le compilateur détecte les erreurs AVANT l'exécution
const handleAnime = (anime: Anime) => {
  console.log(anime.title); // ✅ OK
  console.log(anime.noexist); // ❌ Erreur TypeScript
};
```

**Zustand**
```typescript
// VS Redux : beaucoup plus simple
// Redux: actions, reducers, dispatch, selectors...
// Zustand: just a hook!

import { create } from 'zustand';

interface ShioriStore {
  favorites: Anime[];
  addFavorite: (anime: Anime) => void;
}

export const useShioriStore = create<ShioriStore>((set) => ({
  favorites: [],
  addFavorite: (anime) =>
    set((state) => ({
      favorites: [...state.favorites, anime],
    })),
}));

// Utilisation dans un composant:
function Component() {
  const { favorites, addFavorite } = useShioriStore();
  // C'est tout! Pas de Provider, pas de mapStateToProps
}
```

**Tailwind CSS 4**
```tsx
// Utility-first: chaque classe fait une chose
// Plutôt que d'écrire du CSS personnalisé:
<div className="flex items-center justify-between p-4 bg-blue-500 rounded-lg hover:bg-blue-600">
  {/* flex = display: flex */}
  {/* items-center = align-items: center */}
  {/* p-4 = padding: 1rem */}
  {/* bg-blue-500 = background: #3b82f6 */}
  {/* rounded-lg = border-radius: 0.5rem */}
  {/* hover:bg-blue-600 = au survol, bg devient plus foncé */}
</div>

// Avantages:
// ✅ Pas besoin d'ouvrir un fichier CSS
// ✅ Responsive design facile: md:text-xl lg:text-2xl
// ✅ Dark mode automatique: dark:bg-gray-800
// ✅ Performance: seules les classes utilisées sont compilées
```

---

## <a name="flux-données"></a>🔄 Flux de Données Détaillé

### Étape 1 : Initialisation de l'app

```typescript
// src/app/shiori-client.tsx
'use client'; // Composant client

export default function ShioriClient() {
  const { setCarousels, setLoading } = useShioriStore();

  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      
      try {
        // 1. Charger les favoris depuis localStorage
        const savedFavorites = loadFromLocalStorage('favorites');
        
        // 2. Charger les données depuis les APIs
        const [trending, seasonal] = await Promise.all([
          fetchTrendingAnimes(),
          fetchSeasonalAnimes(),
        ]);
        
        // 3. Mettre à jour le store
        setCarousels({
          trending,
          seasonal,
          favorites: savedFavorites,
        });
      } catch (error) {
        console.error('Erreur d\'initialisation:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []); // [] = s'exécute une seule fois au montage

  return null; // Pas d'UI, juste la logique
}
```

### Étape 2 : Chargement des données anime

```typescript
// src/services/animeService.ts
export async function fetchTrendingAnimes(): Promise<Anime[]> {
  // 1. Vérifier le cache local
  const cached = getCachedData('trending');
  if (cached && !isExpired(cached.timestamp)) {
    return cached.data;
  }

  // 2. Appeler l'API AniList (GraphQL)
  const query = `
    query {
      Page(perPage: 20, sort: TRENDING_DESC) {
        media(type: ANIME) {
          id
          title { english romaji }
          coverImage { large }
          averageScore
          format
        }
      }
    }
  `;

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();

  // 3. Transformer et mettre en cache
  const animes = transformAnimeData(data.data.Page.media);
  cacheData('trending', animes);

  return animes;
}

// Transformation des données externes
function transformAnimeData(rawData: any[]): Anime[] {
  return rawData.map((item) => ({
    id: item.id,
    title: item.title.english || item.title.romaji,
    score: item.averageScore / 10,
    coverImage: item.coverImage.large,
    format: item.format,
  }));
}

// Gestion du cache
function getCachedData(key: string) {
  const item = localStorage.getItem(`cache_${key}`);
  return item ? JSON.parse(item) : null;
}

function cacheData(key: string, data: any, expiryMinutes = 30) {
  const expiry = Date.now() + expiryMinutes * 60 * 1000;
  localStorage.setItem(
    `cache_${key}`,
    JSON.stringify({ data, timestamp: expiry })
  );
}

function isExpired(timestamp: number): boolean {
  return Date.now() > timestamp;
}
```

### Étape 3 : Affichage et interaction

```typescript
// src/components/AnimeCard.tsx
interface AnimeCardProps {
  anime: Anime;
  onSelect: (anime: Anime) => void;
}

export default function AnimeCard({ anime, onSelect }: AnimeCardProps) {
  const { favorites, toggleFavorite } = useShioriStore();
  const isFavorite = favorites.some((fav) => fav.id === anime.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ne pas déclencher onSelect
    toggleFavorite(anime);
    saveToLocalStorage('favorites', favorites);
  };

  return (
    <div
      onClick={() => onSelect(anime)}
      className="cursor-pointer rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <img
        src={anime.coverImage}
        alt={anime.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg truncate">{anime.title}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-600">{anime.format}</span>
          <span className={isFavorite ? 'text-red-500' : 'text-gray-400'}>
            ★ {anime.score}
          </span>
        </div>
        <button
          onClick={handleFavoriteClick}
          className="mt-3 w-full py-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition"
        >
          {isFavorite ? '♥ Retirer des favoris' : '♡ Ajouter aux favoris'}
        </button>
      </div>
    </div>
  );
}
```

---

## <a name="frontend"></a>⚛️ Next.js 16 Expliqué en Détail

### App Router (src/app/)

**Structure moderne de Next.js 16:**

```
src/app/
├── layout.tsx           # Layout principal (HTML, meta, fonts)
├── page.tsx             # Page d'accueil (/)
├── shiori-client.tsx    # Composant client (logique d'app)
├── globals.css          # Styles globaux
└── api/                 # Route API (si besoin)
    └── route.ts
```

**layout.tsx - Le wrapper de toutes les pages:**
```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Shiori-Sama | Anime Streaming</title>
        <meta name="description" content="Plateforme anime moderne" />
      </head>
      <body className="bg-gray-900 text-white">
        {/* ShioriClient gère la logique d'app côté client */}
        <ShioriClient />
        {/* Les pages enfants se rendent ici */}
        {children}
      </body>
    </html>
  );
}
```

**page.tsx - La page d'accueil:**
```typescript
// Composant serveur par défaut
export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Shiori-Sama</h1>
      
      {/* Carousels d'anime gérés par Zustand */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Tendance</h2>
        <AnimeCarousel category="trending" />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Saisonnier</h2>
        <AnimeCarousel category="seasonal" />
      </section>
    </main>
  );
}
```

### Server Components vs Client Components

**Server Components** (défaut):
```typescript
// Pas de 'use client'
// ✅ Accès direct à la base de données
// ✅ Variables d'environnement sécurisées
// ✅ Moins de JavaScript envoyé au client
// ✅ Parfait pour les données statiques

export default async function ServerComponent() {
  // Peut faire des requêtes async directement
  const data = await fetch('https://api.example.com/data');
  return <div>{data}</div>;
}
```

**Client Components**:
```typescript
'use client'; // Ouvrir ce fichier

// ✅ useState, useEffect, event listeners
// ✅ Interactivité utilisateur
// ✅ localStorage, sessionStorage
// ✅ Hooks personnalisés

export default function ClientComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Logique côté client
    console.log('Composant monté');
  }, []);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clics: {count}
    </button>
  );
}
```

---

## <a name="zustand"></a>💾 Zustand - Gestion d'État

### Pourquoi Zustand plutôt que Redux/Context ?

| Feature | Zustand | Redux | Context API |
|---|---|---|---|
| **Bundle size** | ~1KB | ~50KB | 0KB (built-in) |
| **Boilerplate** | Minimal | ÉNORME | Moyen |
| **Performance** | ⚡ Rapide | ⚡ Rapide | 🐢 Lent (re-renders) |
| **Courbe d'apprentissage** | Facile | Difficile | Moyen |
| **Idéal pour** | Petits/moyens projets | Très gros projets | Très simples cas |

### Implémentation Zustand

```typescript
// src/store/shioriStore.ts
import { create } from 'zustand';

interface Anime {
  id: number;
  title: string;
  coverImage: string;
  score: number;
}

interface ShioriStore {
  // État
  carousels: {
    trending: Anime[];
    seasonal: Anime[];
  };
  favorites: Anime[];
  watchHistory: Anime[];
  loading: boolean;
  searchQuery: string;

  // Setters simples
  setLoading: (loading: boolean) => void;
  setCarousels: (carousels: ShioriStore['carousels']) => void;
  setSearchQuery: (query: string) => void;

  // Actions complexes
  addToWatchHistory: (anime: Anime) => void;
  toggleFavorite: (anime: Anime) => void;
  clearWatchHistory: () => void;
}

export const useShioriStore = create<ShioriStore>((set, get) => ({
  // État initial
  carousels: {
    trending: [],
    seasonal: [],
  },
  favorites: [],
  watchHistory: [],
  loading: false,
  searchQuery: '',

  // Setters
  setLoading: (loading) => set({ loading }),
  setCarousels: (carousels) => set({ carousels }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  // Actions complexes (peuvent accéder à l'état avec get())
  addToWatchHistory: (anime) =>
    set((state) => ({
      watchHistory: [anime, ...state.watchHistory].slice(0, 50), // Garder les 50 derniers
    })),

  toggleFavorite: (anime) =>
    set((state) => {
      const isFavorite = state.favorites.some((fav) => fav.id === anime.id);
      return {
        favorites: isFavorite
          ? state.favorites.filter((fav) => fav.id !== anime.id)
          : [...state.favorites, anime],
      };
    }),

  clearWatchHistory: () => set({ watchHistory: [] }),
}));
```

### Utilisation dans les composants

```typescript
// src/components/MyComponent.tsx
'use client';

import { useShioriStore } from '@/store/shioriStore';

export default function MyComponent() {
  // Récupérer ce qu'on a besoin du store
  const { favorites, searchQuery, toggleFavorite } = useShioriStore();

  // Composant re-render seulement si favorites ou searchQuery change
  // (Zustand gère la memoization automatiquement)

  return (
    <div>
      <h2>Vos favoris ({favorites.length})</h2>
      <ul>
        {favorites.map((anime) => (
          <li
            key={anime.id}
            onClick={() => toggleFavorite(anime)}
            className="cursor-pointer hover:bg-gray-700 p-2"
          >
            {anime.title} - Score: {anime.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## <a name="services-api"></a>🔌 Services API - AniList et Jikan

### AniList GraphQL

**Qu'est-ce que GraphQL ?**
- REST: `/api/animes` retourne TOUT
- GraphQL: Demandez exactement ce que vous voulez!

```typescript
// src/services/animeService.ts

// 1. Requête GraphQL pour les animes tendance
const TRENDING_QUERY = `
  query GetTrendingAnimes($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, sort: TRENDING_DESC) {
        id
        title {
          english
          romaji
          native
        }
        coverImage {
          large
          medium
        }
        description
        averageScore
        meanScore
        popularity
        favourites
        format
        episodes
        season
        seasonYear
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        status
        studios(isMain: true) {
          edges {
            node {
              id
              name
            }
          }
        }
        genres
      }
    }
  }
`;

// 2. Fonction pour appeler AniList
export async function fetchTrendingAnimes(
  page: number = 1,
  perPage: number = 20
): Promise<Anime[]> {
  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: TRENDING_QUERY,
        variables: { page, perPage },
      }),
    });

    if (!response.ok) {
      throw new Error(`AniList API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GraphQL error: ${data.errors[0].message}`);
    }

    // Transformer les données au format standard
    return data.data.Page.media.map((media: any) => ({
      id: media.id,
      title: media.title.english || media.title.romaji,
      coverImage: media.coverImage.large,
      score: media.averageScore / 10,
      format: media.format,
      description: media.description,
      episodes: media.episodes,
      genres: media.genres,
      studios: media.studios?.edges?.map((e: any) => e.node.name) || [],
    }));
  } catch (error) {
    console.error('Erreur AniList:', error);
    return [];
  }
}
```

### Jikan API (Alternative REST)

```typescript
// Jikan utilise REST au lieu de GraphQL
export async function fetchAnimeFromJikan(animeId: number) {
  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime/${animeId}/full`
    );
    const data = await response.json();

    return {
      id: data.data.mal_id,
      title: data.data.title,
      synopsis: data.data.synopsis,
      imageUrl: data.data.images.jpg.large_image_url,
      score: data.data.score,
      aired: data.data.aired,
      episodes: data.data.episodes,
      status: data.data.status,
      source: data.data.source,
      genres: data.data.genres.map((g: any) => g.name),
      studios: data.data.studios.map((s: any) => s.name),
    };
  } catch (error) {
    console.error('Erreur Jikan:', error);
    return null;
  }
}
```

---

## <a name="typescript"></a>📝 TypeScript - Typage Strict

### Types et Interfaces Fondamentaux

```typescript
// src/types/index.ts

// Types primitifs typés
type ID = number | string;
type Rating = 0 | 1 | 2 | 3 | 4 | 5; // Union types

// Interfaces pour les objets complexes
interface Anime {
  id: ID;
  title: string;
  coverImage: string;
  score: number;
  format: 'TV' | 'MOVIE' | 'OVA' | 'ONA'; // Enum-like
  episodes?: number; // Propriété optionnelle
}

// Types utilitaires
type AnimeList = Anime[];
type AnimeMap = Record<ID, Anime>; // {[key: ID]: Anime}

// Generics pour la réutilisabilité
interface ApiResponse<T> {
  data: T;
  error: null | string;
  loading: boolean;
}

// Utilisation:
const response: ApiResponse<Anime[]> = {
  data: animes,
  error: null,
  loading: false,
};

// Function types
type FetchFn = (id: ID) => Promise<Anime | null>;
type FilterFn = (anime: Anime) => boolean;

const fetchAnime: FetchFn = async (id) => {
  // ...
};

const isTV: FilterFn = (anime) => anime.format === 'TV';
const tvAnimes = animes.filter(isTV);
```

### Avantages du Typage

```typescript
// ❌ Sans TypeScript - Bug difficile à trouver
function displayAnime(anime) {
  console.log(anime.titel); // Typo ! Aucune erreur jusqu'à l'exécution
}

// ✅ Avec TypeScript - Bug détecté immédiatement
function displayAnime(anime: Anime) {
  console.log(anime.titel); // ❌ Erreur TypeScript: "titel" n'existe pas
  console.log(anime.title); // ✅ OK
}

// ✅ Autocomplétion dans l'IDE
const { title, sc| } // L'IDE suggère "score", "status", etc.

// ✅ Refactoring sûr
interface Anime {
  title: string;
  score: number;
  // Si je change le nom "title" en "name", TypeScript détecte TOUTES les utilisations
}
```

---

## <a name="tailwind"></a>🎨 Tailwind CSS - Design Responsive

### Concept: Utility-First

```tsx
// Au lieu d'écrire du CSS personnalisé:
<style>
  .button {
    padding: 0.5rem 1rem;
    background-color: #3b82f6;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .button:hover {
    background-color: #2563eb;
  }
</style>

// Tailwind: utiliser des classes directement
<button className="px-4 py-2 bg-blue-500 rounded cursor-pointer hover:bg-blue-600 transition">
  Click me
</button>

// Avantages:
// ✅ Pas de CSS externe à maintenir
// ✅ Responsive: md:text-lg lg:text-xl
// ✅ Dark mode: dark:bg-gray-800
// ✅ Construit uniquement ce qui est utilisé (PurgeCSS)
```

### Responsive Design avec Tailwind

```tsx
// Mobile-first approach
<div className="
  w-full px-4 py-2          // Mobile: full width, padding
  md:w-1/2 md:px-6           // Tablette: 50% width
  lg:w-1/4 lg:px-8           // Desktop: 25% width
  bg-gray-900 text-white      // Toujours appliqué
  hover:shadow-lg             // Au survol
  transition-shadow            // Animation smooth
">
  Responsive content
</div>

// Grid système
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {animes.map((anime) => (
    <AnimeCard key={anime.id} anime={anime} />
  ))}
</div>

// Dark mode
<div className="
  bg-white text-black         // Light mode (défaut)
  dark:bg-gray-900 dark:text-white // Dark mode (si activé)
">
  Content
</div>
```

---

## <a name="déploiement"></a>🚀 Déploiement - GitHub Pages et au-delà

### Déploiement GitHub Pages (RECOMMANDÉ - GRATUIT)

**Problème:** GitHub Pages n'héberge que du contenu statique (HTML/CSS/JS)  
**Solution:** Next.js avec `output: 'export'` génère du HTML statique

**Configuration:**

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export', // ← CRUCIAL: génère HTML statique
  
  basePath: '/shiori-sama-public', // ← Adapte au nom de ton repo
  assetPrefix: '/shiori-sama-public', // ← Assets path
  
  trailingSlash: true, // Important pour routing statique
  
  images: {
    unoptimized: true, // Pages statiques ne supportent pas l'optimization
  },
};
```

**Script de déploiement:**

```json
{
  "scripts": {
    "build": "next build",
    "deploy": "npm run build && git add . && git commit -m 'Deploy' && git push origin main"
  }
}
```

**Étapes:**

```bash
# 1. Build le projet
npm run build

# 2. GitHub Pages va automatiquement déployer depuis main
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main

# 3. Attendre 2-5 minutes
# 4. Visiter: https://votre-username.github.io/shiori-sama-public
```

### Alternative: Render.com (Plus de flexibilité)

Render permet de déployer Next.js en fullstack (avec API routes si besoin).

**Avantages:**
- ✅ Gratuit pour les petits projets
- ✅ Déploiement automatique depuis GitHub
- ✅ SSL/HTTPS inclus
- ✅ Support des variables d'environnement

**Configuration:**

1. Créer un compte sur https://render.com
2. Connecter votre repo GitHub
3. Créer un "Web Service"
4. Configuration:
   ```
   Build Command: npm run build
   Start Command: npm start
   ```
5. Déploiement automatique à chaque push!

---

## <a name="salaires"></a>💰 Salaires IT - Informations Confidentielles

### Fourchettes Salariales (France, 2025)

**Junior (0-2 ans d'expérience):**
- Frontend React/Next.js: 28 000 - 35 000 €
- Fullstack Node.js/React: 30 000 - 38 000 €

**Confirmé (2-5 ans):**
- Frontend/React: 38 000 - 50 000 €
- Fullstack: 42 000 - 55 000 €

**Senior (5+ ans):**
- Frontend Lead: 50 000 - 70 000 €
- Fullstack/Architect: 55 000 - 80 000 €
- Tech Lead: 60 000 - 90 000 €

**Facteurs qui augmentent le salaire:**
- 📍 Localisation (Paris > Province)
- 🏢 Type d'entreprise (GAFAM > PME)
- 📚 Expérience et portfolio
- 🏆 Certifications et reconnaissance
- 🌍 Remote (peut augmenter si entreprise US)

### Évolution de carrière

```
Junior Dev (28k€) 
    ↓ (2 ans)
Développeur (38k€)
    ↓ (3 ans)
Senior Dev (50k€)
    ↓ (2 ans)
Lead/Architect (60-80k€)
    ↓
CTO/VP Engineering (80-150k€)
```

### Tips pour augmenter votre salaire:
1. ✅ Contribuer à l'open-source (rend votre profil attractif)
2. ✅ Avoir un portfolio avec des projets complets
3. ✅ Maîtriser plusieurs technos (fullstack > frontend seul)
4. ✅ Certifications (Google Cloud, AWS, etc.)
5. ✅ Negotiation : premièrement jamais 1er salaire proposé
6. ✅ Switch d'emploi tous les 2-3 ans (20% augmentation moyenne)

---

## 📚 Ressources d'Apprentissage

### Documentations Officielles
- [Next.js 16](https://nextjs.org/docs)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)

### Tutoriels Recommandés
- [Next.js App Router - Vercel Learn](https://vercel.com/learn/nextjs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook)
- [Tailwind CSS Tutorial](https://www.youtube.com/watch?v=lCxcTsOHrjo)

### Projets pour Pratiquer
1. Todo app avec Zustand + localStorage
2. Weather app avec API externe
3. Portfolio personnel (comme Shiori-Sama!)
4. Blog avec MDX et Next.js

---

**Bonne chance dans votre apprentissage! 🚀**
