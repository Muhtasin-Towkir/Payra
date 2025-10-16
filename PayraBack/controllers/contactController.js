import asyncHandler from 'express-async-handler';
import Contact from '../models/contact.js';

//Public
export const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Mongoose validation will automatically handle missing required fields.
  const submission = await Contact.create({
    name,
    email,
    phone,
    message,
  });

  if (submission) {
    res.status(201).json({
      success: true,
      message: 'Transmission received. We will respond shortly.',
    });
  } else {
    res.status(400);
    throw new Error('Transmission failed. Invalid data provided.');
  }
});
