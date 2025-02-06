import dbConfig from '../../../DB/connection.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';

const conn = dbConfig.promise();

const addDepartment = asyncHandler(async (req, res, next) => {
  const AdminId = req.user.id;
  const { department_name, department_code } = req.body;

  const [result] = await conn.execute(
    'INSERT INTO department (d_dept_name, d_dept_code, d_adminNid) VALUES (?, ?, ?)',
    [department_name, department_code, AdminId]
  );

  res.status(201).json({
    message: 'Department added successfully',
    department: {
      id: result.insertId,
      department_name: department_name,
      department_code: department_code,
    },
  });
});

const getAllDepartments = asyncHandler(async (req, res, next) => {
  const [departments] = await conn.execute(
    `SELECT d_id AS id, d_dept_name AS department_name, d_dept_code AS department_code FROM department`
  );
  res.json({ message: 'success', departments });
});

export { addDepartment, getAllDepartments };




