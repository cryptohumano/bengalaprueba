require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const registerRoutes = require('./routes/register');
const waitlistRoutes = require('./routes/waitlist');
const adminRoutes = require('./routes/admin');
const settingsRoutes = require('./routes/settings');
const { initDb } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes (antes del static para prioridad)
app.use('/api', registerRoutes);
app.use('/api', waitlistRoutes);
app.use('/api', settingsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', message: 'Backend running' });
});

// Frontend estático (para Railway / single deploy)
const publicPath = path.resolve(__dirname, '..', 'public');
const indexHtml = path.join(publicPath, 'index.html');
if (fs.existsSync(indexHtml)) {
  app.use(express.static(publicPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(indexHtml);
  });
} else {
  app.get('/', (_, res) => {
    res.send('<h1>Backend OK</h1><p>Frontend build missing. Check Dockerfile.</p><a href="/api/health">/api/health</a>');
  });
}

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    console.log('⚠️  Server starting without DB - create DB and run schema.sql');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  });
