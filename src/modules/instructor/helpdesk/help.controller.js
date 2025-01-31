import { Router } from "express";
import * as helpServise from "./help.service.js";
const router = Router()


router.post('/send', helpServise.sendMsgHelp)
//router.get('/receive',messageServise.receiveMessage)
export default router