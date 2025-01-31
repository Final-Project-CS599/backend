import { body, param } from 'express-validator';


export const validateUpdateStudents = [
    param('id').isInt().withMessage('Invalid Student ID'),
    body('firstName').optional().trim().notEmpty().withMessage('First name is required'),
    body('midName').optional().trim().notEmpty().withMessage('Middle name is required'),
    body('lastName').optional().trim().notEmpty().withMessage('Last name is required'),
    body('email').optional().trim().isEmail().withMessage('Invalid email address'),
    body('department').optional().trim().notEmpty().withMessage('Department is required'),
    body('nationalId').optional().trim().notEmpty().withMessage('National Id is required'),
  ];


export const validateSearchStudents = [
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('firstName').optional().trim(),
    body('lastName').optional().trim(),
  ];