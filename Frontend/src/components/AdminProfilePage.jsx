import { useState, useEffect } from 'react';
import API from '../utils/api';

const AdminProfilePage = () => {
  const [admin, setAdmin] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await API.get('/users/profile');
        setAdmin(res.data);
      } catch (err) {
        setMessage('Error fetching admin profile');
      }
    };
    
    fetchAdminProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedAdmin = {
        name: admin.name,
        email: admin.email,
        password: admin.password,
      };
      await API.put('/users/profile', updatedAdmin);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Error updating profile');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}

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
          <label className="block font-semibold">Password</label>
          <input
            type="password"
            value={admin.password}
            onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
            className="w-full p-2 border rounded"
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
