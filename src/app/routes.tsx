import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import SplashPage from './pages/SplashPage';
import OnboardingPage from './pages/OnboardingPage';
import { MainLayout } from './pages/MainLayout';
import DashboardPage from './pages/DashboardPage';
import HarvestPage from './pages/HarvestPage';
import MarketPage from './pages/MarketPage';
import SpoilagePage from './pages/SpoilagePage';
import ProfilePage from './pages/ProfilePage';

export const router = createBrowserRouter([
  { path: '/', Component: SplashPage },
  { path: '/onboarding', Component: OnboardingPage },
  {
    path: '/app',
    Component: MainLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'harvest', Component: HarvestPage },
      { path: 'market', Component: MarketPage },
      { path: 'spoilage', Component: SpoilagePage },
      { path: 'profile', Component: ProfilePage },
    ],
  },
  { path: '*', Component: () => <Navigate to="/" replace /> },
]);