const express = require('express');
const cors = require('cors');
const tripRoutes = require('./routes/tripRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

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

app.get(['/', '/health', '/api/health'], (req, res) => {
  res.status(200).json({ status: 'ok', message: 'BudgetYatra API is running smoothly' });
});

app.use('/api/trips', tripRoutes);
app.use('/trips', tripRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

app.use(errorHandler);

module.exports = app;
