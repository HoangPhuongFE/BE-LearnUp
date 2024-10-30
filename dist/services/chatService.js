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
exports.deleteMessage = exports.updateMessage = exports.getMessageById = exports.getAllMessages = exports.saveMessage = void 0;
const Message_1 = __importDefault(require("../models/Message"));
// Lưu tin nhắn mới
const saveMessage = (sender, content) => __awaiter(void 0, void 0, void 0, function* () {
    const newMessage = new Message_1.default({
        sender,
        content,
    });
    return yield newMessage.save();
});
exports.saveMessage = saveMessage;
// Lấy tất cả tin nhắn
const getAllMessages = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Message_1.default.find().populate('sender', 'name');
});
exports.getAllMessages = getAllMessages;
// Lấy tin nhắn theo ID
const getMessageById = (messageId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Message_1.default.findById(messageId).populate('sender', 'name');
});
exports.getMessageById = getMessageById;
// Cập nhật tin nhắn
const updateMessage = (messageId, newContent) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Message_1.default.findByIdAndUpdate(messageId, { content: newContent, updatedAt: new Date() }, { new: true });
});
exports.updateMessage = updateMessage;
// Xóa tin nhắn
const deleteMessage = (messageId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Message_1.default.findByIdAndDelete(messageId);
});
exports.deleteMessage = deleteMessage;
