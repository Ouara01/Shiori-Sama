/**
 * 🚀 GUIDE DE DÉPLOIEMENT COMPLET
 * 
 * Ce guide explique comment déployer votre site sur GitHub Pages
 * et votre API sur Render (gratuit)
 */

# 📦 DÉPLOIEMENT SHIORI-SAMA

## ⚠️ IMPORTANT: Comprendre GitHub Pages vs Express

**GitHub Pages = Hébergement STATIQUE (HTML/CSS/JS)**
- ✅ Peut héberger le frontend (Next.js généré en HTML static)
- ❌ **NE peut PAS héberger Express.js** (besoin d'un serveur Node)

**Votre solution:**
- Frontend (Next.js) → GitHub Pages
- Backend (Express) → Render.com (gratuit)

---

## 🎯 ÉTAPE 1: Préparation du Frontend

### 1.1 Configurer Next.js pour export statique

**next.config.ts:**
```typescript
const nextConfig = {
  output: 'export', // Important: génère du HTML statique
  basePath: '/shiori-sama', // Pour GitHub Pages
  // ... autres configs
};
```

### 1.2 Ajouter script de build

Dans **package.json:**
```json
{
  "scripts": {
    "build": "next build && next export"
  }
}
```

### 1.3 Builder localement

```bash
npm run build
# Crée un dossier `out/` avec les fichiers statiques
```

---

## 🌐 ÉTAPE 2: Déployer sur GitHub Pages

### 2.1 Configurer le repository GitHub

1. **Aller dans Settings → Pages**
2. **Sélectionner:**
   - Source: "Deploy from a branch"
   - Branch: `main`
   - Folder: `/ (root)`

### 2.2 Créer un dossier `docs/` à la racine

```bash
# Créer le dossier
mkdir docs

# Copier les fichiers du build
cp -r out/* docs/

# Commit et push
git add docs/
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### 2.3 Attendre 5-10 minutes

GitHub Pages va construire le site automatiquement.
Vérifier: `https://votreusername.github.io/shiori-sama`

---

## 🔌 ÉTAPE 3: Déployer le Backend sur Render

### 3.1 Créer un compte Render

1. Aller sur https://render.com
2. S'inscrire avec GitHub
3. Autoriser l'accès à vos repos

### 3.2 Créer un Web Service

1. **Dashboard → New → Web Service**
2. **Connecter votre repository GitHub**
3. **Configuration:**
   - Name: `shiori-api`
   - Environment: `Node`
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm run start`

### 3.3 Ajouter les variables d'environnement

Dans Render Dashboard:
```
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://votreusername.github.io,https://shiori-api.render.com
```

### 3.4 Deploy!

Cliquer sur **Deploy** et attendre (~2-3 minutes)

Votre API sera à: `https://shiori-api.render.com` (adapter le nom)

---

## 🔗 ÉTAPE 4: Connecter Frontend → Backend

### 4.1 Mettre à jour `.env.local`

```bash
NEXT_PUBLIC_API_URL=https://shiori-api.render.com/api
```

### 4.2 Rebuild et re-deploy

```bash
npm run build
cp -r out/* docs/
git add docs/
git commit -m "Update API URL to production"
git push origin main
```

---

## ✅ VÉRIFICATION

### Checklist de déploiement:

- [ ] Frontend accessible via GitHub Pages
- [ ] Backend accessible via Render
- [ ] CORS configuré correctement
- [ ] Variables d'environnement définies
- [ ] API répond à /health
- [ ] Frontend peut appeler l'API

### Tests:

```bash
# Vérifier l'API
curl https://shiori-api.render.com/health

# Vérifier le frontend
# Ouvrir https://votreusername.github.io/shiori-sama dans le navigateur
```

---

## 🆓 COÛT

- **GitHub Pages**: Gratuit (illimité)
- **Render Free Plan**: Gratuit
  - ⚠️ Server s'endort après 15min d'inactivité
  - ✅ Se réveille au 1er appel (un peu plus lent)
  - ✅ Parfait pour démo/portfolio

---

## 🎯 ÉTAPES FUTURES (Optionnel)

### Passer de Render gratuit à un service payant:
- **Vercel** ($20/mois) - Mieux pour Node.js
- **Railway** ($5/mois) - Bon rapport qualité/prix
- **Supabase** - Gratuit si vous utilisez PostgreSQL

### Ajouter un domaine personnalisé:
```
Render → Custom Domain
GitHub Pages → Settings → Custom Domain
```

---

## 📝 VARIABLES D'ENVIRONNEMENT COMPLÈTES

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://shiori-api.render.com/api
NEXT_PUBLIC_GITHUB_REPO=https://github.com/votreusername/shiori-sama
```

### Backend (.env)
```
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://votreusername.github.io,https://shiori-api.render.com
ANILIST_API_URL=https://graphql.anilist.co
JIKAN_API_URL=https://api.jikan.moe/v4
```

---

## 🚨 DÉPANNAGE

### Erreur CORS au frontend
- Vérifier `ALLOWED_ORIGINS` dans le backend
- Ajouter `https://votreusername.github.io` à la liste

### API répond 404
- Vérifier que l'API est en cours d'exécution sur Render
- Vérifier que l'URL dans `.env.local` est correcte

### GitHub Pages ne met pas à jour
- Forcer un refresh: `Ctrl+Shift+R`
- Vérifier que le dossier `docs/` est à jour
- Attendre 5 minutes pour la propagation DNS

### Le build échoue
- Vérifier les logs Render
- Vérifier les logs GitHub Actions
- Tester `npm run build` localement

---

## 🎌 VOUS ÊTES EN PRODUCTION!

Votre site est maintenant:
- ✅ Accessible publiquement sur GitHub Pages
- ✅ API accessible sur Render
- ✅ Gratuit et scalable
- ✅ Prêt à être montré aux recruteurs!

Félicitations! 🎉
