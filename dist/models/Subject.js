"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const subjectSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    semester: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Semester', required: true },
    resources: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Resource' }],
});
// Chuyển đổi _id thành id khi trả về JSON
subjectSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});
const Subject = mongoose_1.default.model('Subject', subjectSchema);
exports.default = Subject;
