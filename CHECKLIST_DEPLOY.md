# ✅ Checklist Pré-Déploiement

Vérifier tout avant de déployer sur GitHub Pages.

## 🔍 Vérifications Techniques

### Code
- [ ] `npm run build` réussit sans erreur
- [ ] `npm run lint` passe sans warning
- [ ] `npm run type-check` passe (TypeScript OK)
- [ ] Zéro console.error/warn dans le build

### Dossier `out/`
- [ ] Dossier `out/` existe
- [ ] Contient `index.html`
- [ ] Contient dossier `_next/`
- [ ] Contient environ 100+ fichiers

### Configuration
- [ ] `next.config.ts` a `output: 'export'`
- [ ] `next.config.ts` a `basePath: '/shiori-sama-public'`
- [ ] `next.config.ts` a `assetPrefix: '/shiori-sama-public'`
- [ ] `next.config.ts` a `images: { unoptimized: true }`

## 🌐 GitHub

- [ ] Repo GitHub créé et accessible
- [ ] Dossier local est un repo git (`git status` fonctionne)
- [ ] Remote GitHub est configurée (`git remote -v`)
- [ ] Branche `main` existe
- [ ] Aucun commit non-pushé

## 🚀 Avant de Lancer le Déploiement

### Tester Localement
```bash
npm run build
npm start
# Ouvrir http://localhost:3000/shiori-sama-public
```

- [ ] Site charge sans erreur
- [ ] Carousels d'anime affichent les données
- [ ] Menu burger mobile fonctionne
- [ ] Pas d'erreurs dans F12 → Console

### Préparation du Déploiement
```bash
# Créer le dossier docs/
Copy-Item -Path "out\*" -Destination "docs" -Recurse -Force

# Ou sur Mac/Linux:
cp -r out/* docs/
```

- [ ] Dossier `docs/` créé
- [ ] Contient `index.html`
- [ ] Contient `_next/` folder

## 📋 GitHub Pages Settings

Va sur: https://github.com/Ouara01/Shiori-Sama/settings/pages

- [ ] **Source**: "Deploy from a branch" (sélectionné)
- [ ] **Branch**: `main` (sélectionné)
- [ ] **Folder**: `/docs` (sélectionné) ⚠️ **IMPORTANT!**
- [ ] Clique **Save**

## 🔄 Commit & Push

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

- [ ] Pas d'erreur lors du commit
- [ ] Pas d'erreur lors du push
- [ ] GitHub Actions complètent sans erreur (si configurées)

## ⏳ Après le Déploiement

- [ ] Attendre 2-5 minutes
- [ ] Forcer le refresh navigateur: `Ctrl+Shift+R`
- [ ] Ouvrir https://ouara01.github.io/shiori-sama-public/
- [ ] Vérifier que le site charge ✅

## 🎯 Vérifier le Site Déployé

### Page d'Accueil
- [ ] Titre "Shiori-Sama" visible
- [ ] Carousels visibles
- [ ] Images d'anime chargent

### Fonctionnalités
- [ ] Boutons et liens cliquables
- [ ] Responsive design (zoom 75% pour voir mobile)
- [ ] Menu burger mobile cliquable
- [ ] Pas de 404 ou d'erreurs

### Console (F12)
- [ ] Pas d'erreur rouge
- [ ] Pas d'erreur CORS
- [ ] Network tab: tous les fichiers en 200 OK

## 🆘 Si Quelque Chose Échoue

### Build échoue
```bash
# Nettoyer et réessayer
rm -r node_modules package-lock.json
npm install
npm run build
```

### Push échoue
```bash
# Vérifier les credentials GitHub
git remote -v
# Doit montrer le repo GitHub
```

### Site ne charge pas
1. Attendre 10 minutes (propagation DNS)
2. Forcer refresh: `Ctrl+Shift+R`
3. Vérifier GitHub Pages Settings (Source: main, Folder: /docs)
4. Vérifier que `/docs` contient `index.html`

### Site charge mais pas de données
1. Ouvrir F12 → Console
2. Chercher erreurs rouges
3. Vérifier qu'on a internet
4. Attendre un peu (APIs peut être lentes)

## 📚 Documentation

- [DEPLOY_QUICK.md](DEPLOY_QUICK.md) - Déployer rapidement
- [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) - Guide complet
- [DEPLOYMENT.md](DEPLOYMENT.md) - Options avancées

---

**Une fois tout vérifié, lancez le déploiement! 🚀**
