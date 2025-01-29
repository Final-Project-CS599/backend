import { Router } from "express";
import * as usersServices from "./service/updateDB.service.js";

const router = Router();

<<<<<<< HEAD
router.get('/table-student' ,usersServices.alterTableIStudent);
router.get('/table-SuperAdmin' , usersServices.alterTableAdmin);
// router.get('/truncate-tables' , usersServices.truncateTables);
export default router;
=======
router.get("/table-student", usersServices.alterTableIStudent);
router.get("/table-SuperAdmin", usersServices.alterTableAdmin);
// router.get('/truncate-tables' , usersServices.truncateTables);
export default router;
>>>>>>> 48039b54842b495017d07f2a3f26e41eb250fc29
