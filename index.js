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


// express
const app = express();
// Port
const port = process.env.PORT || 1000;

  app.use(
    cors({
      origin: '*',
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
