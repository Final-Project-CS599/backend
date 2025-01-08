import dbConfig from '../DB/connection.js';
import { globalErrorHandling } from '../utils/error/error.handling.js';
import dbRoute from './createTable/CreateTable.controller.js';
import authController from '../modules/auth/addUsersAuth.controller.js';
import usersController from '../modules/users/users.controller.js';


const bootstrap = (app, express) => {
  app.use(express.json());

  app.get('/', (req, res, next) => {
    return res.status(200).json({ message: 'Welcome in node.js project powered by express and ES6' });
  });

  app.use('/DB', dbRoute);
  app.use('/auth/addUser' , authController)
  app.use('/users', usersController);

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




