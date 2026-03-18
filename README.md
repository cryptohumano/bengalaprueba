# Innovation Immersion Fest

Landing page interactiva para el evento **"INNOVATION IMMERSION FEST"** - Donde la tecnología se siente.

[![GitHub](https://img.shields.io/badge/GitHub-Repositorio-181717?style=flat&logo=github)](https://github.com/cryptohumano/bengalaprueba)

## Stack

- **Frontend:** Vite + React + TypeScript
- **Backend:** Node.js + Express
- **Base de datos:** MySQL

## Requisitos

- Node.js 18+
- MySQL 8+

## Instalación

### 1. Base de datos MySQL

```bash
mysql -u root -p < backend/schema.sql
```

O ejecuta manualmente el contenido de `backend/schema.sql` en tu cliente MySQL.

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edita .env con tus credenciales de MySQL
npm install
npm run dev
```

El backend corre en `http://localhost:3001`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend corre en `http://localhost:5173` y hace proxy de `/api` al backend.

## Estructura

```
prueba-tecnica/
├── frontend/          # Vite + React + TypeScript
│   └── src/
│       ├── components/  # Hero, EventInfo, Gallery, RegisterForm, Countdown, Footer
│       ├── App.tsx
│       └── App.css
├── backend/           # Express + MySQL
│   ├── src/
│   │   ├── config/db.js
│   │   ├── routes/register.js
│   │   └── index.js
│   └── schema.sql
└── README.md
```

## Características

**Frontend**
- Hero con partículas Three.js, orbes animados y títulos interactivos (letra por letra)
- Sección EventInfo con cards que revelan imagen al hover
- Galería carrusel vertical con modal fullscreen (imagen + info + tags)
- Sección de video YouTube (autoplay, loop, muted)
- Formulario de registro con countdown (inicia al llegar a la sección)
- Formulario waitlist cuando expira
- Panel admin en `/admin` (registros, waitlist, duplicados, export CSV)
- Loading inicial, header sticky, footer con contacto y enlace a GitHub

**Backend**
- API registro y waitlist con validaciones (express-validator)
- API admin protegida con contraseña
- Export CSV de registros y waitlist para Excel
- Cierre/apertura manual de registro

## Variables de entorno (backend)

| Variable    | Descripción     | Default        |
|------------|-----------------|----------------|
| PORT       | Puerto del API  | 3001           |
| DB_HOST    | Host MySQL      | localhost      |
| DB_USER    | Usuario MySQL   | root           |
| DB_PASSWORD| Contraseña      | (vacío)        |
| DB_NAME    | Nombre de BD    | innovation_fest |
| ADMIN_PASSWORD | Contraseña panel admin | fest2026 |

**Testing:** `/?reset=1` reinicia el countdown. `/admin` (contraseña: fest2026)

## Docker

Para correr todo con Docker (frontend + backend + MySQL):

```bash
# Opción 1: Script
./scripts/docker-up.sh

# Opción 2: Directo
docker compose up -d --build
```

- **Frontend:** http://localhost
- **Admin:** http://localhost/admin (contraseña: fest2026)

Variables opcionales en `.env` en la raíz:
- `MYSQL_ROOT_PASSWORD` (default: secret)
- `MYSQL_DATABASE` (default: innovation_fest)
- `ADMIN_PASSWORD` (default: fest2026)

Para detener: `docker compose down` o `./scripts/docker-down.sh`

**Reconstruir** (después de cambios en el código):
```bash
docker compose up -d --build
# o solo el frontend si solo cambiaste el frontend:
docker compose up -d --build frontend
```

## Admin

- **URL:** `/admin` (contraseña por defecto: `fest2026`)
- Ver registros completos y waitlist
- Buscar por nombre, email o mensaje
- Exportar a CSV: botones "Exportar registros CSV" y "Exportar waitlist CSV"
- Toggle para cerrar/abrir el registro manualmente

## Lógica del countdown

- **No es por IP:** El countdown es por navegador (localStorage). Cada usuario tiene su propio timer.
- **Primera visita:** Se guarda `fest_countdown_end` = ahora + 10 min. El formulario desaparece cuando llega a 0.
- **Reset:** `/?reset=1` borra el timer para testing.
- **Cierre manual:** En `/admin` puedes "Cerrar registro" para bloquear nuevos registros sin esperar al countdown.
