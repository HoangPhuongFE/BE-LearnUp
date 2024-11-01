"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const socket_io_1 = require("socket.io");
const PORT = process.env.PORT || 8080;
// Khởi tạo HTTP server
const server = http_1.default.createServer(app_1.default);
// Thiết lập Socket.IO với server
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? 'http://learnup.work' : 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});
// Lắng nghe cổng
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
