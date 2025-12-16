# 🎌 Shiori-Sama - Plateforme de Streaming d'Anime

Un projet fullstack moderne et professionnel avec **Next.js 16**, **React 19**, **TypeScript** et **Zustand**.

## 🚀 Stack Technologique

**Frontend:** Next.js 16 | React 19 | TypeScript | Tailwind CSS 4 | Zustand  
**Backend:** Next.js | TypeScript | CORS | dotenv  
**APIs:** AniList GraphQL | Jikan  

## 📁 Structure

```
src/
├── app/                    # Pages Next.js (App Router)
├── components/             # Composants React réutilisables
│   ├── cards/             # AnimeCard, Carousel
│   └── ui/                # Composants UI
├── services/              # Services API (AniList, Jikan)
├── store/                 # Zustand store (état global)
├── types/                 # Interfaces TypeScript
└── lib/                   # Constantes et utilitaires

backend/
├── src/
│   ├── index.ts          # Serveur principal
│   ├── routes/           # Routes API
│   └── controllers/      # Logique métier
└── package.json
```

## ⚙️ Installation

```bash
# Frontend
npm install

# Backend
cd backend && npm install
```

## 🏃 Démarrage

```bash
# Terminal 1 - Frontend (http://localhost:3000)
npm run dev

# Terminal 2 - Backend (http://localhost:3001)
cd backend && npm run dev
```

## 🌐 Déploiement

**Frontend (GitHub Pages):**
```bash
npm run build
git push origin main
# https://Ouara01.github.io/shiori-sama
```

## 📊 API Endpoints

`GET /api/animes/trending` | `GET /api/animes/seasonal` | `GET /api/animes/search`  
`POST/GET /api/users/favorites` | `POST/GET /api/users/watch-history`

## 📝 Pour les Recruteurs

✅ Modern stack professionnel (Next.js 16, React 19, TypeScript)  
✅ Zustand pour gestion d'état optimisée  
✅ Backend Next.js bien structuré  
✅ APIs GraphQL intégrées  
✅ Code documenté en français  
✅ Déploiement fullstack (GitHub Pages + Render)  

---

**Bonne codification! 🎌**
