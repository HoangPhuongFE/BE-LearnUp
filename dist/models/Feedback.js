"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const feedbackSchema = new mongoose_1.default.Schema({
    content: { type: String, required: true },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    media: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Media', required: true },
}, { timestamps: true });
const Feedback = mongoose_1.default.model('Feedback', feedbackSchema);
exports.default = Feedback;
