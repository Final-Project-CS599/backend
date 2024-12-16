export const createTableSuperAdmin = `CREATE TABLE IF NOT EXISTS superAdmin(
    sAdmin_nationalID VARCHAR(14) PRIMARY KEY  NOT NULL,
    sAdmin_firstName VARCHAR(50) NOT NULL,
    sAdmin_lastName VARCHAR(50) NOT NULL,
    sAdmin_email VARCHAR(100) NOT NULL UNIQUE ,
    sAdmin_password VARCHAR(255) NOT NULL ,
    sAdmin_rePassword VARCHAR(255) NOT NULL ,
    sAdmin_role ENUM('sAdmin' , 'admin') NOT NULL DEFAULT 'sAdmin',
    sAdmin_createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sAdmin_updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

export const createTableSuperAdminsPhones = `CREATE TABLE IF NOT EXISTS superAdminsPhone (
    p_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    p_number VARCHAR(20) NOT NULL ,
    sAdmin_nationalID VARCHAR(14) NOT NULL , 
    FOREIGN KEY (sAdmin_nationalID) REFERENCES superAdmin(sAdmin_nationalID) ON DELETE CASCADE ON UPDATE CASCADE
);`;

export const createdTablHelpdesk = `CREATE TABLE IF NOT EXISTS helpdesk(
    hd_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL ,
    hd_title VARCHAR(100) NOT NULL ,
    hd_description VARCHAR(255) NOT NULL ,
    hd_status ENUM('open' , 'closed') NOT NULL DEFAULT 'open',
    hd_type ENUM('done' , 'notDone') NOT NULL DEFAULT 'done',  
    hd_email VARCHAR(100) NOT NULL,
    hd_createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hd_updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

// hd_status //hd_type
