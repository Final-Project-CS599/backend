export const createExamTable = `CREATE TABLE IF NOT EXISTS exam (
        e_type VARCHAR(200) NOT NULL,
        e_link VARCHAR(200) NOT NULL,
        e_degree FLOAT NOT NULL, 
        e_content_id INT ,
        FOREIGN KEY (e_content_id) REFERENCES content(c_content_id) ON DELETE CASCADE ON UPDATE CASCADE
);` ;
