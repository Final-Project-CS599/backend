export const createPaymentTableQuery = `CREATE TABLE IF NOT EXISTS Payment (
  payment_id INT PRIMARY KEY,
  image VARCHAR(100),
  initiation_date DATE NOT NULL,
  student_id INT NOT NULL,
  admin_nid VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

export const createExtraPaymentTableQuery = `CREATE TABLE IF NOT EXISTS Extra_Payment (
  payment_id INT PRIMARY KEY,
  course_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;
