import { useState, useEffect } from 'react';
import API from '../utils/api';

const AdminOrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders');
        setOrders(res.data);
      } catch (err) {
        setMessage('Error fetching orders');
      }
    };

    fetchOrders();
  }, [message]);

  const handleMarkAsDelivered = async (orderId) => {
    try {
      await API.put(`/orders/${orderId}/delivered`);
      setMessage('Order marked as delivered');
    } catch (err) {
      setMessage('Error updating order status');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Admin Order Management</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="flex justify-between items-center border-b pb-4">
            <div>
              <p className="font-semibold">Order ID: {order._id}</p>
              <p>Status: {order.isDelivered ? 'Delivered' : 'Pending'}</p>
            </div>
            <div className="flex space-x-4">
              {!order.isDelivered && (
                <button
                  onClick={() => handleMarkAsDelivered(order._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrderManagementPage;
