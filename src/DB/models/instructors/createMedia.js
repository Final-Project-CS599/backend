export const createMedia =  
`CREATE TABLE IF NOT EXISTS media (
  m_type VARCHAR(200) NOT NULL,
  m_description VARCHAR(500),
  m_publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  m_title VARCHAR(200) NOT NULL,
  m_link VARCHAR(200) NOT NULL,
  m_degree FLOAT NOT NULL, 
  m_instructor_id INT,
  FOREIGN KEY (m_instructor_id) REFERENCES Instructors(i_id) ON DELETE SET NULL ON UPDATE CASCADE,
  m_courseId INT,
  FOREIGN KEY (m_courseId) REFERENCES courses(c_id) ON DELETE SET NULL ON UPDATE CASCADE


    ); `
// m_type VARCHAR(200) NOT NULL,
