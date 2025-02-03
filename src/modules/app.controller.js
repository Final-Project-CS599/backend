import dbConfig from '../DB/connection.js';
import { globalErrorHandling } from '../utils/response/error.response.js';
import dbRoute from './createTable/CreateTable.controller.js';
import instructorRoute from '../modules/student/Instructores/instructor.route.js';
import updateStudentProfileRoutes from '../modules/student/profile/routes.js';
import userRoutes from '../modules/student/users/routes.js';
import adminProfileRouter from './admin/adminProfile/adminProfile.routes.js';
import authController from './admin/auth/auth.controller.js';
import departmentsRouter from './admin/department/department.routes.js';
import editStudentsRouter from './admin/editStudent/editStudent.routes.js';
import assignmentController from './instructor/Assignment/Assignment.controller.js';
import examController from './instructor/exam/exam.controller.js';
import helpController from './instructor/helpdesk/help.controller.js';
import materialController from './instructor/materialCourse/material.controller.js';
import assignmentRoute from './student/Assinment/assign.route.js';
import examRoute from './student/Exam/exam.route.js';
import authAddUsersController from './admin/authAddUsers/addUsersAuth.controller.js';
import updateDBController from './admin/updateDB/updateDB.controller.js';
import coursesController from './admin/courses/courses.controller.js';
import editinstructorsRouter from './admin/editInstructor/editInstructor.routes.js';
import studentHelpDeskRoutes from '../modules/student/helpDesk/routes.js';
import MessageController from './instructor/sendmessage/sendM.controller.js';
import coursesRoutes from '../modules/student/courses/routes.js';
import instProfileController from './instructor/profile/InsPro.controller.js';
import courseController from './instructor/courses/viewCourse.controller.js';
// Admin controllers Help Desk
// import adminHelpDeskController from './admin/adminHelpDesk/adminHelpDeck.controller.js';

const baseUrl = '/api/v1';

const bootstrap = (app, express) => {
  app.use(express.json());

  app.all(`*`, (req, res, next) => {
    console.log(
      `
        User with ip: ${req.ip} send request with:
        URL: ${req.url}
        method: ${req.method}
        body: ${JSON.stringify(req.body)}
        Headers:${JSON.stringify(req.headers['authorization'])}
      `
    );
    next();
  });

  app.get('/', (req, res, next) => {
    return res.status(200).json({
      message: 'Welcome in node.js project powered by express and ES6',
    });
  });

  app.get('/', (req, res, next) => {
    return res.status(200).json({
      message: 'Welcome in node.js project powered by express and ES6',
    });
  });

  // DB Routes
  app.use('/DB', dbRoute);
  //added endpoints
  app.use(`${baseUrl}/courses`, courseController);
  app.use(`${baseUrl}/instructorProfile`, instProfileController);
  app.use(`${baseUrl}/message`, MessageController);
  //
  app.use(`/auth/addUser`, authAddUsersController);
  app.use(`/auth`, authController);
  app.use('/updateDB', updateDBController);
  // app.use('/courses' , coursesController);
  app.use(`${baseUrl}/users`, userRoutes);
  app.use(`${baseUrl}/student`, updateStudentProfileRoutes);
  app.use(`${baseUrl}/student`, studentHelpDeskRoutes);

  app.use(`${baseUrl}/courseMaterial`, materialController);

  app.use(`${baseUrl}/exam`, examController);
  // app.use(`${baseUrl}/message`, MessageController);
  app.use(`${baseUrl}/assignment`, assignmentController);
  // app.use(`${baseUrl}/content`, contentController);
  // app.use(`${baseUrl}/instProfile`, updateInstructorProfile);
  app.use(`${baseUrl}/student`, coursesRoutes);

  // app.use('/msg', MsgController);
  app.use(`${baseUrl}/help`, helpController);
  app.use(`${baseUrl}/departments`, departmentsRouter);
  app.use(`${baseUrl}/adminProfile`, adminProfileRouter);
  app.use(`${baseUrl}/student`, instructorRoute);
  app.use(`${baseUrl}/student`, assignmentRoute);
  app.use(`${baseUrl}/student`, examRoute);
  app.use(`${baseUrl}/editStudents`, editStudentsRouter);
  app.use(`${baseUrl}/editInstructors`, editinstructorsRouter);
  app.use(`${baseUrl}/courses`, coursesController);

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
