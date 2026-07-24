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

set /p commit_msg="Enter commit message (Press Enter for Auto-Timestamp): "
if "%commit_msg%"=="" set commit_msg=Auto update %date% %time%

echo.
echo [2/3] Creating Git Commit: "%commit_msg%"...
git commit -m "%commit_msg%"

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
    echo   ERROR: Git Push failed. Please check internet/login.
    echo ========================================================
)

echo.
pause
