require('dotenv').config();
const express = require('express');
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

app.use('/api', registerRoutes);
app.use('/api', waitlistRoutes);
app.use('/api', settingsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', message: 'Backend running' });
});

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
