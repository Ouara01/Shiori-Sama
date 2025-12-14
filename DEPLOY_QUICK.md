# 🚀 Déployer en 30 Secondes

Vous voulez juste déployer? Voici comment:

## Option 1: Automatisé (⭐ Recommandé - 30 sec)

### Windows
```powershell
.\deploy.ps1
```

### Mac/Linux
```bash
./deploy.sh
```

**C'est tout!** Le script fait tout automatiquement.

---

## Option 2: Manuel (5 min)

```bash
# 1. Builder
npm run build

# 2. Copier vers docs/
# Windows:
Copy-Item -Path "out\*" -Destination "docs" -Recurse -Force

# Mac/Linux:
cp -r out/* docs/

# 3. Commit et push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main

# 4. Attendre 2-5 minutes
# 5. Ouvrir https://ouara01.github.io/shiori-sama-public/
```

---

## ✅ Vérifier Que Ça Marche

1. Attendre 2-5 minutes
2. Ouvrir https://ouara01.github.io/shiori-sama-public/
3. Voir les carousels d'anime charger ✅

### Si ça ne marche pas
- Forcer le refresh: `Ctrl+Shift+R`
- Attendre 10 min (propagation DNS)
- Lire [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) pour dépannage

---

## 🔄 Redeployer (Après modifications)

```bash
npm run build
Copy-Item -Path "out\*" -Destination "docs" -Recurse -Force
git add docs/
git commit -m "Update"
git push origin main
```

**Ou simplement utiliser le script:**
```powershell
.\deploy.ps1
```

---

## 📚 Besoin d'Aide?

- **Configuration GitHub Pages** → [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)
- **Dépannage complet** → [DEPLOYMENT.md](DEPLOYMENT.md#-dépannage)
- **Guide complet** → [COMPLETION_REPORT.md](COMPLETION_REPORT.md)

---

**C'est tout! Vous êtes prêt! 🎉**
