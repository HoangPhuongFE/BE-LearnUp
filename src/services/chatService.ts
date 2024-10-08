import Message from '../models/Message';

// Lưu tin nhắn mới
export const saveMessage = async (sender: string, content: string) => {
  const newMessage = new Message({
    sender,
    content,
  });
  return await newMessage.save();
};

// Lấy tất cả tin nhắn
export const getAllMessages = async () => {
  return await Message.find().populate('sender', 'name');
};

// Lấy tin nhắn theo ID
export const getMessageById = async (messageId: string) => {
  return await Message.findById(messageId).populate('sender', 'name');
};

// Cập nhật tin nhắn
export const updateMessage = async (messageId: string, newContent: string) => {
  return await Message.findByIdAndUpdate(messageId, { content: newContent, updatedAt: new Date() }, { new: true });
};

// Xóa tin nhắn
export const deleteMessage = async (messageId: string) => {
  return await Message.findByIdAndDelete(messageId);
};
