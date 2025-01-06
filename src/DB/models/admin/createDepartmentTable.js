export const createDepartmentTable = `CREATE TABLE IF NOT EXISTS department (
    d_id INT AUTO_INCREMENT PRIMARY KEY,
    d_dept_name VARCHAR(100) NOT NULL UNIQUE,
    d_dept_code VARCHAR(100) NOT NULL UNIQUE,
    d_adminNid VARCHAR(14),
    FOREIGN KEY (d_adminNid) REFERENCES superAdmin(sAdmin_nationalID) ON DELETE SET NULL ON UPDATE CASCADE
)`;