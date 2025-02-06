import dbConfig from '../../../../DB/connection.js';
import { errorAsyncHandler } from '../../../../utils/response/error.response.js';
import { successResponse } from '../../../../utils/response/success.response.js';

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

export const getPayments = errorAsyncHandler(async (req, res, next) => {
  const query = `
  SELECT
    *
  FROM payment`;

  dbConfig.execute(query, (error, results) => {
    if (error) {
      return next(new Error('Internal server error', { cause: 500 }));
    }

    if (results.length === 0) {
      return successResponse({
        res,
        message: 'No payments found',
        status: 200,
        data: [],
      });
    }

    return successResponse({
      res,
      message: 'Payments retrieved successfully',
      status: 200,
      data: results,
    });
  });
});

export const approvePayment = errorAsyncHandler(async (req, res, next) => {
  const { student_id } = req.body;

  if (!student_id) {
    return next(new Error('Student ID is required', { cause: 400 }));
  }

  const fetchCourseQuery = `
      SELECT course_id
      FROM extra_payment
      WHERE student_id = ?
    `;
  const [extraPaymentResults] = await dbConfig.promise().query(fetchCourseQuery, [student_id]);
  console.log('extraPaymentResults:', extraPaymentResults);

  if (extraPaymentResults.length === 0) {
    return next(
      new Error('Course details not found for the student in extra_payment table', { cause: 404 })
    );
  }

  const { course_id } = extraPaymentResults[0];

  const insertEnrollmentQuery = `
      INSERT INTO enrollment (e_studentId, e_courseId)
      VALUES (?, ?)
    `;
  await dbConfig.promise().query(insertEnrollmentQuery, [student_id, course_id]);

  return successResponse({
    res,
    message: 'Student enrolled successfully',
    status: 200,
  });
});

export const cancelPayment = errorAsyncHandler(async (req, res, next) => {
  const paymentId = req.params.id; // Assuming payment_id is passed as a URL parameter

  if (!paymentId) {
    return next(new Error('Payment ID is required', { cause: 400 }));
  }

  try {
    //  Fetch student_id from the payment table
    const fetchStudentQuery = `
      SELECT student_id
      FROM payment
      WHERE id = ?
    `;
    const [paymentResults] = await dbConfig.promise().query(fetchStudentQuery, [paymentId]);

    if (paymentResults.length === 0) {
      return next(new Error('Payment not found', { cause: 404 }));
    }

    const { student_id } = paymentResults[0];

    //  Fetch course_id from the extra_payment table using student_id
    const fetchCourseQuery = `
      SELECT course_id
      FROM extra_payment
      WHERE student_id = ?
    `;
    const [extraPaymentResults] = await dbConfig.promise().query(fetchCourseQuery, [student_id]);

    if (extraPaymentResults.length === 0) {
      return next(
        new Error('Course details not found for the student in extra_payment table', { cause: 404 })
      );
    }

    const { course_id } = extraPaymentResults[0];

    //  Remove the student's enrollment from the enrollment table
    const deleteEnrollmentQuery = `
      DELETE FROM enrollment
      WHERE e_studentId = ? AND e_courseId = ?
    `;
    const [deleteEnrollmentResults] = await dbConfig
      .promise()
      .query(deleteEnrollmentQuery, [student_id, course_id]);

    if (deleteEnrollmentResults.affectedRows === 0) {
      return next(new Error('Enrollment not found', { cause: 404 }));
    }

    //  Delete the record from the extra_payment table
    const deleteExtraPaymentQuery = `
      DELETE FROM extra_payment
      WHERE student_id = ? AND course_id = ?
    `;
    await dbConfig.promise().query(deleteExtraPaymentQuery, [student_id, course_id]);

    // Delete the record from the payment table
    const deletePaymentQuery = `
      DELETE FROM payment
      WHERE id = ?
    `;
    await dbConfig.promise().query(deletePaymentQuery, [paymentId]);

    return successResponse({
      res,
      message: 'Payment cancelled, enrollment removed, and records deleted successfully',
      status: 200,
    });
  } catch (error) {
    console.error('Error cancelling payment:', error);
    return next(new Error('Internal server error', { cause: 500 }));
  }
});
