import { useEffect, useState } from 'react';
import API from '../utils/api';

const AdminOrderDashboard = () => {
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
  }, []);

  const handleMarkAsDelivered = async (orderId) => {
    try {
      const res = await API.put(`/orders/${orderId}/deliver`);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, isDelivered: true, deliveredAt: new Date().toISOString() } : order
        )
      );
      setMessage('Order marked as delivered successfully');
    } catch (err) {
      console.error('Error marking order as delivered:', err);
      setMessage('Error marking order as delivered: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleMarkAsPaid = async (orderId) => {
    try {
      const res = await API.put(`/orders/${orderId}/pay`, {
        paymentId: 'admin-manual-payment',
        status: 'completed',
        update_time: new Date().toISOString(),
        email: 'admin@example.com'
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, isPaid: true, paidAt: new Date().toISOString() } : order
        )
      );
      setMessage('Order marked as paid successfully');
    } catch (err) {
      console.error('Error marking order as paid:', err);
      setMessage('Error marking order as paid: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Order Dashboard</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Order ID</th>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Total</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="px-4 py-2">{order._id}</td>
              <td className="px-4 py-2">{order.user.name}</td>
              <td className="px-4 py-2">{order.totalPrice}</td>
              <td className="px-4 py-2">
                {order.isDelivered ? 'Delivered' : 'Pending'}
              </td>
              <td className="px-4 py-2">
                {!order.isDelivered && (
                  <button
                    onClick={() => handleMarkAsDelivered(order._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Mark as Delivered
                  </button>
                )}
                {!order.isPaid && (
                  <button
                    onClick={() => handleMarkAsPaid(order._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Mark as Paid
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderDashboard;
