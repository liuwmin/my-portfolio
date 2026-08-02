@echo off
cd /d "%~dp0"
echo Scanning public/works/ ...
node scan-photos.js
pause
