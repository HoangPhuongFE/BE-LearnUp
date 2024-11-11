"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mediaSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: String,
    url: { type: String, required: true },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Feedback' }],
    ratings: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Evaluation' }],
}, { timestamps: true });
const Media = mongoose_1.default.model('Media', mediaSchema);
exports.default = Media;
