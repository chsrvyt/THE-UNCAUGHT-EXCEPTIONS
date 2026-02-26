import React, { useState, useEffect, useRef } from 'react';
import { Thermometer, Droplets, Package, Bug, CheckCircle2, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CircularRisk, RiskBadge } from '../components/RiskBadge';
import { PageHeader } from '../components/PageHeader';

const TIPS = [
  { icon: Thermometer, key: 'tip1', color: '#fef3c7', iconColor: '#d97706', checked: false },
  { icon: Droplets, key: 'tip2', color: '#e0f2fe', iconColor: '#0284c7', checked: false },
  { icon: Package, key: 'tip3', color: '#f0fdf4', iconColor: '#15803d', checked: false },
  { icon: Bug, key: 'tip4', color: '#fef2f2', iconColor: '#dc2626', checked: false },
];

export default function SpoilagePage() {
  const { t, hasStorage } = useApp();
  const riskLevelFixed = 'medium' as 'low' | 'medium' | 'high';
  const riskLevel = riskLevelFixed;
  const riskLabel = t.medium;
  const maxDays = hasStorage ? 14 : 8;

  const [checked, setChecked] = useState<boolean[]>(TIPS.map(() => false));
  const [shared, setShared] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = `${(maxDays / 21) * 100}%`;
    }, 400);
    return () => clearTimeout(id);
  }, [maxDays]);

  const handleShare = () => {
    const msg = `Krishak Saarthi Spoilage Report\nRisk Level: ${riskLabel}\nSafe storage: ${maxDays} days\nStorage: ${hasStorage ? 'Available' : 'Not Available'}`;
    navigator.clipboard?.writeText(msg).catch(() => { });
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  };

  const gradBar =
    riskLevel === 'low' ? 'linear-gradient(90deg, #4ade80, #16a34a)' :
      riskLevel === 'medium' ? 'linear-gradient(90deg, #fbbf24, #d97706)' :
        'linear-gradient(90deg, #f87171, #dc2626)';

  return (
    <div style={{ background: '#f7f5f0', minHeight: '100%', paddingBottom: 16, fontFamily: 'Nunito, sans-serif' }}>
      <PageHeader title={t.spoilagePageTitle} />

      <div className="px-4 py-4 flex flex-col gap-4">

        {/* ── Risk Gauge Card ───────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-5 flex flex-col items-center"
          style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
        >
          <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 16px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t.currentRisk}
          </p>

          <CircularRisk level={riskLevel} label={riskLabel} />

          <div className="mt-4 flex items-center gap-2">
            <RiskBadge level={riskLevel} label={riskLabel} size="lg" />
          </div>

          {/* Risk scale */}
          <div className="flex items-center gap-6 mt-4">
            {([
              { level: 'low' as const, label: t.low, color: '#16a34a' },
              { level: 'medium' as const, label: t.medium, color: '#d97706' },
              { level: 'high' as const, label: t.high, color: '#dc2626' },
            ]).map((r) => (
              <div key={r.level} className="flex flex-col items-center gap-1.5">
                <div
                  className="rounded-full"
                  style={{
                    width: 14, height: 14,
                    background: r.color,
                    opacity: r.level === riskLevel ? 1 : 0.25,
                    boxShadow: r.level === riskLevel ? `0 0 0 4px ${r.color}33` : 'none',
                    transition: 'all 0.3s',
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: r.level === riskLevel ? 800 : 500, color: r.level === riskLevel ? r.color : '#9ca3af' }}>
                  {r.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Storage Days Card ─────────────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <div
            className="px-4 py-4"
            style={{ background: riskLevel === 'low' ? '#f0fdf4' : riskLevel === 'medium' ? '#fffbeb' : '#fef2f2' }}
          >
            <p style={{ fontSize: 12, color: '#6b7280', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t.maxStorage}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                style={{
                  fontSize: 56, fontWeight: 900, lineHeight: 1,
                  color: riskLevel === 'low' ? '#14532d' : riskLevel === 'medium' ? '#b45309' : '#b91c1c',
                  animation: 'count-up 0.6s ease',
                }}
              >
                {maxDays}
              </span>
              <span style={{ fontSize: 22, fontWeight: 700, color: riskLevel === 'medium' ? '#d97706' : '#dc2626' }}>
                {t.daysUnit}
              </span>
            </div>
          </div>

          {/* Storage Status */}
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ fontSize: 14, color: '#374151', fontWeight: 600 }}>Storage Type</span>
            <span
              className="px-3 py-1 rounded-full"
              style={{ background: hasStorage ? '#f0fdf4' : '#fef2f2', color: hasStorage ? '#15803d' : '#b91c1c', fontSize: 13, fontWeight: 800 }}
            >
              {hasStorage ? `✅ ${t.available}` : `⚠️ ${t.notAvailable}`}
            </span>
          </div>

          {/* Days bar — animated */}
          <div className="px-4 pb-4 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>Today → Day {maxDays}</span>
              <span style={{ fontSize: 11, color: riskLevel === 'medium' ? '#d97706' : '#dc2626', fontWeight: 700 }}>
                ⚠️ Risk rises after day {maxDays}
              </span>
            </div>
            <div className="rounded-full overflow-hidden" style={{ height: 12, background: '#e5e7eb' }}>
              <div
                ref={barRef}
                className="h-full rounded-full"
                style={{
                  width: '0%',
                  background: gradBar,
                  transition: 'width 1.2s cubic-bezier(0.34,1.2,0.64,1)',
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Current Conditions ────────────────────────────────────────────── */}
        <div className="rounded-2xl p-4" style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: '#374151', margin: '0 0 12px' }}>🌡️ Current Conditions</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Temperature', value: '28°C', icon: '🌡️', status: 'ok', dotColor: '#16a34a' },
              { label: 'Humidity', value: '62%', icon: '💧', status: 'warn', dotColor: '#d97706' },
              { label: 'Moisture', value: '11%', icon: '🌾', status: 'ok', dotColor: '#16a34a' },
            ].map((c, i) => (
              <div
                key={i}
                className="flex flex-col items-center rounded-2xl p-3"
                style={{ background: c.status === 'warn' ? '#fffbeb' : '#f9fafb', border: `1.5px solid ${c.status === 'warn' ? '#fde68a' : '#e5e7eb'}` }}
              >
                <div className="relative">
                  <span style={{ fontSize: 22 }}>{c.icon}</span>
                  <div
                    className="absolute rounded-full"
                    style={{ width: 8, height: 8, background: c.dotColor, top: -2, right: -4, border: '2px solid white' }}
                  />
                </div>
                <span style={{ fontSize: 18, fontWeight: 900, color: c.status === 'warn' ? '#b45309' : '#374151', marginTop: 6 }}>{c.value}</span>
                <span style={{ fontSize: 10, color: '#6b7280', textAlign: 'center', marginTop: 2, fontWeight: 600 }}>{c.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-2xl" style={{ background: '#fffbeb', border: '1.5px solid #fde68a' }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span style={{ fontSize: 13, color: '#92400e', fontWeight: 600 }}>Humidity above 60% increases spoilage risk. Use desiccant bags.</span>
          </div>
        </div>

        {/* ── Preservation Tips — tap to check ─────────────────────────────── */}
        <div className="rounded-2xl p-4" style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize: 15, fontWeight: 800, color: '#374151', margin: 0 }}>🛡️ {t.tipsTitle}</p>
            <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>{checked.filter(Boolean).length}/{TIPS.length} done</span>
          </div>
          <div className="flex flex-col gap-3">
            {TIPS.map((tip, i) => {
              const Icon = tip.icon;
              const done = checked[i];
              return (
                <button
                  key={i}
                  onClick={() => setChecked(prev => { const n = [...prev]; n[i] = !n[i]; return n; })}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all active:scale-98"
                  style={{
                    background: done ? '#f0fdf4' : tip.color,
                    border: `1.5px solid ${done ? '#86efac' : 'transparent'}`,

                    width: '100%',
                    opacity: done ? 0.75 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, background: 'white' }}>
                    <Icon size={20} color={done ? '#15803d' : tip.iconColor} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#374151', flex: 1, lineHeight: 1.4, textDecoration: done ? 'line-through' : 'none' }}>
                    {t[tip.key as keyof typeof t] as string}
                  </span>
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{ width: 24, height: 24, background: done ? '#14532d' : '#e5e7eb', transition: 'all 0.2s' }}
                  >
                    {done && <CheckCircle2 size={14} color="white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Share report button */}
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 rounded-2xl py-3"
          style={{ background: shared ? '#f0fdf4' : 'white', border: `1.5px solid ${shared ? '#86efac' : '#e5e7eb'}`, color: shared ? '#15803d' : '#374151', fontWeight: 700, fontSize: 14, transition: 'all 0.3s' }}
        >
          <Share2 size={16} color={shared ? '#15803d' : '#374151'} />
          {shared ? '✅ Report copied to clipboard!' : '📋 Share Risk Report'}
        </button>

      </div>
    </div>
  );
}
