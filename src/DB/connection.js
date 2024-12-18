import mysql2 from 'mysql2';

export const dbConfig = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'projectbackend',
});
