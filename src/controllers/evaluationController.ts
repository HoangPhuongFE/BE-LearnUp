import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import * as evaluationService from '../services/evaluationService';
import * as mediaService from '../services/mediaService';

import mongoose from 'mongoose';

// Trong hàm createOrUpdateEvaluation
export const createOrUpdateEvaluation = async (req: AuthRequest, res: Response) => {
  try {
    const { rating } = req.body;
    const mediaId = req.params.mediaId;
    const userId = req.user?._id;

    const media = await mediaService.getMediaById(mediaId);
    if (!media) {
      return res.status(404).json({ message: 'Media không tồn tại' });
    }

    const evaluation = await evaluationService.createOrUpdateEvaluation({
      rating,
      user: new mongoose.Types.ObjectId(userId),
      media: new mongoose.Types.ObjectId(mediaId),
    });

    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi thêm hoặc cập nhật evaluation', error });
  }
};


// Lấy evaluation cho media
export const getEvaluationsByMedia = async (req: AuthRequest, res: Response) => {
  try {
    const mediaId = req.params.mediaId;
    const evaluations = await evaluationService.getEvaluationsByMedia(mediaId);
    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy evaluation', error });
  }
};

// Xóa evaluation
export const deleteEvaluation = async (req: AuthRequest, res: Response) => {
  try {
    const evaluationId = req.params.evaluationId;
    const userId = req.user?._id;

    const evaluation = await evaluationService.getEvaluationsByMedia(evaluationId);
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation không tồn tại' });
    }

    // Kiểm tra quyền sở hữu hoặc vai trò admin
    if (evaluation[0].user.toString() !== userId?.toString() && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này' });
    }

    await evaluationService.deleteEvaluation(evaluationId);

    res.json({ message: 'Đã xóa evaluation' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa evaluation', error });
  }
};
