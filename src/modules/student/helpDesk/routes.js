import express from 'express';
import { verifyToken } from '../../../middleware/auth.js'; // Authentication middleware
import { sendMessageToHelpDesk, getStudentMessages } from './controller.js'; // Import controllers
import { validate } from '../../../middleware V2/validate.js'; // Import validation middleware
import { sendMessageValidation } from '../../../validation/student/sendHelpDeskMessage.js'; // Import validation schema
const router = express.Router();

// Route for sending a message to the help desk
router.post(
  '/help-desk/send',
  verifyToken, // Ensure the user is authenticated
  sendMessageValidation, // Validate the request body
  validate, // Handle validation errors
  sendMessageToHelpDesk // Controller to handle the request
);

// Route for retrieving student messages from the help desk
router.get(
  '/help-desk/messages',
  verifyToken, // Ensure the user is authenticated
  getStudentMessages // Controller to handle the request
);

export default router;
