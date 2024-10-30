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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubjectWithSemester = exports.getSubjectById = exports.deleteSubject = exports.updateSubject = exports.getSubjects = exports.addSubjectToSemester = void 0;
const subjectService_1 = require("../services/subjectService");
// Thêm môn học vào học kỳ
const addSubjectToSemester = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { semesterId } = req.params;
    const { name } = req.body;
    try {
        const subject = yield (0, subjectService_1.createSubject)(semesterId, name); // Tạo môn học
        res.status(201).json(subject); // Trả về dữ liệu môn học vừa tạo
    }
    catch (error) {
        res.status(500).json({ message: error.message }); // Xử lý lỗi
    }
});
exports.addSubjectToSemester = addSubjectToSemester;
// Lấy danh sách môn học
const getSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subjects = yield (0, subjectService_1.getSubjects)(); // Gọi hàm từ service để lấy danh sách môn học
        res.status(200).json(subjects); // Trả về danh sách môn học
    }
    catch (error) {
        res.status(500).json({ message: error.message }); // Xử lý lỗi
    }
});
exports.getSubjects = getSubjects;
// Cập nhật môn học
const updateSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const subject = yield (0, subjectService_1.updateSubject)(id, req.body); // Cập nhật môn học
        if (!subject)
            return res.status(404).json({ message: 'Môn học không tồn tại' });
        res.status(200).json(subject); // Trả về dữ liệu môn học vừa cập nhật
    }
    catch (error) {
        res.status(500).json({ message: error.message }); // Xử lý lỗi
    }
});
exports.updateSubject = updateSubject;
// Xóa môn học
const deleteSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const subject = yield (0, subjectService_1.deleteSubject)(id); // Xóa môn học
        if (!subject)
            return res.status(404).json({ message: 'Môn học không tồn tại' });
        res.status(200).json({ message: 'Môn học đã được xóa' });
    }
    catch (error) {
        res.status(500).json({ message: error.message }); // Xử lý lỗi
    }
});
exports.deleteSubject = deleteSubject;
// Lấy môn học theo id
const getSubjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const subject = yield (0, subjectService_1.getSubjectById)(id); // Lấy môn học theo id
        if (!subject)
            return res.status(404).json({ message: 'Môn học không tồn tại' });
        res.status(200).json(subject); // Trả về dữ liệu môn học
    }
    catch (error) {
        res.status(500).json({ message: error.message }); // Xử lý lỗi
    }
});
exports.getSubjectById = getSubjectById;
// Lấy môn học với học kỳ
const getSubjectWithSemester = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Sử dụng `id` vì nó được truyền dưới dạng `:id` trong route
    try {
        const subject = yield (0, subjectService_1.getSubjectWithSemesterService)(id); // Sử dụng đúng tham số id
        if (!subject) {
            return res.status(404).json({ message: 'Môn học không tồn tại' });
        }
        res.status(200).json(subject); // Trả về dữ liệu môn học với học kỳ
    }
    catch (error) {
        res.status(500).json({ message: error.message }); // Xử lý lỗi
    }
});
exports.getSubjectWithSemester = getSubjectWithSemester;
