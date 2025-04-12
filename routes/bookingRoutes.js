const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create a new booking
router.post('/book', bookingController.createBooking);

// Cancel a booking
router.post('/cancel/:bookingId', bookingController.cancelBooking);

// Get booking details
router.get('/booking/:bookingId', bookingController.getBookingDetails);

module.exports = router; 