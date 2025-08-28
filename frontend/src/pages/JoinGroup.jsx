// frontend/src/pages/JoinGroup.jsx

import React, { useState } from 'react';
import API from '../api/api';

function JoinGroup() {
  const [groupCode, setGroupCode] = useState('');
  const [message, setMessage] = useState('');

  const handleJoin = async () => {
    try {
      const res = await API.post('/group/join', { groupCode });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold mb-4">Join a Roommate Group</h2>

      <input
        type="text"
        placeholder="Enter Group Code"
        value={groupCode}
        onChange={(e) => setGroupCode(e.target.value)}
        className="px-4 py-2 border rounded mb-4"
      />

      <button
        onClick={handleJoin}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Join Group
      </button>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}

export default JoinGroup;
