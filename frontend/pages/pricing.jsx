// File: /frontend/pages/pricing.jsx
// Dedicated Pricing & Film Production Packages Page

import React from 'react';
import { PricingPage } from '../../src/pages/PricingPage';

export default function PricingRoutePage({ currentUser, onNavigate, onOpenAuth }) {
  return (
    <PricingPage
      currentUser={currentUser}
      onNavigate={onNavigate}
      onOpenAuth={onOpenAuth}
    />
  );
}
