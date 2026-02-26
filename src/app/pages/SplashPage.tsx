import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { LANGUAGES, Language } from '../data/translations';
import { AuthModal } from '../components/AuthModal';

const AppLogo = () => (
  <svg width="100" height="100" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="48" cy="48" r="48" fill="url(#logoGrad)" />
    <defs>
      <radialGradient id="logoGrad" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#166534" />
        <stop offset="100%" stopColor="#14532d" />
      </radialGradient>
    </defs>
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

const FLOATING_ITEMS = [
  { emoji: '🌾', delay: '0s', dur: '3.2s', x: '8%', size: 28 },
  { emoji: '☀️', delay: '0.4s', dur: '4s', x: '82%', size: 24 },
  { emoji: '🚜', delay: '0.8s', dur: '3.5s', x: '15%', size: 22 },
  { emoji: '🌧️', delay: '1.2s', dur: '3.8s', x: '75%', size: 20 },
  { emoji: '🌿', delay: '0.2s', dur: '4.2s', x: '50%', size: 18 },
  { emoji: '💰', delay: '1.5s', dur: '3.0s', x: '60%', size: 20 },
];

const FEATURES = [
  { icon: '🌱', label: 'Harvest Timing', color: '#f0fdf4', border: '#86efac', text: '#15803d' },
  { icon: '🏪', label: 'Best Mandi', color: '#fefce8', border: '#fde68a', text: '#b45309' },
  { icon: '⚠️', label: 'Spoilage Risk', color: '#fef2f2', border: '#fecaca', text: '#dc2626' },
  { icon: '💰', label: 'Profit Estimate', color: '#f0fdf4', border: '#86efac', text: '#15803d' },
];

export default function SplashPage() {
  const navigate = useNavigate();
  const { t, language, setLanguage, user } = useApp();
  const [mounted, setMounted] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(id);
  }, []);

  const handleStart = () => {
    if (user) {
      navigate('/app');
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 55%, #f9fafb 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Nunito, sans-serif',
      }}
    >
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Floating emoji background */}
      {FLOATING_ITEMS.map((item, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: item.x,
            top: `${15 + i * 10}%`,
            fontSize: item.size,
            animation: `float-up ${item.dur} ${item.delay} ease-in-out infinite`,
            opacity: 0.55,
            userSelect: 'none',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {item.emoji}
        </div>
      ))}

      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-5 pb-2" style={{ position: 'relative', zIndex: 2 }}>
        {/* Gov badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: '#f0fdf4', border: '1.5px solid #86efac', boxShadow: '0 2px 8px rgba(20,83,45,0.08)' }}
        >
          <span style={{ fontSize: 10, color: '#15803d', fontWeight: 800, letterSpacing: '0.04em' }}>
            🏛 {t.govTagline}
          </span>
        </div>

        {/* Language Selector */}
        <div
          className="flex items-center rounded-xl overflow-hidden"
          style={{ border: '1.5px solid #e5e7eb', background: 'white' }}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code as Language)}
              className="transition-all"
              style={{
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: language === lang.code ? 800 : 500,
                background: language === lang.code ? '#14532d' : 'transparent',
                color: language === lang.code ? 'white' : '#6b7280',
                border: 'none',
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex flex-col items-center flex-1 px-6 text-center"
        style={{ position: 'relative', zIndex: 2, paddingTop: 24 }}
      >
        {/* Logo */}
        <div
          className="mb-5"
          style={{
            filter: 'drop-shadow(0 12px 32px rgba(20,83,45,0.30))',
            animation: mounted ? 'count-up 0.7s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
          }}
        >
          <AppLogo />
        </div>

        {/* App Name */}
        <h1
          style={{
            fontSize: 34,
            fontWeight: 900,
            color: '#14532d',
            margin: 0,
            letterSpacing: '-0.5px',
            lineHeight: 1.15,
            animation: mounted ? 'fadeInUp 0.55s 0.15s ease both' : 'none',
          }}
        >
          {t.appName}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 17,
            color: '#16a34a',
            margin: '6px 0 0 0',
            fontWeight: 700,
            animation: mounted ? 'fadeInUp 0.55s 0.25s ease both' : 'none',
          }}
        >
          {t.appSubtitle}
        </p>

        {/* Tagline */}
        <p
          style={{
            fontSize: 14,
            color: '#6b7280',
            margin: '8px 0 0 0',
            fontWeight: 500,
            animation: mounted ? 'fadeInUp 0.55s 0.35s ease both' : 'none',
          }}
        >
          {t.tagline}
        </p>

        {/* Feature Pills */}
        <div
          className="flex flex-wrap justify-center gap-2 mt-8 mb-6"
          style={{ animation: mounted ? 'fadeInUp 0.55s 0.45s ease both' : 'none' }}
        >
          {FEATURES.map((f, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl"
              style={{
                background: f.color,
                border: `1.5px solid ${f.border}`,
                fontSize: 13,
                color: f.text,
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <span style={{ fontSize: 15 }}>{f.icon}</span>
              {f.label}
            </span>
          ))}
        </div>

        {/* Hero Illustration Strip */}
        <div
          className="flex items-center justify-center gap-4 rounded-3xl px-6 py-5 w-full"
          style={{
            background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
            boxShadow: '0 8px 32px rgba(20,83,45,0.25)',
            animation: mounted ? 'fadeInUp 0.55s 0.55s ease both' : 'none',
          }}
        >
          {['🌾', '☀️', '🚜', '🌧️', '📊'].map((emoji, i) => (
            <div
              key={i}
              className="flex items-center justify-center rounded-2xl"
              style={{
                width: 46,
                height: 46,
                background: 'rgba(255,255,255,0.12)',
                fontSize: 22,
                border: '1.5px solid rgba(255,255,255,0.20)',
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        className="px-5 pb-10 pt-4"
        style={{ position: 'relative', zIndex: 2, animation: mounted ? 'fadeInUp 0.55s 0.65s ease both' : 'none' }}
      >
        <button
          onClick={handleStart}
          className="w-full rounded-2xl flex items-center justify-center gap-2 btn-shimmer"
          style={{
            padding: '19px 24px',
            fontSize: 18,
            fontWeight: 900,
            border: 'none',
            color: 'white',
            boxShadow: '0 6px 24px rgba(20,83,45,0.40)',
            letterSpacing: '0.01em',
          }}
        >
          {user ? 'Go to Dashboard' : t.getStarted} →
        </button>
        <p className="text-center mt-3" style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>
          {t.appVersion}
        </p>
      </div>
    </div>
  );
}
