import http from 'http';
import app from './app';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 8080;

// Khởi tạo HTTP server
const server = http.createServer(app);

// Thiết lập Socket.IO với server
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ?[ 'http://learnup.work','https://learnup.work',  'https://learnup.id.vn'    ] : 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Lắng nghe cổng
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
///