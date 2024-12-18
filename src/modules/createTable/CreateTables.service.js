import { dbConfig } from '../../DB/connection.js';
import {
  createTableSuperAdmin,
  createTableSuperAdminsPhones,
  createdTablHelpdesk,
} from '../../DB/models/admin/TableAdmin.model.js';
import * as StudentModels from '../../DB/models/student/index.js';

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
    { query: StudentModels.createDepartmentTable, name: 'Department Table' },
    { query: createdTablHelpdesk, name: 'Helpdesk' },
    { query: StudentModels.createStudentTableQuery, name: 'Student' },
    { query: StudentModels.createStudentPhoneTableQuery, name: 'Student Phone' },
    { query: StudentModels.createSendTableQuery, name: 'Send' },
    { query: StudentModels.AssignmentTable, name: 'Assignment Table' },
    { query: StudentModels.TakesAssignmentTable, name: 'Takes Assignment Table' },
    { query: StudentModels.PaymentTable, name: 'Payment Table' },
    { query: StudentModels.ExtraPaymentTable, name: 'Extra Payment Table' },
    { query: StudentModels.createEnrollmentTable, name: 'Enrollment Table' }
  ];

  try {
    const results = await Promise.all(tables.map((table) => createTable(table.query, table.name)));

    const allSucceeded = results.every((result) => result.success);
    const hasFailures = results.some((result) => !result.success);

    return res.status(hasFailures ? 409 : 201).json({
      success: allSucceeded,
      message: allSucceeded
        ? 'All tables processed successfully'
        : `Some tables could not be created, ${results.map((result) => result.message)}`,
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
