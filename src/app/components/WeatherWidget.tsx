import React, { useState, useEffect, useCallback } from 'react';
import { WifiOff, MapPin, RefreshCw, Thermometer, Droplets, Wind, CloudRain } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface WeatherCurrent {
    tempC: number;
    rainProbability: number;
    humidity: number;
    windKmh: number;
}

interface WeatherDay {
    date: string;
    maxTempC: number;
    minTempC: number;
    rainProbability: number;
    humidity: number;
}

interface Advisory {
    level: 'good' | 'warning' | 'danger';
    text: string;
}

interface WeatherData {
    current: WeatherCurrent;
    forecast: WeatherDay[];
    advisory: Advisory;
    updatedAt: string;
}

type LoadingState = 'idle' | 'locating' | 'fetching' | 'done' | 'error';

// ── Advisory color map ─────────────────────────────────────────────────────────
const ADVISORY_STYLES: Record<Advisory['level'], { bg: string; border: string; text: string; icon: string }> = {
    good: { bg: '#f0fdf4', border: '#86efac', text: '#166534', icon: '✅' },
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e', icon: '⚠️' },
    danger: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', icon: '🌧️' },
};

// ── Stat chip ─────────────────────────────────────────────────────────────────
function StatChip({
    icon: Icon,
    iconColor,
    bg,
    label,
    value,
}: {
    icon: React.ElementType;
    iconColor: string;
    bg: string;
    label: string;
    value: string;
}) {
    return (
        <div
            className="flex flex-col items-center rounded-2xl py-3 px-2 gap-1"
            style={{ background: bg, flex: 1 }}
        >
            <Icon size={20} color={iconColor} />
            <span style={{ fontSize: 18, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{value}</span>
            <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textAlign: 'center' }}>{label}</span>
        </div>
    );
}

// ── Forecast pill ─────────────────────────────────────────────────────────────
function ForecastPill({ day }: { day: WeatherDay }) {
    const isRainy = day.rainProbability > 40;
    return (
        <div
            className="flex flex-col items-center rounded-2xl py-2 px-1"
            style={{
                flex: 1,
                background: isRainy ? '#eff6ff' : '#fafafa',
                border: `1px solid ${isRainy ? '#bfdbfe' : '#f3f4f6'}`,
            }}
        >
            <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 700 }}>{day.date.split(',')[0]}</span>
            <span style={{ fontSize: 15 }}>{isRainy ? '🌧️' : day.maxTempC > 35 ? '☀️' : '⛅'}</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#111827' }}>{day.maxTempC}°</span>
            <span style={{ fontSize: 10, color: isRainy ? '#2563eb' : '#9ca3af', fontWeight: 600 }}>{day.rainProbability}% 💧</span>
        </div>
    );
}

// REFRESH_INTERVAL: 30 minutes in milliseconds
const REFRESH_INTERVAL = 30 * 60 * 1000;

// ── Main Component ─────────────────────────────────────────────────────────────
export function WeatherWidget() {
    const [state, setState] = useState<LoadingState>('idle');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = useCallback((lat: number, lon: number) => {
        setState('fetching');
        setError(null);
        fetch(`/api/weather?lat=${lat}&lon=${lon}`)
            .then((r) => {
                if (!r.ok) throw new Error('Server error');
                return r.json() as Promise<WeatherData | { error: string }>;
            })
            .then((data) => {
                if ('error' in data) throw new Error(data.error);
                setWeather(data as WeatherData);
                setState('done');
            })
            .catch((err: Error) => {
                setError(err.message || 'Failed to load weather. Check your connection.');
                setState('error');
            });
    }, []);

    const locate = useCallback(() => {
        setState('locating');
        setError(null);
        if (!navigator.geolocation) {
            setError('Location not supported on this device.');
            setState('error');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
            (err) => {
                if (err.code === err.PERMISSION_DENIED) {
                    setError('Location permission denied. Please allow location in browser settings.');
                } else {
                    setError('Could not detect your location. Try again.');
                }
                setState('error');
            },
            { timeout: 10000 }
        );
    }, [fetchWeather]);

    // Auto-load on mount + refresh every 30 min
    useEffect(() => {
        locate();
        const id = setInterval(locate, REFRESH_INTERVAL);
        return () => clearInterval(id);
    }, [locate]);

    // ── IDLE / LOCATING / FETCHING ─────────────────────────────────────────────
    if (state === 'idle' || state === 'locating' || state === 'fetching') {
        return (
            <div
                className="rounded-2xl flex items-center justify-center gap-3"
                style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: '20px 16px' }}
            >
                <div
                    className="rounded-full border-2 border-t-transparent animate-spin"
                    style={{ width: 22, height: 22, borderColor: '#14532d', borderTopColor: 'transparent' }}
                />
                <span style={{ fontSize: 14, color: '#6b7280', fontWeight: 600 }}>
                    {state === 'locating' ? '📍 Detecting your location…' : '☁️ Fetching weather…'}
                </span>
            </div>
        );
    }

    // ── ERROR ──────────────────────────────────────────────────────────────────
    if (state === 'error') {
        return (
            <div
                className="rounded-2xl flex items-start gap-3"
                style={{
                    background: '#fef2f2',
                    border: '1.5px solid #fecaca',
                    padding: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
            >
                <WifiOff size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                <div className="flex-1">
                    <p style={{ fontSize: 14, color: '#991b1b', fontWeight: 700, margin: 0 }}>
                        Weather Unavailable
                    </p>
                    <p style={{ fontSize: 13, color: '#b91c1c', margin: '3px 0 10px', fontWeight: 500 }}>{error}</p>
                    <button
                        onClick={locate}
                        className="flex items-center gap-1.5 rounded-xl px-4 py-2"
                        style={{ background: '#dc2626', color: 'white', border: 'none', fontSize: 13, fontWeight: 700 }}
                    >
                        <RefreshCw size={14} /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    // ── DONE — full weather card ───────────────────────────────────────────────
    if (!weather) return null;
    const { current, forecast, advisory, updatedAt } = weather;
    const advisoryStyle = ADVISORY_STYLES[advisory.level];
    const updatedTime = new Date(updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    return (
        <div
            className="rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.09)', animation: 'fadeInUp 0.5s ease' }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-3"
                style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)' }}
            >
                <div className="flex items-center gap-2">
                    <MapPin size={14} color="#86efac" />
                    <span style={{ fontSize: 13, color: '#a7f3d0', fontWeight: 700 }}>Live Weather</span>
                </div>
                <div className="flex items-center gap-2">
                    <span style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 500 }}>Updated {updatedTime}</span>
                    <button
                        onClick={locate}
                        style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 999, padding: '4px 6px', display: 'flex', alignItems: 'center' }}
                    >
                        <RefreshCw size={13} color="white" />
                    </button>
                </div>
            </div>

            {/* Main temp + stats */}
            <div
                className="px-4 pt-4 pb-3"
                style={{ background: 'white' }}
            >
                {/* Large temperature */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div style={{ fontSize: 56, fontWeight: 900, color: '#14532d', lineHeight: 1 }}>
                            {current.tempC}°<span style={{ fontSize: 28, fontWeight: 700 }}>C</span>
                        </div>
                        <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500, marginTop: 2 }}>Current Temperature</div>
                    </div>
                    <div style={{ fontSize: 64 }}>
                        {current.rainProbability > 60 ? '🌧️' : current.tempC > 35 ? '☀️' : current.humidity > 75 ? '🌫️' : '⛅'}
                    </div>
                </div>

                {/* Stat chips row */}
                <div className="flex gap-2">
                    <StatChip icon={CloudRain} iconColor="#2563eb" bg="#eff6ff" label="Rain Chance" value={`${current.rainProbability}%`} />
                    <StatChip icon={Droplets} iconColor="#0284c7" bg="#f0f9ff" label="Humidity" value={`${current.humidity}%`} />
                    <StatChip icon={Wind} iconColor="#6b7280" bg="#f9fafb" label="Wind" value={`${current.windKmh} km/h`} />
                </div>
            </div>

            {/* Advisory banner */}
            <div
                className="mx-4 mb-3 rounded-2xl px-4 py-3 flex items-center gap-3"
                style={{ background: advisoryStyle.bg, border: `1.5px solid ${advisoryStyle.border}` }}
            >
                <span style={{ fontSize: 20, flexShrink: 0 }}>{advisoryStyle.icon}</span>
                <span style={{ fontSize: 14, color: advisoryStyle.text, fontWeight: 700, lineHeight: 1.4 }}>
                    {advisory.text}
                </span>
            </div>

            {/* 3-day forecast */}
            {forecast.length > 0 && (
                <div className="px-4 pb-4">
                    <p style={{ fontSize: 12, color: '#9ca3af', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        3-Day Forecast
                    </p>
                    <div className="flex gap-2">
                        {forecast.slice(0, 3).map((day, i) => (
                            <ForecastPill key={i} day={day} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
