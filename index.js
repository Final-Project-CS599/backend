import path from 'path';
import dotenv from 'dotenv';

dotenv.config({path:(path.resolve('./src/config/.env.dev'))});

import bootstrap from './src/modules/app.controller.js';
import express from 'express';

const app = express();
const port = process.env.PORT || 5000;

bootstrap(app, express);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});


app.on("error" , (err) => {
    console.error(`Error app listening on PORT : ${err}`);
});


