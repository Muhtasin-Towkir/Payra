import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getWishlist,
  addProductToWishlist,
  removeProductFromWishlist
} from '../controllers/wishlistController.js';


const router = express.Router();

// All wishlist routes require login
router.use(protect);

// GET /api/v1/wishlist (Get user's wishlist)
router.route('/').get(getWishlist);

// POST /api/v1/wishlist/:productId (Add item)
// DELETE /api/v1/wishlist/:productId (Remove item)
router.route('/:productId')
  .post(
    (req, res, next) => {
      console.log(`--- POST /wishlist/${req.params.productId} route hit ---`);
      next(); 
    }, 
    addProductToWishlist // The actual controller function
  )
  .delete(
    (req, res, next) => {
      console.log(`--- DELETE /wishlist/${req.params.productId} route hit ---`);
      next(); // Pass control to the actual handler
    }, 
    removeProductFromWishlist // The actual controller function
  );

export default router;

