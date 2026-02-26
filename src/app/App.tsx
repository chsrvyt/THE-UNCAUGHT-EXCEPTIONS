import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <AppProvider>
      {/* Desktop: show phone frame centered; Mobile: full width */}
      <div
        style={{
          minHeight: '100dvh',
          background: '#d4c8b0',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 430,
            minHeight: '100dvh',
            background: 'white',
            position: 'relative',
            boxShadow: '0 0 60px rgba(0,0,0,0.25)',
          }}
        >
          <RouterProvider router={router} />
        </div>
      </div>
    </AppProvider>
  );
}