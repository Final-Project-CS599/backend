import dbConfig from '../../../../DB/connection';
import { errorAsyncHandler } from '../../../../utils/response/error.response';

export const updateEnrollment = errorAsyncHandler(async (req, res, next) => {
  const studentId = req.user.id;
  const courseId = req.body.id;

  if (!studentId || !courseId) {
    return next(new Error('Student ID and Course ID are required', { cause: 400 }));
  }

  const query = `UPDATE enrollment SET c_courseId = ? WHERE e_studentId = ?`;

  dbConfig.execute(query, [courseId, studentId], (error, results) => {
    if (error) {
      return next(new Error('Internal server error', { cause: 500 }));
    }

    if (results.affectedRows === 0) {
      return next(new Error('Enrollment not found', { cause: 404 }));
    }

    return successResponse({
      res,
      message: 'Enrollment updated successfully',
      status: 200,
    });
  });
});

export default updateEnrollment;
