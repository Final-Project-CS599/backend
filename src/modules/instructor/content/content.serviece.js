import dbConfig from "../../../DB/connection.js";

export const addContent = async (req, res, next) => {
  try {
    const { description, publish_date, title, instructorId, courseId } = req.body;

    // التحقق من البيانات
    if (!description || !publish_date || !title || !instructorId || !courseId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // التحقق من تنسيق التاريخ
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(publish_date)) {
      return res.status(400).json({ message: "Invalid date format. Use dd/mm/yyyy" });
    }

    // تحويل التاريخ إلى التنسيق المطلوب
    const [day, month, year] = publish_date.split('/');
    const formattedDate = `${year}-${month}-${day}`;

    // إدخال البيانات في قاعدة البيانات
    const [data] = await dbConfig.promise().execute(
      `INSERT INTO content (c_description, c_publish_date, c_title, c_instructor_id, c_courseId) VALUES (?, ?, ?, ?, ?)`,
      [description, formattedDate, title, instructorId, courseId]
    );

    return res.status(200).json({ message: "Content added successfully", contentId: data.insertId });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
