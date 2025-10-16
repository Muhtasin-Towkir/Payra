import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\+?[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // This creates a reference to a document in 'products' collection
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ],

}, { timestamps: true });

// Middleware to hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model.User || mongoose.model('User', UserSchema);

export default User;