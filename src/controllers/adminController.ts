
import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';

export const createStaff = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const staff = new User({
      name,
      email,
      password, 
      role
    });

    await staff.save();

    res.status(201).json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      token: generateToken(staff._id.toString()),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating staff' });
  }
};



export const updateStaffRoles = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;
  
    try {
      const staff = await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true });
      if (!staff) {
        return res.status(404).json({ message: 'Staff not found' });
      }
  
      res.json({
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating staff roles' });
    }
  };



export const deleteStaff = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const staff = await User.findByIdAndDelete(id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting staff' });
  }
};


