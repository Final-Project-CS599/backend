export const createAcademicTableQuery = `CREATE TABLE IF NOT EXISTS academic (
    aCourse_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,                       
    course_id INT,
    aDepartment_id INT,                  
    aCourse_code id (5) NOT NULL,  
    FOREIGN KEY (c_id) REFERENCES courses (c_id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (department_id) REFERENCES department (d_id) ON DELETE SET NULL ON UPDATE CASCADE, 
    a_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    a_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
)`;
