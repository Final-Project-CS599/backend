export const createMedia =  
`CREATE TABLE IF NOT EXISTS media (
    m_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    m_content_id INT ,
    m_link VARCHAR(200) NOT NULL,
    FOREIGN KEY (m_content_id) REFERENCES content(c_content_id) ON DELETE CASCADE ON UPDATE CASCADE

    ); `
// m_type VARCHAR(200) NOT NULL,
