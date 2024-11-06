import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import * as ChatController from '../controllers/chatController';

const router = express.Router();

// Tạo tin nhắn
router.post('/messages', protect, ChatController.createMessage);

// Lấy tất cả tin nhắn
router.get('/messages', ChatController.getAllMessages);

// Lấy tin nhắn theo ID
router.get('/messages/:messageId', protect, ChatController.getMessageById);

// Cập nhật tin nhắn
router.put('/messages/:messageId', protect, ChatController.updateMessage);

// Xóa tin nhắn
router.delete('/messages/:messageId', protect, ChatController.deleteMessage);

export default router;
