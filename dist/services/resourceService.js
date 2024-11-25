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
exports.getAllResources = exports.getResourceById = exports.deleteResource = exports.updateResource = exports.getResources = exports.createResource = void 0;
const Resource_1 = __importDefault(require("../models/Resource"));
const Subject_1 = __importDefault(require("../models/Subject"));
const createResource = (subjectId, title, description, fileUrls, type, allowedRoles) => __awaiter(void 0, void 0, void 0, function* () {
    const resource = new Resource_1.default({ title, description, fileUrls, type, allowedRoles, subject: subjectId }); // Lưu subjectId
    yield resource.save();
    const subject = yield Subject_1.default.findById(subjectId);
    if (subject) {
        const resourceId = resource._id;
        subject.resources.push(resourceId);
        yield subject.save();
    }
    return resource;
});
exports.createResource = createResource;
const getResources = (subjectId) => __awaiter(void 0, void 0, void 0, function* () {
    // Tìm kiếm tài liệu dựa trên subjectId mà không phân trang
    const subject = yield Subject_1.default.findById(subjectId).populate('resources');
    if (!subject)
        throw new Error('Subject not found');
    return {
        resources: subject.resources,
        totalResources: subject.resources.length,
    };
});
exports.getResources = getResources;
const updateResource = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Resource_1.default.findByIdAndUpdate(id, data, { new: true });
});
exports.updateResource = updateResource;
const deleteResource = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Resource_1.default.findByIdAndDelete(id);
});
exports.deleteResource = deleteResource;
const getResourceById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Resource_1.default.findById(id).populate('subject', 'name');
});
exports.getResourceById = getResourceById;
const getAllResources = () => __awaiter(void 0, void 0, void 0, function* () {
    // Trả về toàn bộ tài liệu mà không phân trang
    const resources = yield Resource_1.default.find();
    const totalResources = yield Resource_1.default.countDocuments();
    return {
        resources,
        totalResources,
    };
});
exports.getAllResources = getAllResources;
