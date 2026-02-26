import fetch from 'node-fetch';

/**
 * Controller for fetching agricultural news from India
 * Supports filtering by state and language
 * Keywords: किसान, कृषि, farmer, agriculture, mandi
 */
export const getKisanNews = async (req, res, next) => {
    try {
        const { state, language = 'en' } = req.query;
        const apiKey = process.env.NEWS_API_KEY;

        if (!apiKey || apiKey === 'your_news_api_key_here') {
            return res.status(500).json({
                error: 'News API key is not configured on the server.',
                details: 'Please add NEWS_API_KEY to your .env file.'
            });
        }

        // Keywords for agricultural news in India
        const keywords = ['farmer', 'agriculture', 'mandi', 'किसान', 'कृषि'];
        const qBase = `(${keywords.join(' OR ')})`;

        // Ensure news is related to India. If state exists, use state, else use India.
        const locationQuery = state ? state : 'India';
        const finalQuery = `${qBase} AND ${locationQuery}`;

        // NewsAPI.org v2/everything endpoint
        // Supports searching across titles and content
        const url = new URL('https://newsapi.org/v2/everything');
        url.searchParams.append('q', finalQuery);
        url.searchParams.append('apiKey', apiKey);
        url.searchParams.append('language', language === 'hi' ? 'hi' : 'en');
        url.searchParams.append('sortBy', 'publishedAt');
        url.searchParams.append('pageSize', '20');

        const response = await fetch(url.toString());
        const data = await response.json();

        if (!response.ok) {
            // Handle rate limits and invalid keys
            if (response.status === 429) {
                return res.status(429).json({
                    error: 'Rate limit exceeded for News API.',
                    details: 'Please try again later or upgrade your API plan.'
                });
            }
            if (response.status === 401) {
                return res.status(401).json({
                    error: 'Invalid News API key.',
                    details: 'Please check your API key in the .env file.'
                });
            }
            throw new Error(data.message || 'Failed to fetch news');
        }

        // List of Indian states for detection
        const indianStates = [
            'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
            'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
            'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
            'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
            'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
        ];

        // Format and clean the response data
        const formattedArticles = (data.articles || []).map(article => {
            const content = `${article.title} ${article.description}`.toLowerCase();

            // Detect state from content if not already filtered by state
            let detectedState = state || null;
            if (!detectedState) {
                detectedState = indianStates.find(s => content.includes(s.toLowerCase())) || null;
            }

            return {
                title: article.title,
                source: article.source.name,
                publishedDate: article.publishedAt,
                description: article.description,
                articleUrl: article.url,
                detectedState: detectedState
            };
        });

        res.json({
            status: 'success',
            count: formattedArticles.length,
            articles: formattedArticles,
            query: finalQuery,
            language: language
        });

    } catch (error) {
        next(error);
    }
};
