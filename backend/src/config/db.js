const mysql = require('mysql2/promise');

let pool = null;

const getPool = () => {
  if (!pool) {
    // Soporta DB_* (local/docker) y MYSQL* (Railway)
    const host = process.env.DB_HOST || process.env.MYSQLHOST || 'localhost';
    pool = mysql.createPool({
      host: host === 'localhost' ? '127.0.0.1' : host,
      port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306', 10),
      user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
      password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
      database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'innovation_fest',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
};

const initDb = async () => {
  const maxAttempts = 15;
  const delayMs = 2000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const connection = getPool();
      await connection.query('SELECT 1');
      console.log('✅ MySQL connected');
      return connection;
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      console.log(`⏳ MySQL no listo (intento ${attempt}/${maxAttempts}), reintentando en ${delayMs / 1000}s...`);
      await new Promise((r) => setTimeout(r, delayMs));
      pool = null; // reset pool para nuevo intento
    }
  }
};

module.exports = { getPool, initDb };
