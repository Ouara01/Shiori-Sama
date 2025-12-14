<!-- # Architecture de Shiori-Sama -->

## Vue d'ensemble

Shiori-Sama est une application Next.js moderne pour découvrir et suivre des animes. Elle utilise une **approche hybride** :
- **React + Next.js** pour le framework
- **DOM Manipulation directe** pour les carousels (compatibilité avec l'original)
- **APIs externes** : AniList (GraphQL) et Jikan (REST)

## Structure des fichiers

```
src/app/
├── page.tsx                    ✅ Structure HTML principale
├── shiori-client.tsx          ✅ Logique client - Initialisation tout
├── globals.css                ✅ Styles CSS (original)
└── layout.tsx                 ✅ Layout Next.js

src/components/
├── cards/
│   ├── AnimeCard.tsx         ⚠️  Optionnel - Composant React inutilisé
│   ├── AnimeCarousel.tsx      ⚠️  Optionnel - Gestion carousel React
│   └── Carousel.tsx           ⚠️  Optionnel - Carousel générique
└── ui/                        ⚠️  Vides - Pour expansion future
```

## Points clés

### 🟢 Ce qui fonctionne

1. **page.tsx**
   - Structure HTML avec tous les carousels
   - Imports de `shiori-client.tsx` pour initialisation
   - Classes CSS alignées avec le styling

2. **shiori-client.tsx**
   - ✅ Création de cartes via `createCard()` 
   - ✅ Fetch APIs: `fetchAniList()`, `fetchJikanDaily()`
   - ✅ Gestion du menu burger mobile: `initBurgerMenu()`
   - ✅ Initialisation recherche: `initSearch()` 
   - ✅ Bannière de saison: `fetchSeasonBanner()`
   - ✅ Filtrage et tri des animes

3. **Composants optionnels**
   - `AnimeCard.tsx`: Bien commenté, prêt pour refactorisation future
   - `Carousel.tsx`: Structure React alternative
   - `AnimeCarousel.tsx`: Carousel générique

### 🟡 À faire ou à améliorer

- [ ] Intégration localStorage pour "Reprenez votre visionnage"
- [ ] Implémentation de la recherche dans les APIs
- [ ] Tests unitaires et d'intégration
- [ ] Optimisation des images (lazy loading)
- [ ] Refactorisation vers 100% React si désiré

## Comment ça marche

### 1. Chargement de la page

```
browser → page.tsx (HTML)
  ↓
  → shiori-client.tsx (useEffect)
    ↓
    → fillCarousels()
      → fetchAniList() / fetchJikanDaily()
      → createCard() pour chaque anime
      → appendChild() dans le DOM
```

### 2. Cycle de vie

```
1. Page charge → Next.js rend page.tsx
2. React monte ShioriClient composant
3. useEffect se déclenche (client-side)
4. fillCarousels() lance les APIs
5. Cards sont injectées dans le DOM
6. Event listeners attachés (burger, search)
```

### 3. Styles CSS

Tous les styles viennent de `globals.css`:
- `.shiori-card` → Styling des cartes
- `.carousel-anime` → Styling du carrousel
- `.shiori-header` → Header principal
- `.mobile-menu-top` → Menu mobile
- Et bien d'autres...

## APIs utilisées

### AniList GraphQL

```graphql
query {
  Page {
    media(type: ANIME, sort: SCORE_DESC) {
      id
      title { userPreferred, romaji }
      coverImage { large, medium }
      averageScore
      popularity
      ...
    }
  }
}
```

**Endpoints:**
- `https://graphql.anilist.co`

**Données retournées:**
- Top animes par score/popularité
- Mangas avec même filtres
- Couvertures haute qualité

### Jikan REST API

```
GET https://api.jikan.moe/v4/schedules/{day}
```

**Endpoints:**
- Sorties du jour
- Filtrage par jour de semaine
- Score et popularité

## Modification & Maintenance

### Ajouter un nouveau carousel

1. Ajouter objet dans `carousels` array (shiori-client.tsx)
2. Ajouter div container dans page.tsx avec ID correspondant
3. Ajouter CSS pour le styling (globals.css)
4. Vérifier filtrage/tri dans `fillCarousels()`

### Modifier les filtres

Dans `fillCarousels()`:
```typescript
// Changer les critères de tri
const data = await fetchAniList(c.type, sort, 1, perPage);

// Appliquer nouveaux filtres
items = data.filter(item => 
  item.averageScore >= 70 &&  // Seuil minimum
  item.popularity >= 500      // Popularité minimum
);
```

### Ajouter une nouvelle API

1. Créer `async function fetch[APIName]()`
2. Faire la requête appropriée
3. Transformer en format `AnimeData`
4. Retourner tableau d'animes
5. Appeler dans `fillCarousels()`

## Commandes utiles

```bash
# Développement
npm run dev          # Serveur local (http://localhost:3000)

# Build & Production
npm run build        # Build optimisé
npm start            # Serveur production

# Vérifications
npm run lint         # ESLint
```

## Notes de sécurité

- Les APIs AniList et Jikan sont CORS-enabled (pas de proxy nécessaire)
- Pas de données sensibles stockées (localStorage)
- Aucune authentification requise

## Contacts & Questions

Voir page principale du projet pour les contacts développeur.

---

**Dernière mise à jour:** Décembre 2025
**Version Next.js:** 16.0.10
**TypeScript:** Strict Mode
