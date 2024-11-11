import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import * as mediaService from '../services/mediaService';

// Tạo mới media
export const createMedia = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, url } = req.body;
    const userId = req.user?._id;

    const media = await mediaService.createMedia({ title, description, url, user: userId });

    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi tạo media', error });
  }
};

// Lấy tất cả media
export const getAllMedia = async (req: AuthRequest, res: Response) => {
  try {
    const mediaList = await mediaService.getAllMedia();
    res.json(mediaList);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách media', error });
  }
};

// Lấy media theo ID
export const getMediaById = async (req: AuthRequest, res: Response) => {
  try {
    const media = await mediaService.getMediaById(req.params.id);

    if (!media) {
      return res.status(404).json({ message: 'Media không tồn tại' });
    }

    res.json(media);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy media', error });
  }
};

// Cập nhật media
export const updateMedia = async (req: AuthRequest, res: Response) => {
  try {
    const mediaId = req.params.id;
    const userId = req.user?._id;
    const { title, description, url } = req.body;

    const media = await mediaService.getMediaById(mediaId);
    if (!media) {
      return res.status(404).json({ message: 'Media không tồn tại' });
    }

    // Kiểm tra quyền sở hữu hoặc vai trò admin
    if (media.user.toString() !== userId?.toString() && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này' });
    }

    const updatedMedia = await mediaService.updateMedia(mediaId, { title, description, url });
    res.json(updatedMedia);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật media', error });
  }
};

// Xóa media
export const deleteMedia = async (req: AuthRequest, res: Response) => {
  try {
    const mediaId = req.params.id;
    const userId = req.user?._id;

    const media = await mediaService.getMediaById(mediaId);
    if (!media) {
      return res.status(404).json({ message: 'Media không tồn tại' });
    }

    // Kiểm tra quyền sở hữu hoặc vai trò admin
    if (media.user.toString() !== userId?.toString() && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này' });
    }

    await mediaService.deleteMedia(mediaId);
    res.json({ message: 'Đã xóa media' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa media', error });
  }
};
