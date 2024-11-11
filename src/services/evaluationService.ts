// services/evaluationService.ts
import Evaluation, { IEvaluation } from '../models/Evaluation';
import Media from '../models/Media';

export const createOrUpdateEvaluation = async (data: Partial<IEvaluation>): Promise<IEvaluation> => {
  let evaluation = await Evaluation.findOne({ user: data.user, media: data.media });

  if (evaluation) {
    evaluation.rating = data.rating!;
    return await evaluation.save();
  } else {
    evaluation = new Evaluation(data);
    const savedEvaluation = await evaluation.save();

    await Media.findByIdAndUpdate(data.media, { $push: { ratings: savedEvaluation._id } });

    return savedEvaluation;
  }
};

export const getEvaluationsByMedia = async (mediaId: string): Promise<IEvaluation[]> => {
  return await Evaluation.find({ media: mediaId }).populate('user', 'name');
};

export const deleteEvaluation = async (id: string): Promise<void> => {
  const evaluation = await Evaluation.findByIdAndDelete(id);
  if (evaluation) {
    await Media.findByIdAndUpdate(evaluation.media, { $pull: { ratings: evaluation._id } });
  }
};
