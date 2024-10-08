import { Server } from 'socket.io';
import * as ChatService from '../services/chatService';

// Tạo một danh sách các từ ngữ không phù hợp
const blacklist = [
  'địt', 'cặc', 'lồn', 'chó', 'đĩ', 'mẹ mày', 'bố mày', 'thằng ngu', 
  'đồ ngu', 'vãi lồn', 'vãi đái', 'óc chó', 'đụ má', 'con mẹ mày', 
  'khốn nạn', 'vô học', 'mất dạy', 'chết tiệt', 'fuck', 'duma', 
  'vl', 'dm', 'cc', 'clgt'
];
export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Khi người dùng gửi tin nhắn
    socket.on('sendMessage', async (data) => {
      const { senderId, content } = data;

      // Kiểm tra và thay thế từ nhạy cảm
      let cleanContent = content;
      blacklist.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');  // Tạo một biểu thức chính quy để tìm từ cần thay thế
        cleanContent = cleanContent.replace(regex, '****');  // Thay thế từ bằng dấu sao
      });

      // Lưu tin nhắn đã được kiểm duyệt vào cơ sở dữ liệu
      const savedMessage = await ChatService.saveMessage(senderId, cleanContent);

      // Phát tin nhắn đã được kiểm duyệt đến tất cả client
      io.emit('receiveMessage', savedMessage);
    });

    // Khi người dùng ngắt kết nối
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
