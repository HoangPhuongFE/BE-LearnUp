"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const evaluationController_1 = require("../controllers/evaluationController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const permissionMiddleware_1 = require("../middlewares/permissionMiddleware");
const router = express_1.default.Router({ mergeParams: true });
// Người dùng có thể xem evaluation
router.get('/', evaluationController_1.getEvaluationsByMedia);
// Các tuyến đường bảo vệ với kiểm tra quyền
router.post('/', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('create_evaluation'), evaluationController_1.createOrUpdateEvaluation);
router.delete('/:evaluationId', authMiddleware_1.protect, (0, permissionMiddleware_1.checkPermission)('delete_evaluation'), evaluationController_1.deleteEvaluation);
exports.default = router;
