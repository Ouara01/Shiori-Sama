@echo off
REM Script pour installer toutes les dépendances du projet

echo === Installation des dependances Frontend ===
call npm install zustand

echo.
echo === Installation des dependances Backend ===
cd backend
call npm install
cd..

echo.
echo === Installation terminee! ===
pause
