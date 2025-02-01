import express from "express";
import { getexam, takeExam } from "./exam.controller.js";
import { verifyToken } from "../../../middleware/auth.js";

const router = express.Router();

router.get("/exam", getexam);
router.post("/submitexam", verifyToken, takeExam);

export default router;
