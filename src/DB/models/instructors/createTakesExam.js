export const createTakesExamTable = `CREATE TABLE IF NOT EXISTS takesExam (
    tExam_examGrade FLOAT NOT NULL,
    tExam_studentId INT NOT NULL,  FOREIGN KEY (tExam_studentId) REFERENCES student(s_id) ON DELETE CASCADE ON UPDATE CASCADE,
    tExam_contentId INT NOT NULL, FOREIGN KEY (tExam_contentId) REFERENCES content(c_content_id) ON DELETE CASCADE ON UPDATE CASCADE
    
)`; 

