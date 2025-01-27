import { Router } from "express";
import * as messageServise from "./service/message.service.js";
const router = Router()


router.post('/send', messageServise.sendMessage)
router.get('/receive',messageServise.receiveMessage)
export default router