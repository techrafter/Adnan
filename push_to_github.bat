@echo off
title Adnan Super Store - One-Click GitHub Auto Push Tool (Edge Login)
color 0A

echo ========================================================
echo   🛒 ADNAN SUPER STORE - ONE-CLICK GITHUB PUSH TOOL
echo   Repository: https://github.com/techrafter/Adnan
echo ========================================================
echo.

cd /d "%~dp0"

echo Opening GitHub repository in Microsoft Edge browser...
start msedge "https://github.com/techrafter/Adnan"

echo.
echo Clearing old cached logins...
cmdkey /delete:git:https://github.com 2>nul

echo.
echo [1/3] Staging all changed files...
git add .

echo.
echo [2/3] Creating Git Commit...
git commit -m "Update Adnan Super Store - Clean logo, correct WhatsApp number, real Firebase/Cloudinary credentials" 2>nul

echo.
echo [3/3] Pushing code to GitHub (user: techrafter)...
git push https://techrafter@github.com/techrafter/Adnan.git main

if %ERRORLEVEL% EQU 0 (
    color 2F
    echo.
    echo ========================================================
    echo   SUCCESS! Your code was pushed to GitHub successfully!
    echo ========================================================
) else (
    color 4F
    echo.
    echo ========================================================
    echo   If prompted in browser/window, please sign in with:
    echo   GitHub Account: techrafter
    echo ========================================================
)

echo.
pause
