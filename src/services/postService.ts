
import FuzzySearch from 'fuzzy-search';
import Post  from '../models/Post';
import mongoose from 'mongoose';

export const createPost = async (title: string, content: string, tags: string[], authorId: string) => {
  // Kiểm tra xem authorId có phải là ObjectId hợp lệ không
  if (!mongoose.Types.ObjectId.isValid(authorId)) {
    throw new Error('Invalid author ID');
  }

  const post = new Post({
    title,
    content,
    tags,
    authorId: new mongoose.Types.ObjectId(authorId)  // Đảm bảo là ObjectId
  });

  await post.save();
  return post;
};


export const getPosts = async () => {
  return await Post.find().populate('authorId', 'name');
};

export const updatePost = async (postId: string, updateData: object) => {
  return await Post.findByIdAndUpdate(postId, updateData, { new: true });
};

export const deletePost = async (postId: string) => {
  return await Post.findByIdAndDelete(postId);
};


// Tìm kiếm bài viết
export const searchPosts = async (query: string, tags: string[]): Promise<any> => {
  const filter: any = {};

  // Nếu người dùng nhập từ khóa tìm kiếm
  if (query) {
    // Sử dụng $regex để tìm kiếm gần đúng
    filter.$or = [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
      { tags: { $regex: query, $options: 'i' } }
    ];
  }

  // Nếu người dùng nhập hashtag cụ thể
  if (tags && tags.length > 0) {
    filter.tags = { $in: tags };
  }

  const posts = await Post.find(filter).sort({ createdAt: -1 }).exec();

  // Nếu không có kết quả, sử dụng FuzzySearch để gợi ý
  if (posts.length === 0 && query) {
    const allPosts = await Post.find().exec(); // Lấy tất cả bài viết
    const searcher = new FuzzySearch(allPosts, ['title', 'tags'], {
      caseSensitive: false,
      sort: true,
    });

    const fuzzyResults = searcher.search(query); // Gợi ý tìm kiếm
    return { suggestions: fuzzyResults };
  }

  return posts;
};
