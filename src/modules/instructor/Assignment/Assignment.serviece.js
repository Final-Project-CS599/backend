import dbConfig from "../../../DB/connection.js";

export const addAssignment = async (req, res, next) => {
    try {
        const { type, description, publish_date, title, link, degree, instructor_id, courseId } = req.body;

        if (!type || !description || !publish_date || !title || !link || !degree || !instructor_id || !courseId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const query = `INSERT INTO assignment (a_title, a_description, a_degree, a_type, a_link, a_instructor_id, a_courseId)
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;

        dbConfig.query(query, [title, description, degree, type, link, instructor_id, courseId], (err, result) => {
            if (err) {
                return res.status(500).json({ 
                    message: "Failed to execute query", 
                    error: err.message, 
                    stack: err.stack 
                });
            } else {
                return res.status(201).json({ message: "Assignment added successfully", assignmentId: result.insertId });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const editAssignment = async (req, res, next) => {
    try {
        const { assinId } = req.params; 
        const { type, description, publish_date, title, link, degree, instructor_id, courseId } = req.body;

        if (!type || !description || !publish_date || !title || !link || !degree || !instructor_id || !courseId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const query = `
            UPDATE assignment
            SET 
                a_title = ?, 
                a_description = ?, 
                a_degree = ?, 
                a_type = ?, 
                a_link = ?, 
                a_instructor_id = ?, 
                a_courseId = ?,
                a_publish_date = ?
            WHERE a_id = ?
        `;

        dbConfig.query(query, [title, description, degree, type, link, instructor_id, courseId, publish_date, assinId], (err, result) => {
            if (err) {
                return res.status(500).json({ 
                    message: "Failed to execute query", 
                    error: err.message, 
                    stack: err.stack 
                });
            } else {
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "Assignment not found" });
                }
                return res.status(200).json({ message: "Assignment updated successfully" });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getAssignment = async (req, res, next) => {
    try {
        const { type } = req.query; 
        if (!type) {
            return res.status(400).json({ message: "Assignment type is required" });
        }

        dbConfig.execute(`SELECT * FROM assignment WHERE a_type = ?`, [type], (err, data) => {
            if (err) {
                return res.status(500).json({ message: "Failed to execute query", error: err.message });
            } else {
                if (data.length === 0) {
                    return res.status(404).json({ message: "No assignments found" });
                }
                return res.status(200).json({ message: "Success", assignments: data });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteAssignment = async (req, res, next) => {
    console.log("DELETE request received");

    const { assinId } = req.params;  
    console.log("Request body:", req.body);

    dbConfig.execute(`DELETE FROM assignment WHERE a_id = ?`, [assinId], (error, data) => {
        if (error) {
            return res.status(500).json({ message: "Failed to execute query", error: error.message, stack: error.stack });
        } else {
            return res.status(200).json({ message: "Assignment deleted successfully" });
        }
    });
}
