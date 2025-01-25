import { Router } from "express";
import { viewMaterialCourse } from "../viewcourseMat/view.services.js";

const routerCourseView=Router();
routerCourseView.get('/view', viewMaterialCourse);

export default routerCourseUpload;
