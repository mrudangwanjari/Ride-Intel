@echo off
echo ========================================
echo  Ride-Intel - Starting Server
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Python found!
    echo Starting server on http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo ========================================
    echo.
    start http://localhost:8000
    python -m http.server 8000
) else (
    echo [ERROR] Python not found!
    echo.
    echo Please install Python or open index.html directly in your browser.
    echo.
    pause
)
