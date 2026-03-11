import express from 'express';
import { getGeminiResponse } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', getGeminiResponse);

export default router;
