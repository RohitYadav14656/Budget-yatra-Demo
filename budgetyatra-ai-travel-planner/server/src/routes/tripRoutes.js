const express = require('express');
const router = express.Router();
const { generateTrip, getAllTrips, getTripById } = require('../controllers/tripController');

router.post('/generate', generateTrip);
router.get('/', getAllTrips);
router.get('/:id', getTripById);

module.exports = router;
