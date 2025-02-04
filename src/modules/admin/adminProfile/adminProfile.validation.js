import { body } from 'express-validator';

export const validateEditProfile = [
  body('primaryPhone').optional().trim().isMobilePhone('ar-EG')
    .withMessage('Primary phone must be a valid phone number'),

  body('secondaryPhone').optional().trim().isMobilePhone('ar-EG')
    .withMessage('Secondary phone must be a valid phone number'),

  body('newPassword').optional().trim().isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/[a-zA-Z0-9]/)
    .withMessage('Password must contain letters and numbers'),

  body('confirmPassword').optional().trim()
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('New password and confirm password do not match');
      }
      return true;
    }),
];