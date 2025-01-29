import { Router } from "express";
import * as contentServiece from "./content.serviece.js";

const router = Router()

router.post("/add" , contentServiece.addContent );
export default router