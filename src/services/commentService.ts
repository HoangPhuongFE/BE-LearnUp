import Comment from '../models/Comment';



export const createComment = async (postId: string, content: string, authorId: string) => {
  const newComment = new Comment({ postId, content, authorId });
  return await newComment.save();
};

export const getCommentsByPost = async (postId: string) => {
  return await Comment.find({ postId }).populate('authorId', 'name');
};

export const updateComment = async (commentId: string, content: string) => {
  return await Comment.findByIdAndUpdate(commentId, { content }, { new: true });
};

export const deleteComment = async (commentId: string) => {
  return await Comment.findByIdAndDelete(commentId);
};
