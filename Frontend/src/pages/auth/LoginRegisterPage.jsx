import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FaEnvelope, FaLock, FaUser, FaSignInAlt, FaUserPlus } from "react-icons/fa";

const LoginRegisterPage = () => {
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/shop');
    }
  }, [isAuthenticated, navigate]);

  const validateLoginForm = () => {
    const errors = {};
    if (!loginData.email) errors.email = 'Email is required';
    if (!loginData.password) errors.password = 'Password is required';

    // Basic email validation
    if (loginData.email && !/\S+@\S+\.\S+/.test(loginData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateLoginForm()) return;

    setLoginLoading(true);
    try {
      const res = await API.post("/users/login", loginData);

      // First set the user data in context and localStorage
      const loginResult = login(res.data);

      if (loginResult.success) {
        showSuccess('Login successful!');

        // Add a longer delay before navigation to ensure state is fully updated
        setTimeout(() => {
          if (res.data.isAdmin) {
            navigate("/admin/dashboard");
          } else {
            navigate("/shop");
          }
          setLoginLoading(false);
        }, 500); // Increased delay for more reliable state updates
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      showError(errorMessage);
      setLoginErrors({ general: errorMessage });
      setLoginLoading(false);
    }
  };


  const validateRegisterForm = () => {
    const errors = {};
    if (!registerData.name) errors.name = 'Name is required';
    if (!registerData.email) errors.email = 'Email is required';
    if (!registerData.password) errors.password = 'Password is required';

    // Basic email validation
    if (registerData.email && !/\S+@\S+\.\S+/.test(registerData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password strength validation
    if (registerData.password && registerData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateRegisterForm()) return;

    setRegisterLoading(true);
    try {
      const res = await API.post("/users/register", registerData);

      // First set the user data in context and localStorage
      const loginResult = login(res.data);

      if (loginResult.success) {
        showSuccess('Registration successful! Welcome to LUMINA Store.');

        // Add a longer delay before navigation to ensure state is fully updated
        setTimeout(() => {
          navigate("/shop");
          setRegisterLoading(false);
        }, 500); // Increased delay for more reliable state updates
      } else {
        throw new Error('Registration failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      showError(errorMessage);
      setRegisterErrors({ general: errorMessage });
      setRegisterLoading(false);
    }
  };

  // Get theme context
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 transition-colors duration-200`}>LUMINA Store</h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>Your one-stop shop for premium products</p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
          {/* Login Form */}
          <div className={`${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} p-8 rounded-lg shadow-md w-full max-w-md transition-colors duration-200`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaSignInAlt className="mr-2" /> Login to Your Account
            </h2>

            {loginErrors.general && (
              <div className={`${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'} border-l-4 border-red-500 p-4 mb-6`}>
                <p className={`${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>{loginErrors.general}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="login-email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className={`pl-10 w-full py-2 px-4 border ${loginErrors.email ? 'border-red-500' : isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="you@example.com"
                  />
                </div>
                {loginErrors.email && <p className={`mt-1 text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{loginErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="login-password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className={`pl-10 w-full py-2 px-4 border ${loginErrors.password ? 'border-red-500' : isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="••••••••"
                  />
                </div>
                {loginErrors.password && <p className={`mt-1 text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{loginErrors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? (
                  <>
                    <LoadingSpinner size="small" color="white" />
                    <span className="ml-2">Logging in...</span>
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>
          </div>

          {/* Register Form */}
          <div className={`${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} p-8 rounded-lg shadow-md w-full max-w-md transition-colors duration-200`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaUserPlus className="mr-2" /> Create an Account
            </h2>

            {registerErrors.general && (
              <div className={`${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'} border-l-4 border-red-500 p-4 mb-6`}>
                <p className={`${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>{registerErrors.general}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label htmlFor="register-name" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    id="register-name"
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    className={`pl-10 w-full py-2 px-4 border ${registerErrors.name ? 'border-red-500' : isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="John Doe"
                  />
                </div>
                {registerErrors.name && <p className={`mt-1 text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{registerErrors.name}</p>}
              </div>

              <div>
                <label htmlFor="register-email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className={`pl-10 w-full py-2 px-4 border ${registerErrors.email ? 'border-red-500' : isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="you@example.com"
                  />
                </div>
                {registerErrors.email && <p className={`mt-1 text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{registerErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="register-password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    id="register-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className={`pl-10 w-full py-2 px-4 border ${registerErrors.password ? 'border-red-500' : isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="••••••••"
                  />
                </div>
                {registerErrors.password && <p className={`mt-1 text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{registerErrors.password}</p>}
                <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Password must be at least 6 characters long</p>
              </div>

              <button
                type="submit"
                disabled={registerLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registerLoading ? (
                  <>
                    <LoadingSpinner size="small" color="white" />
                    <span className="ml-2">Creating account...</span>
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterPage;
