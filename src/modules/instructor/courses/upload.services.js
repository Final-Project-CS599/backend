import dbConfig from '../../../DB/connection.js';
export const uploadMaterial = (req, res) => {
  try {
    const { title, fileLink, description, courseCode, uploadDate } = req.body;
    const instructor_id = req.params;
    if (!title || !fileLink || !description || !courseCode || !uploadDate || !instructor_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!/^https?:\/\/[\w.-]+\.[a-z]{2,}(\/[\w.-]*)*\/?$/i.test(fileLink)) {
      return res.status(400).json({ error: 'Invalid file link' });
    }

    dbConfig.execute(
      'INSERT INTO content (c_description, c_publish_date, c_file_link, c_title, c_instructor_id) VALUES (?, ?, ?, ?, ?)',
      [description, uploadDate, fileLink, title, instructor_id],
      (err, result) => {
        if (err || !data.affectedRows) {
          console.error('Error inserting into content table:', err);
          return res.status(500).json({ error: 'Database error while inserting content' });
        }

        const content_id = result.insertId; 

        dbConfig.execute(
          'INSERT INTO media (m_title, m_content_id) VALUES (? , ?)',
          [title, fileLink, instructor_id, content_id],
          (err, data) => {
            if (err || !data.affectedRows) {
              console.error('Error inserting into media table:', err);
              return res.status(500).json({ error: 'Database error while inserting media' });
            }

            res.status(201).json({ message: 'Material uploaded successfully' });
          }
        );
      }
    );
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
