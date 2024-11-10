import express from 'express';
import { registerUser, loginUserController, forgetPassword, resetPassword, updateUser , getUserById, getUserInfo} from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';
import { verifyToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUserController);
router.post('/forget-password', forgetPassword);
router.put('/reset-password/:token', resetPassword);

router.put('/update/:id',protect, updateUser);
router.get('/user/:id', getUserById);

router.get('/user-info', protect, getUserInfo);



export default router;
