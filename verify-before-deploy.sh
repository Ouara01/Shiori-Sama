#!/bin/bash
# Script de vérification pre-déploiement
# Usage: ./verify-before-deploy.sh

echo ""
echo "🔍 Vérification Pré-Déploiement Shiori-Sama"
echo "=========================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Compteurs
PASS=0
FAIL=0

# Fonction pour vérifier
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        ((PASS++))
    else
        echo -e "${RED}❌ $1${NC}"
        ((FAIL++))
    fi
}

# Vérifications
echo -e "${BLUE}📦 Vérifications Techniques${NC}"

# 1. npm existe
npm --version > /dev/null 2>&1
check "npm installé"

# 2. git existe
git --version > /dev/null 2>&1
check "git installé"

# 3. package.json existe
[ -f "package.json" ]
check "package.json trouvé"

# 4. next.config.ts existe
[ -f "next.config.ts" ]
check "next.config.ts trouvé"

# 5. tsconfig.json existe
[ -f "tsconfig.json" ]
check "tsconfig.json trouvé"

# 6. src/ existe
[ -d "src" ]
check "Dossier src/ trouvé"

echo ""
echo -e "${BLUE}🔨 Vérifications Build${NC}"

# 7. Build réussit
echo "Building... (ceci peut prendre 30-60 secondes)"
npm run build > /dev/null 2>&1
check "Build réussi (npm run build)"

# 8. out/ existe et a du contenu
[ -d "out" ] && [ "$(ls -A out)" ]
check "Dossier out/ créé avec contenu"

# 9. out/index.html existe
[ -f "out/index.html" ]
check "out/index.html existant"

# 10. out/_next/ existe
[ -d "out/_next" ]
check "Dossier out/_next/ existant"

echo ""
echo -e "${BLUE}📋 Vérifications Configuration${NC}"

# 11. Vérifier next.config.ts pour output: 'export'
grep -q "output.*export" next.config.ts
check "output: 'export' dans next.config.ts"

# 12. Vérifier next.config.ts pour basePath
grep -q "basePath.*shiori-sama-public" next.config.ts
check "basePath: '/shiori-sama-public' dans next.config.ts"

# 13. Vérifier next.config.ts pour assetPrefix
grep -q "assetPrefix.*shiori-sama-public" next.config.ts
check "assetPrefix: '/shiori-sama-public' dans next.config.ts"

# 14. Vérifier images.unoptimized
grep -q "unoptimized.*true" next.config.ts
check "images.unoptimized: true dans next.config.ts"

echo ""
echo -e "${BLUE}🌐 Vérifications Git${NC}"

# 15. C'est un repo git
[ -d ".git" ]
check "Dossier .git/ existant (c'est un repo git)"

# 16. Remote GitHub configuré
git remote get-url origin > /dev/null 2>&1
check "Remote GitHub configuré"

# 17. Branche main existe
git rev-parse --verify main > /dev/null 2>&1
check "Branche main existe"

# 18. Pas de fichiers non-tracked critiques
! git status --short | grep -E "^\?\?" | grep -E "\.(ts|tsx|json|css)$" > /dev/null 2>&1
check "Pas de fichiers importants non-tracked"

echo ""
echo "=========================================="
echo -e "${BLUE}📊 RÉSUMÉ${NC}"
echo "=========================================="
echo -e "${GREEN}✅ Passé: $PASS${NC}"
echo -e "${RED}❌ Échoué: $FAIL${NC}"

if [ $FAIL -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 TOUT EST BON! Vous pouvez déployer!${NC}"
    echo ""
    echo -e "${YELLOW}Prochaines étapes:${NC}"
    echo "1. Copier out/ vers docs/"
    echo "   cp -r out/* docs/"
    echo "2. Commit et push"
    echo "   git add . && git commit -m 'Deploy' && git push"
    echo "3. Attendre 2-5 minutes"
    echo "4. Vérifier: https://ouara01.github.io/shiori-sama-public/"
    echo ""
else
    echo ""
    echo -e "${RED}⚠️  $FAIL vérification(s) échouée(s)${NC}"
    echo -e "${YELLOW}Veuillez corriger les problèmes avant de déployer${NC}"
    echo ""
fi
