@echo off
cd /d "%~dp0"

echo ============================================
echo   Scanning: public/works/
echo ============================================
node scan-photos.js

echo.
echo ============================================
echo   Scanning: public/ai-works/
echo ============================================
node scan-ai.js

echo.
echo ============================================
echo   Done! Refresh your browser to see updates.
echo ============================================
echo.
pause
