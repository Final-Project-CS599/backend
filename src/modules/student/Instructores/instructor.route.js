import express from "express";
import {
  getInstructors,
  getInstructorProfile,
} from "./instructor.controller.js";
import { verifyToken } from "../../../middleware/auth.js";

const router = express.Router();

router.get("/instructor", verifyToken, getInstructors);
router.get("/instructor/profile/:id", verifyToken, getInstructorProfile);

export default router;
