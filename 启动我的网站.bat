@echo off
title Starting website...
cd /d "C:\Users\liuwm\Desktop\my-portfolio"

echo ============================================
echo   Starting website...
echo   Open http://localhost:3000 in browser
echo   Close this window to stop
echo ============================================

start "" http://localhost:3000
npx next dev
pause
