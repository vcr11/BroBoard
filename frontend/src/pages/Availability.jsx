// frontend/src/pages/Availability.jsx

import React, { useState, useEffect } from 'react';
import API from '../api/api';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Availability = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [message, setMessage] = useState('');

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const submitAvailability = async () => {
    try {
      const res = await API.post('/availability', { daysAvailable: selectedDays });
      setMessage('✅ Availability submitted successfully!');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to submit availability.');
    }
  };

  useEffect(() => {
    // Optional: fetch existing availability for current week if needed
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1220] text-white p-6">
      <h2 className="text-2xl font-bold mb-4">Select Your Availability for This Week</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => toggleDay(day)}
            className={`px-4 py-2 rounded-xl border transition ${
              selectedDays.includes(day)
                ? 'bg-green-600 border-green-600 text-white'
                : 'bg-gray-800 border-gray-600 text-gray-300'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <button
        onClick={submitAvailability}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl font-semibold"
      >
        Submit Availability
      </button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
};

export default Availability;
