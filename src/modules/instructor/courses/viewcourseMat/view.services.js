import dbConfig from "../../../../DB/connection.js";
export const viewMaterialCourse = async (req, res) => {
  try {
    const { course_code } = req.params;
    const [data] = await dbConfig.execute(
      `SELECT * FROM content WHERE course_code = ?`,
      [course_code]
    );

    if (!data.length) {
      return res.status(404).json({ message: "Data not found" });
    }

    return res.status(200).json({ message: "Done", data });
  } catch (err) {
    return res.status(500).json({ message: "Failed to execute query", error: err.message });
  }
};
