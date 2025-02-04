import dbConfig from '../../../DB/connection.js';
import { body } from 'express-validator';
import { AppError } from '../../../utils/AppError.js';

const conn = dbConfig.promise();

export const validateAddDepartment = [
  body('department_name').trim().notEmpty()
    .withMessage('Department name is required')
    .isLength({ max: 100 }).withMessage('Department name must be less than 100 characters')
    .custom(async (value) => {
      const [existingDept] = await conn.execute('SELECT d_id FROM department WHERE d_dept_name = ?', [value]);
      if (existingDept.length > 0) {
        return new AppError('Department name already exists');
      }
      return true;
    }),

  body('department_code').trim().notEmpty()
    .withMessage('Department code is required')
    .isLength({ max: 10 }).withMessage('Department code must be less than 10 characters')
    .custom(async (value) => {
      const [existingDept] = await conn.execute('SELECT d_id FROM department WHERE d_dept_code = ?', [value]);
      if (existingDept.length > 0) {
        return new AppError('Department code already exists');
      }
      return true;
    }),
];