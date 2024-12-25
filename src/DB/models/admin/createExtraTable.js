export const createExtraTableQuery = `CREATE TABLE IF NOT EXISTS Extra (
    e_price DECIMAL(7, 2) NOT NULL,              
    e_courseId INT, FOREIGN KEY (e_courseId) REFERENCES courses(c_id) ON DELETE SET NULL ON UPDATE CASCADE,
    e_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    e_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

