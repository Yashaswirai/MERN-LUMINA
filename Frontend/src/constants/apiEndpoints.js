/**
 * API Endpoints for the application
 */

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  PROFILE: '/users/profile',
};

// Product endpoints
export const PRODUCT_ENDPOINTS = {
  GET_ALL: '/products',
  GET_BY_ID: (id) => `/products/${id}`,
  GET_IMAGE: (id) => `/products/${id}/image`,
  CREATE: '/products',
  UPDATE: (id) => `/products/${id}`,
  DELETE: (id) => `/products/${id}`,
};

// Order endpoints
export const ORDER_ENDPOINTS = {
  CREATE: '/orders',
  GET_BY_ID: (id) => `/orders/${id}`,
  GET_MY_ORDERS: '/orders/myorders',
  GET_ALL: '/orders',
  UPDATE_TO_PAID: (id) => `/orders/${id}/pay`,
  UPDATE_TO_DELIVERED: (id) => `/orders/${id}/deliver`,
};

// Payment endpoints
export const PAYMENT_ENDPOINTS = {
  GET_RAZORPAY_KEY: '/payments/get-razorpay-key',
  CREATE_ORDER: '/payments/create-order',
  VERIFY_PAYMENT: '/payments/verify',
};
