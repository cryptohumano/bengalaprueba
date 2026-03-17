const { getPool } = require('./db');

let cachedClosed = null;

async function isRegistrationClosed() {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      "SELECT `value` FROM settings WHERE `key` = 'registration_closed' LIMIT 1"
    );
    if (rows.length === 0) return false;
    return rows[0].value === '1' || rows[0].value === 'true';
  } catch {
    return false;
  }
}

async function setRegistrationClosed(closed) {
  const pool = getPool();
  await pool.execute(
    "INSERT INTO settings (`key`, `value`) VALUES ('registration_closed', ?) ON DUPLICATE KEY UPDATE `value` = ?",
    [closed ? '1' : '0', closed ? '1' : '0']
  );
  cachedClosed = closed;
}

module.exports = { isRegistrationClosed, setRegistrationClosed };
