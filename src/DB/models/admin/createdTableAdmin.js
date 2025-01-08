import { roleTypes } from "../../../middleware/auth.middleware.js";

const enumRoles = Object.values(roleTypes.Admin).map(role => `'${role}'`).join(',');

export const createTableSuperAdmin = `CREATE TABLE IF NOT EXISTS superAdmin(
    sAdmin_nationalID VARCHAR(14) PRIMARY KEY  NOT NULL,
    sAdmin_firstName VARCHAR(50) NOT NULL,
    sAdmin_lastName VARCHAR(50) NOT NULL,
    sAdmin_email VARCHAR(100) NOT NULL UNIQUE ,
    sAdmin_confirmEmail BOOLEAN NOT NULL DEFAULT FALSE,
    sAdmin_password VARCHAR(255) NOT NULL ,
    sAdmin_role ENUM(${enumRoles}) NOT NULL DEFAULT '${roleTypes.Admin.sAdmin}',
    sAdmin_createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sAdmin_updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

export const createTableSuperAdminsPhones = `CREATE TABLE IF NOT EXISTS superAdminsPhone (
    p_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    p_number VARCHAR(255) NOT NULL ,
    sAdmin_nationalID VARCHAR(14) NOT NULL , 
    FOREIGN KEY (sAdmin_nationalID) REFERENCES superAdmin(sAdmin_nationalID) ON DELETE CASCADE ON UPDATE CASCADE
);`;


// sAdmin_role ENUM('sAdmin' , 'admin') NOT NULL DEFAULT 'sAdmin',