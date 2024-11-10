"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/register', authController_1.registerUser);
router.post('/login', authController_1.loginUserController);
router.post('/forget-password', authController_1.forgetPassword);
router.put('/reset-password/:token', authController_1.resetPassword);
router.put('/update/:id', authMiddleware_1.protect, authController_1.updateUser);
router.get('/user/:id', authController_1.getUserById);
router.get('/user-info', authMiddleware_1.protect, authController_1.getUserInfo);
exports.default = router;
