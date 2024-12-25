export const createAcademicTableQuery = `CREATE TABLE IF NOT EXISTS academic (
    aCourse_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,                       
    aCourse_code INT (5) NOT NULL,
    course_id INT NOT NULL,
    aDepartment_id INT NOT NULL,                  
    FOREIGN KEY (course_id) REFERENCES courses (c_id)  ON UPDATE CASCADE,
    FOREIGN KEY (aDepartment_id) REFERENCES department (d_id) ON UPDATE CASCADE, 
    a_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    a_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
)`;
