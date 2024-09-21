import express from 'express';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import connectDB from './config/database';
import dotenv from 'dotenv';

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // Để xử lý JSON request body

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
export default app;
