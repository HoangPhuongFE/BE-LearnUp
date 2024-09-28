import { Request, Response } from 'express';
import * as LikeService from '../services/likeService';

// Thích hoặc không thích một bài viết
export const toggleLike = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const userId = req.user?.id;
  const { type } = req.body; // 'like' hoặc 'dislike'

  try {
    const like = await LikeService.toggleLike(postId, userId, type);
    res.status(201).json(like);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error toggling like', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
};

// Lấy tất cả likes cho một bài viết
export const getLikesByPost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const likes = await LikeService.getLikesByPost(postId);
    res.status(200).json(likes);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error fetching likes', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
};
