import { viewCourseById, viewCoursesWithExtraData } from "./viewCourse.serviece.js";
import { Router } from "express";
import { verifyToken } from "../../../middleware/auth.js";
const router = Router();

router.get('/viewCoursesWithExtra',verifyToken,viewCoursesWithExtraData);
router.get("/viewCourse/:course_id",viewCourseById)

export default router
