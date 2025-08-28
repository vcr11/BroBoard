// backend/routes/auth.js

import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import protect from '../middleware/auth.js';

dotenv.config();

const router = express.Router();

// 🔑 Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// ✅ Register new user
router.post('/register', async (req, res) => {
  const { name, email, password, groupCode } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const newUser = await User.create({ name, email, password, groupCode });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      groupCode: newUser.groupCode,
      token: generateToken(newUser._id),
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// ✅ Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        groupCode: user.groupCode,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password.' });
    }
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// ✅ Get current logged-in user
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Profile Fetch Error:', err);
    res.status(500).json({ error: 'Cannot fetch user profile.' });
  }
});

export default router;
