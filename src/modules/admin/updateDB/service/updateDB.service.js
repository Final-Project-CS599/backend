import { errorAsyncHandler } from '../../../../utils/response/error.response.js';
import { successResponse } from '../../../../utils/response/success.response.js';
import dbConfig from '../../../../DB/connection.js';

export const alterTableIStudent = errorAsyncHandler(async (req, res, next) => {
  dbConfig.execute(
    `ALTER TABLE student MODIFY COLUMN s_password VARCHAR(255) NOT NULL`,
    (err, data) => {
      if (err || !data.affectedRows === 0) {
        return next(new Error('Failed to get data , execute query', { cause: 500 }));
        // return res.status(500).json({ message: 'Failed to get data , execute query', error: err });
      }
      return successResponse({ res, message: 'Table altered successfully', status: 200 });
    }
  );
});

// export const alterTableExtraPayment = errorAsyncHandler(async (req, res, next) => {
//   // Check if the extra_payment table exists
//   dbConfig.execute(`SHOW TABLES LIKE 'extra_payment'`, async (err, data) => {
//     if (err) {
//       return next(new Error('Failed to check table existence', { cause: 500 }));
//     }

//     if (data.length === 0) {
//       return next(new Error('extra_payment table does not exist', { cause: 404 }));
//     }

//     // Alter the extra_payment table to add payment_id as a foreign key
//     dbConfig.execute(
//       `ALTER TABLE extra_payment
//                  ADD COLUMN payment_id INT NOT NULL,
//                  ADD CONSTRAINT fk_payment
//                  FOREIGN KEY (payment_id) REFERENCES payment(id) ON DELETE CASCADE ON UPDATE CASCADE`,
//       (err, data) => {
//         if (err || data.affectedRows === 0) {
//           return next(new Error(`Failed to alter table, execute query ${err}`, { cause: 500 }));
//         }
//         return successResponse({ res, message: 'Table altered successfully', status: 200 });
//       }
//     );
//   });
// });
