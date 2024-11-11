// services/feedbackService.ts
import Feedback, { IFeedback } from '../models/Feedback';
import Media from '../models/Media';

export const createFeedback = async (data: Partial<IFeedback>): Promise<IFeedback> => {
  const feedback = new Feedback(data);
  const savedFeedback = await feedback.save();

  await Media.findByIdAndUpdate(data.media, { $push: { comments: savedFeedback._id } });

  return savedFeedback;
};

export const getFeedbackByMedia = async (mediaId: string): Promise<IFeedback[]> => {
  return await Feedback.find({ media: mediaId }).populate('user', 'name');
};

export const updateFeedback = async (id: string, data: Partial<IFeedback>): Promise<IFeedback | null> => {
  return await Feedback.findByIdAndUpdate(id, data, { new: true });
};

export const deleteFeedback = async (id: string): Promise<void> => {
  const feedback = await Feedback.findByIdAndDelete(id);
  if (feedback) {
    await Media.findByIdAndUpdate(feedback.media, { $pull: { comments: feedback._id } });
  }
};
