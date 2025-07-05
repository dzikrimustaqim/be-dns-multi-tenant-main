#!/bin/bash

echo "🧼 Starting full Docker environment cleanup..."

# 1. Stop all running containers
echo "🛑 Stopping all running containers..."
docker stop $(docker ps -aq) 2>/dev/null

# 2. Remove all containers
echo "🧹 Removing all containers..."
docker rm -f $(docker ps -aq) 2>/dev/null

# 3. Remove all images
echo "🗑️ Removing all Docker images..."
docker rmi -f $(docker images -aq) 2>/dev/null

# 4. Remove all volumes
echo "📦 Removing all Docker volumes..."
docker volume rm -f $(docker volume ls -q) 2>/dev/null

# 5. Remove custom networks
echo "🌐 Removing all custom Docker networks..."
docker network rm $(docker network ls | grep -v "bridge\|host\|none" | awk '{print $1}') 2>/dev/null

# 6. Clean up build cache
echo "🧱 Pruning Docker build cache..."
docker builder prune -a --force

# 7. Remove unused system resources
echo "🧨 Pruning unused Docker resources and volumes..."
docker system prune -a --volumes --force

echo "✅ Cleanup complete: Docker environment has been fully reset."
