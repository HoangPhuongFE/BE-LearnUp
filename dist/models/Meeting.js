"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const meetingSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true }, // Tiêu đề bắt buộc
    description: { type: String }, // Mô tả không bắt buộc
    meetLink: { type: String, required: true }, // Link Google Meet bắt buộc
    startTime: { type: Date, required: true }, // Thời gian bắt đầu
    endTime: { type: Date, required: true }, // Thời gian kết thúc
});
const Meeting = mongoose_1.default.model('Meeting', meetingSchema);
exports.default = Meeting;
