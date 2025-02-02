import dbConfig from "../../../DB/connection.js";



export const sendMsg = (req, res, next) => {
    const { m_message,role } = req.body;
    console.log("Received body:", req.body);  
    let m_reciever
    let m_sender
    let m_student_id
    let m_instructor_id
    if(role=="student"){
        m_student_id = req.user.id //sender
        m_instructor_id= req.body.reciever //reciever
        m_reciever = "instructor",
        m_sender = "student"
    }else{
        m_student_id =  req.body.reciever //reciever
        m_instructor_id= req.user.id //sender
        m_reciever = "student",
        m_sender = "instructor"
    }
    if (!m_student_id || !m_instructor_id || !m_message ) {
        return res.status(400).json({ message: "All fields are required" });
    }
    console.log(m_student_id , m_instructor_id , m_message,m_sender,m_reciever)
    dbConfig.execute(`INSERT INTO message (m_student_id,m_instructor_id,m_message,m_sender,m_reciever ) VALUES (?,?,?,?,?)`,
        [m_student_id , m_instructor_id , m_message,m_sender,m_reciever], (err, result) => {
        if (err) {
            console.error('Failed to send message:', err);
            return res.status(500).json({ message: "Failed to send message", err: err.message });
        }
        return res.status(200).json({ message: "Support message sent successfully" });
    });
};



export const viewMessagesInstructor = (req, res, next) => {
        const m_instructor_id  = req.user.id;
        console.log("Received body:", req.body);  
    
        dbConfig.execute('SELECT * FROM message WHERE m_instructor_id=? ', [ m_instructor_id],(err, results) => {
        if (err) {
            console.error('Error fetching messages:', err);
            return res.status(500).json({ message: "Failed to retrieve messages", error: err.message });
        }
        results = JSON.parse(JSON.stringify(results))
    for (let i = 0; i < results.length; i++) {
        results[i].m_sender == "instructor" ? results[i].type = "sender" : results[i].type = "reciever"
        delete results[i].m_sender
        delete results[i].m_reciever
        
    }
    console.log(results)
        return res.status(200).json({ messages: results });
    });
};

export const viewMessageStudent = (req, res, next) => {
    const m_student_id = req.user.id;
    console.log("Received body:", req.body);  

    dbConfig.execute('SELECT * FROM message WHERE m_student_id=? ', [ m_student_id],(err, results) => {
    if (err) {
        console.error('Error fetching messages:', err);
        return res.status(500).json({ message: "Failed to retrieve messages", error: err.message });
    }
    results = JSON.parse(JSON.stringify(results))
    for (let i = 0; i < results.length; i++) {
        results[i].m_sender == "instructor" ? results[i].type = "sender" : results[i].type = "reciever"
        delete results[i].m_sender
        delete results[i].m_reciever
        
    }
    return res.status(200).json({ messages: results });
});
};

export const deleteMessageInstructor = (req, res, next) => {
    const m_instructor_id = req.user.id;
    const { messageId } = req.params; 

    if (!messageId) {
        return res.status(400).json({ message: "Message ID is required" });
    }

    const query = `DELETE FROM message WHERE m_id = ? AND m_instructor_id = ?`;

    dbConfig.execute(query, [messageId, m_instructor_id], (err, results) => {
        if (err) {
            console.error('Error deleting message:', err);
            return res.status(500).json({ message: "Failed to delete message", error: err.message });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Message not found or you don't have permission to delete it" });
        }

        return res.status(200).json({ message: "Message deleted successfully" });
    });
};

export const deleteMessageStudent = (req, res, next) => {
    const m_student_id = req.user.id;
    const { messageId } = req.params; 

    if (!messageId) {
        return res.status(400).json({ message: "Message ID is required" });
    }

    const query = `DELETE FROM message WHERE m_id = ? AND m_student_id = ?`;

    dbConfig.execute(query, [messageId, m_student_id], (err, results) => {
        if (err) {
            console.error('Error deleting message:', err);
            return res.status(500).json({ message: "Failed to delete message", error: err.message });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Message not found or you don't have permission to delete it" });
        }

        return res.status(200).json({ message: "Message deleted successfully" });
    });
};
