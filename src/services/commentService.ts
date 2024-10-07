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
