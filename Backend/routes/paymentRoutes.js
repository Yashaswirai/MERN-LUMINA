const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getRazorpayKey,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Public route to get Razorpay key
router.get('/get-razorpay-key', getRazorpayKey);

// Protected routes
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

module.exports = router;
