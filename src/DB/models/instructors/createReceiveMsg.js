export const createReceiveTable = `CREATE TABLE IF NOT EXISTS receive (
            r_massage_content TEXT(255) NOT NULL,
            r_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            r_instructor_id INT,
            FOREIGN KEY (r_instructor_id) REFERENCES Instructors(i_id),
            r_student_id INT ,
            FOREIGN KEY (r_student_id) REFERENCES student(s_id)

        );`
