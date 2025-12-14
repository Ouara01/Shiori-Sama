# 🎌 Shiori-Sama - Plateforme Anime Moderne

> Portfolio fullstack professionnel avec **Next.js 16**, **React 19**, **TypeScript** et **gestion d'état moderne**

## ✨ Caractéristiques Clés

✅ **Frontend Next.js 16** - App Router, Static Export, SSG  
✅ **React 19** - Composants modernes avec Hooks  
✅ **TypeScript strict** - Zéro `any`, typage complet  
✅ **Zustand** - Gestion d'état minimale et performante  
✅ **Design responsive** - Tailwind CSS 4, mobile-first  
✅ **APIs intégrées** - AniList GraphQL + Jikan REST  
✅ **Gratuit à l'infini** - Hébergé sur GitHub Pages  

## 🚀 Stack Technologique

**Frontend:** Next.js 16 | React 19 | TypeScript | Tailwind CSS 4 | Zustand  
**APIs:** AniList GraphQL | Jikan REST  
**Hébergement:** GitHub Pages (gratuit)

**💡 Note importante:** Ce projet n'utilise PLUS Express.js - tout fonctionne avec Next.js fullstack + APIs externes (zéro serveur backend!)

## 📂 Structure du Projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Accueil
│   ├── shiori-client.tsx  # Logique d'app côté client
│   └── globals.css        # Styles globaux
├── components/            # Composants React réutilisables
│   ├── cards/
│   │   ├── AnimeCard.tsx
│   │   └── AnimeCarousel.tsx
│   └── ui/
│       └── Carousel.tsx
├── services/              # Logique API
│   └── animeService.ts    # AniList + Jikan integration
├── store/                 # État global
│   └── shioriStore.ts     # Zustand store
├── types/                 # Interfaces TypeScript
│   └── index.ts
└── lib/                   # Utilitaires
    ├── constants.ts
    └── utils.ts

public/                     # Assets statiques (fonts, icons)
```

## 🏃 Démarrage Rapide

### Installation

```bash
# Cloner le repository
git clone https://github.com/Ouara01/Shiori-Sama.git
cd Shiori-Sama

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Ouvrir http://localhost:3000
```

### Build pour Production

```bash
# Builder le projet (génère HTML statique dans `out/`)
npm run build

# Tester le build localement
npm start
```

## 🌐 Déploiement sur GitHub Pages

```bash
# 1. Builder le projet
npm run build

# 2. Copier vers docs/ (dossier pour GitHub Pages)
# Sur Windows (PowerShell):
Copy-Item -Path "out\*" -Destination "docs" -Recurse -Force

# 3. Commit et push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main

# 4. Attendre 2-5 minutes
# 5. Visite: https://ouara01.github.io/shiori-sama-public/
```

## 🎮 Fonctionnalités

### Chargement d'Anime
- Récupération en temps réel depuis AniList GraphQL
- Cache intelligent avec expiration
- Fallback vers Jikan API si nécessaire

### Gestion des Favoris
- Ajout/suppression d'anime aux favoris
- Persistance automatique dans localStorage
- Synchronisation avec l'UI en temps réel

### Historique de Visualisation
- Suivi des 50 derniers anime consultés
- Stockage local pour fonctionnalité hors-ligne
- Accès rapide aux contenus récents

### Design Responsive
- Mobile-first avec Tailwind CSS
- Navigation burger mobile intuitive
- Interface adaptée desktop/tablette/smartphone

## 📊 Architecture

```
Browser (React Components)
        ↓
     Zustand Store
        ↓
  animeService.ts
        ↓
   Fetch API
        ↓
APIs Externes (AniList, Jikan)
```

### Points Clés

- **Server Components** pour les pages statiques
- **Client Components** pour l'interactivité
- **APIs externes** - aucun backend nécessaire
- **localStorage** - persistance côté client
- **Export statique** - compatible GitHub Pages

## 📚 Documentation

Pour une **documentation technique complète** :
- [**TECHNICAL_GUIDE.md**](TECHNICAL_GUIDE.md) - Guide d'apprentissage détaillé (architecture, technos, salaires IT)
- [**README_GITHUB.md**](README_GITHUB.md) - Présentation pour recruteurs

Pour **déploiement** :
- [**DEPLOYMENT.md**](DEPLOYMENT.md) - Guide GitHub Pages complet

## 🔧 Scripts Disponibles

```bash
npm run dev        # Démarrer le serveur de développement
npm run build      # Builder pour production (génère out/)
npm start          # Démarrer le serveur production
npm run lint       # Linter avec ESLint
npm run lint:fix   # Corriger automatiquement les erreurs
npm run type-check # Vérifier les types TypeScript
npm run format     # Formater le code avec Prettier
```

## 💡 Apprentissage

Ce projet est parfait pour apprendre :

✅ **Next.js 16** - App Router, Server/Client Components, Static Export  
✅ **React 19** - Hooks, Concurrent Features, Composants modernes  
✅ **TypeScript** - Typage strict, interfaces, génériques  
✅ **Zustand** - Gestion d'état légère et performante  
✅ **Tailwind CSS 4** - Utility-first, responsive design, dark mode  
✅ **APIs Intégrées** - GraphQL (AniList) et REST (Jikan)  
✅ **Déploiement** - GitHub Pages, bonnes pratiques production  

## 🎯 Pour les Recruteurs

Ce portfolio démontre :

✅ **Architecture solide** - Composants modulaires, séparation des responsabilités  
✅ **Code professionnel** - TypeScript strict, nommage clair, zéro dette technique  
✅ **Meilleures pratiques** - React modernes, performance optimisée, design UX  
✅ **Intégration d'APIs** - Gestion des erreurs, caching, transformation de données  
✅ **Déploiement professionnel** - GitHub Pages, bonnes pratiques CI/CD  
✅ **Documentation** - Code commenté, guides techniques détaillés  

**[→ Lire la présentation complète pour recruteurs](README_GITHUB.md)**

## 🌐 Liens

- **Site en ligne** : https://ouara01.github.io/shiori-sama-public/
- **GitHub** : https://github.com/Ouara01/Shiori-Sama
- **Documentation technique** : [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md)

## 📄 Licence

MIT - Libre d'utilisation pour apprentissage et portfolio personnel.

---

**Build avec ❤️ en Next.js + React + TypeScript**
