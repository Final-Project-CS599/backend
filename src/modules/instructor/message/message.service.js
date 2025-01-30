import dbConfig from "../../../DB/connection.js";
export const sendMessage = (req, res, next) => {
    const { r_massage_content,  r_instructor_id, r_student_id } = req.body;
    console.log("Received body:", req.body);  

    if (!r_massage_content || !r_instructor_id || !r_student_id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    dbConfig.execute(`INSERT INTO receive (r_massage_content, r_instructor_id, r_student_id) VALUES (?, ?, ?)`, [r_massage_content, r_instructor_id, r_student_id], (err, result) => {
        if (err) {
            console.error('Failed to send message:', err);
            return res.status(500).json({ message: "Failed to send message", err: err.message });
        }
        return res.status(200).json({ message: "Support message sent successfully" });
    });
};



export const receiveMessage = (req, res, ) => {
        const {  r_student_id } = req.body;
        console.log("Received body:", req.body);  
    
        dbConfig.execute('SELECT * FROM receive WHERE r_student_id=? ', [ r_student_id],(err, results) => {
        if (err) {
            console.error('Error fetching messages:', err);
            return res.status(500).json({ message: "Failed to retrieve messages", error: err.message });
        }
        return res.status(200).json({ messages: results });
    });
};