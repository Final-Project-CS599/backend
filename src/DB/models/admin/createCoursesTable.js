export const createCoursesTableQuery = `CREATE TABLE IF NOT EXISTS courses (
    c_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    c_name VARCHAR(100) NOT NULL,
    c_type ENUM('Academic', 'Extra') NOT NULL,
    c_start_date DATE NOT NULL,
    c_end_date DATE NOT NULL,
    c_description TEXT NOT NULL,
    c_instructor_id INT NOT NULL,
    c_student_id INT NOT NULL,
    c_admin_nid VARCHAR(14) NOT NULL,
    c_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    c_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
)`;

// FOREIGN KEY (i_id) REFERENCES instructors(id) ON DELETE SET NULL ON UPDATE CASCADE,
// FOREIGN KEY (s_student_id) REFERENCES students(id) ON DELETE SET NULL ON UPDATE CASCADE,
// FOREIGN KEY (a_admin_nid) REFERENCES admins(nid) ON DELETE SET NULL ON UPDATE CASCADE,