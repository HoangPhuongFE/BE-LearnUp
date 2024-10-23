import app from './app';
import { Server } from 'socket.io';
import { setupSocket } from './socket/socket';

// Tạo HTTP server
const PORT = process.env.PORT || 4000;
const httpServer = require('http').createServer(app);

// Tạo server Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Thiết lập socket
setupSocket(io);

// Lắng nghe cổng
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
