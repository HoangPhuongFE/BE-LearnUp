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
exports.deleteDepartment = exports.updateDepartment = exports.getDepartments = exports.createDepartment = void 0;
const Department_1 = __importDefault(require("../models/Department"));
const createDepartment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const department = new Department_1.default(data);
    return yield department.save();
});
exports.createDepartment = createDepartment;
const getDepartments = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Department_1.default.find().populate('semesters');
});
exports.getDepartments = getDepartments;
const updateDepartment = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Department_1.default.findByIdAndUpdate(id, data, { new: true });
});
exports.updateDepartment = updateDepartment;
const deleteDepartment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Department_1.default.findByIdAndDelete(id);
});
exports.deleteDepartment = deleteDepartment;
