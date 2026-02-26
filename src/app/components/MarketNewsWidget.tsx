import React, { useEffect, useState } from 'react';
import { Newspaper, ExternalLink, Calendar, MapPin, AlertCircle, RefreshCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';

interface Article {
    title: string;
    source: string;
    publishedDate: string;
    description: string;
    articleUrl: string;
    detectedState: string | null;
}

export function MarketNewsWidget() {
    const { language, stateVal } = useApp();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = async () => {
        setLoading(true);
        setError(null);
        try {
            // Mapping from app state to name for API
            // For now, using India as base or state if available
            const langParam = language === 'hi' ? 'hi' : 'en';
            const stateParam = stateVal ? `&state=${encodeURIComponent(stateVal)}` : '';

            const response = await fetch(`http://localhost:3001/api/news/kisan-news?language=${langParam}${stateParam}`);

            if (!response.ok) {
                const text = await response.text();
                let errorMessage = 'Failed to fetch news';
                try {
                    const errorData = JSON.parse(text);
                    errorMessage = errorData.error || errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = `Server Error (${response.status}): ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setArticles(data.articles || []);
        } catch (err: any) {
            console.error('News fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, [language, stateVal]);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[200px]">
                <RefreshCcw className="w-6 h-6 text-emerald-600 animate-spin mb-2" />
                <p className="text-sm text-gray-500 font-medium">Fetching latest agriculture news...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100 flex flex-col items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
                <p className="text-sm text-red-600 font-medium text-center">{error}</p>
                <button
                    onClick={fetchNews}
                    className="mt-3 px-4 py-2 bg-white border border-red-200 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-emerald-700" />
                    <h3 className="font-black text-gray-800 text-lg">Market & Agri News</h3>
                </div>
                <button
                    onClick={fetchNews}
                    className="p-2 hover:bg-emerald-50 rounded-full transition-colors"
                    title="Refresh news"
                >
                    <RefreshCcw className="w-4 h-4 text-emerald-600" />
                </button>
            </div>

            <div className="flex flex-col gap-3">
                {articles.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200">
                        <p className="text-gray-400 text-sm font-medium">No recent news found for your region.</p>
                    </div>
                ) : (
                    articles.map((article, idx) => (
                        <motion.a
                            key={article.articleUrl + idx}
                            href={article.articleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group flex flex-col gap-2"
                        >
                            <div className="flex justify-between items-start gap-3">
                                <h4 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors">
                                    {article.title}
                                </h4>
                                <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 flex-shrink-0" />
                            </div>

                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                {article.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 mt-1 underline-offset-2">
                                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                    <span className="uppercase tracking-wider">{article.source}</span>
                                </div>
                                {article.detectedState && (
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                                        <MapPin className="w-2.5 h-2.5" />
                                        <span>{article.detectedState}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1 text-[10px] font-medium text-gray-400 ml-auto">
                                    <Calendar className="w-2.5 h-2.5" />
                                    <span>{new Date(article.publishedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                </div>
                            </div>
                        </motion.a>
                    ))
                )}
            </div>
        </div>
    );
}
