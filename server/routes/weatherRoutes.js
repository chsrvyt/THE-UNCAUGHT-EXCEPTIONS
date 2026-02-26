import express from 'express';
import weatherController from '../controllers/weatherController.js';

const router = express.Router();

// Define endpoints
router.get('/', weatherController.getWeather);
router.get('/history', weatherController.getHistory);
router.get('/latest', weatherController.getLatest);

export default router;
