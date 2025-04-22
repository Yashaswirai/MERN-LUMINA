import { useState, useEffect } from 'react';
import API from '../utils/api';

const AdminProfilePage = () => {
  const [admin, setAdmin] = useState({
    name: '',
    email: '',
  });
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success'); // 'success' or 'error'

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await API.get('/users/profile');
        // Only update name and email from the response, not password
        setAdmin({
          name: res.data.name || '',
          email: res.data.email || ''
        });
      } catch (err) {
        setMessage('Error fetching admin profile');
        setMessageType('error');
      }
    };

    fetchAdminProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      // Only include password in the update if it's not empty
      const updatedAdmin = {
        name: admin.name,
        email: admin.email,
        ...(password ? { password } : {})
      };

      await API.put('/users/profile', updatedAdmin);
      setMessage('Profile updated successfully!');
      setMessageType('success');

      // Clear password field after successful update
      setPassword('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error updating profile');
      setMessageType('error');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>

      {message && (
        <div className={`p-4 mb-4 rounded ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label className="block font-semibold">Name</label>
          <input
            type="text"
            value={admin.name}
            onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            value={admin.email}
            onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Password (leave blank to keep current)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter new password"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default AdminProfilePage;
