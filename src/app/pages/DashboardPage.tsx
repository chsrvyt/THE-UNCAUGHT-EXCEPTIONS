import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { TrendingUp, Sprout, ShoppingBasket, AlertTriangle, Bell, ChevronRight, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/RiskBadge';
import { WeatherWidget } from '../components/WeatherWidget';

const TIPS = [
  { icon: '💡', title: 'Tip of the Day', text: 'Cotton moisture should be 8–10% before storage. Check with a moisture meter.', bg: '#fffbeb', border: '#fde68a', titleColor: '#92400e', textColor: '#78350f' },
  { icon: '📦', title: 'Storage Reminder', text: 'Use clean, dry jute bags for short-term storage. Avoid plastic in humid weather.', bg: '#eff6ff', border: '#bfdbfe', titleColor: '#1e40af', textColor: '#1e3a8a' },
  { icon: '🌾', title: 'Harvest Smart', text: 'Harvest early morning when temperature is cool. Reduces spoilage by 20%.', bg: '#f0fdf4', border: '#86efac', titleColor: '#15803d', textColor: '#166534' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t, farmerName, crop, cropEmoji, stateVal, district } = useApp();
  const [tipIndex, setTipIndex] = useState(0);

  const tip = TIPS[tipIndex];

  return (
    <div style={{ background: '#f7f5f0', minHeight: '100%', paddingBottom: 16, fontFamily: 'Nunito, sans-serif' }}>

      {/* ── Top Header ─────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)', padding: '20px 16px 32px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circle */}
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div className="flex items-start justify-between" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <p style={{ color: '#86efac', fontSize: 13, margin: 0, fontWeight: 600 }}>{t.greeting}</p>
            <h1 style={{ color: 'white', margin: '3px 0 0', fontSize: 24, fontWeight: 900 }}>{farmerName} 🙏</h1>
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              <span style={{ fontSize: 13, color: '#a7f3d0', background: 'rgba(255,255,255,0.12)', padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>
                📍 {district}, {stateVal}
              </span>
              <span style={{ fontSize: 13, color: '#a7f3d0', background: 'rgba(255,255,255,0.12)', padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>
                {cropEmoji} {crop}
              </span>
            </div>
          </div>
          <button
            className="flex items-center justify-center rounded-full"
            style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.2)', flexShrink: 0 }}
          >
            <Bell size={20} color="white" />
          </button>
        </div>

        {/* Updated tag */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)', position: 'relative', zIndex: 1 }}>
          <div className="rounded-full" style={{ width: 6, height: 6, background: '#4ade80' }} />
          <span style={{ fontSize: 12, color: '#a7f3d0', fontWeight: 600 }}>{t.updated}</span>
        </div>
      </div>

      <div className="px-4" style={{ marginTop: -16 }}>

        {/* ── TODAY'S BEST ACTION CARD ──────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.10)', marginBottom: 14 }}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ background: '#f0fdf4', borderBottom: '1.5px solid #dcfce7' }}>
            <TrendingUp size={18} color="#15803d" />
            <span style={{ fontSize: 14, fontWeight: 800, color: '#15803d' }}>{t.todayAction}</span>
          </div>

          <div className="px-4 py-4">
            <div className="flex items-stretch gap-3 mb-4">
              {/* Harvest Countdown Ring */}
              <div className="flex flex-col items-center justify-center rounded-2xl" style={{ background: '#f0fdf4', padding: '16px 20px', minWidth: 100, border: '1.5px solid #dcfce7' }}>
                <div style={{ position: 'relative', width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="72" height="72" viewBox="0 0 72 72" style={{ position: 'absolute', top: 0, left: 0 }}>
                    <circle cx="36" cy="36" r="30" fill="none" stroke="#dcfce7" strokeWidth="6" />
                    <circle cx="36" cy="36" r="30" fill="none" stroke="#16a34a" strokeWidth="6"
                      strokeDasharray={`${(7 / 30) * 188} 188`}
                      strokeLinecap="round"
                      style={{
                        transform: 'rotate(-90deg)',
                        transformOrigin: '36px 36px',
                        transition: 'stroke-dashoffset 1s ease-out'
                      }}
                    />
                  </svg>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                    <span style={{ fontSize: 32, fontWeight: 900, color: '#14532d', lineHeight: 1 }}>7</span>
                  </div>
                </div>
                <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 800, marginTop: 4 }}>{t.days}</span>
                <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>to harvest</span>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                {/* Best Market */}
                <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  <ShoppingBasket size={16} color="#15803d" />
                  <div>
                    <p style={{ fontSize: 11, color: '#6b7280', margin: 0, fontWeight: 500 }}>{t.bestMarket}</p>
                    <p style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: 0 }}>Wardha APMC</p>
                  </div>
                </div>
                {/* Profit */}
                <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: '#f0fdf4', border: '1px solid #dcfce7' }}>
                  <TrendingUp size={16} color="#15803d" />
                  <div>
                    <p style={{ fontSize: 11, color: '#6b7280', margin: 0, fontWeight: 500 }}>{t.expectedProfit}</p>
                    <p style={{ fontSize: 15, fontWeight: 800, color: '#14532d', margin: 0 }}>₹18,500</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Level */}
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>{t.riskLevel}</span>
              <RiskBadge level="medium" label={t.medium} size="md" />
            </div>
          </div>
        </div>

        {/* ── WEATHER WIDGET ────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 14 }}>
          <WeatherWidget />
        </div>

        {/* ── 3 QUICK ACTION CARDS ─────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { path: '/app/harvest', bg: '#f0fdf4', iconBg: '#dcfce7', Icon: Sprout, iconColor: '#15803d', label: t.harvestDetails },
            { path: '/app/market', bg: '#fefce8', iconBg: '#fef3c7', Icon: ShoppingBasket, iconColor: '#d97706', label: t.marketCompare },
            { path: '/app/spoilage', bg: '#fff7ed', iconBg: '#fef3c7', Icon: AlertTriangle, iconColor: '#d97706', label: t.spoilageRisk },
          ].map(({ path, bg, iconBg, Icon, iconColor, label }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center rounded-2xl p-4 transition-all active:opacity-75"
              style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none', gap: 8 }}
            >
              <div className="rounded-2xl flex items-center justify-center" style={{ width: 50, height: 50, background: iconBg }}>
                <Icon size={24} color={iconColor} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#374151', textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
              <ChevronRight size={14} color="#9ca3af" />
            </button>
          ))}
        </div>

        {/* ── MARKET PREVIEW BANNER ────────────────────────────────────────── */}
        <button
          onClick={() => navigate('/app/market')}
          className="w-full rounded-2xl overflow-hidden transition-all active:opacity-80"
          style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none', marginBottom: 14 }}
        >
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#374151' }}>🏪 {t.marketCompare}</span>
            <span style={{ fontSize: 13, color: '#15803d', fontWeight: 700 }}>{t.viewDetails} →</span>
          </div>
          <div className="flex">
            {[
              { name: 'Nagpur', price: '₹6,450', net: '₹6,200', best: true },
              { name: 'Wardha', price: '₹6,200', net: '₹5,820', best: false },
              { name: 'Akola', price: '₹6,580', net: '₹5,730', best: false },
            ].map((m) => (
              <div
                key={m.name}
                className="flex-1 flex flex-col items-center py-3 px-2"
                style={{ borderRight: '1px solid #f3f4f6', background: m.best ? '#f0fdf4' : 'white' }}
              >
                <span style={{ fontSize: 12, color: m.best ? '#15803d' : '#6b7280', fontWeight: m.best ? 800 : 500 }}>{m.name}</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: m.best ? '#14532d' : '#374151' }}>{m.price}</span>
                <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 500 }}>Net {m.net}</span>
                {m.best && (
                  <span className="mt-1 px-2 py-0.5 rounded-full" style={{ fontSize: 10, background: '#14532d', color: 'white', fontWeight: 800 }}>
                    ★ {t.bestChoice}
                  </span>
                )}
              </div>
            ))}
          </div>
        </button>

        {/* ── TIP CAROUSEL ─────────────────────────────────────────────────── */}
        <div className="rounded-2xl px-4 py-4" style={{ background: tip.bg, border: `1.5px solid ${tip.border}` }}>
          <div className="flex items-start gap-3">
            <span style={{ fontSize: 24, flexShrink: 0 }}>{tip.icon}</span>
            <div className="flex-1">
              <p style={{ fontSize: 13, fontWeight: 800, color: tip.titleColor, margin: 0 }}>{tip.title}</p>
              <p style={{ fontSize: 13, color: tip.textColor, margin: '3px 0 10px', fontWeight: 500, lineHeight: 1.5 }}>{tip.text}</p>
              {/* Dot indicators */}
              <div className="flex items-center gap-2">
                {TIPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTipIndex(i)}
                    style={{
                      width: i === tipIndex ? 20 : 8,
                      height: 8,
                      borderRadius: 999,
                      background: i === tipIndex ? tip.titleColor : '#d1d5db',
                      border: 'none',
                      padding: 0,
                      transition: 'all 0.3s',
                    }}
                  />
                ))}
                <button
                  onClick={() => setTipIndex((tipIndex + 1) % TIPS.length)}
                  style={{ marginLeft: 'auto', fontSize: 12, color: tip.titleColor, background: 'none', border: 'none', fontWeight: 700 }}
                >
                  Next tip →
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
