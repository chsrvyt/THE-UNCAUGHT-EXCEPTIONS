import React from 'react';
import { Thermometer, Droplets, Package, Bug, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CircularRisk, RiskBadge } from '../components/RiskBadge';
import { PageHeader } from '../components/PageHeader';

const TIPS = [
  { icon: Thermometer, key: 'tip1', color: '#fef3c7', iconColor: '#d97706' },
  { icon: Droplets, key: 'tip2', color: '#e0f2fe', iconColor: '#0284c7' },
  { icon: Package, key: 'tip3', color: '#f0fdf4', iconColor: '#15803d' },
  { icon: Bug, key: 'tip4', color: '#fef2f2', iconColor: '#dc2626' },
];

export default function SpoilagePage() {
  const { t, hasStorage } = useApp();
  const riskLevel: 'low' | 'medium' | 'high' = 'medium';
  const riskLabel = t.medium;
  const maxDays = hasStorage ? 14 : 8;

  return (
    <div style={{ background: '#f7f5f0', minHeight: '100%', paddingBottom: 16 }}>
      <PageHeader title={t.spoilagePageTitle} />

      <div className="px-4 py-4 flex flex-col gap-4">

        {/* Risk Gauge Card */}
        <div
          className="rounded-2xl p-5 flex flex-col items-center"
          style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
        >
          <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 16px', fontWeight: 600 }}>
            {t.currentRisk}
          </p>

          <CircularRisk level={riskLevel} label={riskLabel} />

          <div className="mt-4 flex items-center gap-2">
            <RiskBadge level={riskLevel} label={riskLabel} size="lg" />
          </div>

          {/* Risk scale */}
          <div className="flex items-center gap-3 mt-4 w-full justify-center">
            {[
              { level: 'low' as const, label: t.low, active: riskLevel === 'low' },
              { level: 'medium' as const, label: t.medium, active: riskLevel === 'medium' },
              { level: 'high' as const, label: t.high, active: riskLevel === 'high' },
            ].map((r) => (
              <div
                key={r.level}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className="rounded-full"
                  style={{
                    width: 12,
                    height: 12,
                    background: r.level === 'low' ? '#16a34a' : r.level === 'medium' ? '#d97706' : '#dc2626',
                    opacity: r.active ? 1 : 0.3,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: r.active ? 700 : 400,
                    color: r.active
                      ? r.level === 'low' ? '#15803d' : r.level === 'medium' ? '#b45309' : '#b91c1c'
                      : '#9ca3af',
                  }}
                >
                  {r.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Storage Days Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
        >
          <div
            className="px-4 py-3"
            style={{ background: riskLevel === 'low' ? '#f0fdf4' : riskLevel === 'medium' ? '#fffbeb' : '#fef2f2' }}
          >
            <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{t.maxStorage}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                style={{
                  fontSize: 48,
                  fontWeight: 800,
                  color: riskLevel === 'low' ? '#14532d' : riskLevel === 'medium' ? '#b45309' : '#b91c1c',
                  lineHeight: 1,
                }}
              >
                {maxDays}
              </span>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: riskLevel === 'low' ? '#15803d' : riskLevel === 'medium' ? '#d97706' : '#dc2626',
                }}
              >
                {t.daysUnit}
              </span>
            </div>
          </div>

          {/* Storage Status */}
          <div className="px-4 py-3 flex items-center justify-between">
            <span style={{ fontSize: 14, color: '#374151' }}>Storage Type</span>
            <span
              className="px-3 py-1 rounded-full"
              style={{
                background: hasStorage ? '#f0fdf4' : '#fef2f2',
                color: hasStorage ? '#15803d' : '#b91c1c',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {hasStorage ? `✅ ${t.available}` : `⚠️ ${t.notAvailable}`}
            </span>
          </div>

          {/* Days bar */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-1">
              <span style={{ fontSize: 12, color: '#6b7280' }}>Today</span>
              <span style={{ fontSize: 12, color: riskLevel === 'medium' ? '#d97706' : '#dc2626' }}>
                ⚠️ Risk increases after day {maxDays}
              </span>
            </div>
            <div className="rounded-full overflow-hidden" style={{ height: 10, background: '#e5e7eb' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(maxDays / 21) * 100}%`,
                  background: riskLevel === 'low'
                    ? 'linear-gradient(90deg, #4ade80, #16a34a)'
                    : riskLevel === 'medium'
                    ? 'linear-gradient(90deg, #fbbf24, #d97706)'
                    : 'linear-gradient(90deg, #f87171, #dc2626)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Conditions */}
        <div
          className="rounded-2xl p-4"
          style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
        >
          <p style={{ fontSize: 14, fontWeight: 700, color: '#374151', margin: '0 0 12px' }}>
            🌡️ Current Conditions
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Temperature', value: '28°C', icon: '🌡️', status: 'ok' },
              { label: 'Humidity', value: '62%', icon: '💧', status: 'warn' },
              { label: 'Moisture', value: '11%', icon: '🌾', status: 'ok' },
            ].map((c, i) => (
              <div
                key={i}
                className="flex flex-col items-center rounded-xl p-3"
                style={{
                  background: c.status === 'warn' ? '#fffbeb' : '#f9fafb',
                  border: `1px solid ${c.status === 'warn' ? '#fde68a' : '#e5e7eb'}`,
                }}
              >
                <span style={{ fontSize: 20 }}>{c.icon}</span>
                <span style={{ fontSize: 17, fontWeight: 800, color: c.status === 'warn' ? '#b45309' : '#374151', marginTop: 4 }}>
                  {c.value}
                </span>
                <span style={{ fontSize: 11, color: '#6b7280', textAlign: 'center', marginTop: 2 }}>{c.label}</span>
              </div>
            ))}
          </div>
          <div
            className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: '#fffbeb', border: '1px solid #fde68a' }}
          >
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span style={{ fontSize: 13, color: '#92400e' }}>
              Humidity above 60% increases spoilage risk. Use desiccant bags.
            </span>
          </div>
        </div>

        {/* Preservation Tips */}
        <div
          className="rounded-2xl p-4"
          style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
        >
          <p style={{ fontSize: 15, fontWeight: 700, color: '#374151', margin: '0 0 12px' }}>
            🛡️ {t.tipsTitle}
          </p>
          <div className="flex flex-col gap-3">
            {TIPS.map((tip, i) => {
              const Icon = tip.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl px-3 py-3"
                  style={{ background: tip.color }}
                >
                  <div
                    className="rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ width: 40, height: 40, background: 'white' }}
                  >
                    <Icon size={20} color={tip.iconColor} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
                    {t[tip.key as keyof typeof t] as string}
                  </span>
                  <CheckCircle2 size={16} color="#9ca3af" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
