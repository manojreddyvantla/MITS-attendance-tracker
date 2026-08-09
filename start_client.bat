@echo off
title MITS Frontend Client (Port 5173)
cd /d "%~dp0"
echo Starting Frontend Client on http://localhost:5173 ...
npx vite client --port 5173 --host
pause
