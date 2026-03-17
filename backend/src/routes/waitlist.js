const express = require('express');
const { body, validationResult } = require('express-validator');
const { getPool } = require('../config/db');

const router = express.Router();

router.post(
  '/waitlist',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('El correo es requerido')
      .isEmail()
      .withMessage('Debe ser un correo válido')
      .normalizeEmail(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
      }

      const { email } = req.body;
      const pool = getPool();

      await pool.execute(
        'INSERT INTO waitlist (email, created_at) VALUES (?, NOW())',
        [email]
      );

      res.status(201).json({
        success: true,
        message: '¡Gracias! Te avisaremos del próximo evento.',
      });
    } catch (err) {
      if (err.code === 'ER_NO_SUCH_TABLE') {
        return res.status(503).json({
          success: false,
          message: 'Base de datos no configurada.',
        });
      }
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(200).json({
          success: true,
          message: 'Ya estás en la lista. Te avisaremos.',
        });
      }
      console.error('Waitlist error:', err);
      res.status(500).json({
        success: false,
        message: 'Error al procesar. Intenta de nuevo.',
      });
    }
  }
);

module.exports = router;
