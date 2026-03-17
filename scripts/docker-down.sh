#!/bin/bash
# Detiene el stack Docker
set -e
cd "$(dirname "$0")/.."

echo "🛑 Deteniendo contenedores..."
docker compose down

echo "✅ Contenedores detenidos"
