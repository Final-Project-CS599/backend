import dbConfig from "../../../DB/connection.js";
export const uploadMaterial = async (req, res, next) => {
  try {
    const { m_description, m_title, m_instructor_id, m_courseId, m_link } = req.body;
    
    let fileUrl = m_link; 
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    if ( !m_description || !m_title || !fileUrl || !m_instructor_id || !m_courseId) {
      return res.status(400).json({ message: "all fields are required" });
    }

    dbConfig.execute(
      `INSERT INTO media (m_description, m_publish_date, m_title, m_link, m_instructor_id, m_courseId)
       VALUES (?, NOW(), ?, ?, ?, ?)`,
      [m_description, m_title, fileUrl, m_instructor_id, m_courseId], 
      (err, data) => {
        if (err) {
          return res.status(500).json({ message: "Fail to execute this Query", error: err.message });
        } else {
          return res.status(200).json({ message: "Upload Material successfully" });
        }
      }
    );
    
  } catch (error) {
    res.status(500).json({ message: "Fail to execute this Query", error: error.message });
  }
};

// تحديث المادة
export const editMaterial = async (req, res, next) => {
  try {
    const { m_description, m_title, m_link } = req.body;
      
      dbConfig.execute(
      `UPDATE media SET  m_description=?, m_title=?, m_link=? WHERE m_id=?`,
      [m_type, m_description, m_title, m_link, m_id],
      (err, data) => {
        if (err) {
          return res.status(500).json({ message: "fail to execute query", error: err.message });
        } else {
          return res.status(200).json({ message: "success update " });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Fail to execute this Query", error: error.message });
  }
};

// view all material
export const getMaterial = async (req, res, next) => {
  try {
    dbConfig.execute("SELECT * FROM media", (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Fail to execute this query", error: err.message });
      }
      return res.status(200).json(results);
    });
  } catch (error) {
    res.status(500).json({ message: "Fail to execute this Query", error: error.message });
  }
};

// delete material
export const deleteMaterial = async (req, res, next) => {
  try {
    const { m_id } = req.body;

    if (!m_id) {
      return res.status(400).json({ message: "materila_id query is required" });
    }

    dbConfig.execute("DELETE FROM media WHERE m_id=?", [m_id], (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Fail to execute this query", error: err.message });
      } else {
        return res.status(200).json({ message: "Delete Material Successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Fail to execute this Query", error: error.message });
  }
};

export const searchMaterial = async (req, res, next) => {
  const { matr } = req.query;
  if (!matr) {
    return res.status(400).json({ message: "Search Query is Required" });
  }

  const query = `SELECT * FROM media WHERE m_title LIKE ? OR m_link LIKE ?`;
  
  dbConfig.execute(query, [`%${matr}%`, `%${matr}%`], (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Failed to execute Query" });
    }
    if (data.length === 0) {
      return res.status(404).json({ message: "No material found" });
    }
    
    return res.status(200).json({ 
      message: "Your material search Done", 
      courses: data 
    });
  });
};
