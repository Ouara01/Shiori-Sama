# Script de déploiement Shiori-Sama sur GitHub Pages
# Usage: .\deploy.ps1

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   Shiori-Sama GitHub Pages Deployer" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Vérifier npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm trouvé: v$npmVersion`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur: npm n'est pas installé ou pas dans PATH" -ForegroundColor Red
    Write-Host "Installez Node.js depuis https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Vérifier git
try {
    $gitVersion = git --version
    Write-Host "✅ git trouvé: $gitVersion`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur: git n'est pas installé ou pas dans PATH" -ForegroundColor Red
    exit 1
}

# 1. Installer les dépendances
Write-Host "[1/5] Installation des dépendances..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dépendances installées`n" -ForegroundColor Green

# 2. Builder le projet
Write-Host "[2/5] Build du projet..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build réussi`n" -ForegroundColor Green

# 3. Copier vers docs/
Write-Host "[3/5] Copie vers docs/..." -ForegroundColor Yellow
if (Test-Path "docs") {
    Remove-Item "docs" -Recurse -Force
}
New-Item -ItemType Directory -Path "docs" | Out-Null
Copy-Item -Path "out\*" -Destination "docs" -Recurse -Force
Write-Host "✅ Fichiers copiés`n" -ForegroundColor Green

# Vérifier que docs/ a du contenu
$filesCount = (Get-ChildItem "docs" -Recurse).Count
Write-Host "   → $filesCount fichiers dans docs/" -ForegroundColor Cyan

# 4. Git commit et push
Write-Host "[4/5] Commit et push..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur git add" -ForegroundColor Red
    exit 1
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Deploy Shiori to GitHub Pages - $timestamp"

git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du push" -ForegroundColor Red
    Write-Host "Vérifiez que vous avez accès à GitHub" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Push réussi`n" -ForegroundColor Green

# 5. Afficher les instructions finales
Write-Host "[5/5] Affichage des instructions finales..." -ForegroundColor Yellow
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "   ✅ DÉPLOIEMENT RÉUSSI!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Votre site sera bientôt disponible à:" -ForegroundColor Cyan
Write-Host "https://ouara01.github.io/shiori-sama-public/" -ForegroundColor White

Write-Host "`n⏳ Attendez 2-5 minutes pour la propagation" -ForegroundColor Yellow
Write-Host "🔄 Si la page ne charge pas, rafraîchissez (Ctrl+R)" -ForegroundColor Yellow
Write-Host "🆘 Pour forcer le cache-bust: Ctrl+Shift+R" -ForegroundColor Yellow

Write-Host "`nCommandes utiles:" -ForegroundColor Cyan
Write-Host "  npm run dev      → Démarrer le développement" -ForegroundColor White
Write-Host "  npm run build    → Builder le projet" -ForegroundColor White
Write-Host "  npm start        → Tester le build localement" -ForegroundColor White

Write-Host "`n" -ForegroundColor Green
