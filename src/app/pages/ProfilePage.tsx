import React, { useState } from 'react';
import { MapPin, Wheat, Ruler, Package, ChevronRight, HelpCircle, Phone, Edit3, CheckCircle2, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LANGUAGES, Language } from '../data/translations';
import { useNavigate } from 'react-router';

export default function ProfilePage() {
  const navigate = useNavigate();
  const {
    t, language, setLanguage, user, signOut,
    farmerName, setFarmerName, stateVal, district,
    crop, cropEmoji, farmSize, hasStorage,
  } = useApp();

  const [editing, setEditing] = useState(false);
  const [nameVal, setNameVal] = useState(farmerName);
  const initials = farmerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const saveName = () => {
    if (nameVal.trim().length >= 2) setFarmerName(nameVal.trim());
    setEditing(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const details = [
    { icon: MapPin, label: t.myLocation, value: `${district}, ${stateVal}` },
    { icon: Wheat, label: t.myCrop, value: `${cropEmoji} ${crop}` },
    { icon: Ruler, label: t.myFarmSize, value: `${farmSize} ${t.acres}` },
    { icon: Package, label: t.myStorage, value: hasStorage ? `✅ ${t.available}` : `❌ ${t.notAvailable}` },
  ];

  return (
    <div style={{ background: '#f7f5f0', minHeight: '100%', paddingBottom: 16, fontFamily: 'Nunito, sans-serif' }}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)', padding: '24px 16px 36px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        <h2 style={{ color: 'white', margin: '0 0 20px', fontSize: 20, fontWeight: 800, position: 'relative', zIndex: 1 }}>{t.profilePageTitle}</h2>

        <div className="flex items-center gap-4" style={{ position: 'relative', zIndex: 1 }}>
          <div
            className="rounded-full flex items-center justify-center flex-shrink-0"
            style={{ width: 68, height: 68, background: 'rgba(255,255,255,0.15)', border: '3px solid rgba(255,255,255,0.35)' }}
          >
            <span style={{ fontSize: 26, fontWeight: 900, color: '#4ade80' }}>{initials}</span>
          </div>
          <div>
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={nameVal}
                  onChange={(e) => setNameVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveName()}
                  style={{
                    fontSize: 18, fontWeight: 800, color: '#14532d', borderRadius: 12, padding: '6px 12px', background: 'white', border: 'none', outline: 'none', fontFamily: 'Nunito, sans-serif', width: 160,
                  }}
                />
                <button onClick={saveName} style={{ background: '#4ade80', border: 'none', borderRadius: 8, padding: '6px 8px', display: 'flex', alignItems: 'center' }}>
                  <CheckCircle2 size={18} color="#14532d" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 style={{ color: 'white', margin: 0, fontSize: 22, fontWeight: 900 }}>{farmerName}</h3>
                <button
                  onClick={() => setEditing(true)}
                  style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: 8, padding: '4px 6px', display: 'flex', alignItems: 'center' }}
                >
                  <Edit3 size={14} color="white" />
                </button>
              </div>
            )}
            <p style={{ color: '#a7f3d0', margin: '4px 0 0', fontSize: 13, fontWeight: 600 }}>
              {user?.email || `🌾 ${crop} Farmer`}
            </p>
          </div>
        </div>

        {/* Stats mini row */}
        <div className="flex gap-2 mt-5" style={{ position: 'relative', zIndex: 1 }}>
          {[
            { label: 'Farm Size', value: `${farmSize} Acres` },
            { label: 'Crop', value: `${cropEmoji} ${crop}` },
            { label: 'Storage', value: hasStorage ? '✅ Yes' : '❌ No' },
          ].map((stat, i) => (
            <div key={i} className="flex-1 rounded-xl p-2 flex flex-col items-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'white', textAlign: 'center' }}>{stat.value}</span>
              <span style={{ fontSize: 10, color: '#86efac', fontWeight: 600, marginTop: 1, textAlign: 'center' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4" style={{ marginTop: -16 }}>

        {/* ── Farm Details Card ─────────────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden mb-4" style={{ background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <div className="px-4 py-3" style={{ background: '#f0fdf4', borderBottom: '1px solid #dcfce7' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#15803d' }}>🌱 Farm Information</span>
          </div>
          {details.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-4"
                style={{ borderBottom: i < details.length - 1 ? '1px solid #f3f4f6' : 'none' }}
              >
                <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 42, height: 42, background: '#f0fdf4' }}>
                  <Icon size={18} color="#15803d" />
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: '2px 0 0' }}>{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Language Selector ─────────────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden mb-4" style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="px-4 py-3" style={{ background: '#fafafa', borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#374151' }}>🌐 {t.changeLang}</span>
          </div>
          <div className="px-4 py-4">
            <div className="flex gap-3">
              {LANGUAGES.map((lang) => {
                const isActive = language === lang.code;
                const flag = lang.code === 'en' ? '🇬🇧' : lang.code === 'hi' ? '🇮🇳' : '🪷';
                return (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as Language)}
                    className="flex-1 flex flex-col items-center rounded-2xl py-4 transition-all"
                    style={{
                      background: isActive ? '#14532d' : '#f9fafb',
                      border: `2.5px solid ${isActive ? '#14532d' : '#e5e7eb'}`,
                      color: isActive ? 'white' : '#374151',
                      transform: isActive ? 'scale(1.04)' : 'scale(1)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: 26, lineHeight: 1 }}>{flag}</span>
                    <span style={{ fontSize: 15, fontWeight: isActive ? 900 : 700, marginTop: 8 }}>{lang.label}</span>
                    <span style={{ fontSize: 12, opacity: 0.8, marginTop: 2, fontWeight: 500 }}>{lang.native}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Support Links ─────────────────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden mb-4" style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          {[
            { icon: Phone, label: 'Helpline: 1800-180-1551', sub: 'Tap to call — free farmer helpline (Mon–Sat)', color: '#f0fdf4', iconColor: '#15803d', action: () => (window.location.href = 'tel:18001801551') },
            { icon: HelpCircle, label: t.helpSupport, sub: 'FAQs, guides & video tutorials', color: '#f9fafb', iconColor: '#6b7280', action: () => { } },
            { icon: LogOut, label: 'Sign Out', sub: 'Securely logout of your account', color: '#fef2f2', iconColor: '#dc2626', action: handleLogout },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-4 py-4 transition-all active:opacity-70"
                style={{ background: 'none', border: 'none', borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 44, height: 44, background: item.color }}>
                  <Icon size={20} color={item.iconColor} />
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: 0 }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0', fontWeight: 500 }}>{item.sub}</p>
                </div>
                <ChevronRight size={18} color="#9ca3af" />
              </button>
            );
          })}
        </div>

        {/* App Info */}
        <div className="flex flex-col items-center gap-1 py-2">
          <p style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>{t.appVersion}</p>
          <p style={{ fontSize: 11, color: '#d1d5db', fontWeight: 500 }}>Krishak Saarthi · AgriChain © 2026</p>
        </div>

      </div>
    </div>
  );
}