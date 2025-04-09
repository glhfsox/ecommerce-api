const express = require('express');
const router = express.Router();
const { createPayment, confirmPayment } = require('../controllers/paymentController');
const { authenticateUser } = require('../middleware/auth');

// Create payment intent
router.post('/create-payment', authenticateUser, createPayment);

// Confirm payment and update order
router.post('/confirm-payment', authenticateUser, confirmPayment);

module.exports = router;