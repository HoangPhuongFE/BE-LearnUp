import Like from '../models/Like';

export const toggleLike = async (postId: string, userId: string, type: string) => {
  const existingLike = await Like.findOne({ postId, userId });
  if (existingLike) {
    await existingLike.deleteOne();
    return null;
  }

  const newLike = new Like({ postId, userId, type });
  await newLike.save();
  return newLike;
};


export const getLikesByPost = async (postId: string) => {
  return await Like.find({ postId });
};
