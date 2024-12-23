export const PaymentTable = `CREATE TABLE IF NOT EXISTS payment(
id INT AUTO_INCREMENT PRIMARY KEY, 
img VARCHAR(100) NOT NULL, 
initiation_date DATE NOT NULL, 
student_id INT NOT NULL,
admin_nid VARCHAR(14) NOT NULL, 
FOREIGN KEY (student_id) REFERENCES student(s_id) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY(admin_nid) REFERENCES superAdmin( sAdmin_nationalID) ON DELETE CASCADE ON UPDATE CASCADE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`;

export const ExtraPaymentTable = `CREATE TABLE IF NOT EXISTS extra_payment(
id INT AUTO_INCREMENT PRIMARY KEY,
student_id INT NOT NULL,
course_id INT NOT NULL,
FOREIGN KEY(course_id) REFERENCES courses(c_id) ON DELETE CASCADE ON UPDATE CASCADE,
 FOREIGN KEY (student_id) REFERENCES student(s_id) ON DELETE CASCADE ON UPDATE CASCADE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;
