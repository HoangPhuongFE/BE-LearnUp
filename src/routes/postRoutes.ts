import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { createPost, getPosts, updatePost, deletePost , searchPosts ,getPostById } from '../controllers/postController';

const router = express.Router();

router.post('/', protect, createPost) ;
router.get('/',  getPosts);
router.put('/:postId', protect, updatePost);
router.delete('/:postId', protect, deletePost);
router.get('/search',  searchPosts);

router.get('/:postId',protect, getPostById);


export default router;
