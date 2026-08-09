@echo off
title MITS Attendance Tracker Runner
cd /d "%~dp0"

echo ===================================================
echo   Starting MITS Attendance Tracker
echo ===================================================
echo.

echo [1/2] Starting Backend Server on http://localhost:5000 ...
start "MITS-Backend (Port 5000)" cmd /k "cd /d "%~dp0" && node server/server.js"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend Client on http://localhost:5173 ...
start "MITS-Frontend (Port 5173)" cmd /k "cd /d "%~dp0" && npx vite client --port 5173 --host"

echo.
echo ===================================================
echo   Servers are launching!
echo.
echo   Frontend (Dev with Hot Reload): http://localhost:5173
echo   Full App (Direct Server):       http://localhost:5000
echo ===================================================
echo.
timeout /t 3 /nobreak >nul
start http://localhost:5173
