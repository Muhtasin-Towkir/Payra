import express from 'express';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminAuth.js';
import { upload } from '../middleware/multer.js';
import { 
  createRequest,
  getMyRequests, // <-- IMPORT ADDED
  getAllRequests,
  getRequestById,
  deleteRequest
} from '../controllers/requestController.js';

const router = express.Router();

// --- User Routes ---
router.route('/')
  .post(protect, upload.single('itemPhoto'), createRequest);
router.route('/my-requests')
  .get(protect, getMyRequests);


// --- Admin-Only Routes ---

// GET /api/v1/request (Get all requests)
router.route('/')
  .get(protect, adminOnly, getAllRequests);

// GET /api/v1/request/:id (Get one request)
// DELETE /api/v1/request/:id (Delete one request)
router.route('/:id')
  .get(protect, adminOnly, getRequestById)
  .delete(protect, adminOnly, deleteRequest);

export default router;

