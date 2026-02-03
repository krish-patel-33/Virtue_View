#!/bin/bash

# Function to kill child processes on exit
cleanup() {
    echo "Stopping all services..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

echo "Starting VirtueView Project..."

# Start API
echo "Starting API on port 8800..."
cd api && npm start &
API_PID=$!

# Start Socket
echo "Starting Socket Server on port 4000..."
cd socket && npm start &
SOCKET_PID=$!

# Start Client
echo "Starting Client on localhost:5173..."
cd client && npm run dev &
CLIENT_PID=$!

echo "All services started. Press Ctrl+C to stop."

# Wait for all background processes
wait
