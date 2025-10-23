import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  sku: {
    type: String, 
    unique: true,
    sparse: true
  },
  name: { type: String, required: true },
  
  description: { type: String, required: true },

  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  isBestSeller: { type: Boolean, default: false, index: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  inStock: { type: Number, default: 100, required: true },
  images: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  sale: { type: Boolean, default: false },
  date: { type: Date, required: true},
  
  details: {
    author: { type: String },
    size: [ String ],
    color: { type: String },
    origin: { type: String },
    material: { type: String },
  },
}, { timestamps: true });

const Product = mongoose.model.Product || mongoose.model('Product', ProductSchema);

export default Product;