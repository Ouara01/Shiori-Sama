/**
 * 🚀 GUIDE DE DÉPLOIEMENT - GITHUB PAGES
 * 
 * Ce guide explique comment déployer votre site Next.js sur GitHub Pages
 */

# 📦 DÉPLOIEMENT SHIORI-SAMA

## ✨ Nouvelle Architecture: Next.js Fullstack Seul

**Bonne nouvelle:** Vous n'avez plus besoin d'Express.js!

- ✅ **Frontend Next.js** → GitHub Pages (statique gratuit)
- ✅ **Données** → APIs externes (AniList + Jikan)
- ❌ **Pas de backend** → Zéro serveur Node.js à maintenir
- ❌ **Pas de frais** → Entièrement gratuit

---

## 🎯 ÉTAPE 1: Vérifier la Configuration Next.js

### 1.1 Configurer next.config.ts pour export statique

**Votre fichier next.config.ts doit contenir:**
```typescript
const nextConfig: NextConfig = {
  output: 'export',  // CRUCIAL: génère du HTML statique
  basePath: '/shiori-sama-public',  // Adapter au nom de ton repo
  assetPrefix: '/shiori-sama-public',  // Assets path
  trailingSlash: true,  // Important pour routing statique
  images: {
    unoptimized: true,  // Pas d'optimization pour Pages
  },
};
```

### 1.2 Vérifier package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

---

## 🌐 ÉTAPE 2: Builder et Tester Localement

### 2.1 Builder le projet

```bash
cd c:\Users\flori\Desktop\Dossiers\Projets-Code\shiori-sama-public

npm run build
# Crée un dossier `out/` avec tous les fichiers statiques
```

### 2.2 Tester localement

```bash
npm start
# Ouvrir http://localhost:3000/shiori-sama-public
# Vérifier que tout fonctionne
```

---

## 📤 ÉTAPE 3: Déployer sur GitHub Pages

### Option A: Déploiement Manuel (Simple)

```bash
# 1. S'assurer d'être dans le bon dossier
cd c:\Users\flori\Desktop\Dossiers\Projets-Code\shiori-sama-public

# 2. Builder
npm run build

# 3. Copier les fichiers vers docs/ (pour GitHub Pages)
# Sur Windows (PowerShell):
Copy-Item -Path "out\*" -Destination "docs" -Recurse -Force

# 4. Commit et push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main

# 5. Attendre 2-5 minutes
# 6. Visiter: https://ouara01.github.io/shiori-sama-public/
```

### Option B: Déploiement Automatique avec GitHub Actions (Avancé)

Créer `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to docs folder
        run: |
          rm -rf docs
          mkdir docs
          cp -r out/* docs/
      
      - name: Commit and push
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add docs/
          git commit -m "Auto-deploy to GitHub Pages"
          git push origin main
```

---

## ✅ VÉRIFICATION

### Checklist:

- [ ] `npm run build` réussit sans erreur
- [ ] Dossier `out/` ou `docs/` crée avec ~100+ fichiers
- [ ] GitHub Pages Settings → Pages → Branch: main
- [ ] Site accessible à https://ouara01.github.io/shiori-sama-public/
- [ ] Carousels d'anime chargent correctement
- [ ] Menu burger mobile fonctionne
- [ ] Aucune erreur dans la console du navigateur

### Tests après déploiement:

```bash
# Vérifier que le site charge
curl https://ouara01.github.io/shiori-sama-public/ | head -20

# Vérifier les assets
# Ouvrir https://ouara01.github.io/shiori-sama-public/ dans le navigateur
# F12 → Console → Pas d'erreurs?
```

---

## 🆓 COÛT

- **GitHub Pages**: 100% gratuit ✅
- **Next.js Build**: Gratuit sur votre machine
- **APIs externes**: Gratuites (AniList, Jikan)

**Total: 0€ par mois!**

---

## 🚨 DÉPANNAGE

### GitHub Pages ne met pas à jour

```bash
# 1. Forcer un hard refresh
# Ctrl+Shift+R dans le navigateur

# 2. Vérifier le dossier docs/
ls docs/
# Doit contenir: index.html, _next/, etc.

# 3. Attendre 5 minutes pour propagation DNS
# GitHub Pages peut prendre du temps

# 4. Vérifier les logs GitHub
# Aller dans Settings → Pages → voir les logs de déploiement
```

### Le build échoue

```bash
# 1. Vérifier localement
npm run build

# 2. Lire les erreurs
# Chercher les lignes rouges

# 3. Erreur courante: images
# Vérifier que images.unoptimized = true dans next.config.ts

# 4. Erreur courante: basePath
# Vérifier que basePath = '/shiori-sama-public' (adapter le nom du repo)
```

### Site charge mais pas de données

```bash
# 1. Ouvrir F12 → Console
# Chercher les erreurs CORS

# 2. Les APIs (AniList, Jikan) sont publiques
# Aucune configuration CORS n'est nécessaire

# 3. Si Erreur: "Cannot fetch from AniList"
# → AniList peut être temporairement down
# → Tester dans 5 minutes

# 4. Vérifier animeService.ts
# Vérifier que l'URL est correcte:
# https://graphql.anilist.co ✅
```

---

## 🎯 ÉTAPES FUTURES (Optionnel)

### Ajouter un domaine personnalisé

Dans GitHub Pages Settings:
```
Custom Domain: shiori.example.com
(acheter un domaine sur GoDaddy, Namecheap, etc.)
```

### Ajouter Analytics

```typescript
// Dans src/app/layout.tsx
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
```

### Ajouter des fonctionnalités backend (optionnel)

Si vous voulez ajouter un backend plus tard:
```
NextJS API Routes (src/app/api/)
→ Déployer sur Vercel (gratuit aussi!)
→ Base de données: Supabase (PostgreSQL gratuit)
```

---

## 🎌 VOUS ÊTES EN PRODUCTION!

Votre portfolio est maintenant:
- ✅ Accessible publiquement
- ✅ Gratuit à l'infini
- ✅ Rapide (CDN GitHub)
- ✅ Prêt à être montré aux recruteurs!

Félicitations! 🎉
