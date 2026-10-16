require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

// ── Connect to MongoDB ──────────────────────────────────────────────────────
connectDB();

// ── Global Middleware ───────────────────────────────────────────────────────
app.use(express.json()); // parse incoming JSON bodies

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/events', eventRoutes);

// ── Health check ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Events API is running 🚀' });
});

// ── 404 Handler (unknown routes) ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
