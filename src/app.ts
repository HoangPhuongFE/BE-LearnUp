import express from 'express';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import departmentRoutes from './routes/departmentRoutes';
import semesterRoutes from './routes/semesterRoutes';
import subjectRoutes from './routes/subjectRoutes';
import resourceRoutes from './routes/resourceRoutes';
import postRoutes from './routes/postRoutes';
import commetRoutes from './routes/commentRoutes';
import likeRoutes from './routes/likeRoutes';









import connectDB from './config/database';
import dotenv from 'dotenv';

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // Để xử lý JSON request body

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/semesters', semesterRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commetRoutes);
app.use('/api/likes', likeRoutes);



export default app;
