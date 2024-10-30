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
exports.getSemesterWithDepartmentService = exports.getSemesterById = exports.deleteSemester = exports.updateSemester = exports.getSemesters = exports.createSemester = void 0;
const Semester_1 = __importDefault(require("../models/Semester"));
const Department_1 = __importDefault(require("../models/Department"));
const createSemester = (departmentId, name) => __awaiter(void 0, void 0, void 0, function* () {
    const semester = new Semester_1.default({ name, department: departmentId }); // Gán departmentId
    yield semester.save();
    const department = yield Department_1.default.findById(departmentId);
    if (department) {
        department.semesters.push(semester._id);
        yield department.save();
    }
    return semester;
});
exports.createSemester = createSemester;
const getSemesters = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Semester_1.default.find().populate('subjects');
});
exports.getSemesters = getSemesters;
const updateSemester = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Semester_1.default.findByIdAndUpdate(id, data, { new: true });
});
exports.updateSemester = updateSemester;
const deleteSemester = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Semester_1.default.findByIdAndDelete(id);
});
exports.deleteSemester = deleteSemester;
const getSemesterById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Semester_1.default.findById(id).populate('subjects');
});
exports.getSemesterById = getSemesterById;
const getSemesterWithDepartmentService = (semesterId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const semester = yield Semester_1.default.findById(semesterId)
            .populate({
            path: 'department', // Populate để lấy thông tin ngành học
            select: 'name code', // Chỉ lấy tên và mã ngành học
        });
        // .populate('subjects');  // Populate các môn học
        return semester;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        else {
            throw new Error('An unknown error occurred');
        }
    }
});
exports.getSemesterWithDepartmentService = getSemesterWithDepartmentService;
