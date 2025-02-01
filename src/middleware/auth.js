import { AppError } from '../utils/AppError.js';
import { asyncHandler } from './asyncHandler.js';
import jwt from 'jsonwebtoken';

export const verifyToken = asyncHandler(async (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Token is required. Please log in', 401));
  }

  // Extract the token (remove "Bearer " from the header)
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE_ADMIN);
    // Attach the decoded payload (e.g., user ID) to the request object
    req.user = decoded;

    // Proceed to the next middleware or controller
    return next();
  } catch (err) {
    return next(new AppError('Invalid token', 401));
  }
});
