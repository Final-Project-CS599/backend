import { body } from 'express-validator';

// Validation and sanitization rules
export const updateStudentProfileValidation = [
  body('primaryPhone').optional().trim(),
  body('secondaryPhone').optional().trim(),
  body('password')
    .optional()
    .trim()
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/[a-zA-Z0-9]/)
    .withMessage('Password must contain letters and numbers'),

  body('birthDate')
    .optional() // Birth date is optional
    .isISO8601()
    .withMessage('Birth date must be a valid date in ISO8601 format (YYYY-MM-DD)')
    .toDate(), // Convert the value to a Date object

  body('gender')
    .optional() // Gender is optional
    .isIn(['Male', 'Female'])
    .withMessage('Gender must be one of: male, female')
    .trim(), // Trim whitespace
];
