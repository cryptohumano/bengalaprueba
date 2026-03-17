const mysql = require('mysql2/promise');

let pool = null;

const getPool = () => {
  if (!pool) {
    const host = process.env.DB_HOST || 'localhost';
    pool = mysql.createPool({
      host: host === 'localhost' ? '127.0.0.1' : host,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'innovation_fest',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
};

const initDb = async () => {
  try {
    const connection = getPool();
    await connection.query('SELECT 1');
    console.log('✅ MySQL connected');
    return connection;
  } catch (err) {
    throw err;
  }
};

module.exports = { getPool, initDb };
