# 🎌 Shiori-Sama - Plateforme de Streaming d'Anime

**Projet personnel fullstack utilisant des technologies web modernes.**

**En cours de développement.**

## 💻 Stack Technologique

**Frontend:** Next.js 16 | React 19 | TypeScript | Tailwind CSS 4 | Zustand  
**Backend:** Next.js | TypeScript | CORS | dotenv  
**APIs:** AniList GraphQL

## 📁 Structure

```
src/
├── app/                   # Pages Next.js (App Router)
├── components/            # Composants React réutilisables
│   ├── cards/             # AnimeCard, Carousel
│   └── ui/                # Composants UI
├── services/              # Services API (AniList, Jikan)
├── store/                 # Zustand store (état global)
├── types/                 # Interfaces TypeScript
└── lib/                   # Constantes et utilitaires

backend/
├── src/
│   ├── index.ts           # Serveur principal
│   ├── routes/            # Routes API
│   └── controllers/       # Logique métier
└── package.json
```

## ⚙️ Installation

```bash
# Frontend
npm install
```

## 🏃 Démarrage

```bash
# Terminal 1 - Frontend (http://localhost:3000)
npm run dev
```

## 🌐 Déploiement

**Frontend (GitHub Pages):**
```bash
# https://Ouara01.github.io/shiori-sama
```

## 📊 API Endpoints

`GET /api/animes/trending` | `GET /api/animes/seasonal` | `GET /api/animes/search`  
`POST/GET /api/users/favorites` | `POST/GET /api/users/watch-history`

## 🎓 Ce que j’ai appris / réalisé

- Développement front-end avec Next.js et React  
- Gestion d’état globale avec Zustand  
- Architecture backend organisée sous Next.js  
- Connexion à des APIs externes (GraphQL)  
- Documentation et bonnes pratiques de code  
- Déploiement d’une application fullstack  

---
