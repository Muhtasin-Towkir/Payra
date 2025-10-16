import express from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';
import { createRequest } from '../controllers/requestController.js';

const router = express.Router();

// A user must be logged in to make a request.
// The route will handle a single file upload with the field name 'itemPhoto'.
router.route('/')
  .post(protect, upload.single('itemPhoto'), createRequest);

export default router;
