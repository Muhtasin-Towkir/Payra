console.log("Order Route module has been located and is active.");import express from 'express';
import { protect} from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminAuth.js';
import {
  createOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

// All routes below this are protected; a user must be logged in.
router.use(protect);

// Routes for regular users
router.route('/').post(createOrder);
router.route('/my-orders').get(getMyOrders);
router.route('/:id').get(getSingleOrder);

// Routes accessible only by admins
router.use(adminOnly);
router.route('/').get(getAllOrders);
router.route('/:id').put(updateOrderStatus);

export default router;
