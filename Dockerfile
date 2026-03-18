# Railway: build frontend + backend en un solo servicio
# Frontend usa /api relativo → mismo origen, sin CORS

# 1. Build frontend
FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# 2. Backend con frontend incluido
FROM node:20-alpine
WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/ ./

# Copiar frontend build a backend/public
COPY --from=frontend /app/frontend/dist ./public

EXPOSE 3001
CMD ["node", "src/index.js"]
