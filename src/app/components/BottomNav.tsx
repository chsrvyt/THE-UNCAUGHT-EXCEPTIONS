import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Home, ShoppingBasket, AlertTriangle, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useApp();

  const items = [
    { path: '/app', icon: Home, label: t.home },
    { path: '/app/market', icon: ShoppingBasket, label: t.market },
    { path: '/app/spoilage', icon: AlertTriangle, label: t.risk },
    { path: '/app/profile', icon: User, label: t.profile },
  ];

  return (
    <div
      className="bg-white border-t border-gray-200 flex items-stretch"
      style={{ minHeight: 64 }}
    >
      {items.map((item) => {
        const isActive =
          item.path === '/app'
            ? location.pathname === '/app' || location.pathname === '/app/harvest'
            : location.pathname === item.path;
        const Icon = item.icon;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
            style={{ color: isActive ? '#14532d' : '#9ca3af' }}
          >
            <Icon size={22} />
            <span style={{ fontSize: 11, fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
            {isActive && (
              <div
                className="rounded-full"
                style={{ height: 3, width: 20, backgroundColor: '#14532d', marginTop: 2 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
