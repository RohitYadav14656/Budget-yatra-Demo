require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas first, then listen for incoming connections
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`BudgetYatta server running on port ${PORT}`);
  });
});
