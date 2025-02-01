import path from 'path';
import dotenv from 'dotenv';
import bootstrap from './src/modules/app.controller.js';
import express from 'express';
import multer from 'multer';

dotenv.config({ path: path.resolve('.env.dev') });

const app = express();
const port = process.env.PORT || 1000;

const upload = multer(); // Middleware for form-data parsing

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.is('multipart/form-data')) {
    upload.none()(req, res, next);
  } else {
    next();
  }
});

bootstrap(app, express);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

app.on('error', (err) => {
  console.error(`Error app listening on PORT : ${err}`);
});


//sudent token
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaXNMb2dnZWRJbiI6dHJ1ZSwiaWF0IjoxNzM4NDIyNjgyLCJleHAiOjE3Mzg1MDkwODJ9.JwxZIa2qThOF50lxB4zy7OhIZgHDKI26IZ-3JrBkHJg
//inst token
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlzTG9nZ2VkSW4iOnRydWUsImlhdCI6MTczODQyMzc5OCwiZXhwIjoxNzM4NTEwMTk4fQ.1QipGbA62lhd9VJJdLUPE6jb6ykSS4SK0w0-i0h8bGQ