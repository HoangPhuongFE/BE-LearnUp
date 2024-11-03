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
exports.getSubjectWithSemesterService = exports.getSubjectById = exports.deleteSubject = exports.updateSubject = exports.getSubjects = exports.createSubject = void 0;
const Subject_1 = __importDefault(require("../models/Subject"));
const Semester_1 = __importDefault(require("../models/Semester"));
const createSubject = (semesterId, name, description) => __awaiter(void 0, void 0, void 0, function* () {
    // Tạo tài liệu mới cho Subject và lưu semesterId
    const subject = new Subject_1.default({ name, description, semester: semesterId });
    yield subject.save();
    // Tìm Semester theo semesterId và thêm subject._id vào mảng subjects
    const semester = yield Semester_1.default.findById(semesterId);
    if (semester) {
        const subjectId = subject._id;
        semester.subjects.push(subjectId);
        yield semester.save();
    }
    return subject;
});
exports.createSubject = createSubject;
const getSubjects = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Subject_1.default.find().populate('resources');
});
exports.getSubjects = getSubjects;
const updateSubject = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Subject_1.default.findByIdAndUpdate(id, data, { new: true });
});
exports.updateSubject = updateSubject;
const deleteSubject = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Subject_1.default.findByIdAndDelete(id);
});
exports.deleteSubject = deleteSubject;
const getSubjectById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Subject_1.default.findById(id).populate('resources');
});
exports.getSubjectById = getSubjectById;
const getSubjectWithSemesterService = (subjectId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subject = yield Subject_1.default
            .findById(subjectId)
            .populate({
            path: 'semester',
            select: 'name', // Chỉ lấy tên của học kỳ
        });
        return subject;
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
exports.getSubjectWithSemesterService = getSubjectWithSemesterService;
