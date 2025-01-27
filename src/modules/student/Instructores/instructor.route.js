import express from "express";
import getInstructors from "./instructor.controller.js";

const router = express.Router();

router.get("/student/instructor", getInstructors);

export default router;
