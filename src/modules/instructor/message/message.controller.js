import { Router } from "express";
import * as messageServise from "./service/message.server.js";
const router = Router()


router.post('/send', messageServise.sendMessage)
router.get('/receive',messageServise.receiveMessage)
export default router