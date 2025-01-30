import { Router } from "express";
import { viewMaterialCourse ,uploadMaterial} from "./material.service.js";
const router=Router();
router.get('/view', viewMaterialCourse);
router.post('/upload',uploadMaterial)
export default router;
