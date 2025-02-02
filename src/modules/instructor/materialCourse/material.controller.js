import { Router } from "express";
import * as materialService from "./material.service.js";
import multer from "multer";
import path from "path";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// تعريف الـ Routes
router.post("/add", upload.single("file"), materialService.uploadMaterial);
router.put("/edit", materialService.editMaterial);
router.get("/view", materialService.getMaterial);
router.delete("/delete", materialService.deleteMaterial);
router.get("/searchMaterial",materialService.searchMaterial)

export default router;
