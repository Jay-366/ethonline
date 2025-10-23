'use client';

import { NexusProvider as WidgetsNexusProvider } from '@avail-project/nexus-widgets';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';

interface BridgeAndExecuteSectionProps {
  children: React.ReactNode;
}

export default function BridgeAndExecuteSection({ children }: BridgeAndExecuteSectionProps) {
  const { isConnected, connector } = useAccount();
  const [provider, setProvider] = useState<any>(null);

  // Get the wallet provider when connected
  useEffect(() => {
    if (isConnected && connector) {
      connector.getProvider().then((walletProvider) => {
        setProvider(walletProvider);
      }).catch((error) => {
        console.error('Failed to get wallet provider:', error);
      });
    } else {
      setProvider(null);
    }
  }, [isConnected, connector]);

  // Only render the widget if wallet is connected and provider is available
  if (!isConnected || !provider) {
    return (
      <div className="text-center py-8">
        <p style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
          {!isConnected ? 'Please connect your wallet to use the subscription feature' : 'Initializing wallet provider...'}
        </p>
      </div>
    );
  }

  return (
    <WidgetsNexusProvider
      config={{
        environment: 'testnet',            // Use testnet for development
        defaultToChainId: 11155111,        // Ethereum Sepolia
        // Pass the wallet provider to the widgets provider
        provider: provider,
      }}
    >
      {/* Now it's safe to render widgets */}
      {children}
    </WidgetsNexusProvider>
  );
}
