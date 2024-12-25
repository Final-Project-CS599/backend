export const createExtraTableQuery = `CREATE TABLE IF NOT EXISTS Extra (
    eCourse_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, 
    ePrice DECIMAL(2, 3) NOT NULL,              
    eCategory VARCHAR(50) NOT NULL,   
    course_id INT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses (c_id) ON UPDATE CASCADE,
    e_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    e_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;
// ePrice DECIMAL(2, 3) NOT NULL,  