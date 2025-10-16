import express from 'express';
import { submitContactForm } from '../controllers/contactController.js';

const router = express.Router();

// public
// POST /api/v1/contact
router.route('/').post(submitContactForm);

export default router;
