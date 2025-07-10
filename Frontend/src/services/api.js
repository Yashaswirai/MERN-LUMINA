import axios from 'axios';

// IMPORTANT: This should be your complete backend URL including /api
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mern-lumina.onrender.com/api';
console.log('API Base URL being used:', API_BASE_URL);

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

// Add detailed logging for debugging
API.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.message);
    console.error('Request was to:', error.config?.url);
    console.error('Full error:', error);
    return Promise.reject(error);
  }
);

export default API;
