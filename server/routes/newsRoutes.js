import express from 'express';
import { getKisanNews } from '../controllers/newsController.js';

const router = express.Router();

/**
 * @route   GET /api/news/kisan-news
 * @desc    Fetch agricultural news for India
 * @access  Public
 * @params  state (optional), language (optional: hi|en)
 */
router.get('/kisan-news', getKisanNews);

export default router;
