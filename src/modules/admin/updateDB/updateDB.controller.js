import { Router } from 'express';
import * as usersServices from './service/updateDB.service.js';

const router = Router();

<<<<<<< HEAD
router.get('/table-student' ,usersServices.alterTableIStudent);
router.get('/table-SuperAdmin' , usersServices.alterTableAdmin);
// router.get('/truncate-tables' , usersServices.truncateTables);



export default router;

=======
router.get('/table-student', usersServices.alterTableIStudent);
router.get('/table-SuperAdmin', usersServices.alterTableAdmin);
// router.get('/truncate-tables' , usersServices.truncateTables);
export default router;
>>>>>>> 78e70fea7cd038b2fc013332477d2e75d358594a
