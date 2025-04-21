import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const HomePage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/users/login', loginData);
      login(res.data);
      console.log('Login response:', res.data);
      navigate('/shop');
    } catch (err) {
      console.error('Login error:', err.response?.data?.message || err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/users/register', registerData);
      login(res.data);
      navigate('/shop');
    } catch (err) {
      console.error('Register error:', err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen space-x-12">
      {/* Login Form */}
<form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-80">
  <h2 className="text-xl mb-4 font-bold">Login</h2>
  <input
    type="email"
    placeholder="Email"
    className="border p-2 w-full mb-3"
    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
  />
  <input
    type="password"
    placeholder="Password"
    className="border p-2 w-full mb-3"
    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
  />
  <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">Login</button>
</form>

{/* Register Form */}
<form onSubmit={handleRegister} className="bg-white p-6 rounded shadow w-80">
  <h2 className="text-xl mb-4 font-bold">Register</h2>
  <input
    type="text"
    placeholder="Name"
    className="border p-2 w-full mb-3"
    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
  />
  <input
    type="email"
    placeholder="Email"
    className="border p-2 w-full mb-3"
    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
  />
  <input
    type="password"
    placeholder="Password"
    className="border p-2 w-full mb-3"
    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
  />
  <button type="submit" className="bg-green-600 text-white w-full py-2 rounded">Register</button>
</form>

    </div>
  );
};

export default HomePage;
