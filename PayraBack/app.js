import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import errorHandler from './middleware/error.js'; 
import cartRoute from './routes/cartRoute.js'
import contactRoutes from './routes/contactRoutes.js';
import requestRoutes from './routes/requestRoutes.js' 

// App config
const app = express();

// Core Setup Middleware
app.use(cors());
app.use(express.json());

// API endpoints (simple GET for root)
app.get('/', (req, res) => {
  res.status(200).send("API is working!");
});

// Route Middlewares
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoute);
app.use('/api/v1/contact', contactRoutes); 
app.use('/api/v1/request', requestRoutes);

// Custom Error Handler Middleware
app.use(errorHandler);

export default app;