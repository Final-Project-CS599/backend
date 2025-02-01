import dbConfig from '../../../DB/connection.js';
import { asyncHandler } from '../../../middleware/asyncHandler.js';

const mainDepartments = [
  { deptName: 'Statistical Methods', deptCode: 'AS' },
  { deptName: 'Computer Science', deptCode: 'CS' },
  { deptName: 'Information Systems', deptCode: 'IT' },
  { deptName: 'Mathematical Methods', deptCode: 'MS' },
  { deptName: 'Operation Research', deptCode: 'OR' },
];

const conn = dbConfig.promise();

// (async () => {
//     try {
//         const deptCodes = `'${mainDepartments.map(dept => dept.deptCode).join("','")}'`;
//         const [existingDepts] = await conn.execute( `SELECT d_dept_code FROM department WHERE d_dept_code IN (${deptCodes})`);
//         if (existingDepts.length === 0) {
//             for (const dept of mainDepartments) {
//                 await conn.execute(`INSERT INTO department (d_dept_name, d_dept_code) VALUES (?, ?)`,[dept.deptName, dept.deptCode]);
//             }
//             console.log("Main departments inserted successfully");
//         } else {
//             console.log("Main departments already exist");
//         }
//     } catch (error) {
//         console.error("Error inserting core departments:", error);
//     }
// })();


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




