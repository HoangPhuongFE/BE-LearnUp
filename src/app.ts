import express from 'express';
import path from 'path';
import morgan from 'morgan'; // Thêm morgan
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
import paymentRoutes from "./routes/payment.routes";
import connectDB from './config/database';
import dotenv from 'dotenv';
dotenv.config();
//console.log("PAYOS_CLIENT_ID:", process.env.PAYOS_CLIENT_ID);
//console.log("PAYOS_API_KEY:", process.env.PAYOS_API_KEY);
//console.log("PAYOS_CHECKSUM_KEY:", process.env.PAYOS_CHECKSUM_KEY);

const cors = require('cors');

// Kết nối cơ sở dữ liệu
connectDB();

const app = express();

// Sử dụng morgan để log các request
app.use(morgan('dev')); // Thêm dòng này

const allowedOrigins = ['http://localhost:5173',
   'https://exe-201-project.vercel.app', 
   'https://learnup.work'];

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Cho phép nguồn hợp lệ
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));

app.use(express.json()); // Để xử lý JSON request body

// Sử dụng file tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Các route của ứng dụng
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
app.use("/api/payment", paymentRoutes);


// Thêm route cho đường dẫn gốc '/'
app.get('/', (req, res) => {
    res.send('Welcome to LearnUp API');
});
  
// Thêm catch-all route cho các yêu cầu không xác định
app.use((req, res) => {
    res.status(404).send('Page not found');
});

export default app;
