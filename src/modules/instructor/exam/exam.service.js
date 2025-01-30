import dbConfig from "../../../DB/connection.js";

// export const addExam = async (req, res, next) => {
//     try {
//         // استخراج البيانات من الطلب
//         const { type, link, degree } = req.body;

//         // التحقق من وجود البيانات المطلوبة
//         if (!type || !link || !degree) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         // إدراج محتوى جديد في جدول content
//         const [contentResult] = await dbConfig.execute(
//             `INSERT INTO content (c_type) VALUES (?)`,
//             ["exam"]
//         );

//         // طباعة النتيجة لفحصها
//         console.log("Content Result:", contentResult);

//         // التحقق إذا كانت النتيجة كائنًا يحتوي على insertId
//         if (!contentResult || !contentResult.insertId) {
//             return res.status(500).json({ message: "Failed to insert content" });
//         }

//         const contentId = contentResult.insertId; // مباشرة الحصول على insertId

//         // إدراج بيانات الاختبار في جدول exam
//         const [examResult] = await dbConfig.execute(
//             `INSERT INTO exam (e_type, e_link, e_degree, e_content_id) VALUES (?, ?, ?, ?)`,
//             [type, link, degree, contentId]
//         );

//         // طباعة النتيجة لفحصها
//         console.log("Exam Result:", examResult);

//         // التحقق من أن النتيجة تحتوي على insertId
//         if (!examResult || !examResult.insertId) {
//             return res.status(500).json({ message: "Failed to insert exam" });
//         }

//         // إرسال استجابة ناجحة
//         res.status(201).json({ message: "Exam added successfully", contentId });
//     } catch (error) {
//         // طباعة الأخطاء في السيرفر
//         console.error("Database error:", error.message);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

   export const addExam = async(req, res, next )=>{
    try {
        const{type, description, publish_date, title, link, degree, instructor_id, courseId} = req.body
        
    if (!type|| !description | !publish_date|| !title|| !link|| !degree|| !instructor_id|| !courseId) {
        return res.status(400).json({ message: 'Type and link are required' });
    }
    db.execute(`INSERT INTO exam ( e_type , e_link ,e_description,e_publish_date,e_title, e_degree ,e_instructor_id,e_courseId ) VALUES (?,?,?,?,?,?,?,?)`,
        [ type, description, publish_date, title, link, degree, instructor_id, courseId ],  (err, data) => {
        if (err) {
            return res.status(500).json({message:"Failed to execute query " , error , msg:error.message, stack:error.stack }) 
        } else {
            return res.status(200).json({message:"done "  })
        }
    });  
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });  
    }
}



 export const editExam = async(req, res, next )=>{
    const{type , link , degree , content_id} = req.body
    console.log( req.body);

 try {

    dbConfig.execute(`UPDATE exam 
        SET e_type = ?, e_link = ?, e_degree = ?, e_content_id = ? 
        WHERE e_degree= ?`,
       [ type , link , degree , content_id , degree ],  (error, data) => {
       if (error) {
           return res.status(500).json({message:"Failed to execute query " , error , msg:error.message, stack:error.stack }) 
       } else {
           return res.status(200).json({message:"Exam updated successfully "    })
       }
   });  
 
 } catch (error) {
    return res.status(500).json({ message: "Failed to update exam", error: error.message, stack: error.stack}); 
 }
} 

export const getExam = async (req, res, next) => {
   try {
    const { type } = req.body;  
    if (!type) {
        return res.status(400).json({ message: "Exam type is required" });
    }

    dbConfig.execute(`SELECT * FROM exam WHERE e_type=? `, [type ], (err, data) => {
        if (err) {
            return res.status(500).json({message: "Failed to execute query",error: err, msg: err.message,stack: err.stack
            });
        } else {
            if (data.length === 0) {
                return res.status(404).json({ message: "No exam found" });
            }
            return res.status(200).json({ message: "Success", exams: data });
        }
    });
   } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });  
   } 
};

export const deleteExam = async(req, res, next )=>{
    console.log("DELETE request received");
  
        const{type } = req.body
        console.log("Request body:", req.body);
     dbConfig.execute( `DELETE FROM exam WHERE e_type = ?`,
        [ type  ],  (error, data) => {
        if (error) {
            return res.status(500).json({message:"Failed to execute query " , error , msg:error.message, stack:error.stack }) 
        } else {
            return res.status(200).json({message:"done "  })
        }
    });  
  
}