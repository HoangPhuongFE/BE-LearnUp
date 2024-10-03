import { Request, Response } from 'express';
import * as PostService from '../services/postService';

export const createPost = async (req: Request, res: Response) => {
  const { title, content, tags } = req.body;
  const authorId = req.user?.id;  

  try {
    const post = await PostService.createPost(title, content, tags, authorId);
    res.status(201).json(post);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error creating post', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
};



// Lấy danh sách bài viết
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await PostService.getPosts();
    res.status(200).json(posts);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error fetching posts', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};

// Cập nhật bài viết
export const updatePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const updatedPost = await PostService.updatePost(postId, req.body);
    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error updating post', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};

// Xóa bài viết
export const deletePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const deletedPost = await PostService.deletePost(postId);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error deleting post', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};


// Tìm kiếm bài viết
export const searchPosts = async (req: Request, res: Response) => {
  const { query, tags } = req.query; // Query và tags từ request query

  try {
    const posts = await PostService.searchPosts(query as string, (tags as string)?.split(',') || []);
    res.status(200).json(posts);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error searching posts', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
};