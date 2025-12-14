@echo off
REM Script de déploiement Shiori-Sama sur GitHub Pages

echo.
echo ========================================
echo   Shiori-Sama GitHub Pages Deployer
echo ========================================
echo.

REM Vérifier que npm est installé
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur: npm n'est pas installé ou pas dans PATH
    echo Installez Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ npm détecté
echo.

REM 1. Installer les dépendances
echo [1/5] Installation des dépendances...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)
echo ✅ Dépendances installées

REM 2. Builder le projet
echo.
echo [2/5] Build du projet...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors du build
    pause
    exit /b 1
)
echo ✅ Build réussi

REM 3. Copier vers docs/
echo.
echo [3/5] Copie vers docs/...
if exist docs rmdir /s /q docs
mkdir docs
Copy-Item -Path "out\*" -Destination "docs" -Recurse -Force
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Essai avec xcopy...
    xcopy out\* docs\ /E /I /Y
)
echo ✅ Fichiers copiés

REM 4. Git commit et push
echo.
echo [4/5] Commit et push...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur git add
    pause
    exit /b 1
)

git commit -m "Deploy Shiori to GitHub Pages - %date% %time%"
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Rien à committer ou erreur git
)

git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors du push
    echo Vérifiez que vous avez accès à GitHub
    pause
    exit /b 1
)
echo ✅ Push réussi

REM 5. Afficher les instructions finales
echo.
echo [5/5] Affichage des instructions finales...
echo.
echo ========================================
echo   ✅ DÉPLOIEMENT RÉUSSI!
echo ========================================
echo.
echo Votre site sera bientôt disponible à:
echo https://ouara01.github.io/shiori-sama-public/
echo.
echo ⏳ Attendez 2-5 minutes pour la propagation DNS
echo 🔄 Rafraîchissez la page si elle ne charge pas
echo 🆘 Utilisez Ctrl+Shift+R pour forcer le cache-bust
echo.
pause
