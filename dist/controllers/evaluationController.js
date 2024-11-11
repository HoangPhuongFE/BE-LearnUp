"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvaluation = exports.getEvaluationsByMedia = exports.createOrUpdateEvaluation = void 0;
const evaluationService = __importStar(require("../services/evaluationService"));
const mediaService = __importStar(require("../services/mediaService"));
const mongoose_1 = __importDefault(require("mongoose"));
// Trong hàm createOrUpdateEvaluation
const createOrUpdateEvaluation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { rating } = req.body;
        const mediaId = req.params.mediaId;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const media = yield mediaService.getMediaById(mediaId);
        if (!media) {
            return res.status(404).json({ message: 'Media không tồn tại' });
        }
        const evaluation = yield evaluationService.createOrUpdateEvaluation({
            rating,
            user: new mongoose_1.default.Types.ObjectId(userId),
            media: new mongoose_1.default.Types.ObjectId(mediaId),
        });
        res.json(evaluation);
    }
    catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi thêm hoặc cập nhật evaluation', error });
    }
});
exports.createOrUpdateEvaluation = createOrUpdateEvaluation;
// Lấy evaluation cho media
const getEvaluationsByMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mediaId = req.params.mediaId;
        const evaluations = yield evaluationService.getEvaluationsByMedia(mediaId);
        res.json(evaluations);
    }
    catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy evaluation', error });
    }
});
exports.getEvaluationsByMedia = getEvaluationsByMedia;
// Xóa evaluation
const deleteEvaluation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const evaluationId = req.params.evaluationId;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const evaluation = yield evaluationService.getEvaluationsByMedia(evaluationId);
        if (!evaluation) {
            return res.status(404).json({ message: 'Evaluation không tồn tại' });
        }
        // Kiểm tra quyền sở hữu hoặc vai trò admin
        if (evaluation[0].user.toString() !== (userId === null || userId === void 0 ? void 0 : userId.toString()) && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này' });
        }
        yield evaluationService.deleteEvaluation(evaluationId);
        res.json({ message: 'Đã xóa evaluation' });
    }
    catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi xóa evaluation', error });
    }
});
exports.deleteEvaluation = deleteEvaluation;
