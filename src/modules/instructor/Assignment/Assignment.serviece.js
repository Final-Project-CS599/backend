
import dbConfig from "../../../DB/connection.js";

export const addAssignment = async (req, res, next) => {
    try {
        const { type, link, degree, description, publish_date, title } = req.body;

        if (!type || !link || !degree || !description || !publish_date || !title) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const [contentResult] = await dbConfig.execute(
            `INSERT INTO content (c_description, c_publish_date, c_title, c_type) VALUES (?, ?, ?, "assignment")`,
            [description, publish_date, title, "Assignment"]
        );

        const contentId = contentResult.insertId;

        await dbConfig.execute(
            `INSERT INTO Assignment (type,link,degree,content_id) VALUES (?, ?, ?, ?)`,
            [type, link, degree, contentId]
        );

        res.status(200).json({ message: "Assignment added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


 export const editAssignment = async(req, res, next )=>{
    const{type , link , degree , content_id} = req.body
    console.log( req.body);

 try {

    dbConfig.execute(`UPDATE Assignment 
        SET e_type = ?, e_link = ?, e_degree = ?, e_content_id = ? 
        WHERE e_degree= ?`,
       [ type , link , degree , content_id , degree ],  (error, data) => {
       if (error) {
           return res.status(500).json({message:"Failed to execute query " , error , msg:error.message, stack:error.stack }) 
       } else {
           return res.status(200).json({message:"Assignment updated successfully "    })
       }
   });  
 
 } catch (error) {
    return res.status(500).json({ message: "Failed to update Assignment", error: error.message, stack: error.stack}); 
 }
} 

export const getAssignment = async (req, res, next) => {
   try {
    const { type } = req.body;  
    if (!type) {
        return res.status(400).json({ message: "Assignment type is required" });
    }

    dbConfig.execute(`SELECT * FROM Assignment WHERE e_type=? `, [type ], (err, data) => {
        if (err) {
            return res.status(500).json({message: "Failed to execute query",error: err, msg: err.message,stack: err.stack
            });
        } else {
            if (data.length === 0) {
                return res.status(404).json({ message: "No Assignment found" });
            }
            return res.status(200).json({ message: "Success", Assignments: data });
        }
    });
   } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });  
   } 
};

export const deleteAssignment = async(req, res, next )=>{
    console.log("DELETE request received");
  
        const{type } = req.body
        console.log("Request body:", req.body);
     dbConfig.execute( `DELETE FROM Assignment WHERE e_type = ?`,
        [ type  ],  (error, data) => {
        if (error) {
            return res.status(500).json({message:"Failed to execute query " , error , msg:error.message, stack:error.stack }) 
        } else {
            return res.status(200).json({message:"done "  })
        }
    });  
  
}