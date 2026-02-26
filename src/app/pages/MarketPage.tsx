import React from 'react';
import { MapPin, TrendingUp, Truck, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';

const MANDIS = [
  {
    name: 'Wardha APMC',
    distance: 42,
    price: 6450,
    transport: 380,
    net: 6070,
    isBest: true,
    trend: '+8%',
    trendUp: true,
  },
  {
    name: 'Nagpur APMC',
    distance: 28,
    price: 6200,
    transport: 250,
    net: 5950,
    isBest: false,
    trend: '+5%',
    trendUp: true,
  },
  {
    name: 'Amravati APMC',
    distance: 85,
    price: 6380,
    transport: 720,
    net: 5660,
    isBest: false,
    trend: '+3%',
    trendUp: true,
  },
  {
    name: 'Yavatmal APMC',
    distance: 64,
    price: 5800,
    transport: 580,
    net: 5220,
    isBest: false,
    trend: '-2%',
    trendUp: false,
  },
];

export default function MarketPage() {
  const { t, crop, cropEmoji } = useApp();
  const best = MANDIS[0];

  return (
    <div style={{ background: '#f7f5f0', minHeight: '100%', paddingBottom: 16 }}>
      <PageHeader title={t.marketPageTitle} />

      <div className="px-4 py-4 flex flex-col gap-4">

        {/* Crop Tag */}
        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1.5 rounded-full"
            style={{ background: '#f0fdf4', border: '1.5px solid #86efac', fontSize: 14, color: '#15803d', fontWeight: 600 }}
          >
            {cropEmoji} {crop}
          </span>
          <span style={{ fontSize: 13, color: '#6b7280' }}>· Price per quintal (100 kg)</span>
        </div>

        {/* BEST MANDI HERO CARD */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
            boxShadow: '0 6px 24px rgba(20,83,45,0.35)',
          }}
        >
          <div className="px-4 pt-4 pb-2 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star size={16} color="#fcd34d" fill="#fcd34d" />
                <span style={{ fontSize: 12, color: '#86efac', fontWeight: 700, letterSpacing: '0.05em' }}>
                  {t.bestChoice.toUpperCase()}
                </span>
              </div>
              <h2 style={{ color: 'white', margin: 0, fontSize: 22 }}>{best.name}</h2>
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={13} color="#a7f3d0" />
                <span style={{ fontSize: 13, color: '#a7f3d0' }}>{best.distance} {t.kmAway}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span style={{ fontSize: 12, color: '#86efac' }}>{t.priceCol}</span>
              <span style={{ fontSize: 30, fontWeight: 800, color: 'white', lineHeight: 1.1 }}>
                ₹{best.price.toLocaleString('en-IN')}
              </span>
              <span
                className="px-2 py-0.5 rounded-full mt-1"
                style={{ background: '#4ade80', color: '#14532d', fontSize: 12, fontWeight: 700 }}
              >
                {best.trend} this week
              </span>
            </div>
          </div>

          <div
            className="flex mx-4 mb-4 rounded-xl overflow-hidden"
            style={{ border: '1.5px solid rgba(255,255,255,0.2)' }}
          >
            <div className="flex-1 flex flex-col items-center py-3" style={{ borderRight: '1px solid rgba(255,255,255,0.2)' }}>
              <Truck size={16} color="#a7f3d0" />
              <span style={{ fontSize: 11, color: '#a7f3d0', marginTop: 4 }}>{t.transportCol}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>₹{best.transport}</span>
            </div>
            <div className="flex-1 flex flex-col items-center py-3">
              <TrendingUp size={16} color="#4ade80" />
              <span style={{ fontSize: 11, color: '#a7f3d0', marginTop: 4 }}>{t.netCol}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#4ade80' }}>₹{best.net.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Column Headers */}
        <div className="flex items-center px-1 gap-2">
          <span style={{ flex: 2, fontSize: 12, color: '#6b7280', fontWeight: 600 }}>{t.mandiCol}</span>
          <span style={{ flex: 1, fontSize: 12, color: '#6b7280', fontWeight: 600, textAlign: 'right' }}>{t.priceCol}</span>
          <span style={{ flex: 1, fontSize: 12, color: '#6b7280', fontWeight: 600, textAlign: 'right' }}>{t.transportCol}</span>
          <span style={{ flex: 1, fontSize: 12, color: '#6b7280', fontWeight: 600, textAlign: 'right' }}>{t.netCol}</span>
        </div>

        {/* Mandi List */}
        <div className="flex flex-col gap-3">
          {MANDIS.map((mandi, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'white',
                border: mandi.isBest ? '2px solid #86efac' : '1.5px solid #e5e7eb',
                boxShadow: mandi.isBest ? '0 4px 16px rgba(20,83,45,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              <div className="flex items-center px-4 py-3 gap-2">
                <div style={{ flex: 2 }}>
                  <div className="flex items-center gap-1.5">
                    {mandi.isBest && <Star size={14} color="#d97706" fill="#d97706" />}
                    <span style={{ fontSize: 15, fontWeight: mandi.isBest ? 700 : 600, color: '#111827' }}>
                      {mandi.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={11} color="#9ca3af" />
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>{mandi.distance} km</span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: mandi.trendUp ? '#15803d' : '#b91c1c',
                        marginLeft: 4,
                      }}
                    >
                      {mandi.trend}
                    </span>
                  </div>
                </div>

                <div style={{ flex: 1, textAlign: 'right' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#374151' }}>
                    ₹{mandi.price.toLocaleString('en-IN')}
                  </span>
                </div>

                <div style={{ flex: 1, textAlign: 'right' }}>
                  <span style={{ fontSize: 14, color: '#6b7280' }}>
                    ₹{mandi.transport}
                  </span>
                </div>

                <div style={{ flex: 1, textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: mandi.isBest ? '#14532d' : '#374151',
                    }}
                  >
                    ₹{mandi.net.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {mandi.isBest && (
                <div
                  className="flex items-center justify-center gap-1 py-1.5"
                  style={{ background: '#f0fdf4', borderTop: '1px solid #dcfce7' }}
                >
                  <TrendingUp size={13} color="#15803d" />
                  <span style={{ fontSize: 12, color: '#15803d', fontWeight: 700 }}>
                    Highest net profit for your crop
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Note */}
        <div
          className="rounded-xl px-4 py-3 flex items-start gap-2"
          style={{ background: '#fffbeb', border: '1px solid #fde68a' }}
        >
          <span style={{ fontSize: 18 }}>ℹ️</span>
          <p style={{ fontSize: 13, color: '#78350f', margin: 0 }}>
            Prices updated daily. Transport cost estimated based on your location. Actual prices may vary at mandi.
          </p>
        </div>

      </div>
    </div>
  );
}
