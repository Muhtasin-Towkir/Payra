import asyncHandler from 'express-async-handler';
import Contact from '../models/contact.js';

export const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;

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

// --- ADMIN FUNCTIONS ---

export const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await Contact.find({}).sort({ createdAt: -1 });
  res.status(200).json(messages);
});

export const getMessageById = asyncHandler(async (req, res) => {
  const message = await Contact.findById(req.params.id);

  if (message) {
    res.status(200).json(message);
  } else {
    res.status(404);
    throw new Error('Transmission record not found.');
  }
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Contact.findById(req.params.id);

  if (message) {
    await message.deleteOne();
    res.status(200).json({ message: 'Transmission record deleted.' });
  } else {
    res.status(404);
    throw new Error('Transmission record not found.');
  }
});
