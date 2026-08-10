@echo off
cd /d "%~dp0"
call npm.cmd run build >nul 2>&1
start "INTEGR Local" /min cmd /c "node scripts\local-server.mjs"
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:4173"
