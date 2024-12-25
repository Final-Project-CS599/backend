export const createCoursesTableQuery = `CREATE TABLE IF NOT EXISTS courses (
    c_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    c_name VARCHAR(200) NOT NULL,
    c_type ENUM('Academic', 'Extra') NOT NULL,
    c_startDate DATE NOT NULL,
    c_endDate DATE NOT NULL,
    c_description TEXT NOT NULL,
    c_category VARCHAR(100) NOT NULL, 
    c_instructorId INT , FOREIGN KEY (c_instructorId) REFERENCES Instructors(i_id) ON DELETE SET NULL ON UPDATE CASCADE,
    c_studentId INT , FOREIGN KEY (c_studentId) REFERENCES student(s_id) ON DELETE SET NULL ON UPDATE CASCADE,
    c_adminNid VARCHAR(14) , FOREIGN KEY (c_adminNid) REFERENCES superAdmin(sAdmin_nationalID) ON DELETE SET NULL ON UPDATE CASCADE,
    c_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    c_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

