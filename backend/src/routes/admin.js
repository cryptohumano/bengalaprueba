const express = require('express');
const { getPool } = require('../config/db');

const router = express.Router();

async function getSettings(pool) {
  try {
    const [rows] = await pool.execute(
      "SELECT setting_value FROM settings WHERE setting_key = 'registration_closed' LIMIT 1"
    );
    const closed = rows.length > 0 && (rows[0].setting_value === '1' || rows[0].setting_value === 'true');
    return { registration_closed: closed };
  } catch {
    return { registration_closed: false };
  }
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'fest2026';

const authMiddleware = (req, res, next) => {
  const token = req.headers['x-admin-password'] || req.query.token;
  if (token !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
};

router.get('/registros', authMiddleware, async (req, res) => {
  try {
    const pool = getPool();
    const { search } = req.query;

    let registrosQuery =
      'SELECT id, nombre, email, mensaje, created_at FROM registros';
    let waitlistQuery = 'SELECT id, email, created_at FROM waitlist';
    const params = [];

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      registrosQuery +=
        ' WHERE nombre LIKE ? OR email LIKE ? OR mensaje LIKE ?';
      params.push(term, term, term);
    }
    registrosQuery += ' ORDER BY created_at DESC';

    if (search && search.trim()) {
      waitlistQuery += ' WHERE email LIKE ?';
    }
    waitlistQuery += ' ORDER BY created_at DESC';

    const [registros] = params.length
      ? await pool.execute(registrosQuery, params)
      : await pool.execute(registrosQuery);
    const [waitlist] =
      search && search.trim()
        ? await pool.execute(waitlistQuery, [`%${search.trim()}%`])
        : await pool.execute(waitlistQuery);

    const registrosEmails = new Set(registros.map((r) => r.email.toLowerCase()));
    const waitlistEmails = new Set(waitlist.map((w) => w.email.toLowerCase()));
    const duplicados = registros.filter((r) =>
      waitlistEmails.has(r.email.toLowerCase())
    );
    const enAmbos = [...duplicados];

    const settings = await getSettings(pool);
    res.json({
      registros,
      waitlist,
      totalRegistros: registros.length,
      totalWaitlist: waitlist.length,
      duplicados: enAmbos,
      settings,
    });
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return res.status(503).json({ error: 'Base de datos no configurada' });
    }
    console.error('Admin error:', err);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

function escapeCsvCell(val) {
  if (val == null) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

router.get('/export/registros.csv', authMiddleware, async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT id, nombre, email, mensaje, created_at FROM registros ORDER BY created_at DESC'
    );
    const headers = ['ID', 'Nombre', 'Email', 'Mensaje', 'Fecha'];
    const csvRows = [
      headers.join(','),
      ...rows.map((r) =>
        [
          r.id,
          escapeCsvCell(r.nombre),
          escapeCsvCell(r.email),
          escapeCsvCell(r.mensaje),
          escapeCsvCell(r.created_at),
        ].join(',')
      ),
    ];
    const csv = '\uFEFF' + csvRows.join('\n'); // BOM for Excel UTF-8
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="registros-${new Date().toISOString().slice(0, 10)}.csv"`
    );
    res.send(csv);
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return res.status(503).json({ error: 'Base de datos no configurada' });
    }
    console.error('Export error:', err);
    res.status(500).json({ error: 'Error al exportar' });
  }
});

router.get('/export/waitlist.csv', authMiddleware, async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT id, email, created_at FROM waitlist ORDER BY created_at DESC'
    );
    const headers = ['ID', 'Email', 'Fecha'];
    const csvRows = [
      headers.join(','),
      ...rows.map((r) =>
        [r.id, escapeCsvCell(r.email), escapeCsvCell(r.created_at)].join(',')
      ),
    ];
    const csv = '\uFEFF' + csvRows.join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="waitlist-${new Date().toISOString().slice(0, 10)}.csv"`
    );
    res.send(csv);
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return res.status(503).json({ error: 'Base de datos no configurada' });
    }
    console.error('Export error:', err);
    res.status(500).json({ error: 'Error al exportar' });
  }
});

module.exports = router;
