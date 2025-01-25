import dbConfig from '../DB/connection.js';
import { globalErrorHandling } from '../utils/error/error.handling.js';
import dbRoute from './createTable/CreateTable.controller.js';
import authAddUsersController from '../modules/authAddUsers/addUsersAuth.controller.js';
import authController from '../modules/auth/auth.controller.js';
import userRoutes from '../modules/student/users/routes.js';
import updateStudentProfileRoutes from '../modules/student/profile/routes.js';
import studentHelpDeskRoutes from '../modules/student/helpDesk/routes.js';
import uploadCourseMaterial from './instructor/courses/upload.controller.js';
import { viewMaterialCourse } from './instructor/courses/viewcourseMat/view.services.js';

const baseUrl = '/api/v1';

const bootstrap = (app, express) => {
  app.all(`*`, (req, res, next) => {
    console.log(
      `
        User with ip: ${req.ip} send request with:
        URL: ${req.url}
        method: ${req.method}
        body: ${JSON.stringify(req.body)}
        Headers:${JSON.stringify(req.query['ln'])}
      `
    );
    next();
  });

  app.get('/', (req, res, next) => {
    return res
      .status(200)
      .json({ message: 'Welcome in node.js project powered by express and ES6' });
  });

  app.use('/DB', dbRoute);
  app.use('/auth/addUser', authAddUsersController);
  app.use('/auth', authController);

  app.use(`${baseUrl}/users`, userRoutes);
  app.use(`${baseUrl}/student`, updateStudentProfileRoutes);
  app.use(`${baseUrl}/student`, studentHelpDeskRoutes);

  app.use('/courseMaterial', uploadCourseMaterial);
  app.use('/courseMaterial', viewMaterialCourse);

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
