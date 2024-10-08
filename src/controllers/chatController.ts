import { Request, Response } from 'express';
import * as ChatService from '../services/chatService';

// Tạo tin nhắn mới
export const createMessage = async (req: Request, res: Response) => {
  const { content } = req.body;
  const senderId = req.user?.id;

  try {
    const newMessage = await ChatService.saveMessage(senderId, content);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error creating message', error });
  }
};

// Lấy tất cả tin nhắn
export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const messages = await ChatService.getAllMessages();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
};

// Lấy tin nhắn theo ID
export const getMessageById = async (req: Request, res: Response) => {
  const { messageId } = req.params;

  try {
    const message = await ChatService.getMessageById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching message', error });
  }
};

// Cập nhật tin nhắn
export const updateMessage = async (req: Request, res: Response) => {
  const { messageId } = req.params;
  const { content } = req.body;

  try {
    const updatedMessage = await ChatService.updateMessage(messageId, content);
    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error updating message', error });
  }
};

// Xóa tin nhắn
export const deleteMessage = async (req: Request, res: Response) => {
  const { messageId } = req.params;

  try {
    const deletedMessage = await ChatService.deleteMessage(messageId);
    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error });
  }
};
