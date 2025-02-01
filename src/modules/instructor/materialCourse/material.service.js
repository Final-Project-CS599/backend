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
          return res.status(500).json({ message: "خطأ أثناء تنفيذ الاستعلام", error: err.message });
        } else {
          return res.status(200).json({ message: "تم رفع المادة بنجاح" });
        }
      }
    );
    
  } catch (error) {
    res.status(500).json({ message: "خطأ في السيرفر", error: error.message });
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
    res.status(500).json({ message: "خطأ في السيرفر", error: error.message });
  }
};

// عرض جميع المواد
export const getMaterial = async (req, res, next) => {
  try {
    dbConfig.execute("SELECT * FROM media", (err, results) => {
      if (err) {
        return res.status(500).json({ message: "فشل في جلب المواد", error: err.message });
      }
      return res.status(200).json(results);
    });
  } catch (error) {
    res.status(500).json({ message: "خطأ في السيرفر", error: error.message });
  }
};

// حذف مادة
export const deleteMaterial = async (req, res, next) => {
  try {
    const { m_id } = req.body;

    if (!m_id) {
      return res.status(400).json({ message: "يجب توفير معرف المادة" });
    }

    dbConfig.execute("DELETE FROM media WHERE m_id=?", [m_id], (err, data) => {
      if (err) {
        return res.status(500).json({ message: "فشل في حذف المادة", error: err.message });
      } else {
        return res.status(200).json({ message: "تم حذف المادة بنجاح" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "خطأ في السيرفر", error: error.message });
  }
};
