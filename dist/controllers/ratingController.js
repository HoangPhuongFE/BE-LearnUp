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
exports.getAverageRating = exports.addRating = void 0;
const Rating_1 = __importDefault(require("../models/Rating"));
// Gửi đánh giá cho video
const addRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user ? req.user._id : null;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { videoId } = req.params;
    const { rating } = req.body;
    try {
        const newRating = new Rating_1.default({
            user: userId,
            video: videoId,
            rating,
        });
        yield newRating.save();
        res.status(201).json(newRating);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.addRating = addRating;
// Lấy điểm đánh giá trung bình của video
const getAverageRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    try {
        const ratings = yield Rating_1.default.find({ video: videoId });
        const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;
        res.status(200).json({ averageRating });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.getAverageRating = getAverageRating;
