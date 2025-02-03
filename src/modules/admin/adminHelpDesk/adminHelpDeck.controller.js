import { Router } from "express";
import * as helpDeskServices from './service/adminHelpDesk.service.js';



const router = Router();

//HelpDesk

router.get('/viewHelpDesk' , helpDeskServices.getHelpDesk)
router.delete('/deleteHelpDesk/:id', helpDeskServices.deletedHelpDesk);


export default router;

