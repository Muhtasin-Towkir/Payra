import asyncHandler from 'express-async-handler';
import User from '../models/user.js';
import Order from '../models/order.js';
import Product from '../models/product.js'; 
export const createOrder = asyncHandler(async (req, res) => {
  const { 
    shippingInfo, 
    itemsPrice, 
    shippingPrice, 
    totalPrice, 
    paymentMethod,
    orderNotes 
  } = req.body;

  const user = await User.findById(req.user.id).populate('cart.product');

  if (!user.cart || user.cart.length === 0) {
    res.status(400);
    throw new Error('Your cargo hold is empty.');
  }

  const orderItems = user.cart.map(({ product, quantity }) => ({
    name: product.name,
    quantity,
    image: product.images[0]?.url,
    price: product.price,
    product: product._id,
  }));

  // Set payment status based on method
  const paymentInfo = {
    status: paymentMethod === 'COD' ? 'pending' : 'succeeded',
  };

  const order = await Order.create({
    shippingInfo,
    orderItems,
    itemsPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paymentMethod,
    orderNotes,
    paidAt: paymentMethod === 'Online' ? Date.now() : undefined,
    user: req.user._id,
  });

  // --- Update Stock ---
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { inStock: -item.quantity },
    });
  }

  // Clear the user's cart
  user.cart = [];
  await user.save();

  res.status(201).json({
    success: true,
    order,
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
});

export const getSingleOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'username email'
  );

  if (!order) {
    res.status(404);
    throw new Error('Order not found in the archives.');
  }

  // A regular user can only see their own orders. An admin can see any.
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to view this transmission.');
  }

  res.json(order);
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id username').sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    orders,
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    if (order.orderStatus === 'Delivered') {
        res.status(400);
        throw new Error('This order has already been delivered.');
    }

    order.orderStatus = req.body.status;

    if (req.body.status === 'Delivered') {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

