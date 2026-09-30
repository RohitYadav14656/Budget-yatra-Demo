const express = require('express');
const cors = require('cors');
const tripRoutes = require('./routes/tripRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Configure CORS dynamically to support Vercel preview/production links and local dev
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    const cleanClientUrl = (process.env.CLIENT_URL || '').replace(/\/$/, '');
    
    if (
      cleanOrigin === cleanClientUrl ||
      cleanOrigin.endsWith('.vercel.app') ||
      cleanOrigin.includes('localhost') ||
      cleanOrigin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Health check endpoints
app.get(['/', '/health', '/api/health'], (req, res) => {
  res.status(200).json({ status: 'ok', message: 'BudgetYatra API is running smoothly' });
});

// Trip API routes (supports both /api/trips and /trips fallback)
app.use('/api/trips', tripRoutes);
app.use('/trips', tripRoutes);

// Central error handler middleware
app.use(errorHandler);

module.exports = app;
