import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
    addToCart, 
    getCart, 
    updateCartItem, 
    removeCartItem 
} from '../controllers/cartController.js';

const router = express.Router();

// All routes in this file will first be checked by the 'protect' middleware
router.use(protect);

// Define the routes for cart operations
router.route('/')
    .get(getCart) 
    .post(addToCart); 

router.route('/:productId')
    .put(updateCartItem)    
    .delete(removeCartItem); 

export default router;