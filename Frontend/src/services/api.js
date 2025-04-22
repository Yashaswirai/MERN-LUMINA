import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true, // Always include credentials (cookies)
});

// Add token to headers if available
API.interceptors.request.use((config) => {
  const userInfoStr = localStorage.getItem('userInfo');
  if (userInfoStr) {
    try {
      const user = JSON.parse(userInfoStr);
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (error) {
      // Error parsing user info
    }
  }
  return config;
});

export default API;
