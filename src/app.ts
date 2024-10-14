// app.ts
import express from 'express';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import departmentRoutes from './routes/departmentRoutes';
import semesterRoutes from './routes/semesterRoutes';
import subjectRoutes from './routes/subjectRoutes';
import resourceRoutes from './routes/resourceRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import likeRoutes from './routes/likeRoutes';
import ratingRoutes from './routes/ratingRoutes';
import meetingRoutes from './routes/meetingRoutes';
import chatRoutes from './routes/chatRoutes';
import connectDB from './config/database';
import dotenv from 'dotenv';
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:9999', 
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));


app.use(express.json()); // Để xử lý JSON request body

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/semesters', semesterRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/chat', chatRoutes);








// Thêm route cho đường dẫn gốc '/'
app.get('/', (req, res) => {
    res.send('Welcome to LearnUp API');
  });
  
  // Thêm catch-all route cho các yêu cầu không xác định
  app.use((req, res) => {
    res.status(404).send('Page not found');
  });
  



export default app;
