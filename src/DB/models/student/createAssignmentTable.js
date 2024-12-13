export const createAssignmentTableQuery = `CREATE TABLE IF NOT EXISTS assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  end_date DATE NOT NULL,
  start_date DATE NOT NULL,
  category VARCHAR(50) NOT NULL,
  description VARCHAR(500),
  instructor_id INT NOT NULL,
  student_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

export const createTakesAssignmentTableQuery = `CREATE TABLE IF NOT EXISTS takes_assignments (
  content_id AUTO_INCREMENT INT PRIMARY KEY,
  assignment_grade FLOAT,
  student_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;
