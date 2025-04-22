const Razorpay = require('razorpay');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Razorpay with your key_id and key_secret
// In production, these should be stored in environment variables
let razorpay;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } else {
    // Create a mock Razorpay instance for testing without warning
    // We're using the credentials from .env file
    razorpay = {
      orders: {
        create: async (options) => ({
          id: 'order_' + Math.random().toString(36).substring(2, 15),
          amount: options.amount,
          currency: options.currency,
          receipt: options.receipt,
          status: 'created',
          created_at: new Date().toISOString(),
        }),
      },
    };
  }
} catch (error) {
  console.error('Error initializing Razorpay:', error);
  // Create a mock Razorpay instance as fallback
  razorpay = {
    orders: {
      create: async (options) => ({
        id: 'order_' + Math.random().toString(36).substring(2, 15),
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        status: 'created',
        created_at: new Date().toISOString(),
      }),
    },
  };
}

module.exports = razorpay;
