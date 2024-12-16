export const createSendTableQuery = `CREATE TABLE IF NOT EXISTS send (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    instructor_id INT NOT NULL,
    message VARCHAR(500) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES student(s_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

//    FOREIGN KEY (instructor_id) REFERENCES instructor(i_id)
