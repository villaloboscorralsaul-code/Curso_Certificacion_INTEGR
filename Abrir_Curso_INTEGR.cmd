@echo off
cd /d "%~dp0"
start "INTEGR Local" /min cmd /c "node node_modules\vinext\dist\cli.js start --host 127.0.0.1 --port 4173"
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:4173"
