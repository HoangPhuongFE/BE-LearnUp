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
exports.getSemesterWithDepartment = exports.getSemesterById = exports.deleteSemester = exports.updateSemester = exports.getSemesters = exports.addSemesterToDepartment = void 0;
const semesterService_1 = require("../services/semesterService");
// Thêm học kỳ vào ngành học
const addSemesterToDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { departmentId } = req.params;
    const { name } = req.body;
    try {
        const semester = yield (0, semesterService_1.createSemester)(departmentId, name);
        res.status(201).json(semester);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.addSemesterToDepartment = addSemesterToDepartment;
// Lấy danh sách học kỳ
const getSemesters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const semesters = yield (0, semesterService_1.getSemesters)();
        res.status(200).json(semesters);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getSemesters = getSemesters;
// Cập nhật học kỳ
const updateSemester = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const semester = yield (0, semesterService_1.updateSemester)(id, req.body);
        if (!semester)
            return res.status(404).json({ message: 'Học kỳ không tồn tại' });
        res.status(200).json(semester);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateSemester = updateSemester;
// Xóa học kỳ
const deleteSemester = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const semester = yield (0, semesterService_1.deleteSemester)(id);
        if (!semester)
            return res.status(404).json({ message: 'Học kỳ không tồn tại' });
        res.status(200).json({ message: 'Học kỳ đã được xóa' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteSemester = deleteSemester;
// Lấy học kỳ theo id
const getSemesterById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const semester = yield (0, semesterService_1.getSemesterById)(id);
        if (!semester)
            return res.status(404).json({ message: 'Học kỳ không tồn tại' });
        res.status(200).json(semester);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getSemesterById = getSemesterById;
// Lấy học kỳ và thông tin ngành học
const getSemesterWithDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const semester = yield (0, semesterService_1.getSemesterWithDepartmentService)(id);
        if (!semester)
            return res.status(404).json({ message: 'Học kỳ không tồn tại' });
        res.status(200).json(semester);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getSemesterWithDepartment = getSemesterWithDepartment;
