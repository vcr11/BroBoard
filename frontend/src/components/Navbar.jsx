import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-[#111827] px-6 py-4 shadow-md text-white flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">BroBoard</Link>
      </div>

      <div className="space-x-4">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
            <Link to="/availability" className="hover:text-blue-400 transition">Availability</Link>
            <Link to="/join-group" className="mx-2">Join Group</Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400 transition">Login</Link>
            <Link to="/register" className="hover:text-blue-400 transition">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
