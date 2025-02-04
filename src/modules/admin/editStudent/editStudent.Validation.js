import { body, param, query } from 'express-validator';


export const validateUpdateStudents = [
  param('id').isInt().withMessage('Invalid Student ID'),
  body('firstName').optional().trim().notEmpty().withMessage('First name is required'),
  body('midName').optional().trim().notEmpty().withMessage('Middle name is required'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name is required'),
  body('email').optional().trim().isEmail().withMessage('Invalid email address'),
  body('department').optional().trim().notEmpty().withMessage('Department is required'),
  body('nationalId').optional().trim().notEmpty().withMessage('National Id is required')
  .isLength({ min: 14, max: 14 }).withMessage('National Id must be exactly 14 characters')
  .isNumeric().withMessage('National Id must contain only numbers')
];


export const validateSearchStudents = [
  query('department').trim().notEmpty().withMessage('Department is required'),
  query('firstName').optional().trim(),
  query('lastName').optional().trim(),
];