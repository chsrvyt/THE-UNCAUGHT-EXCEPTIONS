import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, TrendingUp, Sprout, ShoppingBasket, AlertTriangle, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/RiskBadge';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t, farmerName, crop, cropEmoji, stateVal, district } = useApp();

  return (
    <div style={{ background: '#f7f5f0', minHeight: '100%', paddingBottom: 16 }}>
      {/* Top Header */}
      <div
        style={{
          background: '#14532d',
          padding: '20px 16px 28px',
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p style={{ color: '#86efac', fontSize: 14, margin: 0 }}>{t.greeting}</p>
            <h1 style={{ color: 'white', margin: '2px 0 0', fontSize: 22 }}>{farmerName}</h1>
            <div className="flex items-center gap-1 mt-1">
              <span style={{ fontSize: 13, color: '#a7f3d0' }}>📍 {district}, {stateVal}</span>
              <span style={{ fontSize: 13, color: '#a7f3d0', marginLeft: 8 }}>{cropEmoji} {crop}</span>
            </div>
          </div>
          <button
            className="flex items-center justify-center rounded-full"
            style={{ width: 42, height: 42, background: 'rgba(255,255,255,0.15)', border: 'none' }}
          >
            <Bell size={20} color="white" />
          </button>
        </div>

        {/* Updated tag */}
        <div
          className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.12)' }}
        >
          <div className="rounded-full" style={{ width: 6, height: 6, background: '#4ade80' }} />
          <span style={{ fontSize: 12, color: '#a7f3d0' }}>{t.updated}</span>
        </div>
      </div>

      <div className="px-4" style={{ marginTop: -12 }}>

        {/* TODAY'S BEST ACTION CARD */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
            marginBottom: 16,
          }}
        >
          {/* Card Header */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ background: '#f0fdf4', borderBottom: '1.5px solid #dcfce7' }}
          >
            <TrendingUp size={18} color="#15803d" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#15803d' }}>{t.todayAction}</span>
          </div>

          {/* Action Content */}
          <div className="px-4 py-4">
            {/* Harvest Countdown */}
            <div className="flex items-stretch gap-3 mb-4">
              <div
                className="flex flex-col items-center justify-center rounded-2xl"
                style={{ background: '#f0fdf4', padding: '16px 20px', minWidth: 90 }}
              >
                <span style={{ fontSize: 40, fontWeight: 800, color: '#14532d', lineHeight: 1 }}>7</span>
                <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>{t.days}</span>
                <span style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{t.harvestIn}</span>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                {/* Best Market */}
                <div
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                  style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
                >
                  <ShoppingBasket size={16} color="#15803d" />
                  <div>
                    <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>{t.bestMarket}</p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Wardha APMC</p>
                  </div>
                </div>

                {/* Profit */}
                <div
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                  style={{ background: '#f0fdf4', border: '1px solid #dcfce7' }}
                >
                  <TrendingUp size={16} color="#15803d" />
                  <div>
                    <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>{t.expectedProfit}</p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#14532d', margin: 0 }}>₹18,500</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Level */}
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 14, color: '#6b7280' }}>{t.riskLevel}</span>
              <RiskBadge level="medium" label={t.medium} size="md" />
            </div>
          </div>
        </div>

        {/* 3 QUICK ACTION CARDS */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Harvest Details */}
          <button
            onClick={() => navigate('/app/harvest')}
            className="flex flex-col items-center rounded-2xl p-4 transition-all active:opacity-75"
            style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none', gap: 8 }}
          >
            <div
              className="rounded-2xl flex items-center justify-center"
              style={{ width: 48, height: 48, background: '#f0fdf4' }}
            >
              <Sprout size={24} color="#15803d" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', textAlign: 'center', lineHeight: 1.3 }}>
              {t.harvestDetails}
            </span>
            <ChevronRight size={14} color="#9ca3af" />
          </button>

          {/* Market Compare */}
          <button
            onClick={() => navigate('/app/market')}
            className="flex flex-col items-center rounded-2xl p-4 transition-all active:opacity-75"
            style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none', gap: 8 }}
          >
            <div
              className="rounded-2xl flex items-center justify-center"
              style={{ width: 48, height: 48, background: '#fef3c7' }}
            >
              <ShoppingBasket size={24} color="#d97706" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', textAlign: 'center', lineHeight: 1.3 }}>
              {t.marketCompare}
            </span>
            <ChevronRight size={14} color="#9ca3af" />
          </button>

          {/* Spoilage Risk */}
          <button
            onClick={() => navigate('/app/spoilage')}
            className="flex flex-col items-center rounded-2xl p-4 transition-all active:opacity-75"
            style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none', gap: 8 }}
          >
            <div
              className="rounded-2xl flex items-center justify-center"
              style={{ width: 48, height: 48, background: '#fef3c7' }}
            >
              <AlertTriangle size={24} color="#d97706" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', textAlign: 'center', lineHeight: 1.3 }}>
              {t.spoilageRisk}
            </span>
            <ChevronRight size={14} color="#9ca3af" />
          </button>
        </div>

        {/* Market Preview Banner */}
        <button
          onClick={() => navigate('/app/market')}
          className="w-full rounded-2xl overflow-hidden transition-all active:opacity-80"
          style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' }}
        >
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>🏪 {t.marketCompare}</span>
            <span style={{ fontSize: 13, color: '#15803d', fontWeight: 600 }}>{t.viewDetails} →</span>
          </div>
          <div className="flex">
            {[
              { name: 'Wardha', price: '₹6,450', net: '₹6,070', best: true },
              { name: 'Nagpur', price: '₹6,200', net: '₹5,950', best: false },
              { name: 'Amravati', price: '₹6,380', net: '₹5,660', best: false },
            ].map((m) => (
              <div
                key={m.name}
                className="flex-1 flex flex-col items-center py-3 px-2"
                style={{ borderRight: '1px solid #f3f4f6', background: m.best ? '#f0fdf4' : 'white' }}
              >
                <span style={{ fontSize: 12, color: m.best ? '#15803d' : '#6b7280', fontWeight: m.best ? 700 : 400 }}>
                  {m.name}
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: m.best ? '#14532d' : '#374151' }}>
                  {m.price}
                </span>
                <span style={{ fontSize: 11, color: '#6b7280' }}>Net {m.net}</span>
                {m.best && (
                  <span
                    className="mt-1 px-2 py-0.5 rounded-full"
                    style={{ fontSize: 10, background: '#14532d', color: 'white', fontWeight: 700 }}
                  >
                    ★ {t.bestChoice}
                  </span>
                )}
              </div>
            ))}
          </div>
        </button>

        {/* Tip of Day */}
        <div
          className="mt-4 rounded-2xl px-4 py-4 flex items-start gap-3"
          style={{ background: '#fffbeb', border: '1.5px solid #fde68a' }}
        >
          <span style={{ fontSize: 24 }}>💡</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#92400e', margin: 0 }}>Tip of the Day</p>
            <p style={{ fontSize: 13, color: '#78350f', margin: '3px 0 0' }}>
              Cotton moisture should be 8–10% before storage. Check with a moisture meter.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
