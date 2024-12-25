export const createdTableHelpdesk = `CREATE TABLE IF NOT EXISTS helpdesk(
    hd_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL ,
    hd_title VARCHAR(100) NOT NULL ,
    hd_description VARCHAR(255) NOT NULL ,
    hd_status ENUM('open' , 'closed') NOT NULL DEFAULT 'open',
    hd_type ENUM('done' , 'notDone') NOT NULL DEFAULT 'done',  
    hd_email VARCHAR(100) NOT NULL,
    hd_student_id INT NOT NULL, FOREIGN KEY (hd_student_id) REFERENCES student(s_id) ON DELETE CASCADE ON UPDATE CASCADE,
    hd_instructors_id INT NOT NULL, FOREIGN KEY (hd_instructors_id) REFERENCES Instructors(i_id) ON DELETE CASCADE ON UPDATE CASCADE,
    hd_createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hd_updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

// hd_status //hd_type

