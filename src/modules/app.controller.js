import dbConfig from '../DB/connection.js';
import { globalErrorHandling } from '../utils/response/error.response.js';
import dbRoute from './createTable/CreateTable.controller.js';
import authAddUsersController from './admin/authAddUsers/addUsersAuth.controller.js';
import authController from './admin/auth/auth.controller.js';
import updateDBController from './admin/updateDB/updateDB.controller.js';
import coursesController from './admin/courses/courses.controller.js';
import cors  from 'cors' 
import session from 'express-session';
import cookieParser from 'cookie-parser';



const bootstrap = (app, express) => {
  app.use(cors({
    origin: process.env.FE_URL,
    credentials: true 
  }));


  app.use(express.json());

  app.all(`*` , (req ,res ,next) => {
    console.log(
      `
        User with ip: ${req.ip} send request with:
        URL: ${req.url}
        method: ${req.method}
        body: ${JSON.stringify(req.body)}
        Headers:${JSON.stringify(req.query["ln"])}
      `,
    );
    next();
  })
  
  app.get('/', (req, res, next) => {
    return res.status(200).json({ message: 'Welcome in node.js project powered by express and ES6' });
  });

  app.use('/DB', dbRoute);
  app.use('/auth/addUser' , authAddUsersController);
  app.use('/auth' , authController);
  app.use('/updateDB', updateDBController);
  app.use('/courses' , coursesController)


  app.all('*', (req, res, next) => {
    return res.status(404).json({ message: 'In-valid routing' });
  });

  app.use(globalErrorHandling);


  dbConfig.connect((err) => {
      if (err) {
        console.log('error on db connection ', err);
      } else {
        console.log('db connected');
      }
  });
  
};

export default bootstrap;

