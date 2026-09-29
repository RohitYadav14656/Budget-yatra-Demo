const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const validateTripInput = require('../utils/validateTripInput');
const { generateItineraryWithGroq } = require('../services/aiService');

// @desc    Generate new trip itinerary via AI and save to DB
// @route   POST /api/trips/generate
exports.generateTrip = async (req, res, next) => {
  try {
    const { isValid, errors, sanitized } = validateTripInput(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Call Groq AI service
    const aiResponse = await generateItineraryWithGroq(sanitized);

    // Validate Groq AI response structure before saving to DB
    if (
      !aiResponse ||
      !aiResponse.itinerary ||
      !Array.isArray(aiResponse.itinerary) ||
      aiResponse.itinerary.length === 0 ||
      !aiResponse.expenseBreakdown ||
      typeof aiResponse.expenseBreakdown !== 'object'
    ) {
      return res.status(502).json({
        success: false,
        message: 'AI service returned invalid or incomplete itinerary data structure.'
      });
    }

    // Server-side calculation of expense breakdown total (Do not trust AI arithmetic)
    const breakdown = aiResponse.expenseBreakdown;
    const stay = Number(breakdown.stay) || 0;
    const food = Number(breakdown.food) || 0;
    const transport = Number(breakdown.transport) || 0;
    const activities = Number(breakdown.activities) || 0;
    const miscellaneous = Number(breakdown.miscellaneous) || 0;

    const estimatedTotalCost = stay + food + transport + activities + miscellaneous;

    // Server-side budget status calculation
    const budget = sanitized.totalBudget;
    let budgetStatus = 'within_budget';
    if (estimatedTotalCost > budget) {
      budgetStatus = 'over_budget';
    } else if (estimatedTotalCost >= budget * 0.9) {
      budgetStatus = 'near_budget';
    }

    // Save trip document into MongoDB
    const newTrip = new Trip({
      destination: sanitized.destination,
      days: sanitized.days,
      travellers: sanitized.travellers,
      totalBudget: sanitized.totalBudget,
      accommodation: sanitized.accommodation,
      interests: sanitized.interests,
      tripTitle: aiResponse.tripTitle || `Trip to ${sanitized.destination}`,
      summary: aiResponse.summary || `A ${sanitized.days}-day budget trip to ${sanitized.destination}.`,
      itinerary: aiResponse.itinerary,
      expenseBreakdown: { stay, food, transport, activities, miscellaneous },
      estimatedTotalCost,
      budgetStatus,
      travelTips: Array.isArray(aiResponse.travelTips) ? aiResponse.travelTips : []
    });

    const savedTrip = await newTrip.save();

    res.status(201).json({
      success: true,
      data: savedTrip
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all saved trips (latest first)
// @route   GET /api/trips
exports.getAllTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find()
      .select('destination days travellers totalBudget tripTitle budgetStatus createdAt estimatedTotalCost')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trip details by ID
// @route   GET /api/trips/:id
exports.getTripById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Trip ID format'
      });
    }

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip plan not found'
      });
    }

    res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    next(error);
  }
};
