import asyncHandler from 'express-async-handler';
import Wishlist from '../models/wishlist.js';

export const getWishlist = asyncHandler(async (req, res) => {
  // Find the wishlist by the logged-in user's ID and populate the products
  const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');

  if (!wishlist) {
    // If no wishlist exists yet for this user, return an empty array
    return res.status(200).json({
      success: true,
      products: [],
    });
  }
  
  // Return the populated products array
  res.status(200).json({
    success: true,
    products: wishlist.products,
  });
});

export const addProductToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params; 

  if (!productId) {
     res.status(400);
     throw new Error('Product ID is required'); 
  }

  const wishlist = await Wishlist.findOneAndUpdate(
    { user: req.user.id },
    { $addToSet: { products: productId } }, 
    { new: true, upsert: true } 
  ).populate('products');
  
  res.status(200).json({
     success: true,
     message: 'Product added to wishlist',
     products: wishlist.products, // Send back the updated list of products
  });
});

export const removeProductFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  
  // Find the user's wishlist
  const wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }

  // Use $pull to remove the productId from the 'products' array
  wishlist.products.pull(productId);
  await wishlist.save();

  // Populate the products after saving the change
  await wishlist.populate('products');
  
  res.status(200).json({
    success: true,
    message: 'Product removed from wishlist',
    products: wishlist.products, // Send back the updated list
  });
});

