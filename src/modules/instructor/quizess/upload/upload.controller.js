import { Router } from "express";

const route = Router();
route.post('/upload-quiz', UploadQuiz);

export default route;
