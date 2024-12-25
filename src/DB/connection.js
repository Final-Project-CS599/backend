import mysql2 from 'mysql2';
import 'dotenv/config';

const dbConfig = mysql2.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'projectbackend',
});

export default dbConfig;
