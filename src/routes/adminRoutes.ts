// File: routes/adminRoutes.ts

import express from 'express';
import { createStaff, updateStaffRoles, deleteStaff } from '../controllers/adminController';
import { protect, admin } from '../middlewares/authMiddleware'; 

const router = express.Router();

router.post('/staff/create', protect, admin, createStaff);
router.put('/staff/:id', protect, admin, updateStaffRoles);
router.delete('/staff/:id', protect, admin, deleteStaff);



export default router;
