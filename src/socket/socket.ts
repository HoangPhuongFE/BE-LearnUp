import { Server } from 'socket.io';
import * as ChatService from '../services/chatService';

// Tạo một danh sách các từ ngữ không phù hợp
const blacklist = ['badword1', 'badword2', 'badword3'];

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Khi người dùng gửi tin nhắn
    socket.on('sendMessage', async (data) => {
      const { senderId, content } = data;

      // Kiểm tra nội dung tin nhắn với danh sách từ bị cấm
      const containsProfanity = blacklist.some(word => content.includes(word));
      if (containsProfanity) {
        return socket.emit('errorMessage', 'Tin nhắn có chứa nội dung không phù hợp');
      }

      // Lưu tin nhắn vào cơ sở dữ liệu
      const savedMessage = await ChatService.saveMessage(senderId, content);

      // Phát tin nhắn đến tất cả client
      io.emit('receiveMessage', savedMessage);
    });

    // Khi người dùng ngắt kết nối
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
