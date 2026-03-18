# Despliegue en Railway

Guía para desplegar Innovation Immersion Fest en Railway con un solo servicio (frontend + backend) y MySQL.

## Requisitos

- Cuenta en [Railway](https://railway.app)
- Repo en GitHub conectado a Railway

---

## Paso 1: Crear proyecto en Railway

1. Entra a [railway.app](https://railway.app) y crea un proyecto nuevo
2. **Deploy from GitHub repo** → selecciona tu repositorio
3. Railway detectará el `Dockerfile` en la raíz y usará ese build

---

## Paso 2: Añadir MySQL

1. En el proyecto, clic en **+ New** (o `Ctrl+K` / `Cmd+K`)
2. Elige **Database** → **MySQL**
3. Se creará un servicio MySQL con variables: `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`

---

## Paso 3: Vincular MySQL al servicio de la app

1. Selecciona tu servicio de la app (el que se creó desde GitHub)
2. **Variables** → **+ New Variable** → **Add Reference**
3. Añade referencias a las variables del servicio MySQL:
   - `MYSQLHOST` → referencia a MySQL service
   - `MYSQLPORT` → referencia
   - `MYSQLUSER` → referencia
   - `MYSQLPASSWORD` → referencia
   - `MYSQLDATABASE` → referencia

   O bien, en el servicio MySQL → **Connect** → **Add to [tu servicio]** para inyectar todas las variables.

4. Añade también:
   - `ADMIN_PASSWORD` = `fest2026` (o la que quieras para `/admin`)

---

## Paso 4: Ejecutar el schema de la base de datos

Railway crea la base de datos vacía. Hay que crear las tablas una vez:

1. En el servicio MySQL → **Connect** → **MySQL URL** o usa **TCP Proxy**
2. Conéctate con MySQL Workbench, DBeaver o `mysql` CLI usando los datos de conexión
3. Ejecuta el contenido de `backend/schema.sql`:

```sql
CREATE DATABASE IF NOT EXISTS innovation_fest;
USE innovation_fest;

CREATE TABLE IF NOT EXISTS registros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  mensaje VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_created (created_at)
);

CREATE TABLE IF NOT EXISTS waitlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

CREATE TABLE IF NOT EXISTS settings (
  setting_key VARCHAR(50) PRIMARY KEY,
  setting_value VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('registration_closed', '0');
```

**Alternativa:** Railway puede tener un "Query" o "Data" tab en el servicio MySQL para ejecutar SQL desde el dashboard.

---

## Paso 5: Dominio público

1. Selecciona tu servicio de la app
2. **Settings** → **Networking** → **Generate Domain**
3. Railway generará una URL como `tu-app.up.railway.app`

---

## Paso 6: Deploy

1. Haz push a la rama conectada (por defecto `main`)
2. Railway desplegará automáticamente
3. El build usa el `Dockerfile` de la raíz: construye frontend, lo copia a `backend/public` y ejecuta el backend

---

## Estructura del despliegue

```
Un solo servicio:
├── Frontend (React/Vite) → build → backend/public
├── Backend (Express) → sirve /api y archivos estáticos
└── MySQL (plugin) → variables MYSQL*
```

- **`/`** → Frontend (SPA)
- **`/api/*`** → Backend API
- **`/admin`** → Panel admin (protegido con `ADMIN_PASSWORD`)

---

## Variables de entorno

| Variable | Origen | Descripción |
|----------|--------|-------------|
| `MYSQLHOST` | MySQL plugin | Host de la base de datos |
| `MYSQLPORT` | MySQL plugin | Puerto |
| `MYSQLUSER` | MySQL plugin | Usuario |
| `MYSQLPASSWORD` | MySQL plugin | Contraseña |
| `MYSQLDATABASE` | MySQL plugin | Nombre de la base |
| `ADMIN_PASSWORD` | Manual | Contraseña del panel `/admin` |
| `PORT` | Railway | Lo asigna Railway (ej. 3001) |

---

## Troubleshooting

**Error de conexión a MySQL**
- Comprueba que las variables del MySQL estén referenciadas en el servicio
- Ejecuta el schema si aún no lo has hecho

**404 en rutas del frontend**
- El backend sirve el SPA; rutas como `/admin` deben devolver `index.html`
- Si falla, revisa que el build del frontend genere `dist/` correctamente

**Build falla**
- Revisa los logs de Railway
- El `Dockerfile` construye primero el frontend y luego el backend
