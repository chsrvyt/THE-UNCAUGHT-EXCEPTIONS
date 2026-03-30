import express from 'express';
import { getKisanNews, forceRefreshNews } from '../controllers/newsController.js';

const router = express.Router();

/**
 * @route   GET /api/news/kisan-news
 * @desc    Fetch agricultural news for India (served from Supabase cache when fresh)
 * @access  Public
 * @params  language (optional: hi|en)
 */
router.get('/kisan-news', getKisanNews);

/**
 * @route   POST /api/news/admin/refresh
 * @desc    Force-refresh the news cache from NewsAPI and persist to Supabase
 * @access  Admin only (protect this in production)
 */
router.post('/admin/refresh', forceRefreshNews);

export default router;
