import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function GroupMembers() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/group/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMembers(res.data);
      } catch (err) {
        console.error('Error fetching group members', err);
      }
    };

    fetchGroup();
  }, []);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-semibold mb-4">Group Members</h2>
      <ul className="space-y-2">
        {members.map((user) => (
          <li key={user._id} className="bg-gray-800 p-3 rounded-md">
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
