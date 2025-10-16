@echo off
echo Stopping any running Node processes...
taskkill /f /im node.exe /t 2>nul
timeout /t 2 /nobreak >nul
echo Starting development server on port 3000...
cd /d "%~dp0"
npm run dev

