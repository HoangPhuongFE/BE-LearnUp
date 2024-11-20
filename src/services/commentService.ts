import Comment from '../models/Comment';

// Tạo bình luận mới
export const createComment = async (commentData: { postId?: string, videoId?: string, content: string, authorId: string }) => {
  const { postId, videoId, content, authorId } = commentData;

  const newComment = new Comment({
    postId,
    videoId,
    content,
    authorId,
  });

  return await newComment.save();
};

// Lấy bình luận theo postId
export const getCommentsByPost = async (postId: string) => {
  return await Comment.find({ postId }).populate('authorId', 'name');
};

// Lấy bình luận theo videoId
export const getCommentsByVideo = async (videoId: string) => {
  return await Comment.find({ videoId }).populate('authorId', 'name');
};

// Cập nhật bình luận
export const updateComment = async (commentId: string, content: string) => {
  return await Comment.findByIdAndUpdate(commentId, { content }, { new: true });
};

// Xóa bình luận
export const deleteComment = async (commentId: string) => {
  return await Comment.findByIdAndDelete(commentId);
};



// Tạo bình luận cho Resource
export const createCommentForResource = async (
  resourceId: string,
  commentData: { content: string; authorId: string; images?: string[] }
) => {
  // Kiểm tra dữ liệu đầu vào
  if (!resourceId) {
    throw new Error('Resource ID is required');
  }
  if (!commentData.content || typeof commentData.content !== 'string') {
    throw new Error('Content is required and must be a string');
  }
  if (!commentData.authorId) {
    throw new Error('Author ID is required');
  }

  // Tạo bình luận
  const comment = new Comment({
    resourceId,
    content: commentData.content,
    authorId: commentData.authorId,
    images: commentData.images || [], // Mặc định là mảng rỗng nếu không có hình ảnh
  });

  // Lưu bình luận vào MongoDB
  try {
    return await comment.save();
  } catch (error) {
    throw new Error('Failed to create comment: ' + (error as Error).message);
  }
};


// Lấy danh sách bình luận theo Resource ID
export const getCommentsByResource = async (resourceId: string) => {
  return await Comment.find({ resourceId }).populate('authorId', 'name'); // Liên kết với tác giả
};

// Cập nhật bình luận
export const updateResourceComment = async (commentId: string, content: string) => {
  return await Comment.findByIdAndUpdate(commentId, { content, updatedAt: new Date() }, { new: true });
};

// Xóa bình luận
export const deleteResourceComment = async (commentId: string) => {
  return await Comment.findByIdAndDelete(commentId);
};
