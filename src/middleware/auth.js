import { AppError } from '../utils/AppError.js';
import { asyncHandler } from './asyncHandler.js';
import jwt from 'jsonwebtoken';

export const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Token is required. Please log in', 401));
  }

  const token = authHeader.split(' ')[1];

  const tokenSignatures = [
    process.env.TOKEN_SIGNATURE, // Primary signature
    process.env.TOKEN_SIGNATURE_ADMIN, // Fallback signature 1
  ];

  let decoded = null;

  for (const signature of tokenSignatures) {
    try {
      if (!signature) continue;
      decoded = jwt.verify(token, signature);
      break;
    } catch (err) {
      continue;
    }
  }

  if (!decoded) {
    return next(new AppError('Invalid token', 401));
  }

  req.user = decoded;

  return next();
});
