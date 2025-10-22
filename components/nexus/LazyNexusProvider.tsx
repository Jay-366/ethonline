'use client';

import { lazy, Suspense, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

// Lazy load the Nexus components
const NexusProvider = lazy(() => import('./NexusProvider'));
const InitNexusOnConnect = lazy(() => import('../wallet/InitNexusOnConnect'));

interface LazyNexusProviderProps {
  children: React.ReactNode;
}

export default function LazyNexusProvider({ children }: LazyNexusProviderProps) {
  const { isConnected } = useAccount();
  const [shouldLoadNexus, setShouldLoadNexus] = useState(false);

  useEffect(() => {
    // Only load Nexus when wallet is connected
    if (isConnected) {
      setShouldLoadNexus(true);
    }
  }, [isConnected]);

  // If wallet is not connected, just render children without Nexus
  if (!shouldLoadNexus) {
    return <>{children}</>;
  }

  // If wallet is connected, load Nexus components
  return (
    <Suspense fallback={<div>Loading Nexus SDK...</div>}>
      <NexusProvider>
        <InitNexusOnConnect />
        {children}
      </NexusProvider>
    </Suspense>
  );
}
