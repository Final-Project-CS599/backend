export const instructorTable =  `CREATE TABLE IF NOT EXISTS Instructors (
    i_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    i_firstName VARCHAR(250) NOT NULL,
    i_lastName VARCHAR(250) NOT NULL,
    i_email VARCHAR(255) UNIQUE,
    i_password VARCHAR(200),
    i_rePassword BOOLEAN,
    i_departmentId INT,
    FOREIGN KEY (i_departmentId) REFERENCE DEPATMENTS(d_departmentId) ON DELETE CASCADE ON UPDATE CASCADE,
    i_adminId INT,
    FOREIGN KEY (i_adminId) REFERENCE ADMINS(a_id) ON DELETE SET NULL,
    i_createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    i_updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`

export const instructorPhoneTable = `
        CREATE TABLE IF NOT EXISTS InstructorsPhone (
            i_instructorPhone TEXT,
            i_createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            i_updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            i_instructorId INT,
            FOREIGN KEY (i_instructorId) REFERENCES Instructors(i_id) ON DELETE CASCADE ON UPDATE CASCADE
            );`