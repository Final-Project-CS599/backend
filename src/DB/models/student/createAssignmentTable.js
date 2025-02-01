import dbConfig from "../../../DB/connection.js";

export const addAssignment = async (req, res, next) => {
    try {
        const instructor_id = req.user.id; 
        const { title, description, degree, type, link } = req.body;

        if (!instructor_id || !title || !description || !degree || !type || !link) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const courseQuery = `SELECT c_id FROM courses WHERE instructor_id = ? ORDER BY c_id DESC LIMIT 1`;
        dbConfig.query(courseQuery, [instructor_id], (err, result) => {
            if (err || result.length === 0) {
                return res.status(400).json({ message: "No course found for this instructor" });
            }

            const courseId = result[0].c_id; 
            const insertQuery = `INSERT INTO assignment (a_title, a_description, a_degree, a_type, a_link, a_instructor_id, a_courseId, a_publish_date)
                                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

            dbConfig.query(insertQuery, [title, description, degree, type, link, instructor_id, courseId], (err, result) => {
                if (err) {
                    return res.status(500).json({ 
                        message: "Failed to execute query", 
                        error: err.message 
                    });
                }
                return res.status(201).json({ message: "Assignment added successfully", assignmentId: result.insertId });
            });
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const TakesAssignmentTable = `CREATE TABLE IF NOT EXISTS takes_assignment(
  ta_id INT AUTO_INCREMENT PRIMARY KEY,
  ta_grade FLOAT NOT NULL,
  ta_student_id INT NOT NULL,
  ta_assignment_id INT NOT NULL,
  FOREIGN KEY (ta_assignment_id) REFERENCES assignment(a_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (ta_student_id) REFERENCES student(s_id) ON DELETE CASCADE ON UPDATE CASCADE
  )`;
