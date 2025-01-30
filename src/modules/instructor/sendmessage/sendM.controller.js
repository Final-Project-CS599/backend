import { Router } from "express";
import * as msgServise from "./sendM.service.js";
const router = Router()


router.post('/send', msgServise.sendMsg)
router.get('/receive',msgServise.receiveMsg)
export default router