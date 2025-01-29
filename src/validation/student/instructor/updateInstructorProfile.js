import { body, param } from 'express-validator';

export const updateInstructorProfileValidation = [
  param('id').isInt().withMessage('Instructor ID must be an integer').toInt(), 
  body('phoneNumbers')
    .optional() 
    .isArray()
    .withMessage('Phone numbers must be an array')
    .custom((value) => {
      if (value.length > 0) {
        return value.every((phone) => typeof phone === 'string' && phone.trim().length > 0);
      }
      return true;
    })
    .withMessage('Each phone number must be a non-empty string')
    .customSanitizer((value) => value.map((phone) => phone.trim())), 

  body('password')
    .optional() 
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[a-zA-Z0-9]/)
    .withMessage('Password must contain letters and numbers'),

  body('birthDate')
    .optional() 
    .isISO8601()
    .withMessage('Birth date must be a valid date in ISO8601 format (YYYY-MM-DD)')
    .toDate(), 

  body('gender')
    .optional() 
    .isIn(['Male', 'Female'])
    .withMessage('Gender must be one of: male, female')
    .trim(), 
];
