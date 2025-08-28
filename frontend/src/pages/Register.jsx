import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

const Register = () => {
  const navigate = useNavigate();
  const [msg, setMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    groupCode: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      setMsg('✅ Registration successful!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      console.error('Registration Error:', err);
      setMsg('❌ Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-white flex items-center justify-center p-4">
      <form
        onSubmit={handleRegister}
        className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm">Group Code</label>
          <input
            type="text"
            name="groupCode"
            value={form.groupCode}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold"
        >
          Register
        </button>

        {msg && <p className="mt-4 text-center text-sm">{msg}</p>}
      </form>
    </div>
  );
};

export default Register;
