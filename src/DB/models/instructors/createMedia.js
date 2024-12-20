export const createMedia =  
`CREATE TABLE IF NOT EXISTS media (
    m_type VARCHAR(200) NOT NULL,
    m_content_id INT ,
    FOREIGN KEY (m_content_id) REFERENCE content(c_id) ON DELETE CASCADE ON UPDATE CASCADE

      

    ); `