export const createAcademicTableQuery = `CREATE TABLE IF NOT EXISTS academic (                      
    a_courseCode VARCHAR(10) NOT NULL,
    a_courseId INT ,FOREIGN KEY (a_courseId) REFERENCES courses(c_id)  ON DELETE SET NULL ON UPDATE CASCADE,
    a_departmentId INT ,FOREIGN KEY (a_departmentId) REFERENCES department(d_id) ON DELETE SET NULL ON UPDATE CASCADE,                 
    a_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    a_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
)`;

