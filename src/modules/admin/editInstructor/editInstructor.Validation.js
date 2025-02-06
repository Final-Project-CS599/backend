import { body, param, query } from 'express-validator';


export const validateUpdateInstructor = [
    param('id').isInt().withMessage('Invalid instructor ID'),
    body('firstName').optional().trim().notEmpty().withMessage('First name is required')
    .matches(/^[A-Za-z]+$/).withMessage('First name must contain only letters'),
    body('lastName').optional().trim().notEmpty().withMessage('Last name is required')
    .matches(/^[A-Za-z]+$/).withMessage('Last name must contain only letters'),
    body('email').optional().trim().isEmail().withMessage('Invalid email address'),
    body('department').optional().trim().notEmpty().withMessage('Department is required'),
  ];


export const validateSearchInstructors = [
  query('department').trim().notEmpty().withMessage('Department is required'),
  query('firstName').optional().trim(),
  query('lastName').optional().trim(),
  ];