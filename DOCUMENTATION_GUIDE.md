# 📋 Index de Documentation

Bienvenue! Voici guide simplifié pour naviguer dans la documentation.

## 👥 Pour les Recruteurs

**Lisez ça en premier :**
- [📄 README_GITHUB.md](README_GITHUB.md) - Présentation professionnelle du projet (2-3 min)

## 🎓 Pour Apprendre les Technos

**Guide complète et détaillé :**
- [📘 TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md) - Documentation technique exhaustive avec :
  - Architecture complète expliquée
  - Chaque technologie en détail (Next.js, React, TypeScript, Zustand, Tailwind)
  - Flux de données pas à pas
  - Exemples de code pratiques
  - Ressources d'apprentissage
  - Informations salaires IT

## 🚀 Pour Déployer

**Déploiement pas à pas :**
- [⚙️ GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) - Configuration GitHub Pages en 5 minutes
- [📦 DEPLOYMENT.md](DEPLOYMENT.md) - Guide complet avec dépannage

## 📁 Fichiers Clés

| Fichier | Audience | Contenu |
|---------|----------|---------|
| README_MAIN.md | Tous | Vue d'ensemble rapide |
| README_GITHUB.md | Recruteurs | Présentation professionnelle |
| TECHNICAL_GUIDE.md | Développeurs | Guide d'apprentissage détaillé |
| GITHUB_PAGES_SETUP.md | Développeurs | Déploiement rapide |
| DEPLOYMENT.md | Ops/DevOps | Guide complet déploiement |
| ARCHITECTURE.md | Développeurs | Architecture technique |

## ⚡ Démarrage Ultra-Rapide

```bash
# 1. Installer
npm install

# 2. Développer
npm run dev
# Ouvrir http://localhost:3000

# 3. Déployer sur GitHub Pages
npm run build
Copy-Item -Path "out\*" -Destination "docs" -Recurse -Force
git add .
git commit -m "Deploy"
git push origin main

# 4. Attendre 2 minutes
# 5. Visiter https://ouara01.github.io/shiori-sama-public/
```

## 🔍 Chercher Quelque Chose?

**Comment démarrer le projet?**
→ [README_MAIN.md](README_MAIN.md#-démarrage-rapide)

**Comment ça marche le code?**
→ [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md#flux-de-données)

**Comment déployer sur GitHub Pages?**
→ [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)

**Comment présenter le projet aux recruteurs?**
→ [README_GITHUB.md](README_GITHUB.md)

**Pourquoi chaque technologie?**
→ [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md#stack-technologique-détaillé)

**Combien gagnent les développeurs?**
→ [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md#salaires) (doc technique privée)

## 📊 Structure du Projet

```
Shiori-Sama/
├── src/                          # Code source
│   ├── app/                      # Pages & layout Next.js
│   ├── components/               # Composants React
│   ├── services/                 # Logique API
│   ├── store/                    # État global (Zustand)
│   ├── types/                    # Interfaces TypeScript
│   └── lib/                      # Utilitaires
├── public/                       # Assets statiques
├── docs/                         # Build output (GitHub Pages)
├── next.config.ts                # Config Next.js
├── tsconfig.json                 # Config TypeScript
├── tailwind.config.ts            # Config Tailwind
└── package.json                  # Dépendances
```

## 🎯 Roadmap du Projet

**Phase 1 - Frontend (✅ DONE)**
- Next.js 16 + React 19
- TypeScript strict
- Zustand store
- Tailwind CSS responsive
- AniList + Jikan API integration

**Phase 2 - Déploiement (✅ DONE)**
- GitHub Pages (gratuit)
- Build static export
- Documentation complète

**Phase 3 - Future (⏳ OPTIONNEL)**
- API Route Next.js (si besoin)
- Base de données (Supabase)
- Authentification utilisateur
- Partage entre appareils

---

## 🆘 Besoin d'Aide?

1. **Erreur de build?** → Voir [GITHUB_PAGES_SETUP.md - Dépannage](GITHUB_PAGES_SETUP.md#-si-ça-ne-marche-toujours-pas)

2. **Comment fonctionne X?** → Chercher dans [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md)

3. **Comment déployer?** → [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)

4. **Comment présenter?** → [README_GITHUB.md](README_GITHUB.md)

---

**Bon apprentissage! 🚀**
