import asyncHandler from 'express-async-handler';
import User from '../models/user.js';
import Product from '../models/product.js';
//private
// --- ADD TO CART ---
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  
  // The 'protect' middleware gives us the logged-in user's ID
  const userId = req.user.id;

  // First, verify the product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found in the archives.');
  }

  // Find the user
  const user = await User.findById(userId);

  // Check if the item is already in the cart
  const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);

  if (itemIndex > -1) {
    // If item exists, update the quantity
    user.cart[itemIndex].quantity += quantity;
  } else {
    // If item does not exist, add it to the cart array
    user.cart.push({ product: productId, quantity });
  }

  // Save the updated user document
  await user.save();
  
  // Respond with the newly updated cart
  // We populate the cart to send back full product details
  const updatedUser = await User.findById(userId).populate('cart.product');
  res.status(200).json({
    success: true,
    message: 'Cargo added to hold.',
    cart: updatedUser.cart
  });
});

// --- GET CART ---
export const getCart = asyncHandler(async (req, res) => {
  // Use .populate() to replace the product IDs with the actual product data
  const user = await User.findById(req.user.id).populate('cart.product');

  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  res.status(200).json({
    success: true,
    cart: user.cart
  });
});

// --- UPDATE CART ITEM ---
export const updateCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
        // If quantity is 0 or less, remove the item instead
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { cart: { product: productId } } },
            { new: true }
        ).populate('cart.product');
        return res.status(200).json({ success: true, message: 'Cargo jettisoned.', cart: updatedUser.cart });
    }

    // Use a direct MongoDB update for efficiency
    const updatedUser = await User.findOneAndUpdate(
        { _id: req.user.id, 'cart.product': productId },
        { $set: { 'cart.$.quantity': quantity } },
        { new: true }
    ).populate('cart.product');

    res.status(200).json({ success: true, message: 'Cargo quantity adjusted.', cart: updatedUser.cart });
});


// --- REMOVE FROM CART ---
export const removeCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    // Use the $pull operator to remove the item from the cart array in one atomic operation
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { cart: { product: productId } } },
        { new: true } // 'new: true' returns the updated document
    ).populate('cart.product');

    if (!updatedUser) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json({ success: true, message: 'Cargo jettisoned.', cart: updatedUser.cart });
});