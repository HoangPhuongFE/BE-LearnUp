import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
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
import paymentRoutes from './routes/payment.routes';
import mediaRoutes from './routes/mediaRoutes';
import evaluationRoutes from './routes/evaluationRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import connectDB from './config/database';

dotenv.config();

// Kết nối cơ sở dữ liệu
connectDB();

const app = express();

const upload = multer({ storage: multer.memoryStorage() });
app.use(upload.none()); // Xử lý các field text kèm theo file

app.use(morgan('dev'));

const allowedOrigins = [
  'http://localhost:5173',
  'https://exe-201-project.vercel.app',
  'https://learnup.work',
  'https://learnup.id.vn'
];

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[Request]: ${req.method} ${req.url}`);
  console.log(`[Request Body]:`, req.body);
  next();
});

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
app.use('/api/media', mediaRoutes);
app.use('/api/evaluation', evaluationRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to LearnUp API');
});

app.use((req: Request, res: Response) => {
  res.status(404).send('Page not found');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Unhandled Error]:', err.message || err);
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message || 'Unknown error',
  });
});

export default app;
