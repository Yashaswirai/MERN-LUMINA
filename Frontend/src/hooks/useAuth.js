import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to access the authentication context
 * @returns {Object} Authentication context values (user, login, logout, loading)
 */
export const useAuth = () => useContext(AuthContext);

export default useAuth;
