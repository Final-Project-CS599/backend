export const createExamTable = `CREATE TABLE IF NOT EXISTS exam (
  e_id INT AUTO_INCREMENT PRIMARY KEY, 
  e_type VARCHAR(200) NOT NULL,
  e_description VARCHAR(500),
  e_publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  e_title VARCHAR(200) NOT NULL,
  e_link VARCHAR(200) NOT NULL,
  e_degree FLOAT NOT NULL, 
  e_instructor_id INT,
  FOREIGN KEY (e_instructor_id) REFERENCES Instructors(i_id) ON DELETE SET NULL ON UPDATE CASCADE,
  e_courseId INT,
  FOREIGN KEY (e_courseId) REFERENCES courses(c_id) ON DELETE SET NULL ON UPDATE CASCADE
);`

