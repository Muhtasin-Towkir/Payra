import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminAuth.js';
import { upload } from '../middleware/multer.js';
import { searchProducts } from '../controllers/productController.js';

const router = express.Router();

// Routes for getting all products and creating a new one
router.route('/')
  .get(getAllProducts)
  .post(protect, adminOnly, upload.array('images', 5), createProduct);

  // Add a new route for search. Place it before the '/:id' route.
router.route('/search').get(searchProducts);

// Routes for getting, updating, and deleting a single product by its ID
router.route('/:id')
  .get(getProductById)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

// Add a new route for search. Place it before the '/:id' route.
router.route('/search').get(searchProducts);

export default router;