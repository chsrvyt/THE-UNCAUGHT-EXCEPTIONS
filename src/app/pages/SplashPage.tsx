import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { LANGUAGES, Language } from '../data/translations';

const AppLogo = () => (
  <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="48" cy="48" r="48" fill="#14532d" />
    {/* Sun */}
    <circle cx="48" cy="22" r="7" fill="#FFC107" />
    <line x1="48" y1="10" x2="48" y2="13" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />
    <line x1="38" y1="14" x2="40" y2="16" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />
    <line x1="58" y1="14" x2="56" y2="16" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />
    <line x1="34" y1="22" x2="37" y2="22" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />
    <line x1="59" y1="22" x2="62" y2="22" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />
    {/* Stalk */}
    <line x1="48" y1="30" x2="48" y2="78" stroke="white" strokeWidth="3" strokeLinecap="round" />
    {/* Grains Left */}
    <ellipse cx="39" cy="40" rx="4.5" ry="7" fill="white" transform="rotate(-18 39 40)" />
    <ellipse cx="37" cy="51" rx="4.5" ry="7" fill="white" transform="rotate(-22 37 51)" />
    <ellipse cx="38" cy="62" rx="4.5" ry="7" fill="white" transform="rotate(-18 38 62)" />
    {/* Grains Right */}
    <ellipse cx="57" cy="40" rx="4.5" ry="7" fill="white" transform="rotate(18 57 40)" />
    <ellipse cx="59" cy="51" rx="4.5" ry="7" fill="white" transform="rotate(22 59 51)" />
    <ellipse cx="58" cy="62" rx="4.5" ry="7" fill="white" transform="rotate(18 58 62)" />
  </svg>
);

export default function SplashPage() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useApp();

  return (
    <div
      className="flex flex-col"
      style={{ minHeight: '100dvh', background: '#ffffff', position: 'relative' }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-5 pb-2">
        {/* Gov badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: '#f0fdf4', border: '1px solid #86efac' }}
        >
          <span style={{ fontSize: 10, color: '#15803d', fontWeight: 600, letterSpacing: '0.03em' }}>
            🏛 {t.govTagline}
          </span>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code as Language)}
              className="rounded-lg transition-all"
              style={{
                padding: '6px 10px',
                fontSize: 13,
                fontWeight: language === lang.code ? 700 : 400,
                background: language === lang.code ? '#14532d' : '#f3f4f6',
                color: language === lang.code ? 'white' : '#374151',
                border: 'none',
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
        {/* Decorative top arc */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: 220,
            background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
            zIndex: 0,
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo */}
          <div
            className="mb-6"
            style={{
              filter: 'drop-shadow(0 8px 24px rgba(20,83,45,0.25))',
            }}
          >
            <AppLogo />
          </div>

          {/* App Name */}
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#14532d',
              margin: 0,
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
            }}
          >
            {t.appName}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 17,
              color: '#4ade80',
              margin: '6px 0 0 0',
              fontWeight: 500,
            }}
          >
            {t.appSubtitle}
          </p>

          {/* Tagline */}
          <p
            style={{
              fontSize: 15,
              color: '#6b7280',
              margin: '10px 0 0 0',
            }}
          >
            {t.tagline}
          </p>

          {/* Illustration Row */}
          <div className="flex items-center justify-center gap-6 mt-10 mb-10">
            {['🌾', '☀️', '🚜', '🌧️', '📊'].map((emoji, i) => (
              <div
                key={i}
                className="flex items-center justify-center rounded-2xl"
                style={{
                  width: 48,
                  height: 48,
                  background: i % 2 === 0 ? '#f0fdf4' : '#fefce8',
                  fontSize: 22,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                {emoji}
              </div>
            ))}
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['🌱 Harvest Timing', '🏪 Best Mandi', '⚠️ Spoilage Risk', '💰 Profit Estimate'].map((f, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-full"
                style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  fontSize: 13,
                  color: '#374151',
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pb-10">
        <button
          onClick={() => navigate('/onboarding')}
          className="w-full rounded-xl flex items-center justify-center gap-2 transition-opacity active:opacity-80"
          style={{
            background: '#14532d',
            color: 'white',
            padding: '18px 24px',
            fontSize: 18,
            fontWeight: 700,
            border: 'none',
            boxShadow: '0 4px 16px rgba(20,83,45,0.35)',
          }}
        >
          {t.getStarted} →
        </button>
        <p
          className="text-center mt-3"
          style={{ fontSize: 12, color: '#9ca3af' }}
        >
          {t.appVersion}
        </p>
      </div>
    </div>
  );
}
