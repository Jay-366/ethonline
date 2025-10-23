'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const AnimatedNavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) => {
  const defaultTextColor = isActive ? 'text-[#FBede0]' : 'text-[rgba(251,237,224,0.7)]';
  const hoverTextColor = 'text-[#FBede0]';
  const textSizeClass = 'text-sm';

  return (
    <Link href={href} className={`group relative inline-block overflow-hidden h-5 flex items-center ${textSizeClass}`}>
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </Link>
  );
};

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/chat', label: 'Chat' },
    { href: '/agents', label: 'My Agents' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/wallet', label: 'Wallet' },
  ];

  const logoElement = (
    <Link href="/" className="flex items-center">
      <Image
        src="/logo.svg"
        alt="Intellitrade Logo"
        width={30}
        height={30}
        className="w-8 h-8"
      />
    </Link>
  );

  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50
                       flex flex-col items-center
                       px-4 py-2.5 backdrop-blur-sm
                       rounded-full
                       border border-[rgba(251,237,224,0.2)] bg-[rgba(22,24,35,0.9)]
                       w-[calc(100%-2rem)] sm:w-auto
                       transition-[border-radius] duration-300 ease-in-out shadow-lg`}>

      <div className="flex items-center justify-between w-full gap-x-3 sm:gap-x-4">
        <div className="flex items-center">
           {logoElement}
        </div>

        <nav className="hidden sm:flex items-center space-x-4 text-sm">
          {navItems.map((link) => {
            const isActive = pathname === link.href || 
              (link.href === '/agents' && pathname.startsWith('/agents/'));
            
            return (
              <AnimatedNavLink key={link.href} href={link.href} isActive={isActive}>
                {link.label}
              </AnimatedNavLink>
            );
          })}
        </nav>

        <div className="hidden sm:flex items-center gap-1.5">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          type="button"
                          className="px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200"
                          style={{
                            backgroundColor: '#FBede0',
                            color: '#161823',
                          }}
                        >
                          Connect Wallet
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200"
                          style={{
                            backgroundColor: '#ff4444',
                            color: '#ffffff',
                          }}
                        >
                          Wrong network
                        </button>
                      );
                    }

                    return (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="px-2.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap"
                          style={{
                            backgroundColor: 'rgba(251, 237, 224, 0.1)',
                            color: '#FBede0',
                            border: '1px solid rgba(251, 237, 224, 0.2)',
                          }}
                        >
                          {chain.name}
                        </button>

                        <button
                          onClick={openAccountModal}
                          type="button"
                          className="px-2.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap"
                          style={{
                            backgroundColor: '#FBede0',
                            color: '#161823',
                          }}
                        >
                          {account.displayName}
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ''}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </header>
  );
}