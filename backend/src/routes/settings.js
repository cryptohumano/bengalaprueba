const express = require('express');
const { getPool } = require('../config/db');
const { setRegistrationClosed } = require('../config/settings');

const router = express.Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'fest2026';

const authMiddleware = (req, res, next) => {
  const token = req.headers['x-admin-password'] || req.query.token;
  if (token !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
};

router.get('/registration-status', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      "SELECT `value` FROM settings WHERE `key` = 'registration_closed' LIMIT 1"
    );
    const closed = rows.length > 0 && (rows[0].value === '1' || rows[0].value === 'true');
    res.json({ open: !closed });
  } catch {
    res.json({ open: true });
  }
});

router.get('/admin/settings', authMiddleware, async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM settings');
    const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
});

router.patch('/admin/settings', authMiddleware, async (req, res) => {
  try {
    const { registration_closed } = req.body;
    if (typeof registration_closed === 'boolean') {
      await setRegistrationClosed(registration_closed);
    }
    const pool = getPool();
    const [rows] = await pool.execute(
      "SELECT `value` FROM settings WHERE `key` = 'registration_closed' LIMIT 1"
    );
    const closed = rows.length > 0 && (rows[0].value === '1' || rows[0].value === 'true');
    res.json({ registration_closed: closed });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar configuración' });
  }
});

module.exports = router;
