// frontend/src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import API from '../api/api';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  const fetchUserAndTasks = async () => {
    try {
      const userRes = await API.get('/auth/me');
      setUser(userRes.data);

      const tasksRes = await API.get('/tasks/my');
      setTasks(tasksRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchUserAndTasks();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1220] text-white p-6">
      <h1 className="text-3xl font-bold mb-4">
        Welcome {user?.name || 'Back'}! 👋
      </h1>

      <h2 className="text-xl font-semibold mb-3">🧹 Your Tasks This Week</h2>

      {tasks.length === 0 ? (
        <p className="text-gray-400">No tasks assigned yet. Please check back later.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
