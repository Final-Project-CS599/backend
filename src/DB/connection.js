import path from 'path';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve('.env.dev') });

const dbConfig = mysql2.createConnection({
  host: process.env.MYSQL_ADDON_HOST,
  database: process.env.MYSQL_ADDON_DB,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,

  // host     : process.env.DB_HOST,
  // user     : process.env.DB_USER,
  // password : process.env.DB_PASSWORD,
  // database : process.env.DB_NAME
});

export default dbConfig;
