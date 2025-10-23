import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoute from './routes/cartRoute.js'
import contactRoutes from './routes/contactRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import orderRoute from './routes/orderRoute.js'; 
import errorHandler from './middleware/error.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import userRoutes from './routes/userRoutes.js'; 

// App config
const app = express();

// Core Setup Middleware
app.use(cors());
app.use(express.json());

// API endpoints
app.get('/', (req, res) => {
  res.status(200).send("API is working!");
});

// Route Middlewares
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoute);
app.use('/api/v1/contact', contactRoutes); 
app.use('/api/v1/request', requestRoutes);
app.use('/api/v1/orders', orderRoute); 

// --- ADMIN ROUTE ---
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
// Custom Error Handler Middleware
app.use(errorHandler);

export default app;
