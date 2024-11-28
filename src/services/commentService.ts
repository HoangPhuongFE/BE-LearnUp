import Comment from '../models/Comment';

// Tạo bình luận mới
export const createComment = async (
  postId: string,
  authorId: string,
  content: string,
  images: string[] = [] // Mặc định là mảng rỗng
) => {
  const newComment = new Comment({
    postId,
    authorId,
    content,
    images,
  });

  return await newComment.save();
};


// Lấy bình luận theo postId
export const getCommentsByPost = async (postId: string) => {
  return await Comment.find({ postId }).populate('authorId', 'name');
};
export const replyToComment = async (postId: string, parentCommentId: string, authorId: string, content: string, images?: string[]) => {
  const reply = new Comment({
    postId,
    parentCommentId,
    authorId,
    content,
    images: images || [],
  });
  return await reply.save();
};





// Cập nhật bình luận
export const updateComment = async (commentId: string, content?: string, images?: string[]) => {
  const updateData: any = {
    updatedAt: new Date(),
  };

  if (content) updateData.content = content;
  if (images) updateData.images = images;

  return await Comment.findByIdAndUpdate(
    commentId,
    updateData,
    { new: true } // Trả về dữ liệu đã cập nhật
  );
};



export const deleteComment = async (commentId: string) => {
  const childComments = await Comment.find({ parentCommentId: commentId });
  for (const child of childComments as { _id: string }[]) {
    await deleteComment(child._id.toString());
  }
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
/*

// Lấy danh sách bình luận theo Resource ID
export const getCommentsByResource = async (resourceId: string) => {
  return await Comment.find({ resourceId }).populate('authorId', 'name'); // Liên kết với tác giả
};
*/

// Xóa bình luận và tất cả bình luận con
export const deleteResourceComment = async (commentId: string) => {
  // Tìm tất cả các bình luận con liên quan đến commentId
  const childComments = await Comment.find({ parentCommentId: commentId });

  // Xóa từng bình luận con và các bình luận con của nó (đệ quy)
  for (const childComment of childComments) {
    await deleteResourceComment((childComment._id as string).toString());
  }

  // Cuối cùng xóa bình luận hiện tại (cha)
  return await Comment.findByIdAndDelete(commentId);
};

// Cập nhật bình luận theo ID
export const updateResourceComment = async (commentId: string, content: string) => {
  return await Comment.findByIdAndUpdate(
    commentId,
    { content, updatedAt: new Date() }, // Cập nhật nội dung và thời gian
    { new: true } // Trả về dữ liệu đã cập nhật
  );
};




// Trả lời bình luận cho Resource
export const replyToCommentForResource = async (
  resourceId: string,
  parentCommentId: string,
  commentData: { content: string; authorId: string; images?: string[] }
) => {
  if (!resourceId || !parentCommentId) {
    throw new Error('Resource ID and Parent Comment ID are required');
  }

  const replyComment = new Comment({
    resourceId,
    parentCommentId,
    content: commentData.content,
    authorId: commentData.authorId,
    images: commentData.images || [],
  });

  try {
    return await replyComment.save();
  } catch (error) {
    throw new Error('Failed to reply to comment: ' + (error as Error).message);
  }
};

// Lấy danh sách bình luận dạng cây cho Resource
export const getCommentsTreeForResource = async (resourceId: string) => {
  // Lấy bình luận gốc
  const rootComments = await Comment.find({ resourceId, parentCommentId: null }).populate('authorId', 'name');

  // Lấy tất cả trả lời
  const replies = await Comment.find({ resourceId, parentCommentId: { $ne: null } }).populate('authorId', 'name');

  // Xây dựng cây bình luận
  const commentTree = rootComments.map((comment: any) => {
    const commentReplies = replies.filter((reply) => reply.parentCommentId?.toString() === comment._id.toString());
    return { ...comment.toObject(), replies: commentReplies };
  });

  return commentTree;
};

// Lấy thông tin bình luận theo ID
export const getCommentById = async (commentId: string) => {
  return await Comment.findById(commentId).populate('authorId', 'name role'); // Có thể lấy thêm thông tin người tạo
};



// Create a comment for a subject
export const createCommentForSubject = async (
  subjectId: string,
  commentData: { content: string; authorId: string; images?: string[] }
) => {
  if (!subjectId) {
    throw new Error('Subject ID is required');
  }
  if (!commentData.content || typeof commentData.content !== 'string') {
    throw new Error('Content is required and must be a string');
  }
  if (!commentData.authorId) {
    throw new Error('Author ID is required');
  }

  const comment = new Comment({
    subjectId,
    content: commentData.content,
    authorId: commentData.authorId,
    images: commentData.images || [],
  });

  return await comment.save();
};

// Get comments for a subject
export const getCommentsBySubject = async (subjectId: string) => {
  return await Comment.find({ subjectId, parentCommentId: null }).populate('authorId', 'name');
};

// Reply to a comment on a subject
export const replyToCommentForSubject = async (
  subjectId: string,
  parentCommentId: string,
  commentData: { content: string; authorId: string; images?: string[] }
) => {
  if (!subjectId || !parentCommentId) {
    throw new Error('Subject ID and Parent Comment ID are required');
  }

  const replyComment = new Comment({
    subjectId,
    parentCommentId,
    content: commentData.content,
    authorId: commentData.authorId,
    images: commentData.images || [],
  });

  return await replyComment.save();
};

// Update a comment for a subject
export const updateSubjectComment = async (commentId: string, content: string, images?: string[]) => {
  const updateData: any = { content, updatedAt: new Date() };
  if (images) updateData.images = images;

  return await Comment.findByIdAndUpdate(commentId, updateData, { new: true });
};

// Delete a comment and its replies for a subject
export const deleteSubjectComment = async (commentId: string) => {
  const childComments = await Comment.find({ parentCommentId: commentId });
  for (const child of childComments as { _id: string }[]) {
    await deleteSubjectComment(child._id.toString());
  }
  return await Comment.findByIdAndDelete(commentId);
};
