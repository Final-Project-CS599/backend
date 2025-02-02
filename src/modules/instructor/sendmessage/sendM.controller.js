import { Router } from "express";
import * as msgServise from "./sendM.service.js";
import { verifyToken } from "../../../middleware/auth.js";
const router = Router()


router.post('/send',verifyToken, msgServise.sendMsg)
router.get('/viewMsgInst',verifyToken,msgServise.viewMessagesInstructor)
router.get('/viewMsgStu',verifyToken,msgServise.viewMessageStudent)
router.delete('/deleteMsg/:messageId',verifyToken,msgServise.deleteMessageInstructor)
router.delete('/deleteMsg',verifyToken,msgServise.deleteMessageStudent)
export default router