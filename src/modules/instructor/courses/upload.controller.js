import { Router } from "express";
import { uploadMaterial } from "./upload.services.js";

const routerCourseUpload=Router();
routerCourseUpload.post('/upload', uploadMaterial);

export default routerCourseUpload;
