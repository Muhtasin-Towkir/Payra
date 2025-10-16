import User from '../models/user.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/genToken.js';

export const registerUser = asyncHandler(async (req, res) => {
  // 1. Add 'mobile' to the destructuring
  const { username, email, password, mobile } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with that email already exists');
  }
  
  // Add a check for existing mobile number
  const mobileExists = await User.findOne({ mobile });
  if (mobileExists) {
    res.status(400);
    throw new Error('User with that mobile number already exists');
  }

  // 2. Add 'mobile' to the create call
  const user = await User.create({
    username,
    email,
    password,
    mobile,
  });

  if (user) {
    const token = generateToken(user._id, user.role);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "User registered successfully!",
      token: token,
      user: userResponse,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token (Login)
// @route   POST /api/v1/auth/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.comparePassword(password))) {
    // Generate a token that includes the user's ID and role
    const token = generateToken(user._id, user.role);

    // Create a user object to send back, excluding the password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Logged in successfully!",
      token: token,
      user: userResponse,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get all users
// @route   GET /api/v1/auth/users
//  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password'); // Exclude passwords from the list
    res.status(200).json(users);
});