import mongoose from 'mongoose';
import validator from 'validator';

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name is required for this transmission.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'An email is required for this transmission.'],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address.'],
  },
  phone: {
    type: String,
    required: [true, 'A phone number is required for this transmission.'],
    trim: true,
  },
  message: {
    type: String,
    trim: true,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const Contact = mongoose.model('Contact', ContactSchema);

export default Contact;
