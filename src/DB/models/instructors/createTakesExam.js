export const createTakesExamTable = 
   `CREATE TABLE IF NOT EXISTS takesExam (
    tExam_examGrade FLOAT NOT NULL,
    tExam_studentId INT NOT NULL,  FOREIGN KEY (tExam_studentId) REFERENCES student(s_id) ON DELETE CASCADE ON UPDATE CASCADE,
    tExam_examId INT NOT NULL, FOREIGN KEY (tExam_examId) REFERENCES exam(e_id) ON DELETE CASCADE ON UPDATE CASCADE
    
)`; 

