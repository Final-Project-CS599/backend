import { Router } from "express";
import * as assignmentServiece from "./Assignment.serviece.js";

const router = Router()

router.post("/add" , assignmentServiece.addAssignment )
router.put('edit/:assinId',assignmentServiece.editAssignment)
router.get("/view" , assignmentServiece.getAssignment )
router.delete('/delete/:assinId',assignmentServiece.deleteAssignment)
export default router