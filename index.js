// dotenv
import path from 'path';
import dotenv from 'dotenv';
// path .env
dotenv.config({ path: path.resolve('.env.dev') });
//express or app bootstrap
import bootstrap from './src/modules/app.controller.js';
import express from 'express';
// Multer
import multer from 'multer';
// Cors
import cors  from 'cors' 
import session from 'express-session';
import cookieParser from 'cookie-parser';

// express
const app = express();
// Port
const port = process.env.PORT || 1000;

  app.use(
    cors({
      origin: '*',
      credentials: true, // السماح بإرسال الكوكيز
    })
  );

  // استخدام cookie-parser middleware
  // app.use(cookieParser(process.env.COOKIE_SECRET));

  app.use(
    session({
      secret: process.env.SESSION_SECRET, // secret used to sign session ID cookie
      resave: false, // no save session if unmodified
      saveUninitialized: true, // don't create session until something stored
      cookie: {
        secure: false, // true if using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        sameSite: 'lax',
      },
    })
  );

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