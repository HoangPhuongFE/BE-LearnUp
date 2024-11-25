"use strict";
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
exports.getAllResources = exports.getResourceById = exports.getVideoById = exports.getAllVideos = exports.deleteVideo = exports.updateVideo = exports.uploadVideo = exports.deleteResource = exports.updateResource = exports.getResourcesForSubject = exports.addResourceToSubject = void 0;
const Resource_1 = __importDefault(require("../models/Resource"));
const resourceService_1 = require("../services/resourceService");
// Thêm tài liệu vào môn học
const addResourceToSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subjectId } = req.params;
    const { title, description, fileUrls, type, allowedRoles } = req.body;
    try {
        const resource = yield (0, resourceService_1.createResource)(subjectId, title, description, fileUrls, type, allowedRoles); // Tạo tài liệu mới
        res.status(201).json(resource); // Trả về tài liệu vừa tạo
    }
    catch (error) {
        res.status(500).json({ message: error.message }); // Xử lý lỗi
    }
});
exports.addResourceToSubject = addResourceToSubject;
// Lấy danh sách tài liệu với phân trang
const getResourcesForSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subjectId } = req.params;
    try {
        const resourcesData = yield (0, resourceService_1.getResources)(subjectId); // Gọi service mà không truyền page và limit
        res.status(200).json(resourcesData); // Trả về toàn bộ dữ liệu
    }
    catch (error) {
        res.status(500).json({ message: error.message }); // Xử lý lỗi
    }
});
exports.getResourcesForSubject = getResourcesForSubject;
// Cập nhật tài liệu
const updateResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, fileUrls, type, allowedRoles } = req.body;
    try {
        const resource = yield (0, resourceService_1.updateResource)(id, {
            title,
            description,
            fileUrls,
            type,
            allowedRoles,
        }); // Cập nhật tài liệu
        if (!resource)
            return res.status(404).json({ message: 'Tài liệu không tồn tại' });
        res.status(200).json(resource); // Trả về tài liệu vừa cập nhật
    }
    catch (error) {
        res.status(500).json({ message: error.message }); // Xử lý lỗi
    }
});
exports.updateResource = updateResource;
// Xóa tài liệu
const deleteResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const resource = yield (0, resourceService_1.deleteResource)(id); // Gọi hàm từ service để xóa tài liệu
        if (!resource)
            return res.status(404).json({ message: 'Tài liệu không tồn tại' });
        res.status(200).json({ message: 'Tài liệu đã được xóa' });
    }
    catch (error) {
        res.status(500).json({ message: error.message }); // Xử lý lỗi
    }
});
exports.deleteResource = deleteResource;
const uploadVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, youtubeUrl } = req.body; // Lấy dữ liệu từ body của request
    try {
        const newResource = new Resource_1.default({
            title,
            description,
            fileUrls: [youtubeUrl], // Lưu URL của video
            type: 'video',
        });
        yield newResource.save();
        res.status(201).json(newResource);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Đã xảy ra lỗi không xác định' });
        }
    }
});
exports.uploadVideo = uploadVideo;
const updateVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, youtubeUrl, allowedRoles } = req.body;
    try {
        // Tìm video theo ID và đảm bảo nó là loại video
        const resource = yield Resource_1.default.findById(id);
        if (!resource || resource.type !== 'video') {
            return res.status(404).json({ message: 'Video không tồn tại' });
        }
        // Cập nhật thông tin của video
        resource.title = title;
        resource.description = description;
        resource.fileUrls = [youtubeUrl];
        resource.allowedRoles = allowedRoles; // Cập nhật allowedRoles
        yield resource.save();
        res.status(200).json(resource); // Trả về video đã cập nhật
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Đã xảy ra lỗi không xác định' });
        }
    }
});
exports.updateVideo = updateVideo;
const deleteVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Tìm và xóa video dựa trên ID, đảm bảo nó là loại video
        const resource = yield Resource_1.default.findOneAndDelete({ _id: id, type: 'video' });
        if (!resource) {
            return res.status(404).json({ message: 'Video không tồn tại' });
        }
        res.status(200).json({ message: 'Video đã được xóa' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Đã xảy ra lỗi không xác định' });
        }
    }
});
exports.deleteVideo = deleteVideo;
// Lấy tất cả video
const getAllVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10 } = req.query; // Hỗ trợ phân trang nếu cần
    try {
        // Tìm tất cả tài liệu với type là 'video'
        const videos = yield Resource_1.default.find({ type: 'video' })
            .skip((Number(page) - 1) * Number(limit)) // Phân trang
            .limit(Number(limit)); // Giới hạn số lượng video trả về mỗi lần
        // Trả về danh sách video
        res.status(200).json(videos);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Đã xảy ra lỗi không xác định' });
        }
    }
});
exports.getAllVideos = getAllVideos;
// Lấy video theo ID
const getVideoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Tìm video theo ID và kiểm tra xem nó có phải là loại 'video' không
        const video = yield Resource_1.default.findOne({ _id: id, type: 'video' });
        if (!video) {
            return res.status(404).json({ message: 'Video không tồn tại' });
        }
        // Trả về chi tiết video
        res.status(200).json(video);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Đã xảy ra lỗi không xác định' });
        }
    }
});
exports.getVideoById = getVideoById;
// Lấy tài liệu theo ID và hiển thị subject name
const getResourceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const resource = yield (0, resourceService_1.getResourceById)(id);
        if (!resource)
            return res.status(404).json({ message: 'Tài liệu không tồn tại' });
        res.status(200).json(resource); // Trả về dữ liệu tài liệu và subject
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getResourceById = getResourceById;
const getAllResources = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resourcesData = yield (0, resourceService_1.getAllResources)(); // Gọi service mà không truyền page và limit
        res.status(200).json(resourcesData); // Trả về toàn bộ dữ liệu
    }
    catch (error) {
        res.status(500).json({ message: error.message }); // Xử lý lỗi
    }
});
exports.getAllResources = getAllResources;
