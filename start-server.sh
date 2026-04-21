#!/bin/bash

echo "========================================"
echo " Ride-Intel - Starting Server"
echo "========================================"
echo ""

# Check if Python is installed
if command -v python3 &> /dev/null; then
    echo "[OK] Python found!"
    echo "Starting server on http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "========================================"
    echo ""
    
    # Open browser (works on macOS and Linux)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open http://localhost:8000
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open http://localhost:8000 2>/dev/null
    fi
    
    python3 -m http.server 8000
else
    echo "[ERROR] Python not found!"
    echo ""
    echo "Please install Python or open index.html directly in your browser."
    echo ""
    read -p "Press Enter to exit..."
fi
