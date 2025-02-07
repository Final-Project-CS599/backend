export const AssignmentTable = `CREATE TABLE IF NOT EXISTS assignment(
 id INT AUTO_INCREMENT PRIMARY KEY, 
 degree FLOAT NOT NULL, 
 link VARCHAR(255) NOT NULL, 
 content_id INT NOT NULL,
 FOREIGN KEY (content_id) REFERENCES content(c_id) ON DELETE CASCADE ON UPDATE CASCADE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`;


export const TakesAssignmentTable = `CREATE TABLE IF NOT EXISTS takes_assignment(
  id INT AUTO_INCREMENT PRIMARY KEY,
  assignment_grade FLOAT NOT NULL,
  student_id INT NOT NULL,
  content_id INT NOT NULL,
  FOREIGN KEY (content_id) REFERENCES content(c_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (student_id) REFERENCES student(s_id) ON DELETE CASCADE ON UPDATE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`;

