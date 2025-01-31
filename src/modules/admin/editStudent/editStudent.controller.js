import dbConfig from '../../../DB/connection.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';
import { AppError } from '../../../utils/AppError.js';

const conn = dbConfig.promise();

const searchStudents = asyncHandler(async (req, res, next) => {
  const { department, firstName, lastName } = req.body;

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

  res.status(200).json({ status: 'success', results: students.length, data: { students } });
});

const findStudentById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return next(new AppError('Valid student ID is required', 400));

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

  if (!students.length) return next(new AppError('Student not found', 404));

  const student = {
    ...students[0],
    phones: students[0].phones ? students[0].phones.split(',') : [],
    dateOfBirth: new Date(students[0].dateOfBirth).toISOString().split('T')[0],
  };

  res.json({ status: 'success', data: { student } });
});

const updateStudentById = asyncHandler(async (req, res, next) => {
  const AdminId = req.user.id;
  const { id } = req.params;
  const { firstName, midName, lastName, email, department, nationalId } = req.body;

  let queryParams = [];
  let changeFields = [];
  
  if (firstName) {
    changeFields.push('s_first_name = ?');
    queryParams.push(firstName);
  }

  if (midName) {
    changeFields.push('s_middle_name = ?');
    queryParams.push(midName);
  }
  
  if (lastName) {
    changeFields.push('s_last_name = ?');
    queryParams.push(lastName);
  }
  
  if (email) {
    changeFields.push('s_email = ?');
    queryParams.push(email);
  }
  
  if (department) {
    const [deptResult] = await conn.query('SELECT d_id FROM department WHERE d_dept_name = ?', [department]);
    if (!deptResult.length) return next(new AppError('Department not found', 404));
    changeFields.push('s_department_id = ?');
    queryParams.push(deptResult[0].d_id);
  }

  if (nationalId) {
    changeFields.push('s_national_id = ?');
    queryParams.push(nationalId);
  }

  changeFields.push('s_updated_at = CURRENT_TIMESTAMP, s_admin_id = ?');
  queryParams.push(AdminId);

  const sql = `UPDATE student SET ${changeFields.join(', ')} WHERE s_id = ?`;

queryParams.push(id);
  
const [result] = await conn.query(sql, queryParams);

  if (result.affectedRows === 0) return next(new AppError('Student not found', 404));

  res.status(200).json({ status: 'success', message: 'Student updated successfully' });
});

const viewStudentAcademicCourses = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return next(new AppError('Valid Student ID is required', 400));

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

  const [courses] = await conn.execute(query, [id]);

  if (!courses.length) return next(new AppError('No academic courses found for this student', 404));

  res.status(200).json({ success: true, message: 'Academic courses retrieved successfully', data: courses });
});

const viewStudentExtraCourses = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return next(new AppError('Valid Student ID is required', 400));

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

  const [courses] = await conn.execute(query, [id]);

  if (!courses.length) return next(new AppError('No extra courses found for this student', 404));

  res.status(200).json({ status: 'success', message: 'Extra courses retrieved successfully', data: courses });
});

export {
  searchStudents,
  findStudentById,
  updateStudentById,
  viewStudentAcademicCourses,
  viewStudentExtraCourses,
};
