import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Item name is required.'],
    trim: true,
  },
  externalLink: {
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required.'],
  },
  itemPhoto: {
    public_id: { type: String },
    url: { type: String },
  },
  // Reference to the user who made the request
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Sourced', 'Rejected'],
    default: 'Pending',
  }
}, { timestamps: true });

const Request = mongoose.model('Request', RequestSchema);

export default Request;
