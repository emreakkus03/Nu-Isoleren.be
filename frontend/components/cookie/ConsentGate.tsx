'use client';

import type { ReactNode } from 'react';
import { useConsent } from './useConsent';

export default function ConsentGate({ category, children }: {
  category: 'analytics' | 'marketing';
  children: ReactNode;
}) {
  const { ready, preferences } = useConsent();
  return ready && preferences[category] ? children : null;
}
