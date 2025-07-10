import axios from 'axios';

// IMPORTANT: This should be your complete backend URL including /api
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mern-lumina.onrender.com/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Keep this for cookies
});

// Check for token in localStorage on initialization
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

// If token exists, add it to default headers
if (userInfoFromStorage && userInfoFromStorage.token) {
  API.defaults.headers.common['Authorization'] = `Bearer ${userInfoFromStorage.token}`;
}

// Add response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.status, error.response.data);

      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        // Clear user data on authentication failure
        localStorage.removeItem('userInfo');

        // Only redirect if not already on the login page to prevent redirect loops
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default API;
