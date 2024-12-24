import { dbConfig } from '../../DB/connection.js';
import {
  createTableSuperAdmin,
  createTableSuperAdminsPhones,
  createdTableHelpdesk,
} from '../../DB/models/admin/TableAdmin.model.js';
import * as AdminModels from '../../DB/models/admin/index.js';
import * as StudentModels from '../../DB/models/student/index.js';
import * as InstructorModels from '../../DB/models/instructors/index.js'
import { query } from 'express';
const createTable = async (query, tableName) => {
  try {
    const [result] = await dbConfig.promise().execute(query);
    return {
      success: result.warningStatus === 0,
      message:
        result.warningStatus === 0
          ? `${tableName} table created`
          : `${tableName} table already exists`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to create ${tableName} table`,
      error: error.message,
    };
  }
};

export const createdTables = async (req, res) => {
  const tables = [
    { query: createTableSuperAdmin, name: 'Super Admin' },
    { query: createTableSuperAdminsPhones, name: 'Super Admin Phone' },
    { query: createdTablHelpdesk, name: 'Helpdesk' },
    { query: StudentModels.createDepartmentTable, name: 'Department' },
    { query: StudentModels.createStudentTableQuery, name: 'Student' },
    { query: StudentModels.createStudentPhoneTableQuery, name: 'Student Phone' },
    { query: StudentModels.createSendTableQuery, name: 'Send' },
    { query: StudentModels.AssignmentTable, name: 'Assignment Table' },
    { query: StudentModels.TakesAssignmentTable, name: 'Takes Assignment Table' },
    { query: StudentModels.PaymentTable, name: 'Payment Table' },
    { query: StudentModels.ExtraPaymentTable, name: 'Extra Payment Table' },
    { query: StudentModels.createEnrollmentTable, name: 'Enrollment' },
    { query: InstructorModels.instructorTable, name: 'Instructor' },
    { query: InstructorModels.instructorPhoneTable, name: 'Instructor Phone' },
    { query: InstructorModels.createContentTable, name: 'Content' },
    { query: InstructorModels.createExamTable, name: 'Exam' },
    { query: InstructorModels.createMedia, name: 'Media' },
    { query: InstructorModels.createReceiveTable, name: 'Receive' },




  ];

  try {
    const results = await Promise.all(tables.map((table) => createTable(table.query, table.name)));

    const allSucceeded = results.every((result) => result.success);
    const hasFailures = results.some((result) => !result.success);

    return res.status(200).json({
      success: allSucceeded,
      message: allSucceeded
        ? 'All tables processed successfully'
        : `Some tables could not be created, ${results.map((result) => result.message + " ")}`,
      details: results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unexpected error in table creation',
      error: error.message,
    });
  }
};
