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
exports.deleteFeedback = exports.updateFeedback = exports.getFeedbackByMedia = exports.createFeedback = void 0;
// services/feedbackService.ts
const Feedback_1 = __importDefault(require("../models/Feedback"));
const Media_1 = __importDefault(require("../models/Media"));
const createFeedback = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const feedback = new Feedback_1.default(data);
    const savedFeedback = yield feedback.save();
    yield Media_1.default.findByIdAndUpdate(data.media, { $push: { comments: savedFeedback._id } });
    return savedFeedback;
});
exports.createFeedback = createFeedback;
const getFeedbackByMedia = (mediaId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Feedback_1.default.find({ media: mediaId }).populate('user', 'name');
});
exports.getFeedbackByMedia = getFeedbackByMedia;
const updateFeedback = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Feedback_1.default.findByIdAndUpdate(id, data, { new: true });
});
exports.updateFeedback = updateFeedback;
const deleteFeedback = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const feedback = yield Feedback_1.default.findByIdAndDelete(id);
    if (feedback) {
        yield Media_1.default.findByIdAndUpdate(feedback.media, { $pull: { comments: feedback._id } });
    }
});
exports.deleteFeedback = deleteFeedback;
