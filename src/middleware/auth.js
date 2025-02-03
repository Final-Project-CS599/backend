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

  // Define an array of token signatures to try
  const tokenSignatures = [
    process.env.TOKEN_SIGNATURE, // Primary signature
    process.env.TOKEN_SIGNATURE_ADMIN, // Fallback signature 1
  ];

  let decoded = null;

  // Try each signature in sequence
  for (const signature of tokenSignatures) {
    try {
      if (!signature) continue; // Skip if the signature is not defined
      decoded = jwt.verify(token, signature);
      break; // Exit the loop if verification succeeds
    } catch (err) {
      // Continue to the next signature if verification fails
      continue;
    }
  }

  // If no signature worked, throw an error
  if (!decoded) {
    return next(new AppError('Invalid token', 401));
  }

  // Attach the decoded payload (e.g., user ID) to the request object
  req.user = decoded;

  // Proceed to the next middleware or controller
  return next();
});
