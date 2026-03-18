const { getPool } = require('./db');

let cachedClosed = null;

async function isRegistrationClosed() {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      "SELECT setting_value FROM settings WHERE setting_key = 'registration_closed' LIMIT 1"
    );
    if (rows.length === 0) return false;
    return rows[0].setting_value === '1' || rows[0].setting_value === 'true';
  } catch {
    return false;
  }
}

async function setRegistrationClosed(closed) {
  const pool = getPool();
  await pool.execute(
    "INSERT INTO settings (setting_key, setting_value) VALUES ('registration_closed', ?) ON DUPLICATE KEY UPDATE setting_value = ?",
    [closed ? '1' : '0', closed ? '1' : '0']
  );
  cachedClosed = closed;
}

module.exports = { isRegistrationClosed, setRegistrationClosed };
