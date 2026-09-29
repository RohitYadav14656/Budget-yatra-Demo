const express = require('express');
const cors = require('cors');
const tripRoutes = require('./routes/tripRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'BudgetYatta API is running smoothly' });
});

// Trip Routes
app.use('/api/trips', tripRoutes);

// Error Handler Middleware
app.use(errorHandler);

module.exports = app;
