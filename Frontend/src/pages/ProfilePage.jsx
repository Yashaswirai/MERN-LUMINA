import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const ProfilePage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]);

  // Fetch orders when the user is logged in
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/users/profile', { name, email });
      updateUser(res.data);  // Update user context
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Update Profile */}
        <div className="border p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Update Profile</h3>
          {message && <p className="text-green-600 mb-4">{message}</p>}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block font-semibold">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
              Update Profile
            </button>
          </form>
        </div>

        {/* Right Side: Order History */}
        <div className="border p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">My Orders</h3>
          {orders.length === 0 ? (
            <p>You have no orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border-b pb-4">
                  <h4 className="font-semibold">Order #{order._id}</h4>
                  <p className="text-sm">Status: {order.status}</p>
                  <ul className="list-disc pl-5">
                    {order.items.map((item) => (
                      <li key={item._id}>
                        {item.product.name} - Quantity: {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
