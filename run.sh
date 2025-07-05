#!/bin/bash

echo "🚀 [1/3] Cleaning up old containers..."
docker compose down --volumes --remove-orphans --rmi all

echo "🔨 [2/3] Building fresh Docker images..."
docker compose build --no-cache

echo "🟢 [3/3] Starting up services in background..."
docker compose up -d

echo "✅ All services are running. Use 'docker ps' to verify."
