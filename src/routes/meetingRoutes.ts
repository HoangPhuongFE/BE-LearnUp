import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { checkPermission } from '../middlewares/permissionMiddleware';
import {
    createMeeting,
    getMeetings,
    getMeetingById,
    updateMeeting,
    deleteMeeting
} from '../controllers/meetingController';

const router = express.Router();

// Tạo buổi học mới
router.post('/', protect, checkPermission('manage_meetings'), createMeeting);

// Lấy danh sách tất cả buổi học
router.get('/', getMeetings);

// Lấy buổi học theo ID
router.get('/:meetingId', protect, getMeetingById);

// Cập nhật buổi học
router.put('/:meetingId', protect, checkPermission('manage_meetings'), updateMeeting);

// Xóa buổi học
router.delete('/:meetingId', protect, checkPermission('manage_meetings'), deleteMeeting);

export default router;
