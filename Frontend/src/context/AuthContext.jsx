import { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Fetch user data on page load
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount

    const fetchUser = async () => {
      try {
        if (isMounted) setLoading(true);

        // Check if we have user info in localStorage
        const storedUser = localStorage.getItem('userInfo');
        let parsedUser = null;

        if (storedUser) {
          try {
            parsedUser = JSON.parse(storedUser);
            // Set user from localStorage immediately to prevent flashing
            if (isMounted) setUser(parsedUser);
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
            localStorage.removeItem('userInfo');
          }
        }

        // Try to get fresh user data from API
        const { data } = await API.get('/users/me', {
          withCredentials: true, // Ensure cookies are sent with the request
        });

        // Update user state and localStorage with fresh data
        if (isMounted) {
          setUser(data);
          setAuthError(null); // Clear any previous errors
          localStorage.setItem('userInfo', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        // Clear user data if authentication fails
        localStorage.removeItem('userInfo');
        if (isMounted) {
          setUser(null);
          setAuthError(error.message || 'Authentication failed');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);

  const login = (userData) => {
    try {
      // First update localStorage
      localStorage.setItem('userInfo', JSON.stringify(userData));

      // Then update the user state
      setUser(userData);
      setAuthError(null); // Clear any previous errors

      // Reset loading state after login
      setLoading(false);

      // Return success for potential chaining
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      setAuthError(error.message || 'Login failed');
      return { success: false, error };
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      setLoading(true);
      await API.post('/users/logout', {}, {
        withCredentials: true, // Ensure cookies are sent with the request
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('userInfo');
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading, authError }}>
      {children}
    </AuthContext.Provider>
  );
};
