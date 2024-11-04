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
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const database_1 = __importDefault(require("./config/database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//console.log("PAYOS_CLIENT_ID:", process.env.PAYOS_CLIENT_ID);
//console.log("PAYOS_API_KEY:", process.env.PAYOS_API_KEY);
//console.log("PAYOS_CHECKSUM_KEY:", process.env.PAYOS_CHECKSUM_KEY);
const cors = require('cors');
// Kết nối cơ sở dữ liệu
(0, database_1.default)();
const app = (0, express_1.default)();
// Sử dụng morgan để log các request
app.use((0, morgan_1.default)('dev')); // Thêm dòng này
app.use(cors({
    origin: ['http://localhost:8080', 'https://exe-201-project.vercel.app'],
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
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
app.use('/api/payment', paymentRoutes_1.default);
app.use('/api/order', orderRoutes_1.default);
// Thêm route cho đường dẫn gốc '/'
app.get('/', (req, res) => {
    res.send('Welcome to LearnUp API');
});
// Thêm catch-all route cho các yêu cầu không xác định
app.use((req, res) => {
    res.status(404).send('Page not found');
});
exports.default = app;
