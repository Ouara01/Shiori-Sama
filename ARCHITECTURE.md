/**
 * GUIDE D'APPRENTISSAGE - ARCHITECTURE SHIORI-SAMA
 * 
 * Ce document explique l'architecture du projet pour votre apprentissage professionnel
 */

## 🏛️ Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  NAVIGATEUR (Client)                                          │
│  ├─ React 19 Components                                       │
│  ├─ Zustand Store (État Global)                             │
│  └─ TypeScript (Typage Strict)                              │
│                                                               │
└────────────────┬──────────────────────────────────────────────┘
                 │
                 │ FETCH API / HTTP
                 │ (JSON)
                 │
┌────────────────┴──────────────────────────────────────────────┐
│                                                               │
│  NEXT.JS 16 (Frontend Fullstack)                            │
│  ├─ App Router avec SSG                                      │
│  ├─ Client Components Interactifs                            │
│  ├─ Zustand Store (État Global)                              │
│  └─ TypeScript (Typage Strict)                              │
│                                                               │
└────────────────┬──────────────────────────────────────────────┘
                 │
                 │ ANILIST GraphQL / Jikan REST
                 │ (Données Anime)
                 │
┌────────────────┴──────────────────────────────────────────────┐
│                                                               │
│  APIs Externes                                                │
│  ├─ AniList (https://graphql.anilist.co)                     │
│  └─ Jikan (https://api.jikan.moe/v4)                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Flux de Données

### 1️⃣ L'utilisateur arrive sur le site

```
1. Next.js rend la page statique (page.tsx)
2. ShioriClient composant client s'initialise (useEffect)
3. loadFromLocalStorage() charge les données stockées localement
4. setLoading(true) pour afficher un loader
```

### 2️⃣ Chargement des données anime

```
1. fetchTrendingAnimes() appelé via animeService.ts
2. ✅ Si en cache ET non expiré → retourner le cache
3. ❌ Si pas de cache ou expiré → appeler AniList API
4. Transformation des données au format standard
5. Sauvegarde en cache avec timestamp
6. setCarousels() met à jour le Zustand store
7. Les composants re-render avec les nouvelles données
```

### 3️⃣ Interaction utilisateur (clic sur un anime)

```
1. Utilisateur clique sur une AnimeCard
2. onSelect() callback appelé
3. addToWatchHistory() ajoute à l'historique
4. saveToLocalStorage() persiste les données
5. Store met à jour l'état global
6. Composants re-render avec les données mises à jour
```

## 📦 Composants Clés Expliqués

### AnimeCard.tsx
```typescript
// Reçoit un anime en props
// Affiche une carte avec:
// - Image (Next/Image pour optimisation)
// - Titre tronqué
// - Type (TV, Movie, etc.)
// - Score formaté
// - Bouton favori qui toggle le favoris

// Points clés:
// ✅ onClick: déclenche le callback parent
// ✅ preventDefault sur le click favori
// ✅ Image avec fallback en cas d'erreur
// ✅ Classnames CSS Tailwind
```

### Carousel.tsx
```typescript
// Conteneur horizontal scrollable
// Affiche des AnimeCard en boucle
// Boutons left/right pour scroll smooth

// Points clés:
// ✅ useRef pour DOM manipulation
// ✅ scrollBy() pour scroll smooth
// ✅ Buttons avec hover opacity
// ✅ Responsive (visible/invisible selon taille)
```

### ShioriClient.tsx
```typescript
// Composant client-side qui s'initialise une seule fois
// Gère:
// ✅ Chargement des données au montage
// ✅ Menu burger mobile (toggle classes CSS)
// ✅ Barre de recherche (debounced)
// ✅ Historique et favoris (Zustand store)

// Points clés:
// ✅ useEffect avec dépendances
// ✅ Promise.all() pour appels parallèles
// ✅ Try/catch pour gestion d'erreur
// ✅ Retourne null (pas de rendu, juste logique)
```

## 🎁 Zustand Store Expliqué

```typescript
// Avantages vs Redux/Context:
// ✅ Plus petit (aucune boilerplate)
// ✅ Plus rapide (pas de Context Provider)
// ✅ Plus simple à apprendre
// ✅ Parfait pour les petits/moyens projets

// Structure:
// 1. État initial (carousels, favoris, etc.)
// 2. Setters simples (setCarousels, setLoading, etc.)
// 3. Actions complexes (addToWatchHistory, etc.)

// Utilisation dans un composant:
const { favorites, toggleFavorite } = useShioriStore();
// Ça c'est du React moderne!
```

## 🔌 Services API Expliqués

```typescript
// animeService.ts gère l'intégration avec AniList

// Fonctions:
// 1. fetchTrendingAnimes() - Top animes populaires
// 2. fetchSeasonalAnimes() - Saison actuelle
// 3. searchAnimes() - Recherche par texte

// Cache intelligent:
cacheWithTimestamp.set(key, data, DURATION_MINUTES)
cacheWithTimestamp.get(key) // Retourne null si expiré

// Transformation AniList → Format App:
transformAniListAnime(anilistAnime) -> Anime
```

## 🎯 Architecture Next.js Fullstack Actuelle

```typescript
// Le projet n'utilise QUE Next.js 16 (pas de backend Express)
// Pourquoi ? Les données viennent directement des APIs externes

// src/app/shiori-client.tsx - Logique d'app côté client
// 1. useEffect au montage pour initialiser l'app
// 2. Appelle fetchTrendingAnimes() depuis animeService.ts
// 3. AniList GraphQL retourne les animes
// 4. Transformation et mise en cache local
// 5. setCarousels() met à jour le Zustand store
// 6. Les composants re-rendent automatiquement

// src/app/api/route.ts (optionnel, non utilisé actuellement)
// Si besoin de logique backend à l'avenir:
// - Serveur Node.js intégré à Next.js
// - Endpoints REST personnalisés
// - Authentification sécurisée
// - Base de données
```

## 💾 Stockage des Données

```typescript
// LocalStorage (Client)
// ✅ Historique de visionnage
// ✅ Animes favoris
// ✅ Préférences utilisateur
// ✅ Cache des données

// Avantages:
// ✅ Pas de server nécessaire
// ✅ Persistance entre sessions
// ✅ Rapide d'accès

// Backend Database (À venir)
// ✅ PostgreSQL + Prisma ORM
// ✅ Sync avec le cloud
// ✅ Partage entre appareils
```

## 📝 TypeScript Strict

```typescript
// Chaque fichier a des interfaces TypeScript

// Exemple:
interface AnimeCardProps {
  anime: Anime;           // Type Anime défini
  onSelect?: (anime: Anime) => void;  // Fonction callback typée
}

// Avantages:
// ✅ Détecte les erreurs à la compilation
// ✅ Meilleure autocomplétion IDE
// ✅ Code plus maintenable
// ✅ Refactoring plus sûr
```

## 🔍 Gestion d'Erreurs

```typescript
// Pattern utilisé partout:

try {
  // 1. Tentative première requête
  const response = await fetchWithRetry(url);
  
  // 2. Transformation
  const data = transformData(response);
  
  // 3. Mise à jour state
  setState(data);
  
} catch (error) {
  // 4. Gestion gracieuse
  console.error('Erreur détaillée:', error);
  setError('Erreur utilisateur friendly');
  // 5. Fallback UI
}

// fetchWithRetry():
// Réessaye 3 fois avec délai exponentiel
// 1ère tentative: immédiat
// 2ème tentative: attendre 1s
// 3ème tentative: attendre 2s
```

## 🎯 Points Clés pour les Recruteurs

1. **Architecture Modulaire**
   - Services séparés
   - Composants réutilisables
   - Types partagés

2. **Code Documenté**
   - Commentaires français détaillés
   - JSDoc sur les fonctions
   - README complet

3. **Bonnes Pratiques**
   - No magic strings (constantes)
   - DRY (Don't Repeat Yourself)
   - SOLID principles

4. **Performance**
   - Cache intelligent
   - Lazy loading images
   - Retry automatiques
   - Debounce sur la recherche

5. **Moderne Stack**
   - Next.js 16 (React Server Components)
   - React 19 (React Compiler)
   - TypeScript strict
   - Zustand (état moderne)

## 📚 Ressources pour Apprendre

- **Next.js:** https://nextjs.org/docs
- **React:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org/docs
- **Zustand:** https://github.com/pmndrs/zustand
- **AniList API:** https://anilist.gitbook.io/anilist-apiv2-docs
- **Jikan API:** https://jikan.moe/docs/api

---

**Bonne compréhension! Si vous avez des questions sur l'architecture, ouvrez une issue. 🎌**
