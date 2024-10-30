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
exports.getResourceById = exports.deleteResource = exports.updateResource = exports.getResources = exports.createResource = void 0;
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
const getResources = (subjectId_1, ...args_1) => __awaiter(void 0, [subjectId_1, ...args_1], void 0, function* (subjectId, page = 1, limit = 10) {
    const subject = yield Subject_1.default.findById(subjectId).populate('resources');
    if (!subject)
        throw new Error('Subject not found');
    const resources = subject.resources;
    const startIndex = (page - 1) * limit;
    const paginatedResources = resources.slice(startIndex, startIndex + limit);
    return {
        resources: paginatedResources,
        totalPages: Math.ceil(resources.length / limit),
        totalResources: resources.length,
        currentPage: page,
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
