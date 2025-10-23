import asyncHandler from 'express-async-handler';
import Request from '../models/request.js';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

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
    user: req.user.id, 
  })

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

// --- NEW USER FUNCTION ---

export const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ user: req.user.id })
    .populate('user', 'username email')
    .sort({ createdAt: -1 });

  res.status(200).json(requests);
});


// --- ADMIN FUNCTIONS ---

export const getAllRequests = asyncHandler(async (req, res) => {
  // Populate the 'user' field, selecting only their username and email
  const requests = await Request.find({})
    .populate('user', 'username email')
    .sort({ createdAt: -1 });
    
  res.status(200).json(requests);
});

export const getRequestById = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id).populate('user', 'username email');

  if (request) {
    res.status(200).json(request);
  } else {
    res.status(404);
    throw new Error('Request record not found.');
  }
});

export const deleteRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    res.status(4404);
    throw new Error('Request record not found.');
  }

  // Check if there is an image associated and delete it from Cloudinary
  if (request.itemPhoto && request.itemPhoto.public_id) {
    await cloudinary.uploader.destroy(request.itemPhoto.public_id);
  }

  // Delete the request from the database
  await request.deleteOne();
  res.status(200).json({ message: 'Request record deleted.' });
});

