"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const semesterSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Kỳ 1', 'Kỳ 2', 'Kỳ 3', 'Kỳ 4', 'Kỳ 5', 'Kỳ 6', 'Kỳ 7', 'Kỳ 8', 'Kỳ 9'],
    },
    department: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Department', // Liên kết với mô hình Department
        required: true,
    },
    subjects: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Subject',
        }],
});
// Chuyển đổi _id thành id khi trả về JSON
semesterSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});
const Semester = mongoose_1.default.model('Semester', semesterSchema);
exports.default = Semester;
