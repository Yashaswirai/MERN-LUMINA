const razorpay = require('../config/razorpay');
const Order = require('../models/Order');
const Product = require('../models/Product');
const crypto = require('crypto');

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Create order with Razorpay
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise (1 INR = 100 paise)
      currency,
      receipt,
      notes,
    };

    const order = await razorpay.orders.create(options);

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
    }

    // Update the order in your database
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only update stock if the order wasn't already paid
    if (!order.isPaid) {
      // Update product stock and increment numOrders for each item
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          // Decrease stock
          product.countInStock = Math.max(0, product.countInStock - item.qty);
          // Increment number of orders (for popularity tracking)
          product.numOrders += 1;
          await product.save();
        }
      }
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
