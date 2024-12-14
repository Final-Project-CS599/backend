export const PaymentTable = `CREATE TABLE IF NOT EXIST payment(
id INT AUTO_INCREMENT PRIMARY KEY , img VARCHAR(100) NOT NULL, intiation_date DATE NOT NULL, student_id INT NOT NULL,admin_nid INT NOT NULL, 
 FOREIGN KEY (student_id) REFERENCES student(s_id) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY(admin_nid) REFERENCES superAdmin( sAdmin_nationalID) ON DELETE CASCADE ON UPDATE CASCADE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`;

export const ExtraPaymentTable = `CREATE TABLE IF NOT EXIST extra_payment(
id INT AUTO_INCREMENT PRIMARY KEY,
student_id INT NOT NULL,
course_id INT NOT NULL,
 FOREIGN KEY (student_id) REFERENCES student(s_id) ON DELETE CASCADE ON UPDATE CASCADE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
  


)`;

//FOREIGN KEY(course_id) REFERENCES course(course_id) ON DELETE CASCADE ON UPDATE CASCADE,
