import {Router } from "express";
import * as usersServices from './service/updateDB.service.js';

const router = Router();

<<<<<<< HEAD

router.get("/table-student", usersServices.alterTableIStudent);
router.get("/table-SuperAdmin", usersServices.alterTableAdmin);
// router.get('/truncate-tables' , usersServices.truncateTables);
export default router;
=======
router.get('/table-student' ,usersServices.alterTableIStudent);
router.get('/table-SuperAdmin' , usersServices.alterTableAdmin);
// router.get('/truncate-tables' , usersServices.truncateTables);



export default router;

>>>>>>> 7d13ecc3cadf8811f821010acf333a9a6f2e1577
