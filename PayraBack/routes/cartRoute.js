import express from 'express';
import { protect } from '../middleware/auth.js'; // Our security droid
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
    .get(getCart) // GET /api/v1/cart - Fetches the user's cart
    .post(addToCart); // POST /api/v1/cart - Adds an item to the cart

router.route('/:productId')
    .put(updateCartItem)    // PUT /api/v1/cart/:productId - Updates an item's quantity
    .delete(removeCartItem); // DELETE /api/v1/cart/:productId - Removes an item

export default router;