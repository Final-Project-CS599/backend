import { Router } from "express";
import * as registrationService from "./exam.service.js";

const router = Router()

router.post("/add" , registrationService.addExam )
router.put('/edit/:examId',registrationService.editExam);
router.get("/view" , registrationService.getExam )
router.delete('/delete/:examId',registrationService.deleteExam)
export default router