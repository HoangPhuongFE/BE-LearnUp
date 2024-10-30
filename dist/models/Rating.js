"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Định nghĩa Schema cho Rating
const ratingSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    video: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Resource', required: true }, // Liên kết với video
    rating: { type: Number, required: true, min: 1, max: 5 }, // Đánh giá từ 1 đến 5 sao
    createdAt: { type: Date, default: Date.now },
});
// Tạo Model Rating dựa trên Schema
const Rating = (0, mongoose_1.model)('Rating', ratingSchema);
exports.default = Rating;
