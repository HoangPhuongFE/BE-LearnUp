import { Request, Response } from 'express';
import * as CommentService from '../services/commentService';

// Tạo bình luận mới
export const createComment = async (req: Request, res: Response) => {
  const { content } = req.body;
  const { postId } = req.params;
  const authorId = req.user?.id;

  try {
    const comment = await CommentService.createComment(postId, content, authorId);
    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error creating comment', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
};

// Lấy tất cả bình luận cho một bài viết
export const getCommentsByPost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const comments = await CommentService.getCommentsByPost(postId);
    res.status(200).json(comments);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error fetching comments', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
};

// Cập nhật bình luận
export const updateComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  try {
    const updatedComment = await CommentService.updateComment(commentId, req.body.content);
    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(200).json(updatedComment);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error updating comment', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
};

// Xóa bình luận
export const deleteComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  try {
    const deletedComment = await CommentService.deleteComment(commentId);
    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error deleting comment', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
};
