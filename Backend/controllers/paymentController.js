const razorpay = require('../config/razorpay');
const Order = require('../models/Order');
const crypto = require('crypto');

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = async (req, res) => {
  try {
    console.log('Create order request body:', req.body);
    const { amount, currency = 'INR', receipt, notes } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      console.log('Invalid amount:', amount);
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Create order with Razorpay
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise (1 INR = 100 paise)
      currency,
      receipt,
      notes,
    };

    console.log('Creating Razorpay order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created:', order);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      message: 'Something went wrong while creating the order',
      error: error.message,
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Skip signature verification if in test mode or missing key
    if (process.env.RAZORPAY_KEY_SECRET) {
      // Verify the payment signature
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ message: 'Invalid payment signature' });
      }
    } else {
      console.log('Skipping signature verification in test mode');
    }

    // Update the order in your database
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: razorpay_payment_id,
      status: 'completed',
      update_time: Date.now(),
      email_address: req.user.email,
    };

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      message: 'Something went wrong while verifying the payment',
      error: error.message,
    });
  }
};

// @desc    Get Razorpay key
// @route   GET /api/payments/get-razorpay-key
// @access  Public
const getRazorpayKey = (req, res) => {
  // Use test key if not set in environment
  const key = process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key_for_testing';
  const isTestMode = !process.env.RAZORPAY_KEY_ID || process.env.NODE_ENV !== 'production';

  console.log('Razorpay key requested:', { key, isTestMode });

  res.status(200).json({
    key,
    isTestMode,
  });
};

module.exports = {
  createOrder,
  verifyPayment,
  getRazorpayKey,
};
