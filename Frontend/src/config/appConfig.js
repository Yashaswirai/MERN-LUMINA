/**
 * Application configuration
 */

const appConfig = {
  // API configuration
  api: {
    baseURL: '/api',
    timeout: 30000, // 30 seconds
  },
  
  // Authentication configuration
  auth: {
    tokenStorageKey: 'userInfo',
    tokenExpiryTime: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  },
  
  // Payment configuration
  payment: {
    razorpay: {
      currency: 'INR',
      name: 'LUMINA Store',
      description: 'Payment for your order',
      image: 'https://via.placeholder.com/150?text=LUMINA',
      theme: {
        color: '#3399cc',
      },
    },
  },
  
  // UI configuration
  ui: {
    toastDuration: 3000, // 3 seconds
    itemsPerPage: 8,
  },
};

export default appConfig;
