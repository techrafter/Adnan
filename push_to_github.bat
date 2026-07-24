@echo off
title Adnan Super Store - One-Click GitHub Auto Push Tool
color 0A

echo ========================================================
echo   🛒 ADNAN SUPER STORE - ONE-CLICK GITHUB PUSH TOOL
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Staging all changed files...
git add .

echo.
echo [2/3] Creating Git Commit...
git commit -m "Update Adnan Super Store production code" 2>nul

echo.
echo [3/3] Pushing code to GitHub (https://github.com/techrafter/Adnan.git)...
git push origin main

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
    echo   NOTE: Please authorize GitHub in your browser if prompted.
    echo ========================================================
)

echo.
pause
