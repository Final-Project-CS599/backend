import { errorAsyncHandler } from '../../../../utils/response/error.response.js';
import { successResponse } from '../../../../utils/response/success.response.js';
import dbConfig from '../../../../DB/connection.js';

export const alterTableIStudent = errorAsyncHandler(async (req, res, next) => {
  dbConfig.execute(
    `ALTER TABLE student MODIFY COLUMN s_password VARCHAR(255) NOT NULL`,
    (err, data) => {
      if (err || !data.affectedRows === 0) {
        return next(new Error('Failed to get data , execute query', { cause: 500 }));
      }
      return successResponse({ res, message: 'Table altered successfully', status: 200 });
    }
  );
});