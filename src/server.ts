import http from 'http';
import https from 'https';
import fs from 'fs';
import app from './app';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 8080;

let server;
if (process.env.NODE_ENV === 'production') {
  // Sử dụng HTTPS trên server sản xuất (VPS)
  const sslOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/learnup.work/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/learnup.work/fullchain.pem')
  };
  server = https.createServer(sslOptions, app);
  console.log('Running with HTTPS');
} else {
  // Sử dụng HTTP cho phát triển cục bộ
  server = http.createServer(app);
  console.log('Running with HTTP');
}

// Thiết lập Socket.IO với server
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? 'https://learnup.work' : 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Lắng nghe cổng
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
