import dbConfig from '../../../DB/connection.js';
import { successResponse } from '../../../utils/response/success.response.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';

export const getAllStudents = asyncHandler(async (req, res, next) => {
  dbConfig.execute(`SELECT * FROM student`, [], (err, results) => {
    if (err) {
      return next(new Error('Failed to fetch students', { cause: 500 }, err));
    }

    return successResponse({
      res,
      message: 'Students fetched successfully',
      status: 200,
      data: results,
    });
  });
});

export const getAllInstructors = asyncHandler(async (req, res, next) => {
  dbConfig.execute(`SELECT * FROM instructors`, [], (err, results) => {
    if (err) {
      return next(new Error('Failed to fetch instructors', { cause: 500 }, err));
    }

    return successResponse({
      res,
      message: 'Instructors fetched successfully',
      status: 200,
      data: results,
    });
  });
});

export const getAllAdmins = asyncHandler(async (req, res, next) => {
  dbConfig.execute(`SELECT * FROM superAdmin`, [], (err, results) => {
    if (err) {
      return next(new Error('Failed to fetch super admins', { cause: 500 }, err));
    }

    return successResponse({
      res,
      message: 'Super admins fetched successfully',
      status: 200,
      data: results,
    });
  });
});

export const getAllDepartments = asyncHandler(async (req, res, next) => {
  dbConfig.execute(`SELECT * FROM department`, [], (err, results) => {
    if (err) {
      return next(new Error('Failed to fetch departments', { cause: 500 }, err));
    }

    return successResponse({
      res,
      message: 'Departments fetched successfully',
      status: 200,
      data: results,
    });
  });
});
