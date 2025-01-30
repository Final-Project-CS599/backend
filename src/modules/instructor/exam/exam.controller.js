import { Router } from "express";
import * as registrationService from "./exam.service.js";

const router = Router()

router.post("/add" , registrationService.addExam )
router.put("/edit" , registrationService.editExam )
router.get("/view" , registrationService.getExam )
router.delete("/delete" , registrationService.deleteExam )
export default router