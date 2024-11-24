"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const departmentRoutes_1 = __importDefault(require("./routes/departmentRoutes"));
const semesterRoutes_1 = __importDefault(require("./routes/semesterRoutes"));
const subjectRoutes_1 = __importDefault(require("./routes/subjectRoutes"));
const resourceRoutes_1 = __importDefault(require("./routes/resourceRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const likeRoutes_1 = __importDefault(require("./routes/likeRoutes"));
const ratingRoutes_1 = __importDefault(require("./routes/ratingRoutes"));
const meetingRoutes_1 = __importDefault(require("./routes/meetingRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const mediaRoutes_1 = __importDefault(require("./routes/mediaRoutes"));
const evaluationRoutes_1 = __importDefault(require("./routes/evaluationRoutes"));
const feedbackRoutes_1 = __importDefault(require("./routes/feedbackRoutes"));
const database_1 = __importDefault(require("./config/database"));
dotenv_1.default.config();
// Kết nối cơ sở dữ liệu
(0, database_1.default)();
const app = (0, express_1.default)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
app.use(upload.none()); // Xử lý các field text kèm theo file
app.use((0, morgan_1.default)('dev'));
const allowedOrigins = [
    'http://localhost:5173',
    'https://exe-201-project.vercel.app',
    'https://learnup.work',
    'https://learnup.id.vn'
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`[Request]: ${req.method} ${req.url}`);
    console.log(`[Request Body]:`, req.body);
    next();
});
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/departments', departmentRoutes_1.default);
app.use('/api/semesters', semesterRoutes_1.default);
app.use('/api/subjects', subjectRoutes_1.default);
app.use('/api/resources', resourceRoutes_1.default);
app.use('/api/posts', postRoutes_1.default);
app.use('/api/comments', commentRoutes_1.default);
app.use('/api/likes', likeRoutes_1.default);
app.use('/api/rating', ratingRoutes_1.default);
app.use('/api/meetings', meetingRoutes_1.default);
app.use('/api/chat', chatRoutes_1.default);
app.use('/api/payment', payment_routes_1.default);
app.use('/api/media', mediaRoutes_1.default);
app.use('/api/evaluation', evaluationRoutes_1.default);
app.use('/api/feedback', feedbackRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Welcome to LearnUp API');
});
app.use((req, res) => {
    res.status(404).send('Page not found');
});
app.use((err, req, res, next) => {
    console.error('[Unhandled Error]:', err.message || err);
    res.status(500).json({
        message: 'Something went wrong!',
        error: err.message || 'Unknown error',
    });
});
exports.default = app;
