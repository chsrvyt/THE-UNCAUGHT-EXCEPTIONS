import fetch from 'node-fetch';

// Simple in-memory cache
let newsCache = {
    data: null,
    lastFetched: 0
};

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Controller for fetching curated agricultural news headlines
 */
export const getKisanNews = async (req, res, next) => {
    try {
        const { language = 'en' } = req.query;
        const apiKey = process.env.NEWS_API_KEY;
        const now = Date.now();

        // Check cache first
        if (newsCache.data && (now - newsCache.lastFetched < CACHE_DURATION)) {
            return res.json(newsCache.data);
        }

        if (!apiKey || apiKey === 'your_news_api_key_here') {
            return res.status(500).json({
                error: 'News API key is not configured.',
                details: 'Please add NEWS_API_KEY to your .env file.'
            });
        }

        // Refined keywords for Indian agriculture
        const keywords = ['agriculture', 'farming', 'mandi', 'MSP', 'crop', 'fertilizer'];
        const qBase = `(${keywords.join(' OR ')})`;
        const finalQuery = `${qBase} AND India`;

        const url = new URL('https://newsapi.org/v2/everything');
        url.searchParams.append('q', finalQuery);
        url.searchParams.append('apiKey', apiKey);
        url.searchParams.append('language', language === 'hi' ? 'hi' : 'en');
        url.searchParams.append('sortBy', 'publishedAt');
        url.searchParams.append('pageSize', '5'); // Limit to 5 headlines

        const response = await fetch(url.toString());
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 429) {
                return res.status(429).json({ error: 'News service busy. Try again later.' });
            }
            throw new Error(data.message || 'Failed to fetch news');
        }

        // Strip down articles to bare minimum as requested
        const formattedArticles = (data.articles || []).map(article => ({
            title: article.title,
            source: article.source.name,
            publishedDate: article.publishedAt,
            articleUrl: article.url
        }));

        const result = {
            status: 'success',
            articles: formattedArticles,
            updatedAt: new Date().toISOString()
        };

        // Update cache
        newsCache = {
            data: result,
            lastFetched: now
        };

        res.json(result);

    } catch (error) {
        next(error);
    }
};
