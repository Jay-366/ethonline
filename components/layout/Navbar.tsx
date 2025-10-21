'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ConnectWalletButton from '@/components/wallet/connect-button';
import { useOptionalSimpleNexus } from '@/components/nexus/SimpleNexusProvider';
import UnifiedBalance from '@/components/unified-balance/unified-balance';

export default function Navbar() {
  const pathname = usePathname();
  const nexus = useOptionalSimpleNexus();
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);

  const nexusSDK = nexus?.nexusSDK ?? null;
  const unifiedBalance = nexus?.unifiedBalance ?? null;
  const fetchUnifiedBalance = nexus?.fetchUnifiedBalance;
  const isLoading = nexus?.loading ?? false;
  const [isBalanceOpen, setIsBalanceOpen] = useState(false);
  const balanceContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isBalanceOpen) return;
    if (!nexusSDK || !fetchUnifiedBalance) return;
    if (unifiedBalance) return;
    if (isFetchingBalance) return;

    let cancelled = false;
    setIsFetchingBalance(true);

    fetchUnifiedBalance()
      .catch((error) => {
        console.error('Failed to fetch unified balance:', error);
      })
      .finally(() => {
        if (!cancelled) {
          setIsFetchingBalance(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fetchUnifiedBalance, nexusSDK, unifiedBalance, isFetchingBalance, isBalanceOpen]);

  useEffect(() => {
    if (!isBalanceOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (balanceContainerRef.current && !balanceContainerRef.current.contains(target)) {
        setIsBalanceOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBalanceOpen]);

  useEffect(() => {
    if (!nexusSDK && isBalanceOpen) {
      setIsBalanceOpen(false);
    }
  }, [nexusSDK, isBalanceOpen]);

  const totalBalance = useMemo(() => {
    if (!unifiedBalance) return null;

    const total = unifiedBalance.reduce((sum, asset) => {
      const fiat = typeof asset.balanceInFiat === 'number' ? asset.balanceInFiat : Number(asset.balanceInFiat ?? 0);
      return sum + (Number.isFinite(fiat) ? fiat : 0);
    }, 0);

    return total.toFixed(2);
  }, [unifiedBalance]);

  const shouldShowBalance = Boolean(nexusSDK);
  const balanceDisplay = totalBalance ?? ((isFetchingBalance || isLoading) ? 'Loading...' : '--');

  const navItems = [
    { href: '/chat', label: 'Chat' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/agents', label: 'My Agents' },
    { href: '/wallet', label: 'Wallet' },
    { href: '/settings', label: 'Settings' },
  ];

  return (
    <nav
      className="w-full px-8 py-4 border-b"
      style={{
        backgroundColor: '#161823',
        borderColor: 'rgba(80, 96, 108, 0.4)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-12">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href === '/chat' && pathname === '/') ||
              (item.href === '/agents' && pathname.startsWith('/agents/'));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative py-2 px-1 text-base font-medium transition-all duration-200"
                style={{
                  color: isActive ? '#FBede0' : 'rgba(251, 237, 224, 0.7)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#FBede0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'rgba(251, 237, 224, 0.7)';
                  }
                }}
              >
                {item.label}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{
                      backgroundColor: '#FBede0',
                      boxShadow: '0 0 8px rgba(251, 237, 224, 0.3)',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center">
          {shouldShowBalance && (
            <div ref={balanceContainerRef} className="relative flex items-center mr-4">
              <button
                type="button"
                onClick={() => setIsBalanceOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                style={{
                  backgroundColor: isBalanceOpen ? 'rgba(251, 237, 224, 0.12)' : 'rgba(251, 237, 224, 0.08)',
                  color: '#FBede0',
                }}
              >
                <span style={{ letterSpacing: '0.08em' }}>Balances</span>
                <span className="text-xs opacity-80">
                  {totalBalance ? `$${totalBalance}` : balanceDisplay}
                </span>
              </button>
              {isBalanceOpen && (
                <div
                  className="absolute right-0 top-full mt-3 z-50 shadow-lg rounded-lg overflow-hidden"
                  style={{
                    width: '360px',
                    backgroundColor: '#11131a',
                    border: '1px solid rgba(80, 96, 108, 0.4)',
                  }}
                >
                  <UnifiedBalance />
                </div>
              )}
            </div>
          )}
          <ConnectWalletButton className="wallet-button" />
        </div>
      </div>
    </nav>
  );
}
