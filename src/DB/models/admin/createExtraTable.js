export const createExtraTableQuery = `CREATE TABLE IF NOT EXISTS Extra (
    e_price DECIMAL(7, 2) NOT NULL,              
    e_courseId INT NOT NULL, FOREIGN KEY (e_courseId) REFERENCES courses(c_id) ON DELETE CASCADE ON UPDATE CASCADE,
    e_Course_code VARCHAR(10) UNIQUE NOT NULL,  
    e_sections ENUM('Back end', 'Front end' , 'languages' , 'programming' , 'Digital marketing') NOT NULL,
    e_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    e_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;
