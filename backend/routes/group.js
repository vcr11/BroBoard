// backend/routes/group.js

import express from 'express';
import User from '../models/User.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// POST /group/join — Join a group via group code
router.post('/join', protect, async (req, res) => {
  const { groupCode } = req.body;

  if (!groupCode) {
    return res.status(400).json({ message: 'Group code is required.' });
  }

  try {
    const user = await User.findById(req.user._id);
    user.groupCode = groupCode;
    await user.save();

    res.status(200).json({ message: 'Joined group successfully.' });
  } catch (err) {
    console.error('Error joining group:', err);
    res.status(500).json({ error: 'Could not join group.' });
  }
});

// GET /group/users — Get members of your group
router.get('/users', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.groupCode) {
      return res.status(400).json({ message: 'User not part of any group.' });
    }

    const groupUsers = await User.find({ groupCode: user.groupCode });

    res.status(200).json(groupUsers);
  } catch (err) {
    console.error('Error fetching group users:', err);
    res.status(500).json({ error: 'Could not get group members.' });
  }
});

export default router;
