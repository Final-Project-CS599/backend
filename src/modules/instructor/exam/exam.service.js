import dbConfig from "../../../DB/connection.js";

export const addExam = async (req, res, next) => {
    try {
        const instructor_id = req.user.id; 
        const { title, description, degree, type, link, courseId } = req.body;

        if (!instructor_id || !title || !description || !degree || !type || !link || !courseId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const insertQuery = `INSERT INTO exam (e_title, e_description, e_degree, e_type, e_link, e_instructor_id, e_courseId, e_publish_date)
                             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;

        dbConfig.query(insertQuery, [title, description, degree, type, link, instructor_id, courseId], (err, result) => {
            if (err) {
                return res.status(500).json({ 
                    message: "Failed to execute query", 
                    error: err.message 
                });
            }
            return res.status(201).json({ message: "Exam added successfully", examId: result.insertId });
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const editExam = async (req, res, next) => {
    try {
        const { examId } = req.params; 
        const instructor_id = req.user.id
        const { type, description, title, link, degree } = req.body;

        if (!type || !description || !title || !link || !degree || !instructor_id) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const query = `
            UPDATE assignment
            SET 
                e_title = ?, 
                e_description = ?, 
                e_degree = ?, 
                e_type = ?, 
                e_link = ?
            WHERE e_id = ? AND e_instructor_id = ?
        `;

        dbConfig.query(query, [title, description, degree, type, link, Number(examId),instructor_id], (err, result) => {
            if (err) {
                return res.status(500).json({ 
                    message: "Failed to execute query", 
                    error: err.message, 
                    stack: err.stack 
                });
            } else {
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "Exam not found" });
                }
                return res.status(200).json({ message: "Exam updated successfully" });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getExam = async (req, res, next) => {
    try {
        const { instructor_id } = req.user.id; 
        if (!instructor_id) {
            return res.status(400).json({ message: "instructor_id is required" });
        }

        dbConfig.execute(`SELECT * FROM exam WHERE e_instructor_id = ?`, [instructor_id], (err, data) => {
            if (err) {
                return res.status(500).json({ message: "Failed to execute query", error: err.message });
            } else {
                if (data.length === 0) {
                    return res.status(404).json({ message: "No exam found" });
                }
                return res.status(200).json({ message: "Success", assignments: data });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteExam = async (req, res, next) => {
    console.log("DELETE request received");

    const { examId } = req.params;  
    console.log("Request body:", req.body);

    dbConfig.execute(`DELETE FROM exam WHERE e_id = ?`, [examId], (error, data) => {
        if (error) {
            return res.status(500).json({ message: "Failed to execute query", error: error.message, stack: error.stack });
        } else {
            return res.status(200).json({ message: "exam deleted successfully" });
        }
    });
}

export const searchExam = async (req, res, next) => {
    const { exam } = req.query;
    if (!exam) {
      return res.status(400).json({ message: "Search Query is Required" });
    }
  
    const query = `SELECT * FROM exam WHERE e_name LIKE ? OR e_type LIKE ?`;
    
    dbConfig.execute(query, [`%${exam}%`, `%${exam}%`], (error, data) => {
      if (error) {
        return res.status(500).json({ message: "Failed to execute Query" });
      }
      if (data.length === 0) {
        return res.status(404).json({ message: "No exams found" });
      }
      
      return res.status(200).json({ 
        message: "Your exam search Done", 
        courses: data 
      });
    });
  };

