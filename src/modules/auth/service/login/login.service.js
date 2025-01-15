import { errorAsyncHandler } from '../../../../utils/error/error.handling.js';
import { successResponse } from '../../../../utils/response/success.response.js';
import dbConfig from '../../../../DB/connection.js';
import { compareHash } from '../../../../utils/hash/hash.js';
import { generateToken } from '../../../../utils/token/token.js';
import { roleTypes } from '../../../../middleware/auth.middleware.js';

/////////////////////////////////////


const loginUtility = async (tableName, emailColumn, passwordColumn, idColumn, roleColumn, updatedAtColumn, email, password, res, next) => {
    return new Promise((resolve, reject) => {
        dbConfig.execute(
            `SELECT * FROM ${tableName} WHERE ${emailColumn} = ?`,
            [email],
            async (err, userData) => {
                if (err) {
                    return reject({ status: 500, message: 'Error while logging in', error: err });
                }
                if (!userData.length) {
                    return resolve(null);
                }

                const user = userData[0];
                const match = compareHash({ plainText: password, hashValue: user[passwordColumn] });
                if (!match) {
                    // return reject({ status: 401, message: "Invalid password" });
                    return reject(JSON.stringify({ status: 401, message: "Invalid password" }));
                }

        await dbConfig.execute(
          `UPDATE ${tableName} SET ${updatedAtColumn} = NOW() WHERE ${emailColumn} = ?`,
          [email]
        );

        const tokenPayload = { id: user[idColumn], isLoggedIn: true };

        if (roleColumn) {
          tokenPayload.role = user[roleColumn];
        }

        const token = generateToken({
          payload: tokenPayload,
          signature:
            user[roleColumn] === roleTypes.User
              ? process.env.TOKEN_SIGNATURE
              : process.env.TOKEN_SIGNATURE_ADMIN,
          options: { expiresIn: '24h' },
        });

        let userInfo;
        switch (tableName) {
          case 'superAdmin':
            userInfo = {
              firstName: user.sAdmin_firstName,
              lastName: user.sAdmin_lastName,
              email: user.sAdmin_email,
              role: user.sAdmin_role,
            };
            break;
          case 'Instructors':
            userInfo = {
              id: user.i_id,
              firstName: user.i_firstName,
              lastName: user.i_lastName,
              email: user.i_email,
              department: user.i_department,
              role: 'instructor',
            };
            break;
          case 'student':
            userInfo = {
              firstName: user.s_first_name,
              lastName: user.s_last_name,
              middleName: user.s_middle_name,
              email: user.s_email,
              department: user.s_department,
              gender: user.s_gender,
              DOB: user.s_DOB,
              department: user.s_department,
              role: 'student',
            };
            break;
        }

        return resolve({ token, userInfo });
      }
    );
  });
};

const login = errorAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const superAdminResult = await loginUtility(
      'superAdmin',
      'sAdmin_email',
      'sAdmin_password',
      'sAdmin_nationalID',
      'sAdmin_role',
      'sAdmin_updatedAt',
      email,
      password,
      res,
      next
    );

    if (superAdminResult) {
      return successResponse({
        res,
        message: 'Welcome SuperAdmin to your account (login)',
        status: 200,
        data: { token: superAdminResult.token },
      });
    }

    const instructorsResult = await loginUtility(
      'Instructors',
      'i_email',
      'i_password',
      'i_id',
      null,
      'i_updatedAt',
      email,
      password,
      res,
      next
    );

    if (instructorsResult) {
      return successResponse({
        res,
        message: 'Welcome Instructor to your account (login)',
        status: 200,
        data: { token: instructorsResult.token },
      });
    }
    const studentResult = await loginUtility(
      'student',
      's_email',
      's_password',
      's_id',
      null,
      's_updated_at',
      email,
      password,
      res,
      next
    );

    if (studentResult) {
      return successResponse({
        res,
        message: 'Welcome Student to your account (login)',
        status: 200,
        data: { token: studentResult.token, user: studentResult.userInfo },
      });
    }
    return next(new Error('User not found', { cause: 404 }));
  } catch (error) {
    const errorObj = JSON.parse(error);
    return next(new Error(errorObj.message, { cause: errorObj.status }));
  }
});

export default login;



// await dbConfig.execute(` UPDATE superAdmin SET sAdmin_lastLoginTime = CURRENT_TIMESTAMP WHERE sAdmin_email=? `,
//     [email]
// )
