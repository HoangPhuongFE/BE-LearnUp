"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const evaluationSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    media: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Media', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: { createdAt: true, updatedAt: false } });
const Evaluation = mongoose_1.default.model('Evaluation', evaluationSchema);
exports.default = Evaluation;
