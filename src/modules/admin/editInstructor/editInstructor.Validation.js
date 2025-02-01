import { body, param } from 'express-validator';


export const validateUpdateInstructor = [
    param('id').isInt().withMessage('Invalid instructor ID'),
    body('firstName').optional().trim().notEmpty().withMessage('First name is required'),
    body('lastName').optional().trim().notEmpty().withMessage('Last name is required'),
    body('email').optional().trim().isEmail().withMessage('Invalid email address'),
    body('department').optional().trim().notEmpty().withMessage('Department is required'),
  ];


export const validateSearchInstructors = [
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('firstName').optional().trim(),
    body('lastName').optional().trim(),
  ];