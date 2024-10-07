import { Request, Response } from 'express';
import * as CommentService from '../services/commentService';
import Comment from '../models/Comment';

// Tạo bình luận mới
export const createComment = async (req: Request, res: Response) => {
  const { content } = req.body;
  const { postId, videoId } = req.params;  // Lấy cả postId và videoId từ params
  const authorId = req.user?.id;

  try {
    let commentData: any = { content, authorId };

    if (postId) {
      commentData.postId = postId;
    } else if (videoId) {
      commentData.videoId = videoId;
    } else {
      return res.status(400).json({ message: 'Cần có postId hoặc videoId' });
    }

    const comment = await CommentService.createComment(commentData);
    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error creating comment', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
};

// Lấy tất cả bình luận cho một bài viết hoặc video
export const getCommentsByPostOrVideo = async (req: Request, res: Response) => {
  const { postId, videoId } = req.params;

  try {
    let comments;
    if (postId) {
      comments = await CommentService.getCommentsByPost(postId);
    } else if (videoId) {
      comments = await CommentService.getCommentsByVideo(videoId);
    } else {
      return res.status(400).json({ message: 'Cần có postId hoặc videoId' });
    }

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
  const { content } = req.body;

  try {
    const updatedComment = await CommentService.updateComment(commentId, content);
    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment không tồn tại' });
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
      return res.status(404).json({ message: 'Comment không tồn tại' });
    }
    res.status(200).json({ message: 'Comment đã được xóa thành công' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error deleting comment', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
};




// Thêm bình luận với ảnh 
export const addCommentWithImage = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { content, imageUrls } = req.body;  // FE gửi imageUrls (các URL của file đã tải lên Cloudinary)
  const userId = req.user ? req.user._id : null;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Lưu bình luận với URLs đã nhận từ FE
    const newComment = new Comment({
      postId,
      authorId: userId,
      content,
      images: imageUrls,  // Lưu URL ảnh mà FE đã gửi
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Đã xảy ra lỗi không xác định' });
    }
  }
};


// Thêm bình luận với ảnh đính kèm cho video
export const addCommentWithImageToVideo = async (req: Request, res: Response) => {
  const { videoId } = req.params;  // Lấy videoId từ URL
  const { content, imageUrls } = req.body;  // Lấy nội dung và URL ảnh từ body của request
  const userId = req.user ? req.user._id : null;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Lưu bình luận với URLs đã nhận từ FE
    const newComment = new Comment({
      videoId,
      authorId: userId,
      content,
      images: imageUrls,  // Lưu URL ảnh mà FE đã gửi
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Đã xảy ra lỗi không xác định' });
    }
  }
};
