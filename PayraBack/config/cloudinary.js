import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const connectCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
    });
    console.log("Cloudinary connected successfully");
  } catch (error) {
    console.error("Cloudinary connection error:", error.message);
  }
};

export default connectCloudinary;