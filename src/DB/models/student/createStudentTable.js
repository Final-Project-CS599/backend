export const createStudentTableQuery = `CREATE TABLE IF NOT EXISTS student (
    s_id INT AUTO_INCREMENT PRIMARY KEY,
    s_first_name VARCHAR(50) NOT NULL,
    s_last_name VARCHAR(50) NOT NULL,
    s_middle_name VARCHAR(50),
    s_password VARCHAR(50) NOT NULL,
    s_DOB DATE NOT NULL,
    s_email VARCHAR(50) NOT NULL UNIQUE,
    s_gender ENUM('Male', 'Female') NOT NULL DEFAULT 'Male',
    s_department_id INT,
    s_admin_id VARCHAR(14),
    s_national_id VARCHAR(14) NOT NULL UNIQUE,
    FOREIGN KEY(s_admin_id) REFERENCES superAdmin(sAdmin_nationalID) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (s_department_id) REFERENCES department (d_id) ON DELETE SET NULL ON UPDATE CASCADE,
    s_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    s_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

export const createStudentPhoneTableQuery = `
CREATE TABLE IF NOT EXISTS student_phone (
    sp_id INT AUTO_INCREMENT PRIMARY KEY,
    sp_student_id INT NOT NULL,
    sp_phone VARCHAR(255) NOT NULL,
    FOREIGN KEY (sp_student_id) REFERENCES student(s_id) ON DELETE CASCADE ON UPDATE CASCADE,
    sp_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sp_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

