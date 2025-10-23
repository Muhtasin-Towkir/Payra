import Product from '../models/product.js';
import asyncHandler from 'express-async-handler';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

 
//Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { 
    sku, name, price, description, category,
    subcategory, inStock, sale, originalPrice, 
    rating, reviews, details 
  } = req.body;

  const productDate = req.body.date || new Date();

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('Please upload at least one image for the product');
  }
  
  // Cloudinary upload logic for multiple files
  const uploadPromises = req.files.map(file => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ folder: "products" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  });

  const uploadResults = await Promise.all(uploadPromises);
  const imagesData = uploadResults.map(result => ({
    public_id: result.public_id,
    url: result.secure_url,
  }));

  // Create the product with all fields from the schema
  const product = await Product.create({
    sku, name, price, description, category,
    subcategory, 
    date: productDate, 
    inStock, sale, originalPrice,
    rating, reviews, details,
    images: imagesData,
  });

  res.status(201).json({ success: true, product });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const queryObj = {};

  // Build the query object dynamically from URL query params
  if (req.query.category) queryObj.category = req.query.category;
  if (req.query.subcategory) queryObj.subcategory = req.query.subcategory;
    if (req.query.inStock) {
    // req.query.inStock will arrive as an object like { gte: '1' } or { lte: '0' }
    queryObj.inStock = req.query.inStock; 
  }

  if (req.query['details.color']) queryObj['details.color'] = { $in: req.query['details.color'].split(',') };
  if (req.query['details.size']) queryObj['details.size'] = { $in: req.query['details.size'].split(',') };
  if (req.query.material) queryObj['details.material'] = { $in: req.query.material.split(',') };
  if (req.query.origin) queryObj['details.origin'] = { $in: req.query.origin.split(',') };
  
  let query = Product.find(queryObj);

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt'); // Default sort: newest first
  }

  const products = await query;

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

// READ (Single)
// Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(44);
    throw new Error('Product not found');
  }
  res.status(200).json({ success: true, product });
});

// UPDATE
//Admin
export const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, product });
});

// DELETE
//Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Delete all images from Cloudinary associated with the product
  if (product.images && product.images.length > 0) {
    const public_ids = product.images.map(image => image.public_id);
    await cloudinary.api.delete_resources(public_ids);
  }
  
  await product.deleteOne();

  res.status(200).json({ success: true, message: 'Product deleted successfully' });
});

// SEARCH
// Public
export const searchProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) {
    res.status(400);
    throw new Error('Please provide a search keyword');
  }

  // Aggregation Pipeline to use the Atlas Search index
  const products = await Product.aggregate([
    {
      $search: {
        index: 'productSearch', // The name of the index you created in Atlas
        text: {
          query: keyword,
          path: {
            'wildcard': '*' // Search across all fields defined in the index
          },
          fuzzy: {
            maxEdits: 1 // Enables typo tolerance for 1-character mistakes
          }
        }
      }
    },
    {
      $addFields: {
        score: { $meta: "searchScore" } // Add a relevance score field
      }
    },
    {
        $sort: { score: -1 } // Sort by the highest relevance score first
    }
  ]);

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

export const getBestsellerProducts = asyncHandler(async (req, res) => {
  // Find all products where the isBestSeller flag is true
  const products = await Product.find({ isBestSeller: true });

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

