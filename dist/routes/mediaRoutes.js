"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mediaController_1 = require("../controllers/mediaController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const permissionMiddleware_1 = require("../middlewares/permissionMiddleware");
const feedbackRoutes_1 = __importDefault(require("../routes/feedbackRoutes"));
const evaluationRoutes_1 = __importDefault(require("../routes/evaluationRoutes"));
const router = express_1.default.Router();
// Các tuyến đường công khai cho người dùng xem
router.get('/allmedia', mediaController_1.getAllMedia);
router.get('/:id', mediaController_1.getMediaById);
// Các tuyến đường bảo vệ với kiểm tra quyền
router.post('/', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_media'), mediaController_1.createMedia);
router.put('/update/:id', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_media'), mediaController_1.updateMedia);
router.delete('/delete/:id', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('manage_media'), mediaController_1.deleteMedia);
// Các tuyến đường lồng cho feedback và evaluation
router.use('/:mediaId/feedback', authMiddleware_1.protect, feedbackRoutes_1.default);
router.use('/:mediaId/evaluation', authMiddleware_1.protect, evaluationRoutes_1.default);
exports.default = router;
