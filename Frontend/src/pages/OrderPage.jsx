import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import RazorpayPayment from '../components/RazorpayPayment';
import { FaArrowLeft, FaMapMarkerAlt, FaCreditCard, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaShippingFast, FaCalendarAlt, FaFileInvoiceDollar, FaMoneyBillWave } from 'react-icons/fa';

const OrderPage = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
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

      console.log('Marking order as paid:', orderId);
      const { data } = await API.put(`/orders/${orderId}/pay`, {
        paymentId: 'admin-manual-payment',
        status: 'completed',
        update_time: new Date().toISOString(),
        email: order.user.email
      });

      console.log('Order marked as paid response:', data);
      setOrder(data);
      setAdminActionMessage('Order marked as paid successfully');
    } catch (err) {
      console.error('Error marking order as paid:', err);
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

      console.log('Marking order as delivered:', orderId);
      const { data } = await API.put(`/orders/${orderId}/deliver`);

      console.log('Order marked as delivered response:', data);
      setOrder(data);
      setAdminActionMessage('Order marked as delivered successfully');
    } catch (err) {
      console.error('Error marking order as delivered:', err);
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
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
          <FaTimesCircle className="mr-2" /> {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded flex items-center">
          <FaTimesCircle className="mr-2" /> Order not found
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Profile
        </button>
      </div>
    );
  }

  // Get order status steps
  const orderStatusSteps = getOrderStatusSteps(order);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order Details</h1>
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" /> Back to Profile
          </button>
        </div>

        {/* Order ID and Date */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-lg font-semibold">Order #{order._id.substring(order._id.length - 8)}</h2>
            <p className="text-gray-600"><FaCalendarAlt className="inline mr-1" /> Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="mt-2 md:mt-0">
            {order.isPaid ? (
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                <FaCheckCircle className="inline mr-1" /> Paid
              </span>
            ) : (
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                <FaCreditCard className="inline mr-1" /> Awaiting Payment
              </span>
            )}
          </div>
        </div>

        {/* Order Tracking */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Order Tracking</h2>
          </div>
          <div className="p-6">
            <div className="relative">
              {/* Progress Bar */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${(orderStatusSteps.filter(step => step.completed).length - 1) / (orderStatusSteps.length - 1) * 100}%`
                  }}
                ></div>
              </div>

              {/* Steps */}
              <div className="relative flex justify-between">
                {orderStatusSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${step.completed ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        <StepIcon />
                      </div>
                      <div className="text-sm font-medium mt-2">{step.title}</div>
                      {step.date && step.completed && (
                        <div className="text-xs text-gray-500 mt-1">{formatDate(step.date).split(',')[0]}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b flex items-center">
                <FaMapMarkerAlt className="text-gray-500 mr-2" />
                <h2 className="text-lg font-semibold">Shipping Information</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">CONTACT</h3>
                    <p className="mt-1">{order.user.name}</p>
                    <p className="text-gray-600">{order.user.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">SHIPPING ADDRESS</h3>
                    <p className="mt-1">{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-500">DELIVERY STATUS</h3>
                  <div className="mt-1">
                    {order.isDelivered ? (
                      <div className="flex items-center text-green-700">
                        <FaCheckCircle className="mr-2" />
                        Delivered on {formatDate(order.deliveredAt)}
                      </div>
                    ) : (
                      <div className="flex items-center text-blue-700">
                        <FaTruck className="mr-2" />
                        {order.isPaid ? 'In Transit' : 'Will ship after payment'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b flex items-center">
                <FaCreditCard className="text-gray-500 mr-2" />
                <h2 className="text-lg font-semibold">Payment Information</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">PAYMENT METHOD</h3>
                    <p className="mt-1">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">PAYMENT STATUS</h3>
                    <div className="mt-1">
                      {order.isPaid ? (
                        <div className="flex items-center text-green-700">
                          <FaCheckCircle className="mr-2" />
                          Paid on {formatDate(order.paidAt)}
                        </div>
                      ) : (
                        <div className="flex items-center text-yellow-700">
                          <FaCreditCard className="mr-2" />
                          Awaiting Payment
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b flex items-center">
                <FaBox className="text-gray-500 mr-2" />
                <h2 className="text-lg font-semibold">Order Items</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item._id || item.product} className="flex justify-between items-center border-b pb-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 flex-shrink-0 mr-4 bg-gray-200 rounded">
                          <img
                            src={`/api/products/${item.product}/image`}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                            }}
                          />
                        </div>
                        <div>
                          <Link to={`/product/${item.product}`} className="text-blue-600 hover:underline font-medium">
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${(item.qty * item.price).toFixed(2)}</div>
                        <div className="text-sm text-gray-500">${item.price.toFixed(2)} each</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">Order Summary</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <div className="text-gray-600">Subtotal:</div>
                    <div>${Number(order.itemsPrice).toFixed(2)}</div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div className="text-gray-600">Shipping:</div>
                    <div>${Number(order.shippingPrice).toFixed(2)}</div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div className="text-gray-600">Tax:</div>
                    <div>${Number(order.taxPrice).toFixed(2)}</div>
                  </div>

                  <div className="flex justify-between font-bold text-lg pt-3 border-t">
                    <div>Total:</div>
                    <div>${Number(order.totalPrice).toFixed(2)}</div>
                  </div>
                </div>

                {!order.isPaid && (
                  <div className="mt-6">
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
                      <div className="mt-4 bg-green-100 text-green-700 p-3 rounded flex items-center">
                        <FaCheckCircle className="mr-2" />
                        Payment successful! Your order is now being processed.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Admin Actions */}
            {user && user.isAdmin && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold">Admin Actions</h2>
                </div>
                <div className="p-6 space-y-4">
                  {adminActionMessage && (
                    <div className={`p-3 rounded ${adminActionMessage.includes('success') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {adminActionMessage}
                    </div>
                  )}

                  {!order.isPaid && (
                    <button
                      onClick={markAsPaid}
                      disabled={adminActionLoading}
                      className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      <FaMoneyBillWave className="mr-2" />
                      {adminActionLoading ? 'Processing...' : 'Mark as Paid'}
                    </button>
                  )}

                  {order.isPaid && !order.isDelivered && (
                    <button
                      onClick={markAsDelivered}
                      disabled={adminActionLoading}
                      className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <FaTruck className="mr-2" />
                      {adminActionLoading ? 'Processing...' : 'Mark as Delivered'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Need Help? */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-700 mb-3">If you have any questions about your order, please contact our customer support.</p>
              <a href="mailto:support@lumina.com" className="text-sm text-blue-600 hover:text-blue-800 font-medium">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
