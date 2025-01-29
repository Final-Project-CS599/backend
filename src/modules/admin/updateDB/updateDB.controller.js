import {Router } from "express";
import * as usersServices from './service/updateDB.service.js';

const router = Router();

router.get('/table-student' ,usersServices.alterTableIStudent);
router.get('/table-SuperAdmin' , usersServices.alterTableAdmin);
// router.get('/truncate-tables' , usersServices.truncateTables);



export default router;
