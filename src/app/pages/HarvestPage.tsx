import React, { useState } from 'react';
import { Sun, Cloud, CloudRain, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';

const WEATHER_DAYS = [
  { day: 'Mon', icon: Sun, color: '#f59e0b', label: 'Sunny' },
  { day: 'Tue', icon: Sun, color: '#f59e0b', label: 'Sunny' },
  { day: 'Wed', icon: Cloud, color: '#9ca3af', label: 'Cloudy' },
  { day: 'Thu', icon: Sun, color: '#f59e0b', label: 'Sunny' },
  { day: 'Fri', icon: Sun, color: '#f59e0b', label: 'Sunny' },
  { day: 'Sat', icon: CloudRain, color: '#3b82f6', label: 'Rain' },
  { day: 'Sun', icon: CloudRain, color: '#3b82f6', label: 'Rain' },
];

const REASONS = [
  { icon: '🌧️', key: 'reason1', color: '#bfdbfe', textColor: '#1d4ed8' },
  { icon: '📈', key: 'reason2', color: '#d1fae5', textColor: '#065f46' },
  { icon: '📦', key: 'reason3', color: '#fef3c7', textColor: '#92400e' },
  { icon: '💧', key: 'reason4', color: '#cffafe', textColor: '#0e7490' },
];

export default function HarvestPage() {
  const { t } = useApp();
  const [showWhy, setShowWhy] = useState(false);

  const confidence = 78;

  return (
    <div style={{ background: '#f7f5f0', minHeight: '100%', paddingBottom: 16 }}>
      <PageHeader title={t.harvestPageTitle} />

      <div className="px-4 py-4 flex flex-col gap-4">

        {/* Harvest Window Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
        >
          <div
            className="px-4 py-3"
            style={{ background: '#14532d', color: 'white' }}
          >
            <p style={{ fontSize: 13, color: '#a7f3d0', margin: 0 }}>{t.harvestWindow}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span style={{ fontSize: 26, fontWeight: 800 }}>Mar 5</span>
              <span style={{ fontSize: 18, color: '#86efac' }}>—</span>
              <span style={{ fontSize: 26, fontWeight: 800 }}>Mar 10</span>
            </div>
            <p style={{ fontSize: 13, color: '#86efac', margin: '4px 0 0' }}>
              {t.harvestBy} 10 March, 2026
            </p>
          </div>

          {/* Countdown Strip */}
          <div
            className="flex items-center justify-around px-4 py-3"
            style={{ background: '#f0fdf4', borderBottom: '1px solid #dcfce7' }}
          >
            {[
              { label: 'Today', value: 'Feb 26' },
              { label: t.harvestIn, value: '7 Days' },
              { label: 'Window', value: '6 Days' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <span style={{ fontSize: 17, fontWeight: 800, color: '#14532d' }}>{item.value}</span>
                <span style={{ fontSize: 12, color: '#6b7280' }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Confidence */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: 14, color: '#374151', fontWeight: 600 }}>{t.confidence}</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#15803d' }}>{confidence}%</span>
            </div>
            <div
              className="rounded-full overflow-hidden"
              style={{ height: 12, background: '#e5e7eb' }}
            >
              <div
                className="rounded-full h-full transition-all"
                style={{
                  width: `${confidence}%`,
                  background: 'linear-gradient(90deg, #16a34a, #4ade80)',
                }}
              />
            </div>
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>
              Based on weather forecast, price trends & market data
            </p>
          </div>
        </div>

        {/* Weather Card */}
        <div
          className="rounded-2xl p-4"
          style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
        >
          <p style={{ fontSize: 14, fontWeight: 700, color: '#374151', margin: '0 0 12px' }}>
            ☁️ {t.weatherAhead}
          </p>
          <div className="flex gap-2 justify-between">
            {WEATHER_DAYS.map((d, i) => {
              const Icon = d.icon;
              const isRain = d.label === 'Rain';
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1 rounded-xl py-2 px-1"
                  style={{
                    flex: 1,
                    background: isRain ? '#eff6ff' : '#fafafa',
                    border: `1px solid ${isRain ? '#bfdbfe' : '#f3f4f6'}`,
                  }}
                >
                  <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>{d.day}</span>
                  <Icon size={20} color={d.color} />
                  <span style={{ fontSize: 9, color: d.color, fontWeight: 600 }}>{d.label}</span>
                </div>
              );
            })}
          </div>
          <div
            className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
          >
            <CloudRain size={16} color="#3b82f6" />
            <span style={{ fontSize: 13, color: '#1d4ed8' }}>
              🌧️ Rain expected Sat–Sun. Harvest before Saturday!
            </span>
          </div>
        </div>

        {/* Why Recommendation — Expandable */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
        >
          <button
            onClick={() => setShowWhy(!showWhy)}
            className="w-full flex items-center justify-between px-4 py-4"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span style={{ fontSize: 15, fontWeight: 700, color: '#374151' }}>
              💡 {t.whyTitle}
            </span>
            {showWhy ? (
              <ChevronUp size={20} color="#6b7280" />
            ) : (
              <ChevronDown size={20} color="#6b7280" />
            )}
          </button>

          {showWhy && (
            <div className="px-4 pb-4 flex flex-col gap-3">
              {REASONS.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl px-3 py-3"
                  style={{ background: r.color }}
                >
                  <span style={{ fontSize: 22 }}>{r.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: r.textColor }}>
                    {t[r.key as keyof typeof t] as string}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Summary */}
        <div
          className="rounded-2xl p-4"
          style={{ background: '#14532d' }}
        >
          <p style={{ fontSize: 13, color: '#86efac', margin: '0 0 8px' }}>📋 Recommended Action</p>
          <div className="flex flex-col gap-2">
            {[
              'Start harvesting on 5 March',
              'Sell at Wardha APMC for best price',
              'Complete harvest before 10 March',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 size={16} color="#4ade80" />
                <span style={{ fontSize: 14, color: 'white' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
