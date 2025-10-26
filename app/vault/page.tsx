'use client';

import Navbar from '@/components/layout/Navbar';
import VaultWithdrawCard from '@/components/vault/VaultWithdrawCard';

export default function VaultPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#161823' }}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-5xl font-bold mb-4"
            style={{ color: '#FBede0' }}
          >
            PublicDataCoinVault
          </h1>
          <p 
            className="text-xl max-w-2xl mx-auto"
            style={{ color: 'rgba(251, 237, 224, 0.7)' }}
          >
            Bridge USDC to Sepolia and automatically withdraw FormDataCoin tokens from the public vault
          </p>
        </div>

        {/* Vault Card */}
        <div className="flex justify-center">
          <VaultWithdrawCard />
        </div>

        {/* Info Section */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div 
            className="p-6 rounded-2xl"
            style={{ 
              backgroundColor: '#1C1F2B',
              border: '1px solid #50606C'
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#FBede0' }}>
              How it works
            </h3>
            <div className="space-y-3 text-sm" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
              <div className="flex items-start gap-3">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: 'rgba(251, 237, 224, 0.1)' }}
                >
                  <span style={{ color: '#FBede0', fontSize: '12px', fontWeight: 'bold' }}>1</span>
                </div>
                <p>
                  <strong style={{ color: '#FBede0' }}>Bridge:</strong> Your USDC is bridged from your current chain to Sepolia testnet using Avail Nexus.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: 'rgba(251, 237, 224, 0.1)' }}
                >
                  <span style={{ color: '#FBede0', fontSize: '12px', fontWeight: 'bold' }}>2</span>
                </div>
                <p>
                  <strong style={{ color: '#FBede0' }}>Execute:</strong> Once bridged, the PublicDataCoinVault contract automatically executes the withdrawal.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: 'rgba(251, 237, 224, 0.1)' }}
                >
                  <span style={{ color: '#FBede0', fontSize: '12px', fontWeight: 'bold' }}>3</span>
                </div>
                <p>
                  <strong style={{ color: '#FBede0' }}>Receive:</strong> FormDataCoin tokens are transferred directly to your wallet address.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: 'rgba(251, 237, 224, 0.05)' }}>
              <p className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.8)' }}>
                <strong style={{ color: '#FBede0' }}>⚠️ Note:</strong> This is a public vault - anyone can deposit and withdraw tokens. The vault currently holds FormDataCoin tokens that can be withdrawn using this interface.
              </p>
            </div>
          </div>
        </div>

        {/* Contract Info */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#1C1F2B' }}>
            <span className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
              Vault Contract:
            </span>
            <a
              href="https://sepolia.etherscan.io/address/0xc526E6dC5ED1BAA9dBd1476E328e987387927e9f"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono hover:underline"
              style={{ color: '#FBede0' }}
            >
              0xc526...7e9f
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
