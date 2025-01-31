
import dbConfig from '../../../DB/connection.js';
	

export const sendMsgHelp = (req, res, next) => {
    const { title, description, email , instructorsId } = req.body;
    console.log("Received body:", req.body);  

    if (!title || !description || !email || !instructorsId) {
        return res.status(400).json({ message: "All fields are required" });
    }

    dbConfig.execute(`INSERT INTO helpDesk (hd_title, hd_description, hd_email, hd_studentId, hd_instructorsId) VALUES (?, ?, ?, ?, ?)`,
        [title, description, email, 6, instructorsId], (err, result) => {
        if (err) {
            console.error('Failed to send message:', err);
            return res.status(500).json({ message: "Failed to send message", err: err.message });
        }
        return res.status(200).json({ message: "Support message sent successfully" });
    });
};

