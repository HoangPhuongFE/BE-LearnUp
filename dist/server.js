"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const app_1 = __importDefault(require("./app"));
const socket_io_1 = require("socket.io");
const PORT = process.env.PORT || 8080;
let server;
if (process.env.NODE_ENV === 'production') {
    // Sử dụng HTTPS trên server sản xuất (VPS)
    const sslOptions = {
        key: fs_1.default.readFileSync('/etc/letsencrypt/live/learnup.work/privkey.pem'),
        cert: fs_1.default.readFileSync('/etc/letsencrypt/live/learnup.work/fullchain.pem')
    };
    server = https_1.default.createServer(sslOptions, app_1.default);
    console.log('Running with HTTPS');
}
else {
    // Sử dụng HTTP cho phát triển cục bộ
    server = http_1.default.createServer(app_1.default);
    console.log('Running with HTTP');
}
// Thiết lập Socket.IO với server
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? 'https://learnup.work' : 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});
// Lắng nghe cổng
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
