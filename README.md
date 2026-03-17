# Innovation Immersion Fest - Prueba Técnica

Landing page interactiva para el evento **"INNOVATION IMMERSION FEST"** - Donde la tecnología se siente.

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

- ✅ Hero con animación glitch y gradientes
- ✅ Sección de información del evento con cards interactivas
- ✅ Galería multimedia con imágenes
- ✅ Formulario de registro con validación
- ✅ Countdown de 10 minutos (el formulario desaparece al expirar)
- ✅ Formulario waitlist cuando expira (guarda correos para próximo evento)
- ✅ Panel admin protegido en `/admin` para ver registros y waitlist
- ✅ Reset countdown: visita `/?reset=1` para reiniciar (testing)
- ✅ Animaciones con Framer Motion (scroll, hover)
- ✅ Backend con validaciones (express-validator)
- ✅ Persistencia en MySQL

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

## Lógica del countdown

- **No es por IP:** El countdown es por navegador (localStorage). Cada usuario tiene su propio timer.
- **Primera visita:** Se guarda `fest_countdown_end` = ahora + 10 min. El formulario desaparece cuando llega a 0.
- **Reset:** `/?reset=1` borra el timer para testing.
- **Cierre manual:** En `/admin` puedes "Cerrar registro" para bloquear nuevos registros sin esperar al countdown.
