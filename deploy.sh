#!/bin/bash

# Script de déploiement Shiori-Sama sur GitHub Pages
# Usage: ./deploy.sh

echo ""
echo "========================================"
echo "   Shiori-Sama GitHub Pages Deployer"
echo "========================================"
echo ""

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ Erreur: npm n'est pas installé"
    echo "Installez Node.js depuis https://nodejs.org/"
    exit 1
fi

echo "✅ npm trouvé: $(npm --version)"
echo ""

# Vérifier git
if ! command -v git &> /dev/null; then
    echo "❌ Erreur: git n'est pas installé"
    exit 1
fi

echo "✅ git trouvé: $(git --version)"
echo ""

# 1. Installer les dépendances
echo "[1/5] Installation des dépendances..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation"
    exit 1
fi
echo "✅ Dépendances installées"
echo ""

# 2. Builder le projet
echo "[2/5] Build du projet..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi
echo "✅ Build réussi"
echo ""

# 3. Copier vers docs/
echo "[3/5] Copie vers docs/..."
rm -rf docs
mkdir docs
cp -r out/* docs/
echo "✅ Fichiers copiés"
echo "   → $(find docs -type f | wc -l) fichiers dans docs/"
echo ""

# 4. Git commit et push
echo "[4/5] Commit et push..."
git add .
if [ $? -ne 0 ]; then
    echo "❌ Erreur git add"
    exit 1
fi

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
git commit -m "Deploy Shiori to GitHub Pages - $TIMESTAMP"

git push origin main
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du push"
    echo "Vérifiez que vous avez accès à GitHub"
    exit 1
fi
echo "✅ Push réussi"
echo ""

# 5. Afficher les instructions finales
echo "[5/5] Affichage des instructions finales..."
echo ""
echo "========================================"
echo "   ✅ DÉPLOIEMENT RÉUSSI!"
echo "========================================"
echo ""
echo "Votre site sera bientôt disponible à:"
echo "https://ouara01.github.io/shiori-sama-public/"
echo ""
echo "⏳ Attendez 2-5 minutes pour la propagation DNS"
echo "🔄 Si la page ne charge pas, rafraîchissez (Cmd+R)"
echo "🆘 Pour forcer le cache-bust: Cmd+Shift+R"
echo ""
echo "Commandes utiles:"
echo "  npm run dev      → Démarrer le développement"
echo "  npm run build    → Builder le projet"
echo "  npm start        → Tester le build localement"
echo ""
