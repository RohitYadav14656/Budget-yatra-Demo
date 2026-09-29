const express = require('express');
const cors = require('cors');
const tripRoutes = require('./routes/tripRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Configure CORS using environment variable
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'BudgetYatra API is running smoothly' });
});

// Trip API routes
app.use('/api/trips', tripRoutes);

// Central error handler middleware
app.use(errorHandler);

module.exports = app;
