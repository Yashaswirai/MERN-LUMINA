import API from './api';

// Load Razorpay script
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // Check if script is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Get Razorpay key from backend
export const getRazorpayKey = async () => {
  try {
    const { data } = await API.get('/payments/get-razorpay-key');
    return {
      key: data.key,
      isTestMode: data.isTestMode || false
    };
  } catch (error) {
    // Return a test key if the API call fails
    return {
      key: 'rzp_test_dummy_key_for_testing',
      isTestMode: true
    };
  }
};

// Create Razorpay order
export const createRazorpayOrder = async (amount, receipt = 'order_receipt', notes = {}) => {
  try {
    const { data } = await API.post('/payments/create-order', {
      amount,
      currency: 'INR',
      receipt,
      notes,
    });
    return data.order;
  } catch (error) {
    throw error;
  }
};

// Verify Razorpay payment
export const verifyRazorpayPayment = async (paymentData, orderId) => {
  try {
    const { data } = await API.post('/payments/verify', {
      ...paymentData,
      orderId,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
