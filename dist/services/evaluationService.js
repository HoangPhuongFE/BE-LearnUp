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
exports.deleteEvaluation = exports.getEvaluationsByMedia = exports.createOrUpdateEvaluation = void 0;
// services/evaluationService.ts
const Evaluation_1 = __importDefault(require("../models/Evaluation"));
const Media_1 = __importDefault(require("../models/Media"));
const createOrUpdateEvaluation = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let evaluation = yield Evaluation_1.default.findOne({ user: data.user, media: data.media });
    if (evaluation) {
        evaluation.rating = data.rating;
        return yield evaluation.save();
    }
    else {
        evaluation = new Evaluation_1.default(data);
        const savedEvaluation = yield evaluation.save();
        yield Media_1.default.findByIdAndUpdate(data.media, { $push: { ratings: savedEvaluation._id } });
        return savedEvaluation;
    }
});
exports.createOrUpdateEvaluation = createOrUpdateEvaluation;
const getEvaluationsByMedia = (mediaId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Evaluation_1.default.find({ media: mediaId }).populate('user', 'name');
});
exports.getEvaluationsByMedia = getEvaluationsByMedia;
const deleteEvaluation = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const evaluation = yield Evaluation_1.default.findByIdAndDelete(id);
    if (evaluation) {
        yield Media_1.default.findByIdAndUpdate(evaluation.media, { $pull: { ratings: evaluation._id } });
    }
});
exports.deleteEvaluation = deleteEvaluation;
