'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
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
        
        {/* Connect Wallet Button */}
        <div className="flex items-center">
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}