import dbConfig from '../../../DB/connection.js';

export const addExam = async (req, res, next) => {
  try {
    const { type, description, publish_date, title, link, degree, instructor_id, courseId } =
      req.body;

    // التحقق من الحقول الفارغة
    if (
      !type ||
      !description ||
      !publish_date ||
      !title ||
      !link ||
      !degree ||
      !instructor_id ||
      !courseId
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // الاستعلام لإضافة الاختبار
    const query = `INSERT INTO exam (e_title, e_description, e_degree, e_type, e_link, e_instructor_id, e_courseId)
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;

    dbConfig.query(
      query,
      [title, description, degree, type, link, instructor_id, courseId],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            message: 'Failed to execute query',
            error: err.message,
            stack: err.stack,
          });
        } else {
          // الرد عند النجاح
          return res
            .status(201)
            .json({ message: 'Exam added successfully', examId: result.insertId });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const editExam = async (req, res, next) => {
  try {
    const { examId } = req.params; // الحصول على examId من الـ URL
    const { type, description, publish_date, title, link, degree, instructor_id, courseId } =
      req.body;

    // التحقق من الحقول الفارغة
    if (
      !type ||
      !description ||
      !publish_date ||
      !title ||
      !link ||
      !degree ||
      !instructor_id ||
      !courseId
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // الاستعلام لتحديث الاختبار
    const query = `
            UPDATE exam 
            SET 
                e_title = ?, 
                e_description = ?, 
                e_degree = ?, 
                e_type = ?, 
                e_link = ?, 
                e_instructor_id = ?, 
                e_courseId = ?,
                e_publish_date = ?
            WHERE e_id = ?
        `;

    dbConfig.query(
      query,
      [title, description, degree, type, link, instructor_id, courseId, publish_date, examId],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            message: 'Failed to execute query',
            error: err.message,
            stack: err.stack,
          });
        } else {
          if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Exam not found' });
          }
          // الرد عند النجاح
          return res.status(200).json({ message: 'Exam updated successfully' });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getExam = async (req, res, next) => {
  try {
    const { type } = req.body;
    if (!type) {
      return res.status(400).json({ message: 'Exam type is required' });
    }

    dbConfig.execute(`SELECT * FROM exam WHERE e_type=? `, [type], (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({
            message: 'Failed to execute query',
            error: err,
            msg: err.message,
            stack: err.stack,
          });
      } else {
        if (data.length === 0) {
          return res.status(404).json({ message: 'No exam found' });
        }
        return res.status(200).json({ message: 'Success', exams: data });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteExam = async (req, res, next) => {
  console.log('DELETE request received');

  const { examId } = req.params;
  console.log('Request body:', req.body);
  dbConfig.execute(`DELETE FROM exam WHERE e_id= ?`, [examId], (error, data) => {
    if (error) {
      return res
        .status(500)
        .json({
          message: 'Failed to execute query ',
          error,
          msg: error.message,
          stack: error.stack,
        });
    } else {
      return res.status(200).json({ message: 'done ' });
    }
  });
};
