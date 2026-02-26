import React from 'react';
import { Outlet } from 'react-router';
import { BottomNav } from '../components/BottomNav';
import { ChatBot } from '../components/ChatBot';

export function MainLayout() {
  return (
    <div
      className="flex flex-col relative"
      style={{ height: '100dvh', overflow: 'hidden' }}
    >
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <BottomNav />
      <ChatBot />
    </div>
  );
}
