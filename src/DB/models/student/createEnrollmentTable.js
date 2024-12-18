export const createEnrollmentTable = `CREATE TABLE IF NOT EXISTS enrollment (
    e_courseId INT,
    e_studentId INT,
    e_enrollmentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    e_finishedCourse TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (e_studentId) REFERENCES student(s_id) ON DELETE CASCADE ON UPDATE CASCADE
)`;

//FOREIGN KEY (e_courseId) REFERENCES courses(c_courses_id) ON DELETE CASCADE ON UPDATE CASCADE