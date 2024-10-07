import Rating from '../models/Rating';
import { Request, Response } from 'express';

// Gửi đánh giá cho video
export const addRating = async (req: Request, res: Response) => {
  const userId = req.user ? req.user._id : null;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { videoId } = req.params;
  const { rating } = req.body;

  try {
    const newRating = new Rating({
      user: userId,
      video: videoId,
      rating,
    });
    await newRating.save();
    res.status(201).json(newRating);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// Lấy điểm đánh giá trung bình của video
export const getAverageRating = async (req: Request, res: Response) => {
  const { videoId } = req.params;

  try {
    const ratings = await Rating.find({ video: videoId });
    const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;
    res.status(200).json({ averageRating });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
