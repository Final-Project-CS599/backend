import {Router } from "express";
import * as usersServices from './service/users.service.js';

const router = Router();

router.post('/alter-table' ,usersServices.alterTableIStudent);


export default router;