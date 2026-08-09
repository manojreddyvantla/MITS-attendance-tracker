Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Starting MITS Attendance Tracker" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting Backend Server on port 5000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run server"

Start-Sleep -Seconds 2

Write-Host "Starting Frontend Client on port 5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run client"

Write-Host ""
Write-Host "Servers started successfully!" -ForegroundColor Yellow
Write-Host "👉 Frontend UI: http://localhost:5173" -ForegroundColor White
Write-Host "👉 Backend API: http://localhost:5000" -ForegroundColor White
