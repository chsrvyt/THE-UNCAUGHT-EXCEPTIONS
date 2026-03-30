import fetch from 'node-fetch';
import { supabase } from '../config/supabase.js';

const CACHE_DURATION_MINUTES = 60; // 1 hour

// Fallback in-memory cache (used if Supabase is unavailable)
let memoryCache = {
    data: null,
    lastFetched: 0
};
const CACHE_DURATION_MS = CACHE_DURATION_MINUTES * 60 * 1000;

/**
 * Fetch articles from Supabase cache (if fresh)
 */
async function getCachedNewsFromSupabase() {
    const { data, error } = await supabase
        .from('news_cache')
        .select('*')
        .order('fetched_at', { ascending: false })
        .limit(1)
        .single();

    if (error || !data) return null;

    const fetchedAt = new Date(data.fetched_at).getTime();
    const ageMinutes = (Date.now() - fetchedAt) / 60000;

    if (ageMinutes > CACHE_DURATION_MINUTES) return null; // Cache expired

    return data.articles;
}

/**
 * Save articles to Supabase cache
 */
async function saveNewsToSupabase(articles) {
    // Upsert into a single-row cache table (using id=1 as the canonical cache row)
    const { error } = await supabase
        .from('news_cache')
        .upsert({
            id: 1,
            articles: articles,
            fetched_at: new Date().toISOString()
        }, { onConflict: 'id' });

    if (error) {
        console.warn('[News] Failed to save cache to Supabase:', error.message);
    }
}

/**
 * Fetch fresh articles from NewsAPI
 */
async function fetchFromNewsAPI(apiKey, language) {
    const keywords = ['agriculture', 'farming', 'mandi', 'MSP', 'crop', 'fertilizer'];
    const qBase = `(${keywords.join(' OR ')})`;
    const finalQuery = `${qBase} AND India`;

    const url = new URL('https://newsapi.org/v2/everything');
    url.searchParams.append('q', finalQuery);
    url.searchParams.append('apiKey', apiKey);
    url.searchParams.append('language', language === 'hi' ? 'hi' : 'en');
    url.searchParams.append('sortBy', 'publishedAt');
    url.searchParams.append('pageSize', '5');

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
        if (response.status === 429) {
            throw Object.assign(new Error('News service busy. Try again later.'), { status: 429 });
        }
        throw new Error(data.message || 'Failed to fetch news from API');
    }

    return (data.articles || []).map(article => ({
        title: article.title,
        source: article.source.name,
        publishedDate: article.publishedAt,
        articleUrl: article.url
    }));
}

/**
 * Controller for fetching curated agricultural news headlines
 * Cache strategy: Supabase (persistent) → in-memory fallback → NewsAPI fetch
 */
export const getKisanNews = async (req, res, next) => {
    try {
        const { language = 'en' } = req.query;
        const apiKey = process.env.NEWS_API_KEY;
        const now = Date.now();

        if (!apiKey || apiKey === 'your_news_api_key_here') {
            return res.status(500).json({
                error: 'News API key is not configured.',
                details: 'Please add NEWS_API_KEY to your .env file.'
            });
        }

        // 1) Try Supabase cache first
        let articles = null;
        try {
            articles = await getCachedNewsFromSupabase();
            if (articles) {
                console.log('[News] Serving from Supabase cache');
                return res.json({
                    status: 'success',
                    source: 'supabase_cache',
                    articles,
                    updatedAt: new Date().toISOString()
                });
            }
        } catch (dbErr) {
            console.warn('[News] Supabase cache read failed, trying memory cache:', dbErr.message);
        }

        // 2) Try in-memory fallback cache
        if (memoryCache.data && (now - memoryCache.lastFetched < CACHE_DURATION_MS)) {
            console.log('[News] Serving from in-memory cache');
            return res.json({
                status: 'success',
                source: 'memory_cache',
                articles: memoryCache.data,
                updatedAt: new Date(memoryCache.lastFetched).toISOString()
            });
        }

        // 3) Fetch fresh from NewsAPI
        console.log('[News] Fetching fresh news from NewsAPI...');
        articles = await fetchFromNewsAPI(apiKey, language);

        // Update in-memory cache
        memoryCache = { data: articles, lastFetched: now };

        // Persist to Supabase (non-blocking)
        saveNewsToSupabase(articles).catch(err =>
            console.warn('[News] Background Supabase save failed:', err.message)
        );

        res.json({
            status: 'success',
            source: 'newsapi',
            articles,
            updatedAt: new Date().toISOString()
        });

    } catch (error) {
        if (error.status === 429) {
            return res.status(429).json({ error: error.message });
        }
        next(error);
    }
};

/**
 * @route   POST /api/news/admin/refresh
 * @desc    Force-refresh news cache (bypasses the 1-hour wait)
 */
export const forceRefreshNews = async (req, res, next) => {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        const { language = 'en' } = req.query;

        if (!apiKey || apiKey === 'your_news_api_key_here') {
            return res.status(500).json({ error: 'News API key is not configured.' });
        }

        const articles = await fetchFromNewsAPI(apiKey, language);

        // Update in-memory cache
        memoryCache = { data: articles, lastFetched: Date.now() };

        // Persist to Supabase
        await saveNewsToSupabase(articles);

        res.json({
            status: 'success',
            message: 'News cache refreshed successfully',
            articles,
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
};
