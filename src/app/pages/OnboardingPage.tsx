import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, CheckCircle2, ChevronLeft, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STATE_DISTRICTS, LANGUAGES, Language } from '../data/translations';

const CROPS = [
  { key: 'cotton', emoji: '🌿', color: '#f0fdf4', border: '#86efac', darkColor: '#15803d' },
  { key: 'soybean', emoji: '🫘', color: '#fefce8', border: '#fcd34d', darkColor: '#b45309' },
  { key: 'rice', emoji: '🍚', color: '#fff7ed', border: '#fdba74', darkColor: '#c2410c' },
  { key: 'wheat', emoji: '🌾', color: '#fefce8', border: '#fde68a', darkColor: '#d97706' },
  { key: 'sugarcane', emoji: '🎋', color: '#f0fdf4', border: '#86efac', darkColor: '#166534' },
  { key: 'maize', emoji: '🌽', color: '#fffbeb', border: '#fcd34d', darkColor: '#b45309' },
  { key: 'gram', emoji: '🥣', color: '#fff7ed', border: '#fdba74', darkColor: '#9a3412' },
  { key: 'bajra', emoji: '🥣', color: '#fafaf9', border: '#d6d3d1', darkColor: '#44403c' },
  { key: 'potato', emoji: '🥔', color: '#fef3c7', border: '#fde68a', darkColor: '#92400e' },
  { key: 'onion', emoji: '🧅', color: '#fdf2f8', border: '#fbcfe8', darkColor: '#9d174d' },
  { key: 'mustard', emoji: '🟡', color: '#fefce8', border: '#fde68a', darkColor: '#854d0e' },
  { key: 'tur', emoji: '🫘', color: '#fff7ed', border: '#fdba74', darkColor: '#c2410c' },
  { key: 'groundnut', emoji: '🥜', color: '#fffbeb', border: '#fcd34d', darkColor: '#b45309' },
  { key: 'jowar', emoji: '🌾', color: '#fafaf9', border: '#d6d3d1', darkColor: '#44403c' },
];

const STEP_LABELS = ['Name', 'Location', 'Crop', 'Farm'];

function StepBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ padding: '0 16px 0' }}>
      <div className="flex items-center gap-1.5 mb-1">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex-1 rounded-full transition-all" style={{
            height: 5,
            background: i < step ? '#14532d' : '#e5e7eb',
            transition: 'background 0.4s',
          }} />
        ))}
      </div>
      <div className="flex justify-between px-0.5">
        {STEP_LABELS.map((label, i) => (
          <span key={i} style={{
            fontSize: 10,
            fontWeight: i === step - 1 ? 800 : 500,
            color: i < step ? '#14532d' : '#9ca3af',
            transition: 'color 0.3s',
          }}>{label}</span>
        ))}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { t, language, setLanguage, setFarmerName, setStateVal, setDistrict, setCrop, setFarmSize, setHasStorage } = useApp();

  const [step, setStep] = useState(1);
  const [detecting, setDetecting] = useState(false);
  const [detected, setDetected] = useState(false);

  // Step 1 — Name
  const [nameInput, setNameInput] = useState('');

  // Step 2 — Location
  const [selState, setSelState] = useState('Maharashtra');
  const [selDistrict, setSelDistrict] = useState('Nagpur');

  // Step 3 — Crop
  const [selCropKey, setSelCropKey] = useState('cotton');

  // Step 4 — Farm
  const [size, setSize] = useState('3.5');
  const [storage, setStorage] = useState(true);

  const states = Object.keys(STATE_DISTRICTS);
  const districts = STATE_DISTRICTS[selState] || [];

  const handleAutoDetect = () => {
    setDetecting(true);
    setTimeout(() => {
      setDetecting(false);
      setDetected(true);
      setSelState('Maharashtra');
      setSelDistrict('Nagpur');
    }, 1800);
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      if (nameInput.trim()) setFarmerName(nameInput.trim());
      setStateVal(selState);
      setDistrict(selDistrict);
      const cropObj = CROPS.find((c) => c.key === selCropKey);
      setCrop(t[selCropKey as keyof typeof t] as string, cropObj?.emoji || '🌿');
      setFarmSize(size);
      setHasStorage(storage);
      navigate('/app');
    }
  };

  const canNext =
    step === 1 ? nameInput.trim().length >= 2 :
      step === 2 ? !!selState && !!selDistrict :
        step === 3 ? true :
          true;

  const stepTitle =
    step === 1 ? '👋 What\'s your name?' :
      step === 2 ? t.step1Title :
        step === 3 ? t.step2Title :
          t.step3Title;

  const stepSub =
    step === 1 ? 'So we can greet you properly' :
      step === 2 ? t.step1Sub :
        step === 3 ? t.step2Sub :
          t.step3Sub;

  return (
    <div className="flex flex-col" style={{ minHeight: '100dvh', background: '#f9fafb', fontFamily: 'Nunito, sans-serif' }}>

      {/* Header */}
      <div
        className="flex items-center justify-between px-4"
        style={{ paddingTop: 16, paddingBottom: 14, background: 'white', boxShadow: '0 1px 0 #e5e7eb' }}
      >
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center justify-center rounded-full"
              style={{ width: 38, height: 38, background: '#f0fdf4', color: '#14532d', border: 'none' }}
            >
              <ChevronLeft size={22} />
            </button>
          )}
          <div>
            <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, letterSpacing: '0.04em' }}>
              STEP {step} OF 4
            </div>
            <h2 style={{ margin: 0, color: '#14532d', fontSize: 20, fontWeight: 800 }}>
              {stepTitle}
            </h2>
          </div>
        </div>

        {/* Language selector */}
        <div
          className="flex items-center rounded-xl overflow-hidden"
          style={{ border: '1.5px solid #e5e7eb' }}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code as Language)}
              style={{
                padding: '5px 10px',
                fontSize: 12,
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

      {/* Progress Bar */}
      <div style={{ background: 'white', padding: '12px 0 14px' }}>
        <StepBar step={step} total={4} />
        <p style={{ margin: '8px 16px 0', fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{stepSub}</p>
      </div>

      {/* Step Content */}
      <div className="flex-1 px-4 py-5 overflow-y-auto">

        {/* ── STEP 1: Name ── */}
        {step === 1 && (
          <div className="animate-fade-up flex flex-col gap-4">
            <div
              className="flex flex-col items-center justify-center rounded-3xl p-8"
              style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
            >
              <div
                className="flex items-center justify-center rounded-full mb-5"
                style={{ width: 72, height: 72, background: '#f0fdf4', border: '3px solid #86efac' }}
              >
                <User size={32} color="#15803d" />
              </div>
              <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 16px', textAlign: 'center', fontWeight: 500 }}>
                We'll use your name to personalize your experience
              </p>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Ramesh Patil"
                autoFocus
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  fontSize: 20,
                  fontWeight: 700,
                  border: '2.5px solid',
                  borderColor: nameInput.trim().length >= 2 ? '#86efac' : '#e5e7eb',
                  borderRadius: 16,
                  background: 'white',
                  color: '#111827',
                  textAlign: 'center',
                  transition: 'border-color 0.3s',
                  outline: 'none',
                  fontFamily: 'Nunito, sans-serif',
                }}
              />
              {nameInput.trim().length >= 2 && (
                <div className="flex items-center gap-2 mt-3" style={{ color: '#15803d', fontWeight: 700, fontSize: 14, animation: 'fadeInUp 0.3s ease' }}>
                  <CheckCircle2 size={18} />
                  Welcome, {nameInput.trim()}! 🙏
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2: Location ── */}
        {step === 2 && (
          <div className="animate-fade-up flex flex-col gap-4">
            {/* Auto Detect */}
            <div style={{ position: 'relative' }}>
              {detecting && (
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: 'rgba(20,83,45,0.07)', animation: 'radar-ping 1.2s ease-out infinite', zIndex: 0 }}
                />
              )}
              <button
                onClick={handleAutoDetect}
                disabled={detecting}
                className="w-full flex items-center justify-center gap-3 rounded-2xl transition-all active:opacity-80"
                style={{
                  padding: '18px 20px',
                  background: detected ? '#f0fdf4' : '#14532d',
                  color: detected ? '#15803d' : 'white',
                  border: `2.5px solid ${detected ? '#86efac' : '#14532d'}`,
                  fontSize: 16,
                  fontWeight: 800,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {detecting ? (
                  <>
                    <div className="rounded-full border-2 border-white border-t-transparent animate-spin" style={{ width: 22, height: 22 }} />
                    {t.detecting}
                  </>
                ) : detected ? (
                  <>
                    <CheckCircle2 size={24} />
                    Maharashtra · Nagpur
                  </>
                ) : (
                  <>
                    <MapPin size={24} />
                    {t.autoDetect}
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1" style={{ height: 1, background: '#e5e7eb' }} />
              <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 600 }}>{t.orManual}</span>
              <div className="flex-1" style={{ height: 1, background: '#e5e7eb' }} />
            </div>

            {/* State Select */}
            <div>
              <label style={{ fontSize: 13, color: '#374151', fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t.selectState}
              </label>
              <select
                value={selState}
                onChange={(e) => { setSelState(e.target.value); setSelDistrict(''); }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: 16,
                  fontWeight: 600,
                  border: '2px solid #d1fae5',
                  borderRadius: 14,
                  background: 'white',
                  color: '#111827',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                  fontFamily: 'Nunito, sans-serif',
                }}
              >
                <option value="">{t.selectState}</option>
                {states.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* District Select */}
            <div>
              <label style={{ fontSize: 13, color: '#374151', fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t.selectDistrict}
              </label>
              <select
                value={selDistrict}
                onChange={(e) => setSelDistrict(e.target.value)}
                disabled={!selState}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: 16,
                  fontWeight: 600,
                  border: '2px solid #d1fae5',
                  borderRadius: 14,
                  background: selState ? 'white' : '#f9fafb',
                  color: '#111827',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                  fontFamily: 'Nunito, sans-serif',
                }}
              >
                <option value="">{t.selectDistrict}</option>
                {districts.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* ── STEP 3: Crop Selection ── */}
        {step === 3 && (
          <div className="animate-fade-up grid grid-cols-2 gap-4">
            {CROPS.map((crop) => {
              const isSelected = selCropKey === crop.key;
              const cropName = t[crop.key as keyof typeof t] as string;
              return (
                <button
                  key={crop.key}
                  onClick={() => setSelCropKey(crop.key)}
                  className="flex flex-col items-center justify-center rounded-3xl relative"
                  style={{
                    padding: '28px 16px 22px',
                    background: isSelected ? crop.color : 'white',
                    border: `2.5px solid ${isSelected ? crop.border : '#e5e7eb'}`,
                    boxShadow: isSelected ? `0 6px 20px rgba(0,0,0,0.10)` : '0 2px 8px rgba(0,0,0,0.04)',
                    transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                    transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                >
                  {isSelected && (
                    <div
                      className="absolute top-3 right-3 rounded-full flex items-center justify-center"
                      style={{ width: 24, height: 24, background: crop.darkColor, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                    >
                      <CheckCircle2 size={14} color="white" />
                    </div>
                  )}
                  <span style={{ fontSize: 52, lineHeight: 1.2, display: 'block' }}>{crop.emoji}</span>
                  <span
                    style={{
                      marginTop: 12,
                      fontSize: 17,
                      fontWeight: isSelected ? 800 : 600,
                      color: isSelected ? crop.darkColor : '#374151',
                    }}
                  >
                    {cropName}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── STEP 4: Farm Details ── */}
        {step === 4 && (
          <div className="animate-fade-up flex flex-col gap-5">
            {/* Farm Size */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <label style={{ fontSize: 15, color: '#374151', fontWeight: 800, display: 'block', marginBottom: 12 }}>
                🌾 {t.farmSize}
              </label>
              {/* Preset buttons */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {['1', '2', '5', '10'].map((val) => (
                  <button
                    key={val}
                    onClick={() => setSize(val)}
                    className="rounded-2xl py-3 transition-all"
                    style={{
                      background: size === val ? '#14532d' : '#f3f4f6',
                      color: size === val ? 'white' : '#374151',
                      fontWeight: size === val ? 800 : 600,
                      fontSize: 16,
                      border: 'none',
                      transform: size === val ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder={t.farmSizePlaceholder}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: 16,
                  fontWeight: 700,
                  border: '2px solid #d1fae5',
                  borderRadius: 14,
                  background: 'white',
                  color: '#111827',
                  outline: 'none',
                  fontFamily: 'Nunito, sans-serif',
                }}
              />
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 6, fontWeight: 500 }}>
                Enter custom acres if not in presets
              </p>
            </div>

            {/* Storage Toggle */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <p style={{ fontSize: 16, fontWeight: 800, color: '#374151', margin: '0 0 14px' }}>
                📦 {t.storageAvailable}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setStorage(true)}
                  className="flex-1 flex flex-col items-center rounded-2xl py-4 transition-all"
                  style={{
                    background: storage ? '#f0fdf4' : '#f9fafb',
                    border: `2.5px solid ${storage ? '#86efac' : '#e5e7eb'}`,
                    color: storage ? '#15803d' : '#9ca3af',
                    fontSize: 16,
                    fontWeight: 800,
                    transform: storage ? 'scale(1.03)' : 'scale(1)',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: 28, marginBottom: 4 }}>✅</span>
                  {t.yes}
                </button>
                <button
                  onClick={() => setStorage(false)}
                  className="flex-1 flex flex-col items-center rounded-2xl py-4 transition-all"
                  style={{
                    background: !storage ? '#fef2f2' : '#f9fafb',
                    border: `2.5px solid ${!storage ? '#fecaca' : '#e5e7eb'}`,
                    color: !storage ? '#dc2626' : '#9ca3af',
                    fontSize: 16,
                    fontWeight: 800,
                    transform: !storage ? 'scale(1.03)' : 'scale(1)',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: 28, marginBottom: 4 }}>❌</span>
                  {t.no}
                </button>
              </div>
            </div>

            {/* Summary */}
            <div
              className="rounded-2xl p-4"
              style={{ background: '#f0fdf4', border: '2px solid #86efac' }}
            >
              <p style={{ fontSize: 13, color: '#15803d', fontWeight: 800, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} /> Your Farm Summary
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { icon: '👤', label: nameInput.trim() || 'Farmer' },
                  { icon: '📍', label: `${selState} · ${selDistrict}` },
                  { icon: CROPS.find(c => c.key === selCropKey)?.emoji || '🌿', label: t[selCropKey as keyof typeof t] as string },
                  { icon: '🌾', label: `${size} ${t.acres}` },
                  { icon: '📦', label: storage ? `Storage ✅` : `No Storage ❌` },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span style={{ fontSize: 16 }}>{item.icon}</span>
                    <span style={{ fontSize: 14, color: '#166534', fontWeight: 600 }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div className="px-4 pb-8 pt-3" style={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
        <button
          onClick={handleNext}
          disabled={!canNext}
          className="w-full rounded-2xl flex items-center justify-center gap-2 transition-all active:opacity-80"
          style={{
            padding: '18px 24px',
            background: canNext ? '#14532d' : '#e5e7eb',
            color: canNext ? 'white' : '#9ca3af',
            fontSize: 17,
            fontWeight: 800,
            border: 'none',
            boxShadow: canNext ? '0 4px 16px rgba(20,83,45,0.30)' : 'none',
            transition: 'all 0.3s',
          }}
        >
          {step === 4 ? t.continueDashboard : `${t.next} →`}
        </button>
      </div>
    </div>
  );
}