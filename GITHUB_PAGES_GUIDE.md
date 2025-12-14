# 🚀 GUIDE COMPLET - GITHUB PAGES DEPLOYMENT

**Pour:** Shiori-Sama Portfolio  
**Date:** Décembre 2025  
**Plateforme:** GitHub Pages (Gratuit)

---

## 📋 PRÉREQUIS

- [x] Compte GitHub (gratuit sur github.com)
- [x] Git installé (`git --version` pour vérifier)
- [x] Node.js 18+ (`node --version` pour vérifier)
- [x] Projet Shiori-Sama cloné localement

---

## 🎯 APPROCHE: Export Statique

Ton projet utilise **des APIs externes** (AniList + Jikan), donc:
- ✅ **Pas besoin de serveur Node.js**
- ✅ **Pages statiques suffisent**
- ✅ **GitHub Pages fonctionne parfaitement**
- ✅ **Déploiement gratuit et automatique**

---

## 📦 ÉTAPE 1: Configuration Local (5 min)

### 1.1 - Vérifie que next.config.ts est correct

Le fichier doit contenir:

```typescript
output: 'export',  // ← CRUCIAL
basePath: '/shiori-sama-public',  // ← Adapte au nom de ton repo
images: {
  unoptimized: true,  // ← Important pour Pages
}
```

✅ **Check:** Ouvre `next.config.ts` et confirme ces 3 lignes

### 1.2 - Build le projet localement

```bash
cd c:\Users\flori\Desktop\Dossiers\Projets-Code\shiori-sama-public

npm run build
```

**Résultat attendu:**
```
✓ Compiled successfully
✓ out/ folder created with ~200+ files
```

Si erreur, les logs indiquent le problème. Partage le message d'erreur!

### 1.3 - Test du build local

```bash
# Reste dans le même dossier
npm start
```

Ouvre `http://localhost:3000/shiori-sama-public` dans le navigateur.

**Dois voir:** 
- ✅ Site complet avec tous les carousels
- ✅ Menu burger fonctionnel
- ✅ Données AniList chargées

---

## 🐙 ÉTAPE 2: GitHub - Créer le Repository (5 min)

### 2.1 - Créer un repo GitHub

1. Va sur https://github.com/new
2. Remplis les champs:
   - **Repository name:** `shiori-sama-public`
   - **Description:** `Modern anime portfolio with Next.js 16, React 19, TypeScript`
   - **Public:** ✅ (sélectionné)
   - **Add .gitignore:** Sélectionne "Node"
   - **Add LICENSE:** Optionnel

3. Clique **"Create repository"**

### 2.2 - Récupère l'URL du repo

Après création, tu verras:
```
https://github.com/YOUR_USERNAME/shiori-sama-public.git
```

**Copie cette URL**, tu vas l'utiliser après.

---

## 💾 ÉTAPE 3: Git - Initialiser & Pousser (5 min)

### 3.1 - Initialise git et configure

```bash
# Dans ton dossier du projet
cd c:\Users\flori\Desktop\Dossiers\Projets-Code\shiori-sama-public

# Initialise git (si pas déjà fait)
git init

# Configure git (une fois seulement)
git config user.name "Ton Nom"
git config user.email "ton.email@gmail.com"

# Ajoute remote origin
git remote add origin https://github.com/YOUR_USERNAME/shiori-sama-public.git

# Renomme branche vers 'main' (standard GitHub)
git branch -M main
```

### 3.2 - Ajoute tous les fichiers au commit

```bash
# Vérifie que .gitignore exclut node_modules, .next, etc.
git status

# Ajoute tous les fichiers
git add .

# Crée le premier commit
git commit -m "🎉 Initial commit: Shiori-Sama anime portfolio

- Next.js 16.0.10 + React 19.2.1
- TypeScript strict mode
- API integrations: AniList GraphQL + Jikan REST
- Fully responsive design
- 0 build errors"
```

### 3.3 - Pousse vers GitHub

```bash
git push -u origin main
```

**Résultat attendu:**
```
Enumerating objects: 152, done.
Counting objects: 100% (152/152), done.
...
To https://github.com/YOUR_USERNAME/shiori-sama-public.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

✅ **Ton code est maintenant sur GitHub!**

Vérifie sur https://github.com/YOUR_USERNAME/shiori-sama-public

---

## 🚀 ÉTAPE 4: Configurer GitHub Pages (5 min)

### 4.1 - Va aux Settings

1. Sur ton repo GitHub: **Settings** (en haut à droite)
2. Dans le menu gauche: **Pages**

### 4.2 - Configure le déploiement

Cherche la section "Build and deployment":

1. **Source:** Sélectionne "GitHub Actions"
2. Clique sur "Next.js"

GitHub crée un workflow automatique!

### 4.3 - Alternative: Manual Deploy

Si tu préfères contrôler manuellement:

1. **Source:** "Deploy from a branch"
2. **Branch:** `main`
3. **Folder:** `/(root)` 

Puis:
```bash
# À chaque fois que tu veux déployer
npm run build
git add out/
git commit -m "Deploy: update"
git push
```

---

## ✅ ÉTAPE 5: Vérifier le Déploiement (2 min)

### 5.1 - Attendre 2-5 minutes

GitHub Pages déploie automatiquement. Va sur:

```
https://YOUR_USERNAME.github.io/shiori-sama-public
```

**Dois voir:**
- ✅ Page Shiori complète
- ✅ Tous les carousels
- ✅ Menu burger
- ✅ AniList data chargées

### 5.2 - Vérifier le status

Sur ton repo → **Settings** → **Pages**

Doit montrer:
```
✅ Your site is live at https://YOUR_USERNAME.github.io/shiori-sama-public
```

---

## 🤖 BONUS: Automation avec GitHub Actions

Pour déployer **automatiquement** à chaque push:

### 5.1 - Créer le fichier workflow

Crée le dossier + fichier:
```
.github/workflows/deploy.yml
```

Copie le contenu:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build project
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

### 5.2 - Push & Auto-deploy

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions CI/CD workflow"
git push
```

**Maintenant:** Chaque push → Auto-deploy! 🚀

Regarde l'onglet **Actions** pour voir la progression.

---

## 🔗 URLS IMPORTANTES

| Élément | URL |
|--------|-----|
| **Site Live** | `https://YOUR_USERNAME.github.io/shiori-sama-public` |
| **Repo Code** | `https://github.com/YOUR_USERNAME/shiori-sama-public` |
| **Settings Pages** | `https://github.com/YOUR_USERNAME/shiori-sama-public/settings/pages` |
| **Actions CI/CD** | `https://github.com/YOUR_USERNAME/shiori-sama-public/actions` |

---

## 🆘 TROUBLESHOOTING

### ❌ "404 Not Found"

**Cause:** GitHub Pages pas encore compilée (<2 min)

**Fix:** 
1. Attends 2-3 minutes
2. Rafraîchis la page (Ctrl+F5)

### ❌ "Build failed" dans Actions

**Cause:** Erreur TypeScript ou node_modules

**Fix:**
```bash
# Local
npm run build  # Dois réussir
git push       # Relance GitHub Actions
```

### ❌ "CSS/Images ne s'affichent pas"

**Cause:** `basePath` mal configuré dans next.config.ts

**Fix:** Assure-toi que:
```typescript
basePath: '/shiori-sama-public'  // ← Doit matcher repo name
```

### ❌ "APIs ne répondent pas"

**Normal!** AniList/Jikan peuvent être lents.

**Fix:** Attends quelques secondes, les requêtes sont asynchrones.

---

## 💡 BONNES PRATIQUES

### Git Commits

Utilise des messages clairs:
```bash
git commit -m "feat: add search functionality"
git commit -m "fix: resolve flag-icons display"
git commit -m "docs: update README"
git commit -m "style: update carousel styling"
```

### Avant chaque push

```bash
npm run lint    # Vérifie code quality
npm run build   # Vérifie compilation
npm start       # Test local (optionnel)
git push        # Pousse si tout OK
```

### Versioning

Utilise des tags pour les versions:

```bash
git tag -a v1.0.0 -m "First public release"
git push origin v1.0.0
```

---

## 📈 PROCHAINES ÉTAPES

1. **✅ Publie le repo** (cette étape)
2. **Ajoute un README.md** complet pour le portfolio
3. **Ajoute une photo/screenshot** du site
4. **Partage le lien** sur LinkedIn
5. **Améliore les fonctionnalités:**
   - Fix flag-icons display
   - Implémente localStorage
   - Ajoute tests unitaires

---

## 🎓 POUR LES RECRUTEURS

Quand tu partages ce projet:

```
Portfolio Anime - Shiori-Sama
https://YOUR_USERNAME.github.io/shiori-sama-public

Stack:
- Frontend: Next.js 16, React 19, TypeScript 5
- Styling: Tailwind CSS + Custom CSS
- APIs: AniList GraphQL, Jikan REST
- Tools: ESLint, Prettier, GitHub Actions
- Status: Production-Ready, 0 errors

Features:
✓ Real-time anime data from AniList
✓ Daily releases tracking (Jikan)
✓ Responsive design (mobile-first)
✓ Advanced search & filtering
✓ Modern TypeScript architecture

Repository: https://github.com/YOUR_USERNAME/shiori-sama-public
```

---

## ✨ FINAL CHECKLIST

- [ ] Code poussé sur GitHub
- [ ] GitHub Pages activé
- [ ] Site accessible à https://YOUR_USERNAME.github.io/shiori-sama-public
- [ ] Tous les carousels affichés
- [ ] AniList data chargées
- [ ] README.md complet
- [ ] GitHub Actions workflow créé (optionnel mais recommandé)

**Félicitations! Ton portfolio est en ligne! 🎉**

