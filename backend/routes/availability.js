import express from 'express';
import Availability from '../models/Availability.js';
import getCurrentWeek from '../utils/weekKey.js';
import protect from '../middleware/auth.js';
import User from '../models/User.js'; // For group availability

const router = express.Router();

// POST /availability – Submit or update availability
router.post('/', protect, async (req, res) => {
  const { daysAvailable } = req.body; // Example: ["Monday", "Wednesday", "Friday"]
  const week = getCurrentWeek();
  const userId = req.user._id;

  try {
    let record = await Availability.findOne({ user: userId, week });

    if (record) {
      // Update if already exists
      record.daysAvailable = daysAvailable;
      await record.save();
    } else {
      // Create new record
      record = await Availability.create({
        user: userId,
        week,
        daysAvailable,
      });
    }

    res.status(200).json({ message: 'Availability saved', availability: record });
  } catch (err) {
    console.error('Error saving availability:', err);
    res.status(500).json({ error: 'Server error while saving availability.' });
  }
});

// GET /availability – Get logged-in user's availability for this week
router.get('/', protect, async (req, res) => {
  const week = getCurrentWeek();
  const userId = req.user._id;

  try {
    const availability = await Availability.findOne({ user: userId, week });

    if (!availability) {
      return res.status(404).json({ message: 'No availability set for this week.' });
    }

    res.status(200).json(availability);
  } catch (err) {
    console.error('Error fetching availability:', err);
    res.status(500).json({ error: 'Server error while fetching availability.' });
  }
});

// GET /availability/group – Get all users' availability for the current week (same group)
router.get('/group', protect, async (req, res) => {
  const week = getCurrentWeek();

  try {
    // Get current user and their groupCode
    const currentUser = await User.findById(req.user._id);
    if (!currentUser || !currentUser.groupCode) {
      return res.status(400).json({ message: 'User has no group assigned.' });
    }

    // Find all users in the same group
    const usersInGroup = await User.find({ groupCode: currentUser.groupCode });
    const userIds = usersInGroup.map(user => user._id);

    // Find availability for all group users for current week
    const availabilities = await Availability.find({
      user: { $in: userIds },
      week,
    }).populate('user', 'name email'); // Show user info

    res.status(200).json(availabilities);
  } catch (err) {
    console.error('Error fetching group availability:', err);
    res.status(500).json({ error: 'Server error while fetching group availability.' });
  }
});

export default router;
