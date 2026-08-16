import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import {
  sendSignupNotification,
  sendLoginNotification,
} from '../services/emailService.js';

// Helper function to extract client IP address
const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.ip || 'Unknown';
};

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'codenest_jwt_secret_key_2026_super_secure',
    {
      expiresIn: '30d',
    }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email: email.toLowerCase() });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email address');
  }

  // Create user (password hashing handled in userModel pre-save hook)
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
  });

  if (user) {
    // Send email notification to admin asynchronously (won't block response)
    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';
    sendSignupNotification({
      name: user.name,
      email: user.email,
      ip,
      userAgent,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      createdAt: user.createdAt,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data provided');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please enter both email address and password');
  }

  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });

  if (user && (await user.matchPassword(password))) {
    // Send email notification to admin asynchronously (won't block response)
    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';
    sendLoginNotification({
      name: user.name,
      email: user.email,
      ip,
      userAgent,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      createdAt: user.createdAt,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } else {
    res.status(404);
    throw new Error('User profile not found');
  }
});
