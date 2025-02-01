export const createSendTableQuery = `CREATE TABLE IF NOT EXISTS message (
    m_id INT AUTO_INCREMENT PRIMARY KEY,
    m_student_id INT NOT NULL,
    m_instructor_id INT NOT NULL,
    m_message VARCHAR(500) NOT NULL,
    m_reciever VARCHAR(500) NOT NULL,
    m_sender VARCHAR(500) NOT NULL,
    FOREIGN KEY (m_student_id) REFERENCES student(s_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (m_instructor_id) REFERENCES Instructors(i_id) ON DELETE CASCADE ON UPDATE CASCADE,
    m_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    m_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;
