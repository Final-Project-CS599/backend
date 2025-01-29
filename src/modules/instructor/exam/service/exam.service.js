import dbConfig from "../../../../DB/connection.js"


/*export const addExam = async(req, res, next )=>{
    try {
        const{type , link , degree , content_id} = req.body
        
    if (!type || !link) {
        return res.status(400).json({ message: 'Type and link are required' });
    }
    dbConfig.execute(`INSERT INTO exam ( e_type , e_link , e_degree , e_content_id ) VALUES (?,?,?,?)`,
        [ type , link , degree , content_id ],  (err, data) => {
        if (err) {
            return res.status(500).json({message:"Failed to execute query " , error , msg:error.message, stack:error.stack }) 
        } else {
            return res.status(200).json({message:"done "  })
        }
    });  
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });  
    }
}*/
// export const addExam = async (req, res, next) => {
//   try {
//     if (req.method === "POST") {
     
//       const { type, link, degree, content_id } = req.body;

    
//       if (!type || !link || !content_id) {
//         return res.status(400).json({ message: "Type, link, and content_id are required" });
//       }

    
//       const [data] = await dbConfig.promise().execute(
//         `INSERT INTO exam (e_type, e_link, e_degree, e_content_id) VALUES (?, ?, ?, ?)`,
//         [type, link, degree, content_id]
//       );

//       return res.status(200).json({ message: "Exam added successfully", examId: data.insertId });
//     } else if (req.method === "GET") {
      
//       const [contents] = await dbConfig.promise().query(`SELECT c_content_id, c_type FROM content`);
//       return res.status(200).json({ contents });
//     } else {
      
//       return res.status(405).json({ message: "Method not allowed" });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

export const addExam = async (req, res, next) => {
    try {
        const { type, link, degree} = req.body;

        if (!type || !link || !degree) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const [contentResult] = await dbConfig.execute(
            `INSERT INTO content (c_type) VALUES ("exam")`,
            ["Exam"]
        );

        const contentId = contentResult.insertId;

        await dbConfig.execute(
            `INSERT INTO exam (type,link,degree,content_id) VALUES (?, ?, ?, ?)`,
            [type, link, degree, contentId]
        );

        res.status(200).json({ message: "Exam added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



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