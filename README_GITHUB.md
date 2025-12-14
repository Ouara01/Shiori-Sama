# 🎌 Shiori-Sama - Plateforme Anime Moderne

> Portfolio fullstack professionnel démontrant expertise en **Next.js 16**, **React 19**, **TypeScript** et **gestion d'état moderne**

## 🎯 À Propos

Shiori-Sama est une plateforme de streaming d'anime et manga moderne et performante, construite avec les meilleures pratiques du développement web contemporain. Le projet intègre des APIs externes (AniList, Jikan) pour fournir un catalogue complet d'anime et manga avec une expérience utilisateur fluide et responsive.

**C'est un portfolio complet** montrant comment construire une application fullstack professionnelle de zéro.

## ✨ Caractéristiques Principales

- ✅ **Frontend moderne** : Next.js 16 avec App Router et export statique
- ✅ **Composants React 19** : Hooks modernes, bonnes pratiques
- ✅ **TypeScript strict** : Typage complet, zéro `any`
- ✅ **Gestion d'état** : Zustand pour une logique simple et performante
- ✅ **Design responsive** : Tailwind CSS 4 avec mobile-first
- ✅ **Données en temps réel** : Intégration GraphQL (AniList) et REST (Jikan)
- ✅ **Persistance côté client** : localStorage pour favoris et historique
- ✅ **Performance optimisée** : Image optimization, lazy loading
- ✅ **Hébergement gratuit** : Déployé sur Render

## 🛠️ Stack Technologique

### Frontend
- **Next.js 16** - Framework React fullstack
- **React 19** - Bibliothèque UI moderne
- **TypeScript 5** - Typage statique
- **Tailwind CSS 4** - Design system utility-first
- **Zustand 4** - Gestion d'état minimale

### Infrastructure
- **Render** - Hébergement frontend gratuit
- **APIs externes** :
  - [AniList GraphQL](https://graphql.anilist.co) - Base de données anime complète
  - [Jikan API](https://jikan.moe) - Données anime alternatives

### Outils de Développement
- **ESLint 9** - Linting et qualité de code
- **TypeScript Compiler** - Vérification de type
- **Tailwind CLI** - Compilation CSS optimisée

## 📂 Structure du Projet

```
src/
├── app/
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Page d'accueil
│   ├── shiori-client.tsx    # Logique d'application côté client
│   └── globals.css          # Styles globaux
├── components/
│   ├── cards/
│   │   ├── AnimeCard.tsx     # Composant carte anime
│   │   └── AnimeCarousel.tsx # Carousel d'anime
│   └── ui/
│       └── Carousel.tsx      # Composant carousel réutilisable
├── services/
│   └── animeService.ts      # Logique d'intégration API
├── store/
│   └── shioriStore.ts       # Store Zustand global
├── types/
│   └── index.ts             # Interfaces TypeScript
└── lib/
    ├── constants.ts         # Constantes d'application
    └── utils.ts             # Fonctions utilitaires

public/                       # Assets statiques
└── fonts/                    # Polices d'écriture personnalisées
```

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone https://github.com/Ouara01/Shiori-Sama.git
cd Shiori-Sama

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Ouvrir http://localhost:3000 dans le navigateur
```

### Build pour production

```bash
# Builder le projet (génère HTML statique)
npm run build

# Tester le build localement
npm start
```

## 🎨 Fonctionnalités Détaillées

### Chargement Dynamique d'Anime et Manga
- Récupération depuis **AniList GraphQL** pour les données à jour
- Mise en cache locale pour optimiser les performances
- Gestion d'erreurs robuste avec fallbacks

### Gestion des Favoris
- Ajout/suppression de contenu à vos favoris
- Persistance automatique dans localStorage
- Synchronisation en temps réel avec l'UI

### Historique de Visualisation
- Suivi automatique des contenus consultés
- Conservation des 50 derniers visionnés
- Accès rapide aux contenus récents

### Design Responsive
- Interface adaptée desktop/tablette/mobile
- Tailwind CSS pour styling cohérent
- Navigation burger mobile intuitive

## 📊 Points Techniques Importants

### Architecture
- **Server Components** pour les pages statiques
- **Client Components** pour l'interactivité
- **API externe** directement depuis le navigateur (pas de backend nécessaire)

### Performance
- Export statique (HTML généré à la compilation)
- Lazy loading des images
- Minification automatique des assets
- Zero JavaScript nécessaire pour fonctionner (sauf interactivité)

### Code Quality
- TypeScript strict mode (zéro `any`)
- ESLint configuration Next.js
- Nommage clair et conventions professionnelles
- Composants réutilisables et bien documentés

## 🌐 Accès

**Visiter le site en ligne :**
https://ouara01.github.io/shiori-sama-public/

## 📚 Documentation

Pour une documentation technique complète et approfondie (architecture, tutoriels...), consultez [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md)

## 🔧 Scripts Disponibles

```bash
npm run dev        # Démarrer le serveur de développement
npm run build      # Builder pour production
npm start          # Démarrer le serveur production
npm run lint       # Exécuter ESLint
npm run lint:fix   # Corriger automatiquement les erreurs lint
npm run type-check # Vérifier les types TypeScript
npm run format     # Formater le code avec Prettier
```

## 🎓 Ce que Démontre ce Projet

✅ **Maîtrise de React moderne**
- Hooks (useState, useEffect, useContext)
- Composants fonctionnels
- Props drilling et composition

✅ **Next.js avancé**
- App Router (système de fichiers de routing)
- Server vs Client Components
- Static Export pour GitHub Pages
- Image Optimization

✅ **TypeScript professionnel**
- Interfaces et types personnalisés
- Generics
- Union types et type guards
- Configuration stricte

✅ **Gestion d'état optimisée**
- Zustand pour simplicité
- Éviter le prop drilling
- Sélection granulaire du state

✅ **Intégration d'APIs**
- GraphQL (AniList)
- REST API (Jikan)
- Gestion des erreurs
- Mise en cache intelligente

✅ **Design system cohérent**
- Tailwind CSS utility-first
- Responsive design mobile-first
- Accessibilité (a11y)
- Performance CSS

## 🔄 Flux de Développement

1. **Développement local** avec `npm run dev`
2. **Commit** et **push** vers GitHub
3. **GitHub Pages** redéploie automatiquement depuis la branche `main`
4. **Site disponible** à https://ouara01.github.io/shiori-sama-public/

## 💡 Points Clés pour les Recruteurs

Ce projet démontre:

1. **Architecture solide** - Composants bien structurés, séparation des responsabilités
2. **Code maintenable** - TypeScript strict, nommage clair, pas de dépendances inutiles
3. **Meilleures pratiques modernes** - Hooks React, Concurrent features, Server Components
4. **Performance** - Optimisations Next.js, caching stratégique, minimal JavaScript
5. **Déploiement professionnel** - Configuration GitHub Pages, CI/CD prêt
6. **Expérience utilisateur** - Interface intuitive, temps de chargement rapide
7. **Documentation complète** - Code commenté, guides techniques détaillés

## 📄 Licence

MIT - Libre d'utilisation pour apprentissage et résumé personnel.

## 🤝 Contact & Liens

- **GitHub**: [Ouara01](https://github.com/Ouara01)
- **Visiter le site**: [shiori-sama-public](https://ouara01.github.io/shiori-sama-public/)

---

**Build avec ❤️ en NextJS + React + TypeScript**
