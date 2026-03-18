# Guía: Configurar MySQL en Azure para el Backend

## Paso 1: Crear el servidor MySQL Flexible Server

1. En **Azure Portal** → busca **Azure Database for MySQL Flexible Server**
2. **Create** y completa:

| Campo | Valor |
|------|--------|
| Subscription | Tu suscripción |
| Resource group | El mismo que tu App Service |
| Server name | `bengalaprueba-db` |
| Region | Mexico Central |
| MySQL version | 8.0.x |
| Workload type | Development |
| Compute + storage | Burstable B1ms |
| Authentication | MySQL authentication |
| Admin username | `bengalaadmin` |
| Password | (guárdala, la necesitarás) |

3. **Networking** → Connectivity method: **Public access**
4. Firewall: **Allow public access from any Azure service within Azure to this server**
5. **Create**

---

## Paso 2: Crear la base de datos y tablas

Cuando el servidor esté listo, tienes **3 opciones**:

### Opción A: Query editor en Azure Portal (la más fácil)

1. Ve a tu recurso **MySQL Flexible Server** en Azure
2. Menú izquierdo → **Query editor**
3. Inicia sesión con:
   - **Username:** `bengalaadmin`
   - **Password:** la que definiste
4. Pega y ejecuta este SQL (bloque por bloque si hace falta):

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

---

### Opción B: MySQL desde la terminal

1. Instala el cliente MySQL si no lo tienes:
   ```bash
   # Ubuntu/Debian
   sudo apt install mysql-client
   ```

2. Obtén el **host** en Azure: `bengalaprueba-db.mysql.database.azure.com`

3. Conecta y ejecuta el schema:
   ```bash
   mysql -h bengalaprueba-db.mysql.database.azure.com -u bengalaadmin -p < backend/schema.sql
   ```

4. Introduce la contraseña cuando la pida.

---

### Opción C: MySQL Workbench

1. Abre MySQL Workbench
2. **Database** → **Connect to Database**
3. Configura:
   - **Hostname:** `bengalaprueba-db.mysql.database.azure.com`
   - **Port:** `3306`
   - **Username:** `bengalaadmin`
   - **Password:** (tu contraseña)
4. Conecta
5. Abre `backend/schema.sql` y ejecútalo (⚡ Execute)

---

## Paso 3: Configurar App Service

1. Azure Portal → tu **App Service** (`bengalaprueba`)
2. **Settings** → **Configuration** → **Application settings**
3. **+ New application setting** y añade:

| Name | Value |
|------|--------|
| `DB_HOST` | `bengalaprueba-db.mysql.database.azure.com` |
| `DB_PORT` | `3306` |
| `DB_USER` | `bengalaadmin` |
| `DB_PASSWORD` | *(tu contraseña de MySQL)* |
| `DB_NAME` | `innovation_fest` |
| `ADMIN_PASSWORD` | `fest2026` |

4. **Save** → **Continue** (para reiniciar la app)

---

## Paso 4: Verificar

1. Espera 1–2 minutos tras el reinicio
2. Abre: `https://bengalaprueba.azurewebsites.net/api/health`
3. Prueba el registro en el frontend

---

## Troubleshooting

**Error "Access denied" o "Connection refused"**
- Revisa que el firewall permita conexiones desde Azure
- Comprueba que `DB_HOST`, `DB_USER`, `DB_PASSWORD` y `DB_NAME` estén bien en App Service

**El servidor no arranca**
- Revisa los logs en App Service → **Log stream**
- Confirma que las variables de entorno estén guardadas y la app reiniciada
