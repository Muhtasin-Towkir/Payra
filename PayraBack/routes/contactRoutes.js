import express from 'express';
import { 
  submitContactForm,
  getAllMessages,
  getMessageById,
  deleteMessage
} from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminAuth.js';

const router = express.Router();

// --- Public Route ---
router.route('/').post(submitContactForm);

// --- Admin-Only Routes ---

// GET /api/v1/contact (Get all)
router.route('/')
  .get(protect, adminOnly, getAllMessages);

// GET /api/v1/contact/:id (Get one)
// DELETE /api/v1/contact/:id (Delete one)
router.route('/:id')
  .get(protect, adminOnly, getMessageById)
  .delete(protect, adminOnly, deleteMessage);

export default router;
