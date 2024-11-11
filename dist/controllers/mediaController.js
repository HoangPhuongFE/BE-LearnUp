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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMedia = exports.updateMedia = exports.getMediaById = exports.getAllMedia = exports.createMedia = void 0;
const mediaService = __importStar(require("../services/mediaService"));
// Tạo mới media
const createMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, url } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const media = yield mediaService.createMedia({ title, description, url, user: userId });
        res.status(201).json(media);
    }
    catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi tạo media', error });
    }
});
exports.createMedia = createMedia;
// Lấy tất cả media
const getAllMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mediaList = yield mediaService.getAllMedia();
        res.json(mediaList);
    }
    catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách media', error });
    }
});
exports.getAllMedia = getAllMedia;
// Lấy media theo ID
const getMediaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const media = yield mediaService.getMediaById(req.params.id);
        if (!media) {
            return res.status(404).json({ message: 'Media không tồn tại' });
        }
        res.json(media);
    }
    catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy media', error });
    }
});
exports.getMediaById = getMediaById;
// Cập nhật media
const updateMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const mediaId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { title, description, url } = req.body;
        const media = yield mediaService.getMediaById(mediaId);
        if (!media) {
            return res.status(404).json({ message: 'Media không tồn tại' });
        }
        // Kiểm tra quyền sở hữu hoặc vai trò admin
        if (media.user.toString() !== (userId === null || userId === void 0 ? void 0 : userId.toString()) && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này' });
        }
        const updatedMedia = yield mediaService.updateMedia(mediaId, { title, description, url });
        res.json(updatedMedia);
    }
    catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật media', error });
    }
});
exports.updateMedia = updateMedia;
// Xóa media
const deleteMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const mediaId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const media = yield mediaService.getMediaById(mediaId);
        if (!media) {
            return res.status(404).json({ message: 'Media không tồn tại' });
        }
        // Kiểm tra quyền sở hữu hoặc vai trò admin
        if (media.user.toString() !== (userId === null || userId === void 0 ? void 0 : userId.toString()) && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này' });
        }
        yield mediaService.deleteMedia(mediaId);
        res.json({ message: 'Đã xóa media' });
    }
    catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi xóa media', error });
    }
});
exports.deleteMedia = deleteMedia;
