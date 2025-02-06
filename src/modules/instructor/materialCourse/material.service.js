import dbConfig from '../../../DB/connection.js';

export const uploadMaterial = async (req, res) => {
  try {
    const m_instructor_id = req.user.id;
    const { m_description, m_title, m_courseId, m_link } = req.body;

    let fileUrl = m_link;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    if (!m_description || !m_title || !fileUrl || !m_instructor_id || !m_courseId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    dbConfig.execute(
      `INSERT INTO media (m_description, m_publish_date, m_title, m_link, m_instructor_id, m_courseId) 
       VALUES (?, NOW(), ?, ?, ?, ?)`,
      [m_description, m_title, fileUrl, m_instructor_id, m_courseId],
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to execute query', error: err.message });
        }
        return res.status(200).json({ message: 'Material uploaded successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const editMaterial = async (req, res) => {
  try {
    const { m_description, m_title, m_link } = req.body;
    const { m_id } = req.params;

    dbConfig.execute(
      `UPDATE media SET m_description=?, m_title=?, m_link=? WHERE m_id=?`,
      [m_description, m_title, m_link, m_id],
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to execute query', error: err.message });
        }
        return res.status(200).json({ message: 'Material updated successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMaterial = async (req, res) => {
  try {
    dbConfig.execute('SELECT * FROM media', (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to execute query', error: err.message });
      }
      return res.status(200).json(results);
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteMaterial = async (req, res) => {
  try {
    const { m_id } = req.params;

    if (!m_id) {
      return res.status(400).json({ message: 'Material ID is required' });
    }

    dbConfig.execute('DELETE FROM media WHERE m_id=?', [m_id], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to execute query', error: err.message });
      }
      return res.status(200).json({ message: 'Material deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const searchMaterial = async (req, res) => {
  const { s } = req.query;
  if (!s) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  const query = `SELECT * FROM media WHERE m_title LIKE ? OR m_link LIKE ?`;

  dbConfig.execute(query, [`%${s}%`, `%${s}%`], (error, data) => {
    if (error) {
      return res.status(500).json({ message: 'Failed to execute query' });
    }
    if (data.length === 0) {
      return res.status(404).json({ message: 'No material found' });
    }
    return res.status(200).json({ message: 'Search completed', materials: data });
  });
};
