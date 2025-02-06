import { Router } from 'express';
import * as helpServise from './help.service.js';
import { verifyToken } from '../../../middleware/auth.js';
const router = Router();

router.post('/send', verifyToken, helpServise.sendMsgHelp);
router.get('/viewHelp', verifyToken, helpServise.getInstructorMessages);
//router.get('/receive',messageServise.receiveMessage)
export default router;
