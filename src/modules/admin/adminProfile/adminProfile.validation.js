import { body, param} from 'express-validator';

export const validateEditProfile = [
    param('nationalId').trim().notEmpty()
    .withMessage('National ID is required')
    .isLength(14)
    .withMessage('National ID must be 14 character'),  

  body('primaryPhone').optional().trim().isMobilePhone('any')
    .withMessage('Primary phone must be a valid phone number'),

  body('secondaryPhone').optional().trim().isMobilePhone('any')
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