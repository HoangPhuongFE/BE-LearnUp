import { Request, Response } from 'express';
import * as MeetingService from '../services/meetingService';

// Tạo buổi học mới
export const createMeeting = async (req: Request, res: Response) => {
  const { title, description, meetLink, startTime, endTime } = req.body;

  try {
    const newMeeting = await MeetingService.createMeeting({
      title,
      description,
      meetLink,
      startTime,
      endTime,
    });

    res.status(201).json(newMeeting);
  } catch (error) {
    res.status(500).json({ message: 'Error creating meeting', error });
  }
};


// Lấy tất cả buổi học
export const getMeetings = async (req: Request, res: Response) => {
    try {
      const meetings = await MeetingService.getAllMeetings();
      res.status(200).json(meetings);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching meetings', error });
    }
  };


  // Lấy buổi học theo ID
export const getMeetingById = async (req: Request, res: Response) => {
    const { meetingId } = req.params;
  
    try {
      const meeting = await MeetingService.getMeetingById(meetingId);
      if (!meeting) {
        return res.status(404).json({ message: 'Meeting not found' });
      }
      res.status(200).json(meeting);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching meeting', error });
    }
  };
  
 
  // Cập nhật buổi học
export const updateMeeting = async (req: Request, res: Response) => {
    const { meetingId } = req.params;
    const { title, description, meetLink, startTime, endTime } = req.body;
  
    try {
      const updatedMeeting = await MeetingService.updateMeeting(meetingId, {
        title,
        description,
        meetLink,
        startTime,
        endTime,
      });
  
      if (!updatedMeeting) {
        return res.status(404).json({ message: 'Meeting not found' });
      }
  
      res.status(200).json(updatedMeeting);
    } catch (error) {
      res.status(500).json({ message: 'Error updating meeting', error });
    }
  };
  


  // Xóa buổi học
export const deleteMeeting = async (req: Request, res: Response) => {
    const { meetingId } = req.params;
  
    try {
      const deletedMeeting = await MeetingService.deleteMeeting(meetingId);
      if (!deletedMeeting) {
        return res.status(404).json({ message: 'Meeting not found' });
      }
  
      res.status(200).json({ message: 'Meeting deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting meeting', error });
    }
  };
  