import express from 'express';
import { registerUser, loginUserController, forgetPassword, resetPassword, updateUser , getUserById } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUserController);
router.post('/forget-password', forgetPassword);
router.put('/reset-password/:token', resetPassword);

router.put('/update/:id', updateUser);
router.get('/user/:id', getUserById);



export default router;
