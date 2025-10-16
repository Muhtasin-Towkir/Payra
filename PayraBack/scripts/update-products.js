import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/product.js';

dotenv.config();

const runMigration = async () => {
  let connection;
  try {
    console.log("Connecting to the archives...");
    connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connection successful.");

    // --- Mission 1: Add 'description' field if it doesn't exist ---
    console.log("Executing Mission 1: Add Description...");
    const descFilter = { description: { $exists: false } };
    const descUpdate = { $set: { description: "Default description. Please update." } };
    const descResult = await Product.updateMany(descFilter, descUpdate);
    console.log(`- Description: ${descResult.modifiedCount} records upgraded.`);

    // --- Mission 2: Add 'size' array to Clothes & Ornaments if it doesn't exist ---
    console.log("Executing Mission 2: Add Size Attribute...");
    const sizeFilter = {
      category: { $in: ['Clothes', 'Ornaments'] }, // Target only these categories
      'details.size': { $exists: false }           // Where 'details.size' does NOT exist
    };
    const sizeUpdate = {
      $set: {
        'details.size': ["S", "M", "L", "XL"] // Use dot notation to set the nested field
      }
    };
    const sizeResult = await Product.updateMany(sizeFilter, sizeUpdate);
    console.log(`- Size: ${sizeResult.modifiedCount} records upgraded.`);


  } catch (error) {
    console.error("A disturbance in the Force occurred during migration:", error);
  } finally {
    if (connection) {
      await mongoose.disconnect();
      console.log("Disconnected from the archives. All missions complete.");
    }
  }
};

runMigration();