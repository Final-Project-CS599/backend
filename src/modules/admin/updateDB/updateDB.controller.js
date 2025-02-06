import { Router } from 'express';
import * as usersServices from './service/updateDB.service.js';




const router = Router();
router.get('/table-student' ,usersServices.alterTableIStudent);



export default router;
