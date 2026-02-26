import React from 'react';
import { Outlet } from 'react-router';
import { BottomNav } from '../components/BottomNav';

export function MainLayout() {
  return (
    <div
      className="flex flex-col"
      style={{ height: '100dvh', overflow: 'hidden' }}
    >
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
