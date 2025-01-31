import dbConfig from "../../../DB/connection.js";



export const sendMsg = (req, res, next) => {
    const {m_id , m_student_id , m_instructor_id , m_message } = req.body;
    console.log("Received body:", req.body);  

    if (!m_id || !m_student_id || !m_instructor_id || !m_message ) {
        return res.status(400).json({ message: "All fields are required" });
    }

    dbConfig.execute(`INSERT INTO send (m_id,m_student_id,m_instructor_id,m_message ) VALUES (?,?,?,?)`,
        [m_id , m_student_id , m_instructor_id , m_message], (err, result) => {
        if (err) {
            console.error('Failed to send message:', err);
            return res.status(500).json({ message: "Failed to send message", err: err.message });
        }
        return res.status(200).json({ message: "Support message sent successfully" });
    });
};



export const receiveMsg = (req, res, ) => {
        const { m_instructor_id } = req.body;
        console.log("Received body:", req.body);  
    
        dbConfig.execute('SELECT * FROM send WHERE m_instructor_id=? ', [ m_instructor_id],(err, results) => {
        if (err) {
            console.error('Error fetching messages:', err);
            return res.status(500).json({ message: "Failed to retrieve messages", error: err.message });
        }
        return res.status(200).json({ messages: results });
    });
};