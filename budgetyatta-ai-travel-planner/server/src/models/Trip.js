const mongoose = require('mongoose');

const itineraryDaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  morning: { type: String, required: true },
  afternoon: { type: String, required: true },
  evening: { type: String, required: true },
  foodSuggestion: { type: String, required: true },
  estimatedCost: { type: Number, required: true, min: 0 }
});

const expenseBreakdownSchema = new mongoose.Schema({
  stay: { type: Number, required: true, default: 0 },
  food: { type: Number, required: true, default: 0 },
  transport: { type: Number, required: true, default: 0 },
  activities: { type: Number, required: true, default: 0 },
  miscellaneous: { type: Number, required: true, default: 0 }
});

const tripSchema = new mongoose.Schema({
  destination: { type: String, required: true, trim: true },
  days: { type: Number, required: true, min: 1, max: 30 },
  travellers: { type: Number, required: true, min: 1, max: 50 },
  totalBudget: { type: Number, required: true, min: 500 },
  accommodation: { 
    type: String, 
    required: true, 
    enum: ['Budget', 'Mid-range', 'Premium'] 
  },
  interests: [{ type: String, required: true }],
  tripTitle: { type: String, required: true },
  summary: { type: String, required: true },
  itinerary: [itineraryDaySchema],
  expenseBreakdown: expenseBreakdownSchema,
  estimatedTotalCost: { type: Number, required: true },
  budgetStatus: { 
    type: String, 
    required: true, 
    enum: ['within_budget', 'near_budget', 'over_budget'] 
  },
  travelTips: [{ type: String }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Trip', tripSchema);
