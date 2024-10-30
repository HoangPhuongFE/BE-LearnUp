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
exports.deleteMeeting = exports.updateMeeting = exports.getMeetingById = exports.getAllMeetings = exports.createMeeting = void 0;
const Meeting_1 = __importDefault(require("../models/Meeting"));
// Tạo buổi học mới
const createMeeting = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const meeting = new Meeting_1.default(data);
    return yield meeting.save(); // Lưu buổi học vào cơ sở dữ liệu
});
exports.createMeeting = createMeeting;
// Lấy tất cả buổi học
const getAllMeetings = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Meeting_1.default.find(); // Lấy tất cả buổi học từ cơ sở dữ liệu
});
exports.getAllMeetings = getAllMeetings;
// Lấy buổi học theo ID
const getMeetingById = (meetingId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Meeting_1.default.findById(meetingId); // Lấy buổi học theo ID
});
exports.getMeetingById = getMeetingById;
// Cập nhật buổi học
const updateMeeting = (meetingId, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Meeting_1.default.findByIdAndUpdate(meetingId, data, { new: true });
});
exports.updateMeeting = updateMeeting;
// Xóa buổi học
const deleteMeeting = (meetingId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Meeting_1.default.findByIdAndDelete(meetingId);
});
exports.deleteMeeting = deleteMeeting;
