// backend/routes/assignTasks.js

import express from 'express';
import User from '../models/User.js';
import Availability from '../models/Availability.js';
import Task from '../models/Task.js';
import protect from '../middleware/auth.js';
import getCurrentWeek from '../utils/weekKey.js';

const router = express.Router();

// Sample tasks to rotate weekly
const taskPool = [
  'Clean Kitchen',
  'Sweep Living Room',
  'Take Out Trash',
  'Mop Bathroom',
  'Buy Groceries',
  'Do Laundry'
];

// Assign tasks to roommates based on availability
router.post('/', protect, async (req, res) => {
  try {
    const currentUser = req.user;
    const week = getCurrentWeek();

    // Fetch all users in the same group
    const groupUsers = await User.find({ groupCode: currentUser.groupCode });

    // Get availability for all users
    const availabilityMap = {};
    for (const user of groupUsers) {
      const available = await Availability.findOne({ user: user._id, week });
      if (available) {
        availabilityMap[user._id] = available.daysAvailable;
      }
    }

    // Basic round-robin task assignment
    const assignedTasks = [];
    let taskIndex = 0;
    const userIds = Object.keys(availabilityMap);

    if (userIds.length === 0) {
      return res.status(400).json({ error: 'No availability found to assign tasks.' });
    }

    while (taskIndex < taskPool.length) {
      for (const userId of userIds) {
        if (taskIndex >= taskPool.length) break;

        const task = await Task.create({
          taskName: taskPool[taskIndex],
          assignedTo: userId,
          week,
        });

        assignedTasks.push(task);
        taskIndex++;
      }
    }

    res.status(200).json({
      message: `Tasks assigned successfully for week ${week}`,
      assignedTasks,
    });

  } catch (err) {
    console.error('Error in assigning tasks:', err);
    res.status(500).json({ error: 'Server error during task assignment.' });
  }
});

export default router;
