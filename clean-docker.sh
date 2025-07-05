#!/bin/bash

echo "🧼 Pembersihan Docker Total Dimulai..."

# 1. Stop all running containers
echo "🛑 Menghentikan semua container..."
docker stop $(docker ps -aq) 2>/dev/null

# 2. Remove all containers
echo "🧹 Menghapus semua container..."
docker rm -f $(docker ps -aq) 2>/dev/null

# 3. Remove all images
echo "🗑️ Menghapus semua image..."
docker rmi -f $(docker images -aq) 2>/dev/null

# 4. Remove all volumes
echo "📦 Menghapus semua volume..."
docker volume rm -f $(docker volume ls -q) 2>/dev/null

# 5. Remove custom networks
echo "🌐 Menghapus semua jaringan custom..."
docker network rm $(docker network ls | grep -v "bridge\|host\|none" | awk '{print $1}') 2>/dev/null

# 6. Prune build cache
echo "🧱 Membersihkan build cache..."
docker builder prune -a --force

# 7. Prune dangling system resources
echo "🧨 Membersihkan resource sisa lainnya..."
docker system prune -a --volumes --force

echo "✅ Semua bersih! Docker kamu kini suci kembali ✨"
