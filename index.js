// dotenv
import dotenv from 'dotenv';
import path from 'path';
// path .env
dotenv.config({ path: path.resolve('.env.dev') });
//express or app bootstrap
import express from 'express';
import bootstrap from './src/modules/app.controller.js';
// Multer
// Cors
import cors from 'cors';

// express
const app = express();
// Port
const port = process.env.PORT || 1000;

app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

bootstrap(app, express);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

app.on('error', (err) => {
  console.error(`Error app listening on PORT : ${err}`);
});
