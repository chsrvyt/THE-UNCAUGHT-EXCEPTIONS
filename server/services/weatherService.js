import fetch from 'node-fetch';
import { supabase } from '../config/supabase.js';
import { classifyHeatZone } from '../utils/heatZone.js';

/**
 * Service to handle weather logic: fetching from API and storing in DB.
 */
class WeatherService {
    /**
     * Helper to build advisory text based on conditions.
     */
    buildAdvisory(rainProb, humidity, tempC) {
        if (rainProb > 60) return { level: 'danger', text: 'Heavy rain expected. Avoid harvesting today.' };
        if (rainProb >= 30) return { level: 'warning', text: 'Possible rain. Be cautious while working.' };
        if (humidity > 80) return { level: 'warning', text: 'High humidity. Storage risk is high.' };
        if (tempC > 38) return { level: 'warning', text: 'Extreme heat alert. Stay hydrated, rest often.' };
        return { level: 'good', text: 'Good weather. Safe to work in the fields.' };
    }

    async getWeatherData(lat, lon) {
        const apiKey = process.env.TOMORROW_API_KEY;
        if (!apiKey) {
            throw new Error('TOMORROW_API_KEY is not configured');
        }

        const url = new URL('https://api.tomorrow.io/v4/weather/forecast');
        url.searchParams.set('location', `${lat},${lon}`);
        url.searchParams.set('units', 'metric');
        url.searchParams.set('apikey', apiKey);

        const response = await fetch(url.toString(), {
            headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[WeatherService] API Error:', response.status, errorText);
            throw new Error('Failed to fetch weather from provider');
        }

        const data = await response.json();

        // Extract current conditions
        const hourly = data?.timelines?.hourly || [];
        const daily = data?.timelines?.daily || [];
        const current = hourly[0]?.values || {};

        const tempC = Math.round(current.temperature ?? 28);
        const rainProb = Math.round(current.precipitationProbability ?? 0);
        const humidity = Math.round(current.humidity ?? 60);
        const windKmh = Math.round((current.windSpeed ?? 0) * 3.6);

        // Classification and Advisory
        const heatZoneInfo = classifyHeatZone(tempC);
        const advisory = this.buildAdvisory(rainProb, humidity, tempC);

        // Save to Supabase
        const { error: dbError } = await supabase
            .from('weather_records')
            .insert({
                latitude: parseFloat(lat),
                longitude: parseFloat(lon),
                temperature_c: tempC,
                humidity,
                rain_probability: rainProb,
                wind_kmh: windKmh,
                heat_zone: heatZoneInfo.zone,
                risk_level: advisory.level,
                advisory_text: advisory.text,
            });

        if (dbError) {
            console.error('[WeatherService] DB Error:', dbError);
            // We don't throw here to ensure the user still gets the weather even if DB fails
        }

        // Forecast formatting
        const forecast = daily.slice(0, 3).map((day) => ({
            date: day.time ? new Date(day.time).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : '',
            maxTempC: Math.round(day.values?.temperatureMax ?? tempC),
            minTempC: Math.round(day.values?.temperatureMin ?? tempC - 4),
            rainProbability: Math.round(day.values?.precipitationProbabilityAvg ?? rainProb),
            humidity: Math.round(day.values?.humidityAvg ?? humidity),
        }));

        return {
            current: {
                tempC,
                rainProbability: rainProb,
                humidity,
                windKmh,
                heatZone: heatZoneInfo,
            },
            forecast,
            advisory,
            updatedAt: new Date().toISOString(),
        };
    }

    async getHistory(lat, lon) {
        const { data, error } = await supabase
            .from('weather_records')
            .select('*')
            .eq('latitude', parseFloat(lat))
            .eq('longitude', parseFloat(lon))
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;
        return data;
    }

    async getLatest(lat, lon) {
        const { data, error } = await supabase
            .from('weather_records')
            .select('*')
            .eq('latitude', parseFloat(lat))
            .eq('longitude', parseFloat(lon))
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
        return data || null;
    }
}

export default new WeatherService();
