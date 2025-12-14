# ⚙️ Configuration GitHub Pages - Guide Rapide

## Le Problème

GitHub Pages affiche le README au lieu du site fonctionnel parce que la configuration n'est pas complètement mise en place.

## La Solution

### Étape 1 : Builder localement

```bash
cd c:\Users\flori\Desktop\Dossiers\Projets-Code\shiori-sama-public
npm run build
```

**Résultat attendu:** Un dossier `out/` apparaît avec ~100+ fichiers (HTML, CSS, JS)

### Étape 2 : Configurer GitHub Pages

1. Va sur ton repo GitHub : https://github.com/Ouara01/Shiori-Sama
2. **Settings** → **Pages** (à gauche)
3. Sélectionne:
   - **Source**: "Deploy from a branch" 
   - **Branch**: `main`
   - **Folder**: `/docs`  ← ⚠️ IMPORTANT!
4. Clique **Save**

### Étape 3 : Créer le dossier docs/

```bash
# Dans le dossier du projet
# Copier les fichiers du build
Copy-Item -Path "out\*" -Destination "docs" -Recurse -Force

# Ou sur Mac/Linux:
cp -r out/* docs/
```

### Étape 4 : Commit et push

```bash
git add .
git commit -m "Deploy Shiori to GitHub Pages"
git push origin main
```

### Étape 5 : Attendre et Vérifier

- ⏳ Attendre 2-5 minutes
- 🌐 Visite: https://ouara01.github.io/shiori-sama-public/
- ✅ Tu dois voir le site avec les carousels d'anime!

## ✅ Checklist

- [ ] `npm run build` réussit
- [ ] Dossier `out/` créé avec des fichiers
- [ ] Dossier `docs/` contient les fichiers du `out/`
- [ ] GitHub Pages Settings → Folder: `/docs`
- [ ] Push vers `main` effectué
- [ ] Attendre 5 minutes
- [ ] Site accessible et fonctionnel

## 🚨 Si ça ne marche toujours pas

### Erreur: "Cannot find module"

```bash
# Nettoyer et réinstaller
rm -r node_modules package-lock.json
npm install
npm run build
```

### Erreur: "Styles not loaded"

- Vérifier que `basePath` dans `next.config.ts` est `/shiori-sama-public`
- Vérifier que `assetPrefix` est aussi `/shiori-sama-public`
- Rebuild : `npm run build`

### Erreur: "Données anime ne chargent pas"

- Ouvrir F12 → Console
- Chercher les erreurs rouges
- Vérifier que tu as internet
- Les APIs (AniList, Jikan) sont publiques, pas de CORS config nécessaire

### GitHub Pages affiche encore le README

- Nettoyer le cache navigateur: `Ctrl+Shift+R`
- Attendre 10 minutes (propagation DNS)
- Vérifier que `/docs` folder contient `index.html`

```bash
# Vérifier le contenu
ls docs/
# Doit contenir: _next/, index.html, etc.
```

## 🔄 Redeployer après des changements

```bash
# Chaque fois que tu modifies le code:

# 1. Build
npm run build

# 2. Copier vers docs/
Copy-Item -Path "out\*" -Destination "docs" -Recurse -Force

# 3. Commit et push
git add docs/
git commit -m "Update site"
git push origin main

# 4. Attendre 2 minutes
# 5. Refresh le navigateur (Ctrl+R ou Cmd+R)
```

## 💡 Automatiser avec GitHub Actions (Optionnel)

Créer `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to docs
        run: |
          rm -rf docs
          mkdir docs
          cp -r out/* docs/
      
      - name: Commit and push
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add docs/
          git commit -m "Auto-deploy to GitHub Pages" || true
          git push origin main
```

Avec ça, chaque push redéploie automatiquement! 🚀

---

**C'est tout! Ton site devrait être en ligne maintenant!** ✨
