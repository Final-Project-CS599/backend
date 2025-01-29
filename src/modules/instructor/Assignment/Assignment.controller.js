import { Router } from "express";
import * as assignmentServiece from "./Assignment.serviece.js";

const router = Router()

router.post("/add" , assignmentServiece.addAssignment )
router.put("/edit" , assignmentServiece.editAssignment )
router.get("/view" , assignmentServiece.getAssignment )
router.delete("/delete" , assignmentServiece.deleteAssignment )
export default router