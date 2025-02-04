import { Router } from 'express';
import * as materialService from './material.service.js';
import multer from 'multer';
import { verifyToken } from '../../../middleware/auth.js';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/add', verifyToken, upload.single('file'), materialService.uploadMaterial);

router.put('/edit/:m_id', verifyToken, materialService.editMaterial);

router.get('/view', materialService.getMaterial);

router.delete('/delete/:m_id', verifyToken, materialService.deleteMaterial);

router.get('/search', verifyToken, materialService.searchMaterial);

export default router;
