import dbConfig from "../../../../DB/connection.js";
import { errorAsyncHandler } from "../../../../utils/response/error.response.js";
import { successResponse } from './../../../../utils/response/success.response.js';



export const getHelpDesk = errorAsyncHandler(
    async (req ,res ,next) => {
        dbConfig.execute(` SELECT  hd_id, hd_title, hd_description, hd_status, hd_type, hd_email,
            CONCAT(student.s_first_name, ' ', student.s_last_name , ' ' , s_middle_name) AS studentName,
            CONCAT(Instructors.i_firstName, ' ', Instructors.i_lastName) AS instructorName,
            hd_createdAt, hd_updatedAt
            FROM 
                helpDesk
            LEFT JOIN 
                student ON helpDesk.hd_studentId = student.s_id
            LEFT JOIN 
            Instructors ON helpDesk.hd_instructorsId = Instructors.i_id;` , 
            (err , data) => {
                if (err) {
                    return next(new Error(`Error Server Database failed` , {cause: 500}));
                }

                if (data.length === 0) {
                    return next(new Error("Data Users Not Found" , {cause: 404}));
                }

                return successResponse({ res, message: "View HelpDesk Successfully",
                    status: 200,
                    data: data.map((item) => ({
                        id: item.hd_id,
                        name: item.studentName || item.instructorName,
                        email: item.hd_email,
                        title: item.hd_title,
                        description: item.hd_description
                    }))
                });
            }
        )
    }
);


export const deletedHelpDesk = errorAsyncHandler(
    async(req , res , next) => {
        const { id } = req.params;

        if (!id) {
            return next(new Error("ID is required", { cause: 400 }));
        }

        dbConfig.execute(`DELETE FROM helpDesk WHERE hd_id =?` , [id] ,
            (err , date) => {
                if (err) {
                    return next(new Error(`Error Server Database failed ` , {cause: 500}));
                }

                if (date.affectedRows === 0) {
                    return next(new Error("Data Users Not Found" , {cause: 404}))
                }

                return successResponse({res , message: "Deleted HelpDesk Successfully" , status: 200 })
            }
        )
    }
);


