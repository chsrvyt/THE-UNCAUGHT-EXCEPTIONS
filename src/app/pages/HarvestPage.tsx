import React, { useEffect, useRef, useState } from 'react';
import { Sun, Cloud, CloudRain, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import { WeatherWidget } from '../components/WeatherWidget';

const WEATHER_DAYS = [
  { day: 'Mon', icon: Sun, color: '#f59e0b', label: 'Sunny', temp: 30 },
  { day: 'Tue', icon: Sun, color: '#f59e0b', label: 'Sunny', temp: 31 },
  { day: 'Wed', icon: Cloud, color: '#9ca3af', label: 'Cloudy', temp: 28 },
  { day: 'Thu', icon: Sun, color: '#f59e0b', label: 'Sunny', temp: 32 },
  { day: 'Fri', icon: Sun, color: '#f59e0b', label: 'Sunny', temp: 33 },
  { day: 'Sat', icon: CloudRain, color: '#3b82f6', label: 'Rain', temp: 25 },
  { day: 'Sun', icon: CloudRain, color: '#3b82f6', label: 'Rain', temp: 24 },
];

const REASONS = [
  { num: '1', icon: '🌧️', key: 'reason1', color: '#eff6ff', textColor: '#1d4ed8', border: '#bfdbfe' },
  { num: '2', icon: '📈', key: 'reason2', color: '#d1fae5', textColor: '#065f46', border: '#6ee7b7' },
  { num: '3', icon: '📦', key: 'reason3', color: '#fef3c7', textColor: '#92400e', border: '#fde68a' },
  { num: '4', icon: '💧', key: 'reason4', color: '#cffafe', textColor: '#0e7490', border: '#a5f3fc' },
];

const ACTIONS = [
  { text: 'Start harvesting on 5 March', done: true },
  { text: 'Sell at Wardha APMC for best price', done: false },
  { text: 'Complete harvest before 10 March', done: false },
];

const confidence = 78;

export default function HarvestPage() {
  const { t } = useApp();
  const [showWhy, setShowWhy] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  // Animate the confidence bar on mount
  useEffect(() => {
    if (!barRef.current) return;
    barRef.current.style.width = '0%';
    const raf = requestAnimationFrame(() => {
      setTimeout(() => {
        if (barRef.current) barRef.current.style.width = `${confidence}%`;
      }, 300);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ background: '#f7f5f0', minHeight: '100%', paddingBottom: 16, fontFamily: 'Nunito, sans-serif' }}>
      <PageHeader title={t.harvestPageTitle} />

      <div className="px-4 py-4 flex flex-col gap-4">

        {/* ── Harvest Window Card ───────────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.10)' }}>
          <div className="px-4 py-4" style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)' }}>
            <p style={{ fontSize: 12, color: '#86efac', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.harvestWindow}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span style={{ fontSize: 30, fontWeight: 900, color: 'white' }}>Mar 5</span>
              <span style={{ fontSize: 20, color: '#86efac', fontWeight: 700 }}>→</span>
              <span style={{ fontSize: 30, fontWeight: 900, color: 'white' }}>Mar 10</span>
            </div>
            <p style={{ fontSize: 13, color: '#86efac', margin: '6px 0 0', fontWeight: 600 }}>
              🗓 {t.harvestBy} 10 March, 2026
            </p>
          </div>

          {/* Calendar strip (Mar 5–10 highlighted) */}
          <div className="flex items-center gap-1 px-4 py-3" style={{ background: '#f8fffe', borderBottom: '1px solid #dcfce7', overflowX: 'auto' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((d) => {
              const isWindow = d >= 5 && d <= 10;
              const isToday = d === 1;
              return (
                <div
                  key={d}
                  className="flex flex-col items-center rounded-xl py-1.5 flex-shrink-0"
                  style={{
                    minWidth: 30,
                    background: isWindow ? '#14532d' : isToday ? '#f0fdf4' : 'transparent',
                    border: isToday ? '1.5px solid #86efac' : 'none',
                  }}
                >
                  <span style={{ fontSize: 10, color: isWindow ? '#86efac' : '#9ca3af', fontWeight: 600 }}>Mar</span>
                  <span style={{ fontSize: 14, fontWeight: isWindow ? 900 : 500, color: isWindow ? 'white' : isToday ? '#15803d' : '#374151' }}>{d}</span>
                </div>
              );
            })}
          </div>

          {/* Countdown Strip */}
          <div className="flex items-center justify-around px-4 py-3" style={{ background: '#f0fdf4', borderBottom: '1px solid #dcfce7' }}>
            {[
              { label: 'Today', value: 'Feb 26' },
              { label: t.harvestIn, value: '7 Days' },
              { label: 'Window', value: '6 Days' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <span style={{ fontSize: 18, fontWeight: 900, color: '#14532d' }}>{item.value}</span>
                <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Confidence */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: 14, color: '#374151', fontWeight: 700 }}>{t.confidence}</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#15803d' }}>{confidence}%</span>
            </div>
            <div className="rounded-full overflow-hidden" style={{ height: 12, background: '#e5e7eb' }}>
              <div
                ref={barRef}
                className="rounded-full h-full"
                style={{
                  width: `${confidence}%`,
                  background: 'linear-gradient(90deg, #16a34a, #4ade80)',
                  transition: 'width 1.2s cubic-bezier(0.34,1.2,0.64,1)',
                }}
              />
            </div>
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 6, fontWeight: 500 }}>
              Based on weather forecast, price trends & market data
            </p>
          </div>
        </div>

        {/* ── Live Weather Widget ───────────────────────────────────────────── */}
        <WeatherWidget />

        {/* ── Why This Recommendation — Expandable ─────────────────────────── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <button
            onClick={() => setShowWhy(!showWhy)}
            className="w-full flex items-center justify-between px-4 py-4"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span style={{ fontSize: 15, fontWeight: 800, color: '#374151' }}>💡 {t.whyTitle}</span>
            {showWhy ? <ChevronUp size={20} color="#6b7280" /> : <ChevronDown size={20} color="#6b7280" />}
          </button>

          {showWhy && (
            <div className="px-4 pb-4 flex flex-col gap-3" style={{ animation: 'fadeInUp 0.3s ease' }}>
              {REASONS.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3"
                  style={{ background: r.color, border: `1.5px solid ${r.border}` }}
                >
                  <span
                    className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{ width: 28, height: 28, background: 'white', fontSize: 12, fontWeight: 900, color: r.textColor }}
                  >
                    {r.num}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: r.textColor }}>{t[r.key as keyof typeof t] as string}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Action Summary ────────────────────────────────────────────────── */}
        <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)' }}>
          <p style={{ fontSize: 12, color: '#86efac', margin: '0 0 12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            📋 Recommended Action
          </p>
          <div className="flex flex-col gap-3">
            {ACTIONS.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{ width: 28, height: 28, background: item.done ? '#4ade80' : 'rgba(255,255,255,0.15)', border: item.done ? 'none' : '1.5px solid rgba(255,255,255,0.3)' }}
                >
                  {item.done
                    ? <CheckCircle2 size={16} color="#14532d" />
                    : <span style={{ fontSize: 12, fontWeight: 800, color: '#a7f3d0' }}>{i + 1}</span>
                  }
                </div>
                <span style={{ fontSize: 14, color: 'white', fontWeight: item.done ? 600 : 700, opacity: item.done ? 0.8 : 1 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
