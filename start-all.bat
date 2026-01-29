@echo off
echo Starting VirtueView Project...

start "Client" cmd /k "cd client && npm run dev"
start "API" cmd /k "cd api && npm start"
start "Socket" cmd /k "cd socket && npm start"

echo All services attempted to start in separate windows.
