export const AssignmentTable = `CREATE TABLE IF NOT EXISTS assignment(
  a_id INT AUTO_INCREMENT PRIMARY KEY, 
  a_type VARCHAR(200) NOT NULL,
  a_description VARCHAR(500),
  a_publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  a_title VARCHAR(200) NOT NULL,
  a_link VARCHAR(200) NOT NULL,
  a_degree FLOAT NOT NULL, 
  a_instructor_id INT,
  FOREIGN KEY (a_instructor_id) REFERENCES Instructors(i_id) ON DELETE SET NULL ON UPDATE CASCADE,
  a_courseId INT,
  FOREIGN KEY (a_courseId) REFERENCES courses(c_id) ON DELETE SET NULL ON UPDATE CASCADE )`;

export const TakesAssignmentTable = `CREATE TABLE IF NOT EXISTS takes_assignment(
  ta_id INT AUTO_INCREMENT PRIMARY KEY,
  ta_grade FLOAT NOT NULL,
  ta_student_id INT NOT NULL,
  ta_assignment_id INT NOT NULL,
  FOREIGN KEY (ta_assignment_id) REFERENCES assignment(a_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (ta_student_id) REFERENCES student(s_id) ON DELETE CASCADE ON UPDATE CASCADE
  )`;
