import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/product.js';

dotenv.config();

const runBestsellerMigration = async () => {
  let connection;
  try {
    console.log("Connecting to the archives...");
    connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connection successful.");

    // 1. Find all products in the archives
    const allProducts = await Product.find({});
    const productCount = allProducts.length;
    const halfCount = Math.ceil(productCount / 2);

    if (productCount === 0) {
      console.log("No products found in the archives to update.");
      return;
    }

    // 2. Create two update operations: one to set true, one to set false
    const productsToMakeBestseller = allProducts.slice(0, halfCount).map(p => p._id);
    const productsToMakeNotBestseller = allProducts.slice(halfCount).map(p => p._id);

    // 3. Execute the upgrades
    console.log(`Designating ${productsToMakeBestseller.length} products as bestsellers...`);
    await Product.updateMany(
      { _id: { $in: productsToMakeBestseller } },
      { $set: { isBestSeller: true } }
    );

    console.log(`Updating remaining ${productsToMakeNotBestseller.length} products...`);
    await Product.updateMany(
      { _id: { $in: productsToMakeNotBestseller } },
      { $set: { isBestSeller: false } }
    );

    console.log("Bestseller designation complete.");

  } catch (error) {
    console.error("A disturbance occurred during the bestseller migration:", error);
  } finally {
    if (connection) {
      await mongoose.disconnect();
      console.log("Disconnected from the archives.");
    }
  }
};

runBestsellerMigration();
