import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STATE_DISTRICTS, LANGUAGES, Language } from '../data/translations';

const CROPS = [
  { key: 'cotton', emoji: '🌿', color: '#f0fdf4', border: '#86efac', darkColor: '#15803d' },
  { key: 'soybean', emoji: '🫘', color: '#fefce8', border: '#fcd34d', darkColor: '#b45309' },
  { key: 'rice', emoji: '🌾', color: '#fff7ed', border: '#fdba74', darkColor: '#c2410c' },
  { key: 'wheat', emoji: '🌻', color: '#fefce8', border: '#fde68a', darkColor: '#d97706' },
];

function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all"
          style={{
            width: i === step - 1 ? 28 : 10,
            height: 10,
            background: i < step ? '#14532d' : '#e5e7eb',
          }}
        />
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { t, language, setLanguage, setStateVal, setDistrict, setCrop, setFarmSize, setHasStorage } = useApp();

  const [step, setStep] = useState(1);
  const [detecting, setDetecting] = useState(false);
  const [detected, setDetected] = useState(false);
  const [selState, setSelState] = useState('Maharashtra');
  const [selDistrict, setSelDistrict] = useState('Nagpur');
  const [selCropKey, setSelCropKey] = useState('cotton');
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
    if (step < 3) setStep(step + 1);
    else {
      setStateVal(selState);
      setDistrict(selDistrict);
      const cropObj = CROPS.find((c) => c.key === selCropKey);
      setCrop(
        t[selCropKey as keyof typeof t] as string,
        cropObj?.emoji || '🌿'
      );
      setFarmSize(size);
      setHasStorage(storage);
      navigate('/app');
    }
  };

  return (
    <div
      className="flex flex-col"
      style={{ minHeight: '100dvh', background: '#f9fafb' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4"
        style={{ paddingTop: 16, paddingBottom: 16, background: 'white', borderBottom: '1px solid #e5e7eb' }}
      >
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center justify-center rounded-full"
              style={{ width: 36, height: 36, background: '#f0fdf4', color: '#14532d', border: 'none' }}
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div>
            <div style={{ fontSize: 13, color: '#6b7280' }}>
              {t.step} {step} {t.of} 3
            </div>
            <h2 style={{ margin: 0, color: '#14532d', fontSize: 20 }}>
              {step === 1 ? t.step1Title : step === 2 ? t.step2Title : t.step3Title}
            </h2>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code as Language)}
              className="rounded-lg"
              style={{
                padding: '5px 8px',
                fontSize: 12,
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

      {/* Progress */}
      <div className="px-4 py-3 bg-white">
        <ProgressDots step={step} total={3} />
        <p style={{ margin: '6px 0 0', fontSize: 14, color: '#6b7280' }}>
          {step === 1 ? t.step1Sub : step === 2 ? t.step2Sub : t.step3Sub}
        </p>
      </div>

      {/* Step Content */}
      <div className="flex-1 px-4 py-5 overflow-y-auto">

        {/* STEP 1: Location */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            {/* Auto Detect */}
            <button
              onClick={handleAutoDetect}
              disabled={detecting}
              className="w-full flex items-center justify-center gap-3 rounded-xl transition-all active:opacity-80"
              style={{
                padding: '18px 20px',
                background: detected ? '#f0fdf4' : '#14532d',
                color: detected ? '#15803d' : 'white',
                border: detected ? '2px solid #86efac' : '2px solid #14532d',
                fontSize: 17,
                fontWeight: 700,
              }}
            >
              {detecting ? (
                <>
                  <div
                    className="rounded-full border-2 border-white border-t-transparent animate-spin"
                    style={{ width: 22, height: 22 }}
                  />
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

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1" style={{ height: 1, background: '#e5e7eb' }} />
              <span style={{ fontSize: 13, color: '#9ca3af' }}>{t.orManual}</span>
              <div className="flex-1" style={{ height: 1, background: '#e5e7eb' }} />
            </div>

            {/* State Select */}
            <div>
              <label style={{ fontSize: 14, color: '#374151', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                {t.selectState}
              </label>
              <select
                value={selState}
                onChange={(e) => { setSelState(e.target.value); setSelDistrict(''); }}
                className="w-full rounded-xl"
                style={{
                  padding: '14px 16px',
                  fontSize: 16,
                  border: '2px solid #d1fae5',
                  background: 'white',
                  color: '#111827',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                }}
              >
                <option value="">{t.selectState}</option>
                {states.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* District Select */}
            <div>
              <label style={{ fontSize: 14, color: '#374151', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                {t.selectDistrict}
              </label>
              <select
                value={selDistrict}
                onChange={(e) => setSelDistrict(e.target.value)}
                disabled={!selState}
                className="w-full rounded-xl"
                style={{
                  padding: '14px 16px',
                  fontSize: 16,
                  border: '2px solid #d1fae5',
                  background: selState ? 'white' : '#f9fafb',
                  color: '#111827',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                }}
              >
                <option value="">{t.selectDistrict}</option>
                {districts.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* STEP 2: Crop Selection */}
        {step === 2 && (
          <div className="grid grid-cols-2 gap-4">
            {CROPS.map((crop) => {
              const isSelected = selCropKey === crop.key;
              const cropName = t[crop.key as keyof typeof t] as string;
              return (
                <button
                  key={crop.key}
                  onClick={() => setSelCropKey(crop.key)}
                  className="flex flex-col items-center justify-center rounded-2xl transition-all relative"
                  style={{
                    padding: '24px 16px',
                    background: isSelected ? crop.color : 'white',
                    border: `2.5px solid ${isSelected ? crop.border : '#e5e7eb'}`,
                    boxShadow: isSelected ? `0 4px 16px rgba(0,0,0,0.08)` : '0 1px 4px rgba(0,0,0,0.04)',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  }}
                >
                  {isSelected && (
                    <div
                      className="absolute top-2 right-2 rounded-full flex items-center justify-center"
                      style={{ width: 22, height: 22, background: crop.darkColor }}
                    >
                      <CheckCircle2 size={14} color="white" />
                    </div>
                  )}
                  <span style={{ fontSize: 48, lineHeight: 1.2, display: 'block' }}>{crop.emoji}</span>
                  <span
                    style={{
                      marginTop: 10,
                      fontSize: 17,
                      fontWeight: isSelected ? 700 : 500,
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

        {/* STEP 3: Farm Details */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            {/* Farm Size */}
            <div>
              <label
                style={{ fontSize: 15, color: '#374151', fontWeight: 600, display: 'block', marginBottom: 8 }}
              >
                {t.farmSize}
              </label>
              {/* Preset buttons */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {['1', '2', '5', '10'].map((val) => (
                  <button
                    key={val}
                    onClick={() => setSize(val)}
                    className="rounded-xl py-3 transition-all"
                    style={{
                      background: size === val ? '#14532d' : '#f3f4f6',
                      color: size === val ? 'white' : '#374151',
                      fontWeight: size === val ? 700 : 400,
                      fontSize: 16,
                      border: 'none',
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
                className="w-full rounded-xl"
                style={{
                  padding: '14px 16px',
                  fontSize: 16,
                  border: '2px solid #d1fae5',
                  background: 'white',
                  color: '#111827',
                  outline: 'none',
                }}
              />
            </div>

            {/* Storage Toggle */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'white', border: '2px solid #e5e7eb' }}
            >
              <p style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: '0 0 14px' }}>
                {t.storageAvailable}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setStorage(true)}
                  className="flex-1 rounded-xl py-4 transition-all"
                  style={{
                    background: storage ? '#14532d' : '#f3f4f6',
                    color: storage ? 'white' : '#374151',
                    fontSize: 18,
                    fontWeight: 700,
                    border: 'none',
                  }}
                >
                  ✅ {t.yes}
                </button>
                <button
                  onClick={() => setStorage(false)}
                  className="flex-1 rounded-xl py-4 transition-all"
                  style={{
                    background: !storage ? '#ef4444' : '#f3f4f6',
                    color: !storage ? 'white' : '#374151',
                    fontSize: 18,
                    fontWeight: 700,
                    border: 'none',
                  }}
                >
                  ❌ {t.no}
                </button>
              </div>
            </div>

            {/* Summary */}
            <div
              className="rounded-2xl p-4"
              style={{ background: '#f0fdf4', border: '1.5px solid #86efac' }}
            >
              <p style={{ fontSize: 13, color: '#15803d', fontWeight: 600, margin: '0 0 8px' }}>📋 Summary</p>
              <div className="flex flex-col gap-1">
                <span style={{ fontSize: 14, color: '#166534' }}>📍 {selState} · {selDistrict}</span>
                <span style={{ fontSize: 14, color: '#166534' }}>
                  {CROPS.find(c => c.key === selCropKey)?.emoji} {t[selCropKey as keyof typeof t] as string}
                </span>
                <span style={{ fontSize: 14, color: '#166534' }}>🌾 {size} {t.acres}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div className="px-4 pb-8 pt-3" style={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
        <button
          onClick={handleNext}
          disabled={step === 1 && !selState}
          className="w-full rounded-xl flex items-center justify-center gap-2 transition-opacity active:opacity-80"
          style={{
            padding: '18px 24px',
            background: '#14532d',
            color: 'white',
            fontSize: 17,
            fontWeight: 700,
            border: 'none',
            boxShadow: '0 4px 16px rgba(20,83,45,0.3)',
            opacity: step === 1 && !selState ? 0.5 : 1,
          }}
        >
          {step === 3 ? t.continueDashboard : `${t.next} →`}
        </button>
      </div>
    </div>
  );
}