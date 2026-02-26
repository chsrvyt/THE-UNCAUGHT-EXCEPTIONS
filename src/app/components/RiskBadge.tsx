import React from 'react';

type RiskLevel = 'low' | 'medium' | 'high';

interface Props {
  level: RiskLevel;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

const RISK_CONFIG = {
  low: { bg: '#dcfce7', text: '#15803d', dot: '#16a34a', border: '#86efac' },
  medium: { bg: '#fef3c7', text: '#b45309', dot: '#d97706', border: '#fcd34d' },
  high: { bg: '#fee2e2', text: '#b91c1c', dot: '#dc2626', border: '#fca5a5' },
};

export function RiskBadge({ level, label, size = 'md' }: Props) {
  const cfg = RISK_CONFIG[level];
  const padding = size === 'sm' ? '4px 10px' : size === 'lg' ? '8px 20px' : '5px 14px';
  const fontSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 13;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full"
      style={{
        background: cfg.bg,
        color: cfg.text,
        border: `1.5px solid ${cfg.border}`,
        padding,
        fontSize,
        fontWeight: 700,
        letterSpacing: '0.02em',
      }}
    >
      <span
        className="rounded-full inline-block"
        style={{ width: size === 'lg' ? 10 : 8, height: size === 'lg' ? 10 : 8, background: cfg.dot, flexShrink: 0 }}
      />
      {label}
    </span>
  );
}

export function CircularRisk({ level, label }: { level: RiskLevel; label: string }) {
  const radius = 68;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const pct = level === 'low' ? 0.33 : level === 'medium' ? 0.66 : 1;
  const strokeDashoffset = circumference * (1 - pct);

  const cfg = RISK_CONFIG[level];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: 160, height: 160 }}>
      <svg width={160} height={160} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={80}
          cy={80}
        />
        <circle
          stroke={cfg.dot}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={80}
          cy={80}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span style={{ fontSize: 22, fontWeight: 800, color: cfg.text, lineHeight: 1 }}>{label}</span>
        <span style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Risk</span>
      </div>
    </div>
  );
}
