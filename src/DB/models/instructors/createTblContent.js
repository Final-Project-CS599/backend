export const createContentTable =
`CREATE TABLE IF NOT EXISTS content (
    c_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    c_description VARCHAR(500),
    c_publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    c_uploaded_file VARCHAR(500) NOT NULL, 
    c_title VARCHAR(200) NOT NULL, 
    c_instructor_id INT,
    FOREIGN KEY (c_instructor_id) REFERENCES Instructors(i_id) ON DELETE SET NULL,
    c_course_id INT,
    FOREIGN KEY (c_course_id) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE
  
  );`
