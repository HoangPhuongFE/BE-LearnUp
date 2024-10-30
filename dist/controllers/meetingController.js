"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteMeeting = exports.updateMeeting = exports.getMeetingById = exports.getMeetings = exports.createMeeting = void 0;
const MeetingService = __importStar(require("../services/meetingService"));
// Tạo buổi học mới
const createMeeting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, meetLink, startTime, endTime } = req.body;
    try {
        const newMeeting = yield MeetingService.createMeeting({
            title,
            description,
            meetLink,
            startTime,
            endTime,
        });
        res.status(201).json(newMeeting);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating meeting', error });
    }
});
exports.createMeeting = createMeeting;
// Lấy tất cả buổi học
const getMeetings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const meetings = yield MeetingService.getAllMeetings();
        res.status(200).json(meetings);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching meetings', error });
    }
});
exports.getMeetings = getMeetings;
// Lấy buổi học theo ID
const getMeetingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { meetingId } = req.params;
    try {
        const meeting = yield MeetingService.getMeetingById(meetingId);
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        res.status(200).json(meeting);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching meeting', error });
    }
});
exports.getMeetingById = getMeetingById;
// Cập nhật buổi học
const updateMeeting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { meetingId } = req.params;
    const { title, description, meetLink, startTime, endTime } = req.body;
    try {
        const updatedMeeting = yield MeetingService.updateMeeting(meetingId, {
            title,
            description,
            meetLink,
            startTime,
            endTime,
        });
        if (!updatedMeeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        res.status(200).json(updatedMeeting);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating meeting', error });
    }
});
exports.updateMeeting = updateMeeting;
// Xóa buổi học
const deleteMeeting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { meetingId } = req.params;
    try {
        const deletedMeeting = yield MeetingService.deleteMeeting(meetingId);
        if (!deletedMeeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        res.status(200).json({ message: 'Meeting deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting meeting', error });
    }
});
exports.deleteMeeting = deleteMeeting;
