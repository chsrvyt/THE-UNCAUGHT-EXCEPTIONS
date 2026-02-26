import React from 'react';
import { MapPin, Wheat, Ruler, Package, ChevronRight, HelpCircle, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LANGUAGES, Language } from '../data/translations';

export default function ProfilePage() {
  const {
    t, language, setLanguage,
    farmerName, stateVal, district,
    crop, cropEmoji, farmSize, hasStorage,
  } = useApp();

  const initials = farmerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const details = [
    { icon: MapPin, label: t.myLocation, value: `${district}, ${stateVal}` },
    { icon: Wheat, label: t.myCrop, value: `${cropEmoji} ${crop}` },
    { icon: Ruler, label: t.myFarmSize, value: `${farmSize} ${t.acres}` },
    { icon: Package, label: t.myStorage, value: hasStorage ? `✅ ${t.available}` : `❌ ${t.notAvailable}` },
  ];

  return (
    <div style={{ background: '#f7f5f0', minHeight: '100%', paddingBottom: 16 }}>
      {/* Header */}
      <div
        style={{ background: '#14532d', padding: '24px 16px 32px' }}
      >
        <h2 style={{ color: 'white', margin: '0 0 20px' }}>{t.profilePageTitle}</h2>

        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          <div
            className="rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              width: 64,
              height: 64,
              background: '#166534',
              border: '3px solid rgba(255,255,255,0.3)',
            }}
          >
            <span style={{ fontSize: 24, fontWeight: 800, color: '#4ade80' }}>{initials}</span>
          </div>
          <div>
            <h3 style={{ color: 'white', margin: 0, fontSize: 20 }}>{farmerName}</h3>
            <p style={{ color: '#a7f3d0', margin: '3px 0 0', fontSize: 14 }}>
              🌾 {crop} Farmer · {district}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4" style={{ marginTop: -12 }}>

        {/* Farm Details Card */}
        <div
          className="rounded-2xl overflow-hidden mb-4"
          style={{ background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
        >
          <div
            className="px-4 py-3"
            style={{ background: '#f0fdf4', borderBottom: '1px solid #dcfce7' }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: '#15803d' }}>🌱 Farm Information</span>
          </div>
          {details.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-4"
                style={{ borderBottom: i < details.length - 1 ? '1px solid #f3f4f6' : 'none' }}
              >
                <div
                  className="rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ width: 40, height: 40, background: '#f0fdf4' }}
                >
                  <Icon size={18} color="#15803d" />
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{item.label}</p>
                  <p style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: '1px 0 0' }}>{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Language Selector */}
        <div
          className="rounded-2xl overflow-hidden mb-4"
          style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
          <div
            className="px-4 py-3"
            style={{ background: '#fafafa', borderBottom: '1px solid #f3f4f6' }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>
              🌐 {t.changeLang}
            </span>
          </div>
          <div className="px-4 py-4">
            <div className="flex gap-3">
              {LANGUAGES.map((lang) => {
                const isActive = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as Language)}
                    className="flex-1 flex flex-col items-center rounded-2xl py-4 transition-all"
                    style={{
                      background: isActive ? '#14532d' : '#f9fafb',
                      border: `2px solid ${isActive ? '#14532d' : '#e5e7eb'}`,
                      color: isActive ? 'white' : '#374151',
                    }}
                  >
                    <span style={{ fontSize: 22, lineHeight: 1 }}>
                      {lang.code === 'en' ? '🇬🇧' : lang.code === 'hi' ? '🇮🇳' : '🪷'}
                    </span>
                    <span style={{ fontSize: 15, fontWeight: isActive ? 700 : 600, marginTop: 6 }}>
                      {lang.label}
                    </span>
                    <span style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
                      {lang.native}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Support Links */}
        <div
          className="rounded-2xl overflow-hidden mb-4"
          style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
          {[
            { icon: Phone, label: 'Helpline: 1800-180-1551', sub: 'Free farmer helpline (Mon–Sat)', color: '#f0fdf4', iconColor: '#15803d' },
            { icon: HelpCircle, label: t.helpSupport, sub: 'FAQs, guides & tutorials', color: '#f9fafb', iconColor: '#6b7280' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-4 py-4 transition-all active:opacity-70"
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: i === 0 ? '1px solid #f3f4f6' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div
                  className="rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ width: 42, height: 42, background: item.color }}
                >
                  <Icon size={20} color={item.iconColor} />
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0 }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: '1px 0 0' }}>{item.sub}</p>
                </div>
                <ChevronRight size={18} color="#9ca3af" />
              </button>
            );
          })}
        </div>

        {/* App Info */}
        <div className="flex flex-col items-center gap-1 py-2">
          <p style={{ fontSize: 12, color: '#9ca3af' }}>{t.appVersion}</p>
          <p style={{ fontSize: 11, color: '#d1d5db' }}>Krishak Saarthi · AgriChain © 2026</p>
        </div>

      </div>
    </div>
  );
}