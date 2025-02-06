import { body, param, query } from 'express-validator';


export const validateUpdateStudents = [
  param('id').isInt().withMessage('Invalid Student ID'),
  body('firstName').optional().trim().notEmpty().withMessage('First name is required')
    .matches(/^[A-Za-z]+$/).withMessage('First name must contain only letters'),
  body('middleName').optional().trim().notEmpty().withMessage('Middle name is required')
    .matches(/^[A-Za-z]+$/).withMessage('Middle name must contain only letters'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name is required')
    .matches(/^[A-Za-z]+$/).withMessage('Last name must contain only letters'),
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