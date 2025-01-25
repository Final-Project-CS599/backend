export const createdTableHelpDesk = `CREATE TABLE IF NOT EXISTS helpDesk(
    hd_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL ,
    hd_title VARCHAR(100) NOT NULL ,
    hd_description VARCHAR(255) NOT NULL ,
    hd_status ENUM('open' , 'closed') NOT NULL DEFAULT 'open',
    hd_type ENUM('done' , 'notDone') NOT NULL DEFAULT 'done',  
    hd_email VARCHAR(100) NOT NULL,
    hd_studentId INT , FOREIGN KEY (hd_studentId) REFERENCES student(s_id) ON DELETE SET NULL ON UPDATE CASCADE,
    hd_instructorsId INT , FOREIGN KEY (hd_instructorsId) REFERENCES Instructors(i_id) ON DELETE SET NULL ON UPDATE CASCADE,
    hd_createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hd_updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;



