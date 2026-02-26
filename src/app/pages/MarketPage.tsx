import React, { useState } from 'react';
import { MapPin, TrendingUp, TrendingDown, Truck, Star, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';

const ALL_MANDIS = [
  { name: 'Wardha APMC', distance: 42, price: 6450, transport: 380, net: 6070, isBest: true, trend: '+8%', trendUp: true, sparkline: [60, 65, 62, 70, 75, 72, 78] },
  { name: 'Nagpur APMC', distance: 28, price: 6200, transport: 250, net: 5950, isBest: false, trend: '+5%', trendUp: true, sparkline: [55, 58, 56, 60, 62, 64, 65] },
  { name: 'Amravati APMC', distance: 85, price: 6380, transport: 720, net: 5660, isBest: false, trend: '+3%', trendUp: true, sparkline: [58, 60, 59, 62, 63, 64, 65] },
  { name: 'Yavatmal APMC', distance: 64, price: 5800, transport: 580, net: 5220, isBest: false, trend: '-2%', trendUp: false, sparkline: [70, 68, 65, 63, 60, 58, 56] },
];

type SortKey = 'net' | 'price' | 'distance';

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 56, H = 22;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * H;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={W} height={H} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MarketPage() {
  const { t, crop, cropEmoji } = useApp();
  const [sort, setSort] = useState<SortKey>('net');

  const sorted = [...ALL_MANDIS].sort((a, b) =>
    sort === 'price' ? b.price - a.price :
      sort === 'distance' ? a.distance - b.distance :
        b.net - a.net
  );
  const best = ALL_MANDIS[0];
  const driveTime = (km: number) => km < 45 ? `~${Math.ceil(km / 35)} hr` : `~${(km / 45).toFixed(1)} hr`;

  return (
    <div style={{ background: '#f7f5f0', minHeight: '100%', paddingBottom: 16, fontFamily: 'Nunito, sans-serif' }}>
      <PageHeader title={t.marketPageTitle} />

      <div className="px-4 py-4 flex flex-col gap-4">

        {/* Crop Tag */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full" style={{ background: '#f0fdf4', border: '1.5px solid #86efac', fontSize: 14, color: '#15803d', fontWeight: 800 }}>
            {cropEmoji} {crop}
          </span>
          <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>· Price per quintal (100 kg)</span>
        </div>

        {/* ── BEST MANDI HERO CARD ─────────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)', boxShadow: '0 8px 28px rgba(20,83,45,0.35)' }}>
          <div className="px-4 pt-4 pb-2 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star size={16} color="#fcd34d" fill="#fcd34d" />
                <span style={{ fontSize: 12, color: '#86efac', fontWeight: 800, letterSpacing: '0.05em' }}>{t.bestChoice.toUpperCase()}</span>
              </div>
              <h2 style={{ color: 'white', margin: 0, fontSize: 22, fontWeight: 900 }}>{best.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <MapPin size={13} color="#a7f3d0" />
                <span style={{ fontSize: 13, color: '#a7f3d0', fontWeight: 600 }}>{best.distance} {t.kmAway} · {driveTime(best.distance)}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span style={{ fontSize: 11, color: '#86efac', fontWeight: 600 }}>{t.priceCol}</span>
              <span style={{ fontSize: 32, fontWeight: 900, color: 'white', lineHeight: 1.1 }}>₹{best.price.toLocaleString('en-IN')}</span>
              <span className="px-2 py-0.5 rounded-full mt-1" style={{ background: '#4ade80', color: '#14532d', fontSize: 12, fontWeight: 800 }}>
                {best.trend} this week
              </span>
            </div>
          </div>

          <div className="flex mx-4 mb-4 rounded-xl overflow-hidden" style={{ border: '1.5px solid rgba(255,255,255,0.2)' }}>
            <div className="flex-1 flex flex-col items-center py-3" style={{ borderRight: '1px solid rgba(255,255,255,0.2)' }}>
              <Truck size={16} color="#a7f3d0" />
              <span style={{ fontSize: 11, color: '#a7f3d0', marginTop: 4, fontWeight: 600 }}>{t.transportCol}</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>₹{best.transport}</span>
            </div>
            <div className="flex-1 flex flex-col items-center py-3">
              <TrendingUp size={16} color="#4ade80" />
              <span style={{ fontSize: 11, color: '#a7f3d0', marginTop: 4, fontWeight: 600 }}>{t.netCol}</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#4ade80' }}>₹{best.net.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* ── Sort Filter Pills ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <Filter size={14} color="#6b7280" />
          <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 700, marginRight: 4 }}>Sort:</span>
          {([['net', 'Net Price'], ['price', 'Gross Price'], ['distance', 'Nearest']] as [SortKey, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className="rounded-full px-3 py-1 transition-all"
              style={{
                background: sort === key ? '#14532d' : 'white',
                color: sort === key ? 'white' : '#374151',
                border: `1.5px solid ${sort === key ? '#14532d' : '#e5e7eb'}`,
                fontSize: 12,
                fontWeight: 700,
                transform: sort === key ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Column Headers */}
        <div className="flex items-center px-1 gap-2">
          <span style={{ flex: 2, fontSize: 11, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t.mandiCol}</span>
          <span style={{ flex: 1, fontSize: 11, color: '#9ca3af', fontWeight: 700, textAlign: 'right', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t.priceCol}</span>
          <span style={{ flex: 1, fontSize: 11, color: '#9ca3af', fontWeight: 700, textAlign: 'right', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t.netCol}</span>
          <span style={{ width: 64, fontSize: 11, color: '#9ca3af', fontWeight: 700, textAlign: 'right', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Trend</span>
        </div>

        {/* ── Mandi List ───────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          {sorted.map((mandi, i) => (
            <div
              key={mandi.name}
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'white',
                border: mandi.isBest ? '2px solid #86efac' : '1.5px solid #e5e7eb',
                boxShadow: mandi.isBest ? '0 4px 16px rgba(20,83,45,0.10)' : '0 1px 4px rgba(0,0,0,0.04)',
                animation: `fadeInUp 0.4s ${i * 0.07}s ease both`,
              }}
            >
              <div className="flex items-center px-4 py-3 gap-2">
                <div style={{ flex: 2 }}>
                  <div className="flex items-center gap-1.5">
                    {mandi.isBest && <Star size={14} color="#d97706" fill="#d97706" />}
                    <span style={{ fontSize: 15, fontWeight: mandi.isBest ? 800 : 700, color: '#111827' }}>{mandi.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <MapPin size={11} color="#9ca3af" />
                    <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>{mandi.distance} km</span>
                    <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>· {driveTime(mandi.distance)}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: mandi.trendUp ? '#15803d' : '#b91c1c', marginLeft: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                      {mandi.trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {mandi.trend}
                    </span>
                  </div>
                </div>

                <div style={{ flex: 1, textAlign: 'right' }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#374151' }}>₹{mandi.price.toLocaleString('en-IN')}</span>
                </div>

                <div style={{ flex: 1, textAlign: 'right' }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: mandi.isBest ? '#14532d' : '#374151' }}>₹{mandi.net.toLocaleString('en-IN')}</span>
                </div>

                {/* Sparkline */}
                <div style={{ width: 64, display: 'flex', justifyContent: 'flex-end' }}>
                  <Sparkline data={mandi.sparkline} color={mandi.trendUp ? '#16a34a' : '#dc2626'} />
                </div>
              </div>

              {mandi.isBest && (
                <div className="flex items-center justify-center gap-1.5 py-1.5" style={{ background: '#f0fdf4', borderTop: '1px solid #dcfce7' }}>
                  <TrendingUp size={13} color="#15803d" />
                  <span style={{ fontSize: 12, color: '#15803d', fontWeight: 800 }}>Highest net profit for your crop</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info note */}
        <div className="rounded-2xl px-4 py-3 flex items-start gap-3" style={{ background: '#fffbeb', border: '1.5px solid #fde68a' }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>ℹ️</span>
          <p style={{ fontSize: 13, color: '#78350f', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
            Prices updated daily. Transport cost estimated based on your location. Actual prices may vary at mandi.
          </p>
        </div>

      </div>
    </div>
  );
}
