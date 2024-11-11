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
exports.deleteMedia = exports.updateMedia = exports.getMediaById = exports.getAllMedia = exports.createMedia = void 0;
// services/mediaService.ts
const Media_1 = __importDefault(require("../models/Media"));
const Feedback_1 = __importDefault(require("../models/Feedback"));
const Evaluation_1 = __importDefault(require("../models/Evaluation"));
const createMedia = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const media = new Media_1.default(data);
    return yield media.save();
});
exports.createMedia = createMedia;
const getAllMedia = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Media_1.default.find().populate('user', 'name email');
});
exports.getAllMedia = getAllMedia;
const getMediaById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Media_1.default.findById(id)
        .populate('user', 'name email')
        .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name' },
    })
        .populate('ratings');
});
exports.getMediaById = getMediaById;
const updateMedia = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Media_1.default.findByIdAndUpdate(id, data, { new: true });
});
exports.updateMedia = updateMedia;
const deleteMedia = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield Feedback_1.default.deleteMany({ media: id });
    yield Evaluation_1.default.deleteMany({ media: id });
    yield Media_1.default.findByIdAndDelete(id);
});
exports.deleteMedia = deleteMedia;
