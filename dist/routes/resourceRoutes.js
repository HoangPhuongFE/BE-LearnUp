"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resourceController_1 = require("../controllers/resourceController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const permissionMiddleware_1 = require("../middlewares/permissionMiddleware");
const router = express_1.default.Router();
// Lấy tất cả tài liệu với phân trang
router.get('/all-resources', authMiddleware_1.protect, resourceController_1.getAllResources);
// fix lỗi id không trùng với id của video
// Tạo tài liệu mới cho môn học
router.post('/:subjectId/resources', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_resources'), resourceController_1.addResourceToSubject);
// Lấy danh sách tài liệu của môn học với phân trang
router.get('/:subjectId/resources', authMiddleware_1.protect, resourceController_1.getResourcesForSubject);
// Cập nhật tài liệu
router.put('/:id', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_resources'), resourceController_1.updateResource);
// Xóa tài liệu
router.delete('/:id', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_resources'), resourceController_1.deleteResource);
// Tạo video mới
router.post('/upload-video', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_videos'), resourceController_1.uploadVideo);
// Cập nhật video
router.put('/videos/:id', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_videos'), resourceController_1.updateVideo);
// Xóa video
router.delete('/videos/:id', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_videos'), resourceController_1.deleteVideo);
// Lấy danh sách video
router.get('/videos', authMiddleware_1.protect, resourceController_1.getAllVideos);
// Lấy video theo id
router.get('/videos/:id', authMiddleware_1.protect, resourceController_1.getVideoById);
// Lấy tài liệu theo id
router.get('/:id', authMiddleware_1.protect, resourceController_1.getResourceById);
exports.default = router;
