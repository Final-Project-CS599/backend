import dbConfig from "../../../DB/connection.js";

const getMedia = (data) => {
  let media = [];
  return new Promise((resolve, reject) => {
    dbConfig.execute(`SELECT * FROM media WHERE m_courseId =?`, [data.c_id], (err, result) => {
      resolve(result);
    });
  });
};

const getAssignments = (data) => {
  return new Promise((resolve, reject) => {
    dbConfig.execute(
      'SELECT * FROM assignment WHERE a_courseId = ?',
      [data.c_id],
      (err, result) => {
        resolve(result);
      }
    );
  });
};

const getExams = (data) => {
  return new Promise((resolve, reject) => {
    dbConfig.execute('SELECT * FROM exam WHERE e_courseId = ?', [data.c_id], (err, result) => {
      resolve(result);
    });
  });
};

export const viewCoursesWithExtraData = async (req, res) => {
  try {
    const instructorID = req.user.id;
    // console.log(req)
    if (!instructorID) {
      return res.status(400).json({ message: 'instructorID is required ' });
    }
    dbConfig.execute(
      `SELECT * FROM courses where c_instructorId=?`,
      [instructorID],
      async (error, data) => {
        if (error) {
          return res.status(500).json({ message: 'Failed to execute query', error: error.message });
        } else {
          if (data.length === 0) {
            return res.status(404).json({ message: 'No Courses found' });
          }
          for (let i = 0; i < data.length; i++) {
            let media = await getMedia(data[i]);
            data[i].media = media.length == 0 ? 'no media found' : media;
            let assignments = await getAssignments(data[i]);
            data[i].assignments = assignments.length == 0 ? 'no assingments found' : assignments;
            let exams = await getExams(data[i]);
            data[i].exams = exams.length == 0 ? 'no exams yet' : exams;
          }
          console.log(data);
          return res.status(200).json({ message: 'Success', Courses: data });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ message: 'Failed to execute query ' });
  }
};

export const viewCourseById = async (req, res, next) => {
  const { course_id } = req.params;
  dbConfig.execute('Select * FROM courses WHERE c_id = ?', [course_id], (error, data) => {
    if (error) {
      return res.status(500).json({ message: 'Failed to execute query', error: error.message });
    }
    if (data.length == 0) {
      return res.status(404).json({ message: 'no course found with that id' });
    }

    return res.status(200).json({ message: 'Success', course: data[0] });
  });
};

//search
export const searchCourse = async (req, res, next) => {
  const { s } = req.query;
  if (!s) {
    return res.status(400).json({ message: 'Search Query is Required' });
  }

  const query = `SELECT * FROM courses WHERE c_name LIKE ? OR c_type LIKE ?`;

  dbConfig.execute(query, [`%${s}%`, `%${s}%`], (error, data) => {
    if (error) {
      return res.status(500).json({ message: 'Failed to execute Query' });
    }
    if (data.length === 0) {
      return res.status(404).json({ message: 'No courses found' });
    }

    return res.status(200).json({
      message: 'Your courses search Done',
      courses: data,
    });
  });
};
