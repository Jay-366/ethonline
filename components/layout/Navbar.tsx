'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

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
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navItems = [
    { href: '/chat', label: 'Chat' },
    { href: '/agents', label: 'My Agents' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/wallet', label: 'Wallet' },
    { href: '/settings', label: 'Settings' },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

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

  const loginButtonElement = (
    <button className="px-4 py-2 sm:px-3 text-xs sm:text-sm border border-[rgba(251,237,224,0.2)] bg-[rgba(22,24,35,0.1)] text-[#FBede0] rounded-full hover:border-[rgba(251,237,224,0.4)] hover:bg-[rgba(22,24,35,0.2)] transition-colors duration-200 w-full sm:w-auto">
      Profile
    </button>
  );

  const signupButtonElement = (
    <div className="relative group w-full sm:w-auto">
       <div className="absolute inset-0 -m-2 rounded-full
                     hidden sm:block
                     bg-[#FBede0]
                     opacity-20 filter blur-lg pointer-events-none
                     transition-all duration-300 ease-out
                     group-hover:opacity-30 group-hover:blur-xl group-hover:-m-3"></div>
       <button className="relative z-10 px-4 py-2 sm:px-3 text-xs sm:text-sm font-semibold text-[#161823] bg-gradient-to-br from-[#FBede0] to-[rgba(251,237,224,0.8)] rounded-full hover:from-[rgba(251,237,224,0.9)] hover:to-[#FBede0] transition-all duration-200 w-full sm:w-auto">
         Connect Wallet
       </button>
    </div>
  );

  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50
                       flex flex-col items-center
                       pl-6 pr-6 py-3 backdrop-blur-sm
                       ${headerShapeClass}
                       border border-[rgba(251,237,224,0.2)] bg-[rgba(22,24,35,0.9)]
                       w-[calc(100%-2rem)] sm:w-auto
                       transition-[border-radius] duration-300 ease-in-out shadow-lg`}>

      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        <div className="flex items-center">
           {logoElement}
        </div>

        <nav className="hidden sm:flex items-center space-x-4 sm:space-x-6 text-sm">
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

        <div className="hidden sm:flex items-center gap-2 sm:gap-3">
          {loginButtonElement}
          {signupButtonElement}
        </div>

        <button className="sm:hidden flex items-center justify-center w-8 h-8 text-[#FBede0] focus:outline-none" onClick={toggleMenu} aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
          {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>
      </div>

      <div className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          {navItems.map((link) => {
            const isActive = pathname === link.href || 
              (link.href === '/agents' && pathname.startsWith('/agents/'));
            
            return (
              <Link key={link.href} href={link.href} 
                className={`transition-colors w-full text-center py-2 ${
                  isActive ? 'text-[#FBede0] font-medium' : 'text-[rgba(251,237,224,0.7)] hover:text-[#FBede0]'
                }`}>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col items-center space-y-4 mt-4 w-full">
          {loginButtonElement}
          {signupButtonElement}
        </div>
        
        {/* Connect Wallet Button */}
        <div className="flex items-center">
          <ConnectButton />
        </div>
        
        {/* Connect Wallet Button */}
        <div className="flex items-center">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}