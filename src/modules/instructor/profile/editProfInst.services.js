import { dbConfig } from '../../DB/connection.js';
// Get instructor profile
 export const viewProfile= (req, res) => {
  const {id} = req.params; // i will use req.user.id  by token
  
    dbConfig.query("SELECT CONCAT(i_firstName,' ',i_lastName) as fullName, i_email, i_photo FROM instructors WHERE i_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({message:"fail to execute query"});
    res.json(result[0]);
  });
};

// Update instructor profile
 export const updateProfile= (req, res) => {
  const {id} = req.params;
  const { name, email} = req.body;
  const [firstName, lastName] = name.split(' ');
  let profilePicture = req.file ? req.file.path : null; 
  dbConfig.query(
    "UPDATE instructors SET i_firstName = ?, i_lastName = ?, i_email = ?, i_photo = ? WHERE i_id = ?",
    [firstName, lastName, email, profilePicture, id], // Pass id directly
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Error updating profile",
          error: err.message,
        });
      }
      res.json({ message: "Profile updated successfully" });
    }
  );
};


