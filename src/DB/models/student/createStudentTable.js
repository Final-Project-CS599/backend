export const createStudentTableQuery = `
CREATE TABLE IF NOT EXISTS student (
    s_id INT AUTO_INCREMENT PRIMARY KEY,
    s_first_name VARCHAR(255) NOT NULL,
    s_last_name VARCHAR(255) NOT NULL,
    s_middle_name VARCHAR(255),
    s_password VARCHAR(255) NOT NULL,
    s_DOB  DATE NOT NULL,
    s_email VARCHAR(255) NOT NULL UNIQUE,
    s_gender ENUM('Male', 'Female'),
    s_department_id INT,
    s_admin_id INT,
    s_national_id VARCHAR(255) NOT NULL UNIQUE,
    s_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    s_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

export const createStudentPhoneTableQuery = `
CREATE TABLE IF NOT EXISTS student_phone (
    id INT PRIMARY KEY,
    student_id INT NOT NULL,
    S_phone INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;
