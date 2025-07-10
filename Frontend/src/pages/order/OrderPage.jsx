import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import API from '../../services/api';
import RazorpayPayment from '../../components/RazorpayPayment';
import { FaArrowLeft, FaMapMarkerAlt, FaCreditCard, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaShippingFast, FaCalendarAlt, FaFileInvoiceDollar, FaMoneyBillWave, FaEnvelope, FaPhone } from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OrderPage = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [adminActionLoading, setAdminActionLoading] = useState(false);
  const [adminActionMessage, setAdminActionMessage] = useState('');

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Mark order as paid (Admin only)
  const markAsPaid = async () => {
    try {
      setAdminActionLoading(true);
      setAdminActionMessage('');

      const { data } = await API.put(`/orders/${orderId}/pay`, {
        paymentId: 'admin-manual-payment',
        status: 'completed',
        update_time: new Date().toISOString(),
        email: order.user.email
      });

      setOrder(data);
      setAdminActionMessage('Order marked as paid successfully');
    } catch (err) {
      setAdminActionMessage(err.response?.data?.message || 'Failed to mark order as paid');
    } finally {
      setAdminActionLoading(false);
    }
  };

  // Mark order as delivered (Admin only)
  const markAsDelivered = async () => {
    try {
      setAdminActionLoading(true);
      setAdminActionMessage('');

      const { data } = await API.put(`/orders/${orderId}/deliver`);

      setOrder(data);
      setAdminActionMessage('Order marked as delivered successfully');
    } catch (err) {
      setAdminActionMessage(err.response?.data?.message || 'Failed to mark order as delivered');
    } finally {
      setAdminActionLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/orders/${orderId}`);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order details');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Get order status steps
  const getOrderStatusSteps = (order) => {
    const steps = [
      { id: 'placed', title: 'Order Placed', icon: FaFileInvoiceDollar, date: order?.createdAt, completed: true },
      { id: 'paid', title: 'Payment Confirmed', icon: FaCreditCard, date: order?.paidAt, completed: order?.isPaid },
      { id: 'processing', title: 'Processing', icon: FaBox, date: order?.isPaid ? new Date(new Date(order.paidAt).getTime() + 24*60*60*1000).toISOString() : null, completed: order?.isPaid },
      { id: 'shipped', title: 'Shipped', icon: FaShippingFast, date: order?.isDelivered ? new Date(new Date(order.deliveredAt).getTime() - 48*60*60*1000).toISOString() : null, completed: order?.isDelivered },
      { id: 'delivered', title: 'Delivered', icon: FaCheckCircle, date: order?.deliveredAt, completed: order?.isDelivered }
    ];

    return steps;
  };

  if (loading) {
    return (
      <div className={`container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh] ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
        <div className="text-center">
          <LoadingSpinner size="large" color="blue" />
          <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen transition-colors duration-200`}>
        <div className={`${isDarkMode ? 'bg-red-900/20 border-red-700 text-red-400' : 'bg-red-100 border-red-400 text-red-700'} px-6 py-4 rounded-lg border flex items-center shadow-sm`}>
          <FaTimesCircle className="mr-3 text-lg" />
          <span className="font-medium">{error}</span>
        </div>
        <button
          onClick={() => navigate(-1)}
          className={`mt-6 flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-800' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'}`}
        >
          <FaArrowLeft className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen transition-colors duration-200`}>
        <div className={`${isDarkMode ? 'bg-yellow-900/20 border-yellow-700 text-yellow-400' : 'bg-yellow-100 border-yellow-400 text-yellow-700'} px-6 py-4 rounded-lg border flex items-center shadow-sm`}>
          <FaTimesCircle className="mr-3 text-lg" />
          <span className="font-medium">Order not found</span>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className={`mt-6 flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-800' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'}`}
        >
          <FaArrowLeft className="mr-2" /> Back to Profile
        </button>
      </div>
    );
  }

  // Get order status steps
  const orderStatusSteps = getOrderStatusSteps(order);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with back button */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Order Details</h1>
              <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-200`}>Track your order status and view details</p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-white border border-gray-300'} shadow-sm`}
            >
              <FaArrowLeft className="mr-2" /> Back to Profile
            </button>
          </div>

          {/* Order ID and Date */}
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 mb-8 border shadow-sm transition-colors duration-200`}>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              <div className="space-y-2">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                  Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                </h2>
                <p className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-200`}>
                  <FaCalendarAlt className="mr-2 text-sm" />
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {order.isPaid ? (
                  <span className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full ${isDarkMode ? 'bg-green-900/30 text-green-400 border border-green-700' : 'bg-green-100 text-green-800 border border-green-200'} transition-colors duration-200`}>
                    <FaCheckCircle className="mr-2" /> Payment Confirmed
                  </span>
                ) : (
                  <span className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full ${isDarkMode ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'} transition-colors duration-200`}>
                    <FaCreditCard className="mr-2" /> Awaiting Payment
                  </span>
                )}
                {order.isDelivered && (
                  <span className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full ${isDarkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-700' : 'bg-blue-100 text-blue-800 border border-blue-200'} transition-colors duration-200`}>
                    <FaTruck className="mr-2" /> Delivered
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Order Tracking */}
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg overflow-hidden mb-8 border transition-colors duration-200`}>
            <div className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} px-6 py-4 border-b transition-colors duration-200`}>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Order Tracking</h2>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-200`}>Follow your order progress</p>
            </div>
            <div className="p-8">
              <div className="relative">
                {/* Progress Bar */}
                <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} transition-colors duration-200`}>
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${(orderStatusSteps.filter(step => step.completed).length - 1) / (orderStatusSteps.length - 1) * 100}%`
                    }}
                  ></div>
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                  {orderStatusSteps.map((step) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={step.id} className="flex flex-col items-center max-w-[120px]">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-300 ${
                          step.completed
                            ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                            : isDarkMode
                              ? 'bg-gray-700 text-gray-400 border-gray-600'
                              : 'bg-gray-200 text-gray-500 border-gray-300'
                        }`}>
                          <StepIcon className="text-lg" />
                        </div>
                        <div className={`text-sm font-semibold mt-3 text-center ${
                          step.completed
                            ? isDarkMode ? 'text-blue-400' : 'text-blue-600'
                            : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        } transition-colors duration-200`}>
                          {step.title}
                        </div>
                        {step.date && step.completed && (
                          <div className={`text-xs mt-1 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} transition-colors duration-200`}>
                            {formatDate(step.date).split(',')[0]}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              {/* Shipping Information */}
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg overflow-hidden border transition-colors duration-200`}>
                <div className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} px-6 py-4 border-b flex items-center transition-colors duration-200`}>
                  <FaMapMarkerAlt className={`${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mr-3 text-lg`} />
                  <div>
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Shipping Information</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-200`}>Delivery details and contact information</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'} transition-colors duration-200`}>
                      <h3 className={`text-sm font-bold uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-3 transition-colors duration-200`}>Contact Information</h3>
                      <div className="space-y-2">
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{order.user.name}</p>
                        <p className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>
                          <FaEnvelope className="mr-2 text-sm" />
                          {order.user.email}
                        </p>
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'} transition-colors duration-200`}>
                      <h3 className={`text-sm font-bold uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-3 transition-colors duration-200`}>Shipping Address</h3>
                      <div className="space-y-1">
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{order.shippingAddress.address}</p>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>{order.shippingAddress.country}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-200`}>
                    <h3 className={`text-sm font-bold uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-3 transition-colors duration-200`}>Delivery Status</h3>
                    <div className="mt-2">
                      {order.isDelivered ? (
                        <div className={`flex items-center p-3 rounded-lg ${isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-700'} transition-colors duration-200`}>
                          <FaCheckCircle className="mr-3 text-lg" />
                          <div>
                            <p className="font-semibold">Package Delivered</p>
                            <p className="text-sm opacity-90">Delivered on {formatDate(order.deliveredAt)}</p>
                          </div>
                        </div>
                      ) : (
                        <div className={`flex items-center p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-700'} transition-colors duration-200`}>
                          <FaTruck className="mr-3 text-lg" />
                          <div>
                            <p className="font-semibold">{order.isPaid ? 'In Transit' : 'Awaiting Payment'}</p>
                            <p className="text-sm opacity-90">{order.isPaid ? 'Your order is on its way' : 'Will ship after payment confirmation'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg overflow-hidden border transition-colors duration-200`}>
                <div className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} px-6 py-4 border-b flex items-center transition-colors duration-200`}>
                  <FaCreditCard className={`${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mr-3 text-lg`} />
                  <div>
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Payment Information</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-200`}>Payment method and transaction details</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'} transition-colors duration-200`}>
                      <h3 className={`text-sm font-bold uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-3 transition-colors duration-200`}>Payment Method</h3>
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{order.paymentMethod}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'} transition-colors duration-200`}>
                      <h3 className={`text-sm font-bold uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-3 transition-colors duration-200`}>Payment Status</h3>
                      <div className="mt-2">
                        {order.isPaid ? (
                          <div className={`flex items-center p-3 rounded-lg ${isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-700'} transition-colors duration-200`}>
                            <FaCheckCircle className="mr-3 text-lg" />
                            <div>
                              <p className="font-semibold">Payment Confirmed</p>
                              <p className="text-sm opacity-90">Paid on {formatDate(order.paidAt)}</p>
                            </div>
                          </div>
                        ) : (
                          <div className={`flex items-center p-3 rounded-lg ${isDarkMode ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700'} transition-colors duration-200`}>
                            <FaCreditCard className="mr-3 text-lg" />
                            <div>
                              <p className="font-semibold">Awaiting Payment</p>
                              <p className="text-sm opacity-90">Complete payment to process your order</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg overflow-hidden border transition-colors duration-200`}>
                <div className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} px-6 py-4 border-b flex items-center transition-colors duration-200`}>
                  <FaBox className={`${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mr-3 text-lg`} />
                  <div>
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Order Items</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-200`}>{order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''} in this order</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {order.orderItems.map((item, index) => (
                      <div key={item._id || item.product} className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 ${index !== order.orderItems.length - 1 ? `pb-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}` : ''} transition-colors duration-200`}>
                        <div className="flex items-center space-x-4">
                          <div className={`w-20 h-20 flex-shrink-0 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg overflow-hidden transition-colors duration-200`}>
                            <img
                              src={`/api/products/${item.product}/image`}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/product/${item.product}`}
                              className={`font-semibold text-lg hover:underline transition-colors duration-200 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                            >
                              {item.name}
                            </Link>
                            <div className="flex items-center mt-2 space-x-4">
                              <span className={`text-sm px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} transition-colors duration-200`}>
                                Qty: {item.qty}
                              </span>
                              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                                ${item.price.toFixed(2)} each
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right sm:text-left">
                          <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>
                            ${(item.qty * item.price).toFixed(2)}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                            Total for this item
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-8">
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg overflow-hidden border transition-colors duration-200`}>
                <div className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} px-6 py-4 border-b transition-colors duration-200`}>
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Order Summary</h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-200`}>Price breakdown and payment details</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>Subtotal:</div>
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>${Number(order.itemsPrice).toFixed(2)}</div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>Shipping:</div>
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>${Number(order.shippingPrice).toFixed(2)}</div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>Tax:</div>
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>${Number(order.taxPrice).toFixed(2)}</div>
                    </div>

                    <div className={`flex justify-between items-center font-bold text-xl pt-4 border-t ${isDarkMode ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-900'} transition-colors duration-200`}>
                      <div>Total:</div>
                      <div className="text-blue-600">${Number(order.totalPrice).toFixed(2)}</div>
                    </div>
                  </div>

                  {!order.isPaid && (
                    <div className="mt-8">
                      <RazorpayPayment
                        order={order}
                        onSuccess={(data) => {
                          setPaymentSuccess(true);
                          setOrder(data.order);
                        }}
                        onError={(error) => {
                          setError('Payment failed: ' + (error.message || 'Unknown error'));
                        }}
                      />
                      {paymentSuccess && (
                        <div className={`mt-6 p-4 rounded-lg flex items-center ${isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-700'} transition-colors duration-200`}>
                          <FaCheckCircle className="mr-3 text-lg" />
                          <div>
                            <p className="font-semibold">Payment Successful!</p>
                            <p className="text-sm opacity-90">Your order is now being processed.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Actions */}
              {user && user.isAdmin && (
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg overflow-hidden border transition-colors duration-200`}>
                  <div className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} px-6 py-4 border-b transition-colors duration-200`}>
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Admin Actions</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-200`}>Manage order status and payments</p>
                  </div>
                  <div className="p-6 space-y-4">
                    {adminActionMessage && (
                      <div className={`p-4 rounded-lg ${adminActionMessage.includes('success')
                        ? isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-700'
                        : isDarkMode ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                      } transition-colors duration-200`}>
                        {adminActionMessage}
                      </div>
                    )}

                    {!order.isPaid && (
                      <button
                        onClick={markAsPaid}
                        disabled={adminActionLoading}
                        className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-semibold text-white transition-all duration-200 ${
                          adminActionLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                        }`}
                      >
                        <FaMoneyBillWave className="mr-2" />
                        {adminActionLoading ? 'Processing...' : 'Mark as Paid'}
                      </button>
                    )}

                    {order.isPaid && !order.isDelivered && (
                      <button
                        onClick={markAsDelivered}
                        disabled={adminActionLoading}
                        className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-semibold text-white transition-all duration-200 ${
                          adminActionLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                      >
                        <FaTruck className="mr-2" />
                        {adminActionLoading ? 'Processing...' : 'Mark as Delivered'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Need Help? */}
              <div className={`${isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} rounded-xl p-6 border transition-colors duration-200`}>
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-blue-400' : 'text-blue-800'} mb-3 transition-colors duration-200`}>Need Help?</h3>
                <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'} mb-4 transition-colors duration-200`}>
                  If you have any questions about your order, please contact our customer support team.
                </p>
                <div className="space-y-2">
                  <a
                    href="mailto:support@lumina.com"
                    className={`inline-flex items-center text-sm font-semibold transition-colors duration-200 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    <FaEnvelope className="mr-2" />
                    support@lumina.com
                  </a>
                  <br />
                  <a
                    href="tel:+1234567890"
                    className={`inline-flex items-center text-sm font-semibold transition-colors duration-200 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    <FaPhone className="mr-2" />
                    +1 (234) 567-8900
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
