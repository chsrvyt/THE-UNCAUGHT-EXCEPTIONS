import React, { useEffect, useState } from 'react';
import { Newspaper, ExternalLink, Calendar, AlertCircle, RefreshCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Article {
    title: string;
    source: string;
    publishedDate: string;
    articleUrl: string;
}

export function MarketNewsWidget() {
    const { language } = useApp();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = async () => {
        setLoading(true);
        setError(null);
        try {
            const langParam = language === 'hi' ? 'hi' : 'en';
            const response = await fetch(`http://localhost:3001/api/news/kisan-news?language=${langParam}`);

            if (!response.ok) {
                const text = await response.text();
                let errorMessage = 'Failed to fetch news';
                try {
                    const errorData = JSON.parse(text);
                    errorMessage = errorData.error || errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = `Server Error (${response.status})`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            // Data is already limited to 5 on backend, but ensuring here too
            setArticles(data.articles ? data.articles.slice(0, 5) : []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, [language]);

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <RefreshCcw className="w-6 h-6 text-emerald-600 animate-spin mb-2" />
                <p className="text-sm text-gray-400 font-bold">लोड हो रहा है...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl p-6 border border-red-100 shadow-sm flex flex-col items-center">
                <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
                <p className="text-sm text-red-600 font-bold text-center mb-3">{error}</p>
                <button
                    onClick={fetchNews}
                    className="px-6 py-2 bg-emerald-700 text-white rounded-lg text-sm font-bold active:scale-95 transition-transform"
                >
                    कोशिश करें
                </button>
            </div>
        );
    }

    return (
        <div className="px-2">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="bg-emerald-700 p-1.5 rounded-lg">
                        <Newspaper className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-black text-gray-900 text-xl tracking-tight">Krishi Updates</h3>
                </div>
                <button onClick={fetchNews} className="text-emerald-700 active:scale-90 transition-transform">
                    <RefreshCcw className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {articles.length === 0 ? (
                    <p className="text-center py-8 text-gray-400 font-bold">कोई नई सूचना नहीं है</p>
                ) : (
                    articles.map((article, idx) => (
                        <a
                            key={article.articleUrl + idx}
                            href={article.articleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-2xl p-5 shadow-sm border-2 border-transparent active:border-emerald-700 active:bg-emerald-50 transition-all flex flex-col gap-3"
                        >
                            <h4 className="font-bold text-gray-900 text-[17px] leading-[1.3]">
                                {article.title}
                            </h4>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                                        {article.source}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(article.publishedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                    <ExternalLink className="w-3 h-3 ml-1" />
                                </div>
                            </div>
                        </a>
                    ))
                )}
            </div>
        </div>
    );
}
