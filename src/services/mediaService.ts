// services/mediaService.ts
import Media, { IMedia } from '../models/Media';
import Feedback from '../models/Feedback';
import Evaluation from '../models/Evaluation';
import mongoose from 'mongoose';

export const createMedia = async (data: Partial<IMedia>): Promise<IMedia> => {
  const media = new Media(data);
  return await media.save();
};

export const getAllMedia = async (): Promise<IMedia[]> => {
  return await Media.find().populate('user', 'name email');
};

export const getMediaById = async (id: string): Promise<IMedia | null> => {
  return await Media.findById(id)
    .populate('user', 'name email')
    .populate({
      path: 'comments',
      populate: { path: 'user', select: 'name' },
    })
    .populate('ratings');
};

export const updateMedia = async (id: string, data: Partial<IMedia>): Promise<IMedia | null> => {
  return await Media.findByIdAndUpdate(id, data, { new: true });
};

export const deleteMedia = async (id: string): Promise<void> => {
  await Feedback.deleteMany({ media: id });
  await Evaluation.deleteMany({ media: id });
  await Media.findByIdAndDelete(id);
};
