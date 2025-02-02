import dbConfig from '../../../DB/connection.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';
import { AppError } from '../../../utils/AppError.js';

const conn = dbConfig.promise();


const searchInstructors = asyncHandler(async (req, res, next) => {
  const { department, firstName, lastName } = req.query;

  let query = `
  SELECT 
      i.i_id AS id,
      i.i_firstName AS firstName,
      i.i_lastName AS lastName,
      i.i_email AS email,
      d.d_dept_name AS department
  FROM Instructors i
  LEFT JOIN department d ON i.i_departmentId = d.d_id
  WHERE d.d_dept_name = ?
`;

  const params = [department];

  if (firstName) {
    query += ` AND i.i_firstName LIKE ?`;
    params.push(`%${firstName}%`);
  }

  if (lastName) {
    query += ` AND i.i_lastName LIKE ?`;
    params.push(`%${lastName}%`);
  }

  const [instructors] = await conn.execute(query, params);

  if (!instructors || instructors.length === 0) {
    return res.status(200).json({ status: 'success', results: 0, data: { instructors: [] } });
  }

  res.status(200).json({ status: 'success', results: instructors.length, data: { instructors } });
});

const findInstructorById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return next(new AppError('Valid instructor ID is required', 400));

  const query = `
        SELECT 
            i.i_id as id,
            i.i_firstName as firstName,
            i.i_lastName as lastName,
            i.i_email as email,
            d.d_dept_name as department,
            GROUP_CONCAT(ip.p_instructorPhone) as phones
        FROM Instructors i
        LEFT JOIN department d ON i.i_departmentId = d.d_id
        LEFT JOIN InstructorsPhone ip ON i.i_id = ip.i_instructorId
        WHERE i.i_id = ?
        GROUP BY i.i_id
    `;

  const [instructors] = await conn.execute(query, [id]);

  if (!instructors.length) return next(new AppError('Instructor not found', 404));

  const instructor = {
    ...instructors[0],
    phones: instructors[0].phones ? instructors[0].phones.split(',') : []
  };

  res.status(200).json({ status: 'success', data: { instructor } });
});


const updateInstructorById = asyncHandler(async (req, res, next) => {
  const AdminId = req.user.id;
  const { id } = req.params;
  const { firstName, lastName, email, department } = req.body;

  let queryParams = [];
  let changeFields = [];

  if (firstName) {
    changeFields.push('i_firstName = ?');
    queryParams.push(firstName);
  }

  if (lastName) {
    changeFields.push('i_lastName = ?');
    queryParams.push(lastName);
  }

  if (email) {
    changeFields.push('i_email = ?');
    queryParams.push(email);
  }

  if (department) {
    const [deptResult] = await conn.query('SELECT d_id FROM department WHERE d_dept_name = ?', [department]);
    if (!deptResult.length) return next(new AppError('Department not found', 404));
    changeFields.push('i_departmentId = ?');
    queryParams.push(deptResult[0].d_id);
  }

  changeFields.push('i_updatedAt = CURRENT_TIMESTAMP , s_admin_id = ?');
  queryParams.push(AdminId);
  

  const sql = `UPDATE Instructors SET ${changeFields.join(', ')} WHERE i_id = ?`;

  queryParams.push(id);

  const [result] = await conn.query(sql, queryParams);

  if (result.affectedRows === 0) return next(new AppError('Instructor not found', 404));

  res.status(200).json({ status: 'success', message: 'Instructor updated successfully' });
});

const viewInstructorAcademicCourses = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return next(new AppError('Valid instructor ID is required', 400));

  const query = `
    SELECT DISTINCT
        c.c_id as courseId,
        c.c_name as courseName,
        a.aCourse_code as courseCode
    FROM courses c
    INNER JOIN academic a ON c.c_id = a.course_id
    WHERE c.c_instructorId = ?
    AND c.c_type = 'Academic'
  `;

  const [courses] = await conn.execute(query, [id]);

  if (!courses.length) return next(new AppError('No academic courses found for this instructor', 404));

  res.status(200).json({ status: 'success', message: 'Academic courses retrieved successfully', data: courses });
});

const viewInstructorExtraCourses = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return next(new AppError('Valid instructor ID is required', 400));

  const query = `
  SELECT DISTINCT
      c.c_id as courseId,
      c.c_name as courseName,
      e.e_Course_code as courseCode,
      e.e_price as price
  FROM courses c
  INNER JOIN Extra e ON c.c_id = e.e_courseId
  WHERE c.c_instructorId = ?
  AND c.c_type = 'Extra'
`;

  const [courses] = await conn.execute(query, [id]);

  if (!courses.length) return next(new AppError('No extra courses found for this instructor', 404));

  res.status(200).json({ status: 'success', message: 'Extra courses retrieved successfully', data: courses });
});

export {
  searchInstructors,
  findInstructorById,
  updateInstructorById,
  viewInstructorAcademicCourses,
  viewInstructorExtraCourses,
};
