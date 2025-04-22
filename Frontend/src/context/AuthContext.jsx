import { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data on page load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Check if we have user info in localStorage
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Try to get user data from API
        const { data } = await API.get('/users/me', {
          withCredentials: true, // Ensure cookies are sent with the request
        });

        // Update user state and localStorage
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
      } catch (error) {
        console.error('Failed to fetch user:', error);
        // Clear user data if authentication fails
        localStorage.removeItem('userInfo');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await API.post('/users/logout', {}, {
        withCredentials: true, // Ensure cookies are sent with the request
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('userInfo');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
