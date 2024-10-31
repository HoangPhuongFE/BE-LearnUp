"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const resourceSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, trim: true }, // Tiêu đề bắt buộc
    description: { type: String, trim: true }, // Mô tả không bắt buộc
    fileUrls: [{ type: String, required: true, trim: true }], // Danh sách file URL là bắt buộc
    type: { type: String, enum: ['pdf', 'video', 'document'], default: 'document' }, // Mặc định là 'document'
    allowedRoles: {
        type: [String],
        enum: ['member_free', 'member_premium'],
        default: ['member_premium'], // Mặc định là 'member_premium'
    },
    subject: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Subject', required: true }, // Liên kết với mô hình Subject
});
// Chuyển đổi _id thành id khi trả về JSON
resourceSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});
const Resource = mongoose_1.default.model('Resource', resourceSchema);
exports.default = Resource;
