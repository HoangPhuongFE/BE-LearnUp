"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const socket_io_1 = require("socket.io");
const socket_1 = require("./socket/socket");
// Tạo HTTP server
const PORT = process.env.PORT || 8080;
const httpServer = require('http').createServer(app_1.default);
// Tạo server Socket.IO
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
// Thiết lập socket
(0, socket_1.setupSocket)(io);
// Lắng nghe cổng
/*
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
