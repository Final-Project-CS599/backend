import express from "express";
import studentassignment from "./assign.controller.js";

const router = express.Router();

router.get("/assignment", studentassignment);

export default router;
