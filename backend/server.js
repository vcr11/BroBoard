// backend/server.js

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import availabilityRoutes from './routes/availability.js';
import taskRoutes from './routes/task.js';
import assignTasksRoutes from './routes/assignTasks.js';
import groupRoutes from './routes/group.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/group', groupRoutes);

// Root Route (optional homepage/test route)
app.get('/', (req, res) => {
  res.send('🚀 BroBoard API is up and running!');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/assign', assignTasksRoutes);

// MongoDB Connection + Server Start
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
