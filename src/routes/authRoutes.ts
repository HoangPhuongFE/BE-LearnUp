import express from 'express';
import { registerUser, loginUserController, forgetPassword, resetPassword } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUserController);
router.post('/forget-password', forgetPassword);
router.put('/reset-password/:token', resetPassword);

export default router;
