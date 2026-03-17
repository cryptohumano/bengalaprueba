#!/bin/bash
# Levanta todo el stack con Docker Compose
set -e
cd "$(dirname "$0")/.."

echo "🐳 Iniciando Innovation Immersion Fest..."
docker compose up -d --build

echo ""
echo "✅ Listo!"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost/api"
echo "   Admin: http://localhost/admin"
echo ""
echo "Para ver logs: docker compose logs -f"
