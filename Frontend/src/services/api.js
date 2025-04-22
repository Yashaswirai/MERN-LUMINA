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
      console.error('Error parsing user info:', error);
    }
  }
  return config;
});

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
        // Could redirect to login or clear user data
        // localStorage.removeItem('userInfo');
        // window.location.href = '/';
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
