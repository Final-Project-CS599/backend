export const instructorTable =  `CREATE TABLE IF NOT EXISTS Instructors (
    i_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    i_firstName VARCHAR(250) NOT NULL,
    i_lastName VARCHAR(250) NOT NULL,
    i_email VARCHAR(255) UNIQUE,
    i_password VARCHAR(200),
    i_active boolean default false,
    i_departmentId INT,
    FOREIGN KEY (i_departmentId) REFERENCES department(d_id) ON DELETE SET NULL ON UPDATE CASCADE,
    i_adminId VARCHAR(14),
    FOREIGN KEY (i_adminId) REFERENCES superAdmin(sAdmin_nationalID) ON DELETE SET NULL ON UPDATE CASCADE,
    i_createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    i_updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`;


export const instructorPhoneTable = ` CREATE TABLE IF NOT EXISTS InstructorsPhone (
    p_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    p_instructorPhone VARCHAR(255) NOT NULL,
    i_instructorId INT NOT NULL,
    FOREIGN KEY (i_instructorId) REFERENCES Instructors(i_id) ON DELETE CASCADE ON UPDATE CASCADE
);` ;