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
exports.getLikesByPost = exports.toggleLike = void 0;
const Like_1 = __importDefault(require("../models/Like"));
const toggleLike = (postId, userId, type) => __awaiter(void 0, void 0, void 0, function* () {
    const existingLike = yield Like_1.default.findOne({ postId, userId });
    if (existingLike) {
        yield existingLike.deleteOne();
        return null;
    }
    const newLike = new Like_1.default({ postId, userId, type });
    yield newLike.save();
    return newLike;
});
exports.toggleLike = toggleLike;
const getLikesByPost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Like_1.default.find({ postId });
});
exports.getLikesByPost = getLikesByPost;
