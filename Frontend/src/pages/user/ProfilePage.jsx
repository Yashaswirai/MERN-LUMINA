import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../services/api';
import { FaBox, FaUser, FaShoppingBag, FaMapMarkerAlt, FaCreditCard, FaCalendarAlt, FaTruck, FaCheckCircle, FaTimesCircle, FaLock } from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

const ProfilePage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { showSuccess, showError } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success'); // 'success' or 'error'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'orders'

  // Fetch orders when the user is logged in
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await API.get('/orders/myorders');
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        showError('Failed to fetch orders. Please try again.');
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, showError]);

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Validate inputs
      if (!name.trim()) {
        throw new Error('Name cannot be empty');
      }

      if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password if user is updating it
      if (showPasswordFields) {
        if (!password) {
          throw new Error('Password cannot be empty');
        }

        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }

        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
      }

      // Prepare data for API call
      const userData = { name, email };

      // Only include password if it's being updated
      if (showPasswordFields && password) {
        userData.password = password;
      }

      // Make API call
      const res = await API.put('/users/profile', userData);

      // Check if response contains user data
      if (!res.data || !res.data._id) {
        throw new Error('Invalid response from server');
      }

      // Update user context with new data
      updateUser(res.data);

      // Show success message
      const successMessage = showPasswordFields
        ? 'Profile and password updated successfully!'
        : 'Profile updated successfully!';

      setMessage(successMessage);
      setMessageType('success');
      showSuccess(successMessage);

      // Reset password fields after successful update
      if (showPasswordFields) {
        setPassword('');
        setConfirmPassword('');
        setShowPasswordFields(false);
      }
    } catch (err) {
      // Handle error
      console.error('Profile update error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      setMessage(errorMessage);
      setMessageType('error');
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get order status badge
  const getOrderStatusBadge = (order) => {
    if (order.isDelivered) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          <FaCheckCircle className="inline mr-1" /> Delivered
        </span>
      );
    } else if (order.isPaid) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          <FaTruck className="inline mr-1" /> Shipping
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          <FaCreditCard className="inline mr-1" /> Awaiting Payment
        </span>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser className="inline mr-2" /> Profile
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'orders' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('orders')}
          >
            <FaBox className="inline mr-2" /> Orders
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
            </div>

            {message && (
              <div className={`px-6 py-3 ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            <div className="p-6">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="border-t pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    {showPasswordFields ? (
                      <>
                        <FaTimesCircle className="mr-2" /> Cancel Password Change
                      </>
                    ) : (
                      <>
                        <FaLock className="mr-2" /> Change Password
                      </>
                    )}
                  </button>
                </div>

                {showPasswordFields && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="small" color="white" />
                      <span className="ml-2">Updating...</span>
                    </div>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Order History</h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="text-center">
                  <LoadingSpinner size="large" color="blue" />
                  <p className="mt-4 text-gray-600">Loading your orders...</p>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center">
                <FaShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-6">When you place an order, it will appear here.</p>
                <Link to="/shop" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order._id.substring(order._id.length - 8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <FaCalendarAlt className="inline mr-1" /> {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${order.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getOrderStatusBadge(order)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link to={`/order/${order._id}`} className="text-blue-600 hover:text-blue-900">
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
