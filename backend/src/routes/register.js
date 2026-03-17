const express = require('express');
const { body, validationResult } = require('express-validator');
const { getPool } = require('../config/db');
const { isRegistrationClosed } = require('../config/settings');

const router = express.Router();

const validations = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El correo es requerido')
    .isEmail()
    .withMessage('Debe ser un correo válido')
    .normalizeEmail(),
  body('mensaje')
    .trim()
    .notEmpty()
    .withMessage('El mensaje es requerido')
    .isLength({ min: 10, max: 500 })
    .withMessage('El mensaje debe tener entre 10 y 500 caracteres'),
];

router.post('/register', validations, async (req, res) => {
  try {
    if (await isRegistrationClosed()) {
      return res.status(503).json({
        success: false,
        message: 'Las 500 emociones se agotaron. Déjanos tu correo para el próximo evento.',
      });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { nombre, email, mensaje } = req.body;
    const pool = getPool();

    await pool.execute(
      'INSERT INTO registros (nombre, email, mensaje, created_at) VALUES (?, ?, ?, NOW())',
      [nombre, email, mensaje]
    );

    res.status(201).json({
      success: true,
      message: 'Registro exitoso. Revisa tu correo en los próximos minutos.',
    });
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return res.status(503).json({
        success: false,
        message: 'Base de datos no configurada. Ejecuta schema.sql',
      });
    }
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Este correo ya está registrado.',
      });
    }
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'No se puede conectar a la base de datos. Verifica que MySQL esté corriendo en el puerto correcto.',
      });
    }
    const errMsg = err.sqlMessage || err.message || String(err.code) || 'Error desconocido';
    console.error('Register error:', errMsg, err);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production'
        ? 'Error al procesar el registro. Intenta de nuevo.'
        : `Error: ${errMsg}`,
    });
  }
});

module.exports = router;
