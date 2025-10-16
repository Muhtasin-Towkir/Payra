import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminAuth.js';

const router = express.Router();

// Public Routes (using the controller logic)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin-Only Route
router.route('/users').get(protect, adminOnly, getAllUsers);

export default router;