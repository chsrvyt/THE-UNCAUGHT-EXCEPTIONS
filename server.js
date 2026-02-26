/**
 * Krishak Saarthi — Secure Weather Backend
 * Proxies Tomorrow.io API calls so the API key is never exposed to the frontend.
 *
 * Run with:  node server.js
 * Port:      3001  (Vite dev server proxies /api → http://localhost:3001)
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── Allow requests from the Vite dev server ──────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns a simple farmer-friendly advisory message based on weather conditions.
 * Written in plain language — no weather jargon.
 */
function buildAdvisory(rainProbability, humidity, temperatureC) {
    if (rainProbability > 60) return { level: 'danger', text: 'Heavy rain expected. Avoid harvesting today.' };
    if (rainProbability >= 30) return { level: 'warning', text: 'Possible rain. Be cautious while working.' };
    if (humidity > 80) return { level: 'warning', text: 'High humidity. Storage risk is high.' };
    if (temperatureC > 38) return { level: 'warning', text: 'Extreme heat alert. Stay hydrated, rest often.' };
    return { level: 'good', text: 'Good weather. Safe to work in the fields.' };
}

// ── GET /api/weather ──────────────────────────────────────────────────────────
// Query params: lat (number), lon (number)
app.get('/api/weather', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'lat and lon query parameters are required.' });
    }

    const apiKey = process.env.TOMORROW_API_KEY;
    if (!apiKey) {
        console.error('[weather] TOMORROW_API_KEY not set in .env');
        return res.status(500).json({ error: 'Weather service not configured. Contact support.' });
    }

    try {
        // Tomorrow.io Forecast API — metric units, 4-day timeline
        const url = new URL('https://api.tomorrow.io/v4/weather/forecast');
        url.searchParams.set('location', `${lat},${lon}`);
        url.searchParams.set('units', 'metric');
        url.searchParams.set('apikey', apiKey);

        const upstream = await fetch(url.toString(), {
            headers: { Accept: 'application/json' },
        });

        if (!upstream.ok) {
            const text = await upstream.text();
            console.error('[weather] Tomorrow.io error', upstream.status, text);
            return res.status(502).json({ error: 'Weather service unavailable. Please try again.' });
        }

        const data = await upstream.json();

        // ── Extract current conditions (first hourly block) ───────────────────
        const hourly = data?.timelines?.hourly || [];
        const daily = data?.timelines?.daily || [];

        const current = hourly[0]?.values || {};
        const tempC = Math.round(current.temperature ?? 28);
        const rainProb = Math.round(current.precipitationProbability ?? 0);
        const humidity = Math.round(current.humidity ?? 60);
        const windKmh = Math.round((current.windSpeed ?? 0) * 3.6); // m/s → km/h

        // ── 3-day forecast summary ────────────────────────────────────────────
        const forecast = daily.slice(0, 3).map((day) => ({
            date: day.time ? new Date(day.time).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : '',
            maxTempC: Math.round(day.values?.temperatureMax ?? tempC),
            minTempC: Math.round(day.values?.temperatureMin ?? tempC - 4),
            rainProbability: Math.round(day.values?.precipitationProbabilityAvg ?? rainProb),
            humidity: Math.round(day.values?.humidityAvg ?? humidity),
        }));

        // ── Advisory message ──────────────────────────────────────────────────
        const advisory = buildAdvisory(rainProb, humidity, tempC);

        return res.json({
            current: { tempC, rainProbability: rainProb, humidity, windKmh },
            forecast,
            advisory,
            updatedAt: new Date().toISOString(),
        });

    } catch (err) {
        console.error('[weather] Unexpected error:', err);
        return res.status(500).json({ error: 'Failed to fetch weather data. Check your connection.' });
    }
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'Krishak Saarthi Weather API' }));

app.listen(PORT, () =>
    console.log(`✅  Weather backend running at http://localhost:${PORT}`)
);
