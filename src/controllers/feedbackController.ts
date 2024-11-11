import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import * as feedbackService from '../services/feedbackService';
import * as mediaService from '../services/mediaService';
import mongoose from 'mongoose';

// Tạo feedback mới
// Trong hàm createFeedback
export const createFeedback = async (req: AuthRequest, res: Response) => {
    try {
      const { content } = req.body;
      const mediaId = req.params.mediaId;
      const userId = req.user?._id;
  
      const media = await mediaService.getMediaById(mediaId);
      if (!media) {
        return res.status(404).json({ message: 'Media không tồn tại' });
      }
  
      const feedback = await feedbackService.createFeedback({
        content,
        user: new mongoose.Types.ObjectId(userId),
        media: new mongoose.Types.ObjectId(mediaId),
      });
  
      res.status(201).json(feedback);
    } catch (error) {
      res.status(500).json({ message: 'Có lỗi xảy ra khi tạo feedback', error });
    }
  };

// Lấy feedback cho media
export const getFeedbackByMedia = async (req: AuthRequest, res: Response) => {
  try {
    const mediaId = req.params.mediaId;
    const feedbackList = await feedbackService.getFeedbackByMedia(mediaId);
    res.json(feedbackList);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy feedback', error });
  }
};

// Cập nhật feedback
export const updateFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const feedbackId = req.params.feedbackId;
    const userId = req.user?._id;
    const { content } = req.body;

    const feedback = await feedbackService.updateFeedback(feedbackId, { content });
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback không tồn tại' });
    }

    // Kiểm tra quyền sở hữu hoặc vai trò admin
    if (feedback.user.toString() !== userId?.toString() && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này' });
    }

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật feedback', error });
  }
};

// Xóa feedback
export const deleteFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const feedbackId = req.params.feedbackId;
    const userId = req.user?._id;

    const feedback = await feedbackService.updateFeedback(feedbackId, {});
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback không tồn tại' });
    }

    // Kiểm tra quyền sở hữu hoặc vai trò admin
    if (feedback.user.toString() !== userId?.toString() && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này' });
    }

    await feedbackService.deleteFeedback(feedbackId);

    res.json({ message: 'Đã xóa feedback' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa feedback', error });
  }
};
