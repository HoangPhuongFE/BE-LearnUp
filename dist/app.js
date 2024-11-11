"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan")); // Thêm morgan
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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors = require('cors');
// Kết nối cơ sở dữ liệu
(0, database_1.default)();
const app = (0, express_1.default)();
// Sử dụng morgan để log các request
app.use((0, morgan_1.default)('dev')); // Thêm dòng này
const allowedOrigins = ['http://localhost:5173',
    'https://exe-201-project.vercel.app',
    'https://learnup.work'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Cho phép nguồn hợp lệ
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
}));
app.use(express_1.default.json()); // Để xử lý JSON request body
// Sử dụng file tĩnh từ thư mục 'public'
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Các route của ứng dụng
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
app.use("/api/payment", payment_routes_1.default);
app.use('/api/media', mediaRoutes_1.default);
app.use('/api/evaluation', evaluationRoutes_1.default);
app.use('/api/feedback', feedbackRoutes_1.default);
// Thêm route cho đường dẫn gốc '/'
app.get('/', (req, res) => {
    res.send('Welcome to LearnUp API');
});
// Thêm catch-all route cho các yêu cầu không xác định
app.use((req, res) => {
    res.status(404).send('Page not found');
});
exports.default = app;
