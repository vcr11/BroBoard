// backend/models/Availability.js

import mongoose from 'mongoose';

const AvailabilitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  week: {
    type: String, // Format: '2025-W35'
    required: true,
  },
  daysAvailable: {
    type: [String], // Example: ['Monday', 'Wednesday', 'Saturday']
    required: true,
  }
}, {
  timestamps: true
});

export default mongoose.model('Availability', AvailabilitySchema);
