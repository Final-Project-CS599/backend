import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import bootstrap from './src/modules/app.controller.js';
import express from 'express';
import multer from 'multer';

dotenv.config({ path: path.resolve('.env.dev') });

const app = express();
const upload = multer(); // Middleware for form-data parsing

const port = process.env.PORT || 1000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

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
