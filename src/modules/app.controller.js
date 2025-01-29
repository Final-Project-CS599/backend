import dbConfig from "../DB/connection.js";
import { globalErrorHandling } from '../utils/response/error.response.js';
// DB models
import dbRoute from './createTable/CreateTable.controller.js';
// Admin controllers
import authAddUsersController from './admin/authAddUsers/addUsersAuth.controller.js';
import authController from './admin/auth/auth.controller.js';
import updateDBController from './admin/updateDB/updateDB.controller.js';
import authAddUsersController from "./admin/authAddUsers/addUsersAuth.controller.js";
import authController from "./admin/auth/auth.controller.js";
import updateDBController from "./admin/updateDB/updateDB.controller.js";

import departmentsRouter from './admin/department/department.routes.js';
import editStudentsRouter from "./admin/editStudent/editStudent.routes.js";
import adminProfileRouter from "./admin/adminProfile/adminProfile.routes.js";
// Student controllers
import userRoutes from "../modules/student/users/routes.js";
import updateStudentProfileRoutes from '../modules/student/profile/routes.js';
import studentHelpDeskRoutes from '../modules/student/helpDesk/routes.js';
import { updateInstructorProfile } from './instructor/profile/ProfInst.services.js';
import uploadCourseMaterial from './instructor/courses/upload.controller.js';
import { viewMaterialCourse } from './instructor/courses/viewcourseMat/view.services.js'; 
import  examController from "./instructor/exam/exam.controller.js";
import  MessageController from "./instructor/message/message.controller.js";
import contentController from "./instructor/content/content.controller.js";
import assignmentController from "./instructor/Assignment/Assignment.controller.js"
import instructorRout from "../modules/student/Instructores/instructor.route.js";
import assignmentRout from "../modules/student/Assinment/assign.route.js";
// Cors 
import cors  from 'cors' 
import session from 'express-session';
import cookieParser from 'cookie-parser';


const baseUrl = "/api/v1";

const bootstrap = (app, express) => {
  app.use(cors({
    origin: '*',
    credentials: true // السماح بإرسال الكوكيز
  }));

  // استخدام cookie-parser middleware
  // app.use(cookieParser(process.env.COOKIE_SECRET));
  
  app.use(session({
    secret: process.env.SESSION_SECRET, // secret used to sign session ID cookie
    resave: false, // no save session if unmodified
    saveUninitialized: true, // don't create session until something stored
    cookie: { 
      secure: false, // true if using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 , // 24 hours
      sameSite: 'lax'
    } 
  }));

  app.use(express.json());

  
  app.all(`*`, (req, res, next) => {

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

  app.get("/", (req, res, next) => {
    return res.status(200).json({
      message: "Welcome in node.js project powered by express and ES6",
    });
  });

  app.use('/DB', dbRoute);
  app.use('/auth/addUser' , authAddUsersController);
  app.use('/auth' , authController);
  app.use('/updateDB', updateDBController);
  // app.use('/courses' , coursesController);
  app.use(`${baseUrl}/users`, userRoutes);
  app.use(`${baseUrl}/student`, updateStudentProfileRoutes);
  app.use(`${baseUrl}/student`, studentHelpDeskRoutes);
  app.use('/courseMaterial', uploadCourseMaterial);
  app.use('/courseMaterial', viewMaterialCourse);
  app.use('/exam', examController)
  app.use('/message', MessageController)
  app.use('/assignment',assignmentController)
  app.use('/content',contentController)
  app.use('/instProfile',updateInstructorProfile)
  app.use(`${baseUrl}/departments`, departmentsRouter);
  app.use(`${baseUrl}/adminProfile`, adminProfileRouter);
  app.use(`${baseUrl}/student/instructor`, instructorRout);
  app.use(`${baseUrl}/student`, assignmentRout);
  app.use(`${baseUrl}/editStudents`, editStudentsRouter);

  app.get("/", (req, res, next) => {
    return res.status(200).json({
      message: "Welcome in node.js project powered by express and ES6",
    });
  });

  app.all("*", (req, res, next) => {
    return res.status(404).json({ message: "In-valid routing" });
  });

  app.use(globalErrorHandling);

  dbConfig.connect((err) => {
    if (err) {
      console.log("error on db connection ", err);
    } else {
      console.log("db connected");
    }
  });
};

export default bootstrap;
