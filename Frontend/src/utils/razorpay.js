import API from './api';

// Load Razorpay script
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // Check if script is already loaded
    if (window.Razorpay) {
      console.log('Razorpay script already loaded');
      resolve(true);
      return;
    }

    console.log('Loading Razorpay script...');
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      resolve(true);
    };
    script.onerror = (error) => {
      console.error('Failed to load Razorpay script:', error);
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Get Razorpay key from backend
export const getRazorpayKey = async () => {
  try {
    console.log('Fetching Razorpay key from backend...');
    const { data } = await API.get('/payments/get-razorpay-key');
    console.log('Razorpay key response:', data);
    return {
      key: data.key,
      isTestMode: data.isTestMode || false
    };
  } catch (error) {
    console.error('Error fetching Razorpay key:', error);
    // Return a test key if the API call fails
    console.log('Using fallback test key due to API error');
    return {
      key: 'rzp_test_dummy_key_for_testing',
      isTestMode: true
    };
  }
};

// Create Razorpay order
export const createRazorpayOrder = async (amount, receipt = 'order_receipt', notes = {}) => {
  try {
    console.log('Creating Razorpay order with params:', { amount, receipt, notes });
    const { data } = await API.post('/payments/create-order', {
      amount,
      currency: 'INR',
      receipt,
      notes,
    });
    console.log('Razorpay order creation response:', data);
    return data.order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
};

// Verify Razorpay payment
export const verifyRazorpayPayment = async (paymentData, orderId) => {
  try {
    console.log('Verifying Razorpay payment:', { paymentData, orderId });
    const { data } = await API.post('/payments/verify', {
      ...paymentData,
      orderId,
    });
    console.log('Payment verification response:', data);
    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
};
