import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/product.js'; // Adjust this path if your model is elsewhere

// Load environment variables (like your MONGODB_URI)
// No path is needed; dotenv defaults to the current working directory
dotenv.config(); 

const updateStock = async () => {
  try {
    // 1. Connect to the Database
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not found in .env file. Database connection failed.');
      return;
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connection established...');

    // 2. Run the Update Command
    // This finds all products ({}) and sets their inStock field to 100
    const result = await Product.updateMany(
      {}, 
      { $set: { inStock: 100 } }
    );

    console.log('--- Inventory Update Complete ---');
    console.log(`Successfully modified ${result.modifiedCount} product(s).`);

  } catch (error) {
    console.error('An error occurred during the update mission:');
    console.error(error);
  } finally {
    // 3. Disconnect from the Database
    await mongoose.disconnect();
    console.log('Database connection terminated.');
  }
};

// Execute the mission
updateStock();

