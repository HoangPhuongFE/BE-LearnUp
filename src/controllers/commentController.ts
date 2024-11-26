import { Request, Response } from 'express';
import * as CommentService from '../services/commentService';
import Comment from '../models/Comment';

export const createComment = async (req: Request, res: Response) => {
  const { content, images } = req.body;

  // Log để debug
  console.log("Raw request body:", req.body);
  console.log("Content type:", req.headers['content-type']);
  console.log("Images before processing:", images);

  try {
    // Kiểm tra và xử lý images
    let processedImages = images;
    
    // Nếu images là string (có thể xảy ra khi gửi qua form-data), thử parse nó
    if (typeof images === 'string') {
      try {
        processedImages = JSON.parse(images);
      } catch {
        // Nếu không parse được, có thể nó đã là string array
        processedImages = [images];
      }
    }

    // Đảm bảo processedImages là array
    if (!Array.isArray(processedImages)) {
      processedImages = [processedImages].filter(Boolean);
    }

    // Làm phẳng array và loại bỏ các giá trị null/undefined/empty
    processedImages = processedImages
      .flat()
      .filter((img: string) => img && typeof img === 'string' && img.trim() !== '');

    console.log("Processed images:", processedImages);

    const comment = await Comment.create({
      content,
      images: processedImages,
      authorId: req.user?.id,
      postId: req.params.postId,
    });

    console.log("Created comment:", comment);
    return res.status(201).json(comment);

  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ 
      message: "Error creating comment",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Lấy tất cả bình luận cho một bài viết hoặc video
export const getCommentsByPost = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ postId })
      .populate('authorId', 'name') // Thêm thông tin tác giả
      .sort({ createdAt: -1 }); // Sắp xếp mới nhất trước

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Unknown error occurred', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};



export const replyToComment = async (req: Request, res: Response) => {
  const { postId, parentCommentId } = req.params;
  const { content, images } = req.body;
  const authorId = req.user?.id;

  try {
    const reply = await CommentService.replyToComment(postId, parentCommentId, authorId, content, images);
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
};


// Cập nhật bình luận
export const updateComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { content, images } = req.body; // Lấy thêm `images` từ request body
  const userId = req.user?.id; // ID người dùng hiện tại
  const userRole = req.user?.role; // Vai trò người dùng (admin hoặc user)

  try {
    // Lấy thông tin bình luận
    const comment = await CommentService.getCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment không tồn tại' });
    }

    // Kiểm tra quyền: Chỉ người tạo hoặc admin mới được cập nhật
   // if (comment.authorId.toString() !== userId && userRole !== 'admin') {
  //    return res.status(403).json({ message: 'Không có quyền cập nhật bình luận này' });
   // }

    // Thực hiện cập nhật
    const updatedComment = await CommentService.updateComment(commentId, content, images);
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};


// Xóa bình luận
export const deleteComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const userId = req.user?.id; // ID của người dùng hiện tại
  const userRole = req.user?.role; // Vai trò người dùng (admin hoặc user)

  try {
    // Lấy thông tin bình luận
    const comment = await CommentService.getCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment không tồn tại' });
    }

    // Kiểm tra quyền: Chỉ người tạo hoặc admin mới được xóa
  //  if (comment.authorId.toString() !== userId && userRole !== 'admin') {
  //    return res.status(403).json({ message: 'Không có quyền xóa bình luận này' });
 //   }

    // Thực hiện xóa bình luận
    await CommentService.deleteComment(commentId);
    res.status(200).json({ message: 'Comment đã được xóa thành công' });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
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



// Tạo bình luận cho Resource
export const createCommentForResource = async (req: Request, res: Response) => {
  const { resourceId } = req.params;
  const { content, images } = req.body;
  const authorId = req.user?.id;

  

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  try {
    const comment = await CommentService.createCommentForResource(resourceId, { 
      content, 
      authorId, 
      images 
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
};
/*
// Lấy bình luận theo Resource ID
export const getCommentsForResource = async (req: Request, res: Response) => {
  const { resourceId } = req.params;

  try {
    const comments = await CommentService.getCommentsByResource(resourceId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
};
*/
// Lấy danh sách bình luận theo cấu trúc cây
export const getCommentsForResource = async (req: Request, res: Response) => {
  const { resourceId } = req.params;

  try {
    const comments = await CommentService.getCommentsTreeForResource(resourceId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
};

// Cập nhật bình luận với kiểm tra quyền
export const updateCommentForResource = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user?.id; // ID người dùng hiện tại
  const userRole = req.user?.role; // Vai trò người dùng (admin hoặc user)

  if (!content) {
    return res.status(400).json({ message: 'Content không được để trống' });
  }

  try {
    // Lấy thông tin bình luận
    const comment = await CommentService.getCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment không tồn tại' });
    }

    // Kiểm tra quyền
    if (comment.authorId.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền cập nhật bình luận này' });
    }

    // Thực hiện cập nhật
    const updatedComment = await CommentService.updateResourceComment(commentId, content);
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};



// Xóa bình luận với kiểm tra quyền
export const deleteCommentForResource = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const userId = req.user?.id; // ID của người dùng đang đăng nhập
  const userRole = req.user?.role; // Vai trò người dùng (ví dụ: 'admin' hoặc 'user')

  try {
    // Lấy thông tin bình luận
    const comment = await CommentService.getCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment không tồn tại' });
    }

    // Kiểm tra quyền
    if (comment.authorId.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền xóa bình luận này' });
    }

    // Xóa bình luận (và các bình luận con)
    const deletedComment = await CommentService.deleteResourceComment(commentId);
    res.status(200).json({ message: 'Comment và các trả lời của nó đã được xóa', deletedComment });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};



export const getAllCommentsForResource = async (req: Request, res: Response) => {
  const { resourceId } = req.params;

  console.log('Resource ID:', resourceId); // Log resourceId để kiểm tra

  try {
    const comments = await Comment.find({ resourceId }).populate('authorId', 'name');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
};

// Trả lời bình luận
export const replyToCommentForResource = async (req: Request, res: Response) => {
  const { resourceId, parentCommentId } = req.params;
  const { content, images } = req.body;
  const authorId = req.user?.id;

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  try {
    const replyComment = await CommentService.replyToCommentForResource(resourceId, parentCommentId, {
      content,
      authorId,
      images,
    });
    res.status(201).json(replyComment);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};


// Tạo bình luận cho Subject
// Controller: Tạo bình luận cho Subject (môn học)
export const createCommentSubject = async (req: Request, res: Response) => {
  const { subjectId } = req.params;  // Lấy subjectId từ params
  const { content, images } = req.body;  // Lấy nội dung và hình ảnh từ body
  const authorId = req.user?.id;  // Lấy authorId từ user đã xác thực (middleware protect)

  // Kiểm tra nếu không có nội dung
  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  try {
    // Tạo comment mới và lưu vào DB
    const comment = await CommentService.createCommentSubject(subjectId, authorId, content, images);
    return res.status(201).json(comment);  // Trả về comment vừa tạo
  } catch (error) {
    console.error('Error creating comment:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// Lấy danh sách bình luận cho Subject
 // Controller: Lấy danh sách bình luận cho Subject (môn học)
export const getCommentsBySubject = async (req: Request, res: Response) => {
  const { subjectId } = req.params;  // Lấy subjectId từ params

  try {
    // Lấy danh sách bình luận từ DB
    const comments = await CommentService.getCommentsBySubject(subjectId);
    return res.status(200).json(comments);  // Trả về danh sách bình luận
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};



// Controller: Cập nhật bình luận cho Subject (môn học)
export const updateCommentSubject = async (req: Request, res: Response) => {
  const { commentId } = req.params;  // Lấy commentId từ params
  const { content, images } = req.body;  // Lấy nội dung và hình ảnh từ body

  try {
    // Cập nhật bình luận trong DB
    const updatedComment = await CommentService.updateCommentSubject(commentId, content, images);
    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    return res.status(200).json(updatedComment);  // Trả về bình luận đã cập nhật
  } catch (error) {
    console.error('Error updating comment:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};


// Controller: Xóa bình luận cho Subject (môn học)
export const deleteCommentSubject = async (req: Request, res: Response) => {
  const { commentId } = req.params;  // Lấy commentId từ params

  try {
    // Tìm các bình luận con (trả lời) nếu có
    const comment = await CommentService.deleteCommentSubject(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    return res.status(200).json({ message: 'Comment has been deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};


// Controller: Trả lời bình luận cho Subject (môn học)
export const replyToCommentSubject = async (req: Request, res: Response) => {
  const { subjectId, parentCommentId } = req.params;  // Lấy subjectId và parentCommentId từ params
  const { content, images } = req.body;  // Lấy nội dung và hình ảnh từ body
  const authorId = req.user?.id;  // Lấy authorId từ user đã xác thực

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  try {
    // Tạo reply và lưu vào DB
    const replyComment = await CommentService.replyToCommentSubject(subjectId, parentCommentId, authorId, content, images);
    return res.status(201).json(replyComment);  // Trả về reply đã tạo
  } catch (error) {
    console.error('Error replying to comment:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};
