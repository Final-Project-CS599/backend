import dbConfig from '../../../DB/connection.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';
import { AppError } from '../../../utils/AppError.js';

const conn = dbConfig.promise();

const searchStudents = asyncHandler(async (req, res, next) => {
  const { department, firstName, lastName } = req.body;

  if (!department) return AppError('Department is required', 400);

  let query = `
        SELECT 
            s.s_id AS id,
            s.s_first_name AS firstName,
            s.s_last_name AS lastName,
            s.s_email AS email,
            d.d_dept_name AS department
        FROM student s
        LEFT JOIN department d ON s.s_department_id = d.d_id
        WHERE d.d_dept_name = ?
    `;

  const params = [department];

  if (firstName) {
    query += ` AND s.s_first_name LIKE ?`;
    params.push(`%${firstName}%`);
  }

  if (lastName) {
    query += ` AND s.s_last_name LIKE ?`;
    params.push(`%${lastName}%`);
  }

  const [students] = await conn.execute(query, params);

  res.json({ status: 'success', results: students.length, data: { students } });
});

const findStudentById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return AppError('Valid student ID is required', 400);

  const query = `
        SELECT 
            s.s_id as id,
            s.s_first_name as firstName,
            s.s_last_name as lastName,
            s.s_middle_name as middleName,
            s.s_email as email,
            s.s_DOB as dateOfBirth,
            s.s_gender as gender,
            s.s_national_id as nationalId,
            d.d_dept_name as department,
            GROUP_CONCAT(sp.sp_phone) as phones
        FROM student s
        LEFT JOIN department d ON s.s_department_id = d.d_id
        LEFT JOIN student_phone sp ON s.s_id = sp.sp_student_id
        WHERE s.s_id = ?
        GROUP BY s.s_id
    `;

  const [students] = await conn.execute(query, [id]);

  if (!students.length) return AppError('Student not found', 404);

  const student = {
    ...students[0],
    phones: students[0].phones ? students[0].phones.split(',') : [],
    dateOfBirth: new Date(students[0].dateOfBirth).toISOString().split('T')[0],
  };

  res.json({ status: 'success', data: { student } });
});

const updateStudentById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { firstName, midName, lastName, email, department, nationalId } = req.body;

  const [deptResult] = await conn.query('SELECT d_id FROM department WHERE d_dept_name = ?', [
    department,
  ]);

  if (!deptResult.length) return AppError('Department not found', 404);

  const [result] = await conn.query(
    `UPDATE student 
         SET s_first_name = ?, 
             s_middle_name = ?,
             s_last_name = ?,
             s_email = ?,
             s_national_id = ?,
             s_department_id = ?,
             s_updated_at = CURRENT_TIMESTAMP
         WHERE s_id = ?`,
    [firstName, midName, lastName, email, nationalId, deptResult[0].d_id, id]
  );

  if (result.affectedRows === 0) return AppError('Student not found', 404);

  res.status(200).json({ status: 'success', message: 'Student updated successfully' });
});

const viewStudentAcademicCourses = asyncHandler(async (req, res, next) => {
  const studentId = req.params.studentId;

  const query = `
            SELECT DISTINCT
                c.c_id as courseId,
                c.c_name as courseName,
                a.aCourse_code as courseCode
            FROM courses c
            INNER JOIN academic a ON c.c_id = a.course_id
            INNER JOIN enrollment e ON c.c_id = e.e_courseId
            WHERE e.e_studentId = ?
            AND c.c_type = 'Academic'
        `;

  const [rows] = await conn.execute(query, [studentId]);

  await conn.end();

  if (!rows.length) return AppError('No academic courses found for this student', 404);

  res
    .status(200)
    .json({ success: true, message: 'Academic courses retrieved successfully', data: rows });
});

const viewStudentExtraCourses = asyncHandler(async (req, res, next) => {
  const studentId = req.params.studentId;

  const query = `
         SELECT DISTINCT
             c.c_id as courseId,
             c.c_name as courseName,
             e.e_Course_code as courseCode,
             e.e_price as price
         FROM courses c
         INNER JOIN Extra e ON c.c_id = e.e_courseId
         INNER JOIN enrollment enr ON c.c_id = enr.e_courseId
         WHERE enr.e_studentId = ?
         AND c.c_type = 'Extra'
     `;

  const [rows] = await conn.execute(query, [studentId]);

  await conn.end();

  if (!rows.length) return AppError('No extra courses found for this student', 404);

  res
    .status(200)
    .json({ status: 'success', message: 'Extra courses retrieved successfully', data: rows });
});

export {
  searchStudents,
  findStudentById,
  updateStudentById,
  viewStudentAcademicCourses,
  viewStudentExtraCourses,
};
