'use client';

import '@/lib/global-polyfills';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/wagmi';
import LazyNexusProvider from '@/components/nexus/LazyNexusProvider';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  // Check if WalletConnect project ID is available
  if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
    console.warn('WalletConnect Project ID not found. Wallet functionality will be limited.');
    return <>{children}</>;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <LazyNexusProvider>
            {children}
          </LazyNexusProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
