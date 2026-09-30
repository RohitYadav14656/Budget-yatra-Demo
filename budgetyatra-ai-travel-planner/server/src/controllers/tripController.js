const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const validateTripInput = require('../utils/validateTripInput');
const { generateItineraryWithGroq } = require('../services/aiService');

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

    const aiResponse = await generateItineraryWithGroq(sanitized);

    if (aiResponse && aiResponse.isInvalidDestination) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [`"${sanitized.destination}" is not a recognized travel destination. Please enter a real city, state, or place.`]
      });
    }

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
        message: 'Itinerary generation returned invalid or incomplete data structure.'
      });
    }

    const breakdown = aiResponse.expenseBreakdown;
    const stay = Number(breakdown.stay) || 0;
    const food = Number(breakdown.food) || 0;
    const transport = Number(breakdown.transport) || 0;
    const activities = Number(breakdown.activities) || 0;
    const miscellaneous = Number(breakdown.miscellaneous) || 0;

    const estimatedTotalCost = stay + food + transport + activities + miscellaneous;

    const budget = sanitized.totalBudget;
    let budgetStatus = 'within_budget';
    if (estimatedTotalCost > budget) {
      budgetStatus = 'over_budget';
    } else if (estimatedTotalCost >= budget * 0.9) {
      budgetStatus = 'near_budget';
    }

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

exports.getTripById = async (req, res, next) => {
  try {
    const { id } = req.params;

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
