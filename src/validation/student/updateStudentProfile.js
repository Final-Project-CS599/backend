import { body, param } from 'express-validator';

// Validation and sanitization rules
export const updateStudentProfileValidation = [
  // Validate and sanitize the student ID in the URL
  param('id').isInt().withMessage('Student ID must be an integer').toInt(), // Convert the ID to an integer
  // Validate and sanitize phoneNumbers (if provided)
  body('phoneNumbers')
    .optional() // Phone numbers are optional
    .isArray()
    .withMessage('Phone numbers must be an array')
    .custom((value) => {
      if (value.length > 0) {
        return value.every((phone) => typeof phone === 'string' && phone.trim().length > 0);
      }
      return true;
    })
    .withMessage('Each phone number must be a non-empty string')
    .customSanitizer((value) => value.map((phone) => phone.trim())), // Trim each phone number

  // Validate and sanitize password (if provided)
  body('password')
    .optional() // Password is optional
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/[a-zA-Z0-9]/)
    .withMessage('Password must contain letters and numbers'),

  // Validate and sanitize birthDate (if provided)
  body('birthDate')
    .optional() // Birth date is optional
    .isISO8601()
    .withMessage('Birth date must be a valid date in ISO8601 format (YYYY-MM-DD)')
    .toDate(), // Convert the value to a Date object

  // Validate and sanitize gender (if provided)
  body('gender')
    .optional() // Gender is optional
    .isIn(['Male', 'Female'])
    .withMessage('Gender must be one of: male, female')
    .trim(), // Trim whitespace
];
