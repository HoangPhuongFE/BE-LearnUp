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
exports.deleteDepartment = exports.updateDepartment = exports.getDepartments = exports.addDepartment = void 0;
const departmentService_1 = require("../services/departmentService");
// Thêm ngành học mới
const addDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const department = yield (0, departmentService_1.createDepartment)(req.body); // Tạo ngành học
        res.status(201).json(department); // Trả về dữ liệu ngành học vừa tạo
    }
    catch (error) {
        res.status(500).json({ message: error.message }); // Xử lý lỗi
    }
});
exports.addDepartment = addDepartment;
// Lấy danh sách ngành học
const getDepartments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departments = yield (0, departmentService_1.getDepartments)(); // Gọi hàm từ service
        res.status(200).json(departments); // Trả về danh sách ngành học
    }
    catch (error) {
        res.status(500).json({ message: error.message }); // Xử lý lỗi
    }
});
exports.getDepartments = getDepartments;
// Cập nhật ngành học
const updateDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const department = yield (0, departmentService_1.updateDepartment)(id, req.body); // Gọi hàm từ service
        if (!department)
            return res.status(404).json({ message: 'Ngành học không tồn tại' });
        res.status(200).json(department); // Trả về dữ liệu ngành học vừa cập nhật
    }
    catch (error) {
        res.status(500).json({ message: error.message }); // Xử lý lỗi
    }
});
exports.updateDepartment = updateDepartment;
// Xóa ngành học
const deleteDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const department = yield (0, departmentService_1.deleteDepartment)(id); // Gọi hàm từ service
        if (!department)
            return res.status(404).json({ message: 'Ngành học không tồn tại' });
        res.status(200).json({ message: 'Ngành học đã được xóa' });
    }
    catch (error) {
        res.status(500).json({ message: error.message }); // Xử lý lỗi
    }
});
exports.deleteDepartment = deleteDepartment;
