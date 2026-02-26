import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Home, ShoppingBasket, AlertTriangle, User, Sprout } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useApp();

  const items = [
    { path: '/app', icon: Home, label: t.home, exact: true },
    { path: '/app/harvest', icon: Sprout, label: 'Harvest', exact: false },
    { path: '/app/market', icon: ShoppingBasket, label: t.market, exact: false },
    { path: '/app/spoilage', icon: AlertTriangle, label: t.risk, exact: false },
    { path: '/app/profile', icon: User, label: t.profile, exact: false },
  ];

  return (
    <div
      style={{
        background: 'white',
        borderTop: '1px solid #f3f4f6',
        display: 'flex',
        alignItems: 'stretch',
        minHeight: 64,
        paddingBottom: 'env(safe-area-inset-bottom)',
        position: 'relative',
      }}
    >
      {items.map((item) => {
        const isActive = item.exact
          ? location.pathname === item.path
          : location.pathname === item.path;
        const Icon = item.icon;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all"
            style={{
              color: isActive ? '#14532d' : '#9ca3af',
              background: 'none',
              border: 'none',
              padding: '8px 0 6px',
              position: 'relative',
            }}
          >
            {/* Active pill background */}
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  top: 6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 40,
                  height: 32,
                  borderRadius: 16,
                  background: '#f0fdf4',
                  zIndex: 0,
                  animation: 'fadeInUp 0.2s ease',
                }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </span>
            <span style={{
              fontSize: 10,
              fontWeight: isActive ? 800 : 500,
              position: 'relative',
              zIndex: 1,
              fontFamily: 'Nunito, sans-serif',
            }}>
              {item.label}
            </span>
            {/* Active dot */}
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 4,
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: '#14532d',
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
