import asyncHandler from 'express-async-handler';
import Request from '../models/request.js';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// Private
export const createRequest = asyncHandler(async (req, res) => {
  const { itemName, externalLink, quantity } = req.body;

  let imageUploadResult = {};

  // Check if a file was uploaded
  if (req.file) {
    // Upload image to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ folder: "requests" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    const uploadResult = await uploadPromise;
    imageUploadResult = {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
    };
  }

  // Create the request document in the database
  const request = await Request.create({
    itemName,
    externalLink,
    quantity,
    itemPhoto: imageUploadResult,
    user: req.user.id, // Get the user ID from the 'protect' middleware
  });

  if (request) {
    res.status(201).json({
      success: true,
      message: 'Product request received.',
      request,
    });
  } else {
    res.status(400);
    throw new Error('Invalid request data.');
  }
});

