import dotenv from 'dotenv';
import app from './app.js'; 
import connectDB from './config/mongoose.js';
import connectCloudinary from './config/cloudinary.js';

// Load environment variables
dotenv.config();

// Define port
const port = process.env.PORT || 4000;

// Connect to external services
connectDB();
connectCloudinary();

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});