import express from 'express';
import Task from '../models/Task.js';
import Availability from '../models/Availability.js';
import User from '../models/User.js';
import getCurrentWeek from '../utils/weekKey.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// ✅ POST /tasks – Create and assign task to someone available
router.post('/', protect, async (req, res) => {
  const { title, description, preferredDays } = req.body;
  const week = getCurrentWeek();

  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser || !currentUser.groupCode) {
      return res.status(400).json({ message: 'User not assigned to any group.' });
    }

    // Get all group members (excluding the current user)
    const groupUsers = await User.find({
      groupCode: currentUser.groupCode,
      _id: { $ne: req.user._id },
    });

    const userIds = groupUsers.map(user => user._id);
    const availabilities = await Availability.find({ user: { $in: userIds }, week });

    // Try to assign to a member available on preferred days
    let bestMatch = null;
    for (let avail of availabilities) {
      const match = avail.daysAvailable.find(day => preferredDays.includes(day));
      if (match) {
        bestMatch = avail.user;
        break;
      }
    }

    if (!bestMatch) {
      return res.status(404).json({ message: 'No group member is available on preferred days.' });
    }

    // ✅ Create and assign task
    const newTask = await Task.create({
      title,
      description,
      assignedTo: bestMatch,
      createdBy: req.user._id,
      week,
      status: 'pending',
    });

    res.status(201).json({ message: 'Task created and assigned.', task: newTask });
  } catch (err) {
    console.error('Error assigning task:', err);
    res.status(500).json({ error: 'Server error while assigning task.' });
  }
});

// ✅ GET /tasks – Fetch tasks assigned to the current user
router.get('/', protect, async (req, res) => {
  const week = getCurrentWeek();
  const userId = req.user._id;

  try {
    const tasks = await Task.find({ assignedTo: userId, week }).populate('createdBy', 'name');
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Could not retrieve tasks.' });
  }
});

// ✅ PATCH /tasks/:id/complete – Mark a task as completed
router.patch('/:id/complete', protect, async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user._id;

  try {
    const task = await Task.findOne({ _id: taskId, assignedTo: userId });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized.' });
    }

    task.status = 'completed';
    await task.save();

    res.status(200).json({ message: 'Task marked as completed.', task });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Could not update task.' });
  }
});

export default router;
