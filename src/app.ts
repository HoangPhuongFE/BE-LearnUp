import express from 'express';
import path from 'path';
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
import paymentRoutes from './routes/paymentRoutes';
import orderRoutes from './routes/orderRoutes';


 
import connectDB from './config/database';
import dotenv from 'dotenv';
dotenv.config();
console.log("PAYOS_CLIENT_ID:", process.env.PAYOS_CLIENT_ID);
console.log("PAYOS_API_KEY:", process.env.PAYOS_API_KEY);
console.log("PAYOS_CHECKSUM_KEY:", process.env.PAYOS_CHECKSUM_KEY);

const cors = require('cors');

connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:9999', 
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));

app.use(express.json()); // Để xử lý JSON request body

// Sử dụng file tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));

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
app.use('/api/payment', paymentRoutes);
app.use('/api/order', orderRoutes);

// Thêm route cho đường dẫn gốc '/'
app.get('/', (req, res) => {
    res.send('Welcome to LearnUp API');
});
  
// Thêm catch-all route cho các yêu cầu không xác định
app.use((req, res) => {
    res.status(404).send('Page not found');
});

export default app;
