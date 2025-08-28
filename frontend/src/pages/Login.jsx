import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });

      // Save token and any user info if needed
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      localStorage.setItem('broboard_token', res.data.token);
      setIsAuthenticated(true);
      setMsg('✅ Login successful!');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      console.error('Login Error:', err);
      setMsg('❌ Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 text-sm">Email</label>
          <input
            id="email"
            type="email"
            className="w-full p-2 rounded bg-yellow-100 text-black border border-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-1 text-sm">Password</label>
          <input
            id="password"
            type="password"
            className="w-full p-2 rounded bg-yellow-100 text-black border border-gray-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold transition duration-200"
        >
          Log In
        </button>

        {msg && (
          <p
            className={`mt-4 text-center text-sm ${
              msg.includes('✅') ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {msg}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
