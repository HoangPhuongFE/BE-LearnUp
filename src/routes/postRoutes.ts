import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { createPost, getPosts, updatePost, deletePost , searchPosts ,getPostById } from '../controllers/postController';
import { checkPermission } from '../middlewares/permissionMiddleware';
const router = express.Router();

router.post('/', protect,checkPermission('manage_post'), createPost) ;
router.get('/',  getPosts);
router.put('/:postId', protect,checkPermission('manage_post'), updatePost);
router.delete('/:postId', protect,checkPermission('manage_post'), deletePost);
router.get('/search',  searchPosts);

router.get('/:postId',protect, getPostById);


export default router;
