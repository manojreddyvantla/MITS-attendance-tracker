@echo off
title MITS Backend Server (Port 5000)
cd /d "%~dp0"
echo Starting Backend Server on http://localhost:5000 ...
node server/server.js
pause
