'use client';

import Link from 'next/link';
import { Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer 
      className="w-full py-12 mt-10"
      style={{ backgroundColor: '#161823' }}
    >
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-6">
          {/* Say Hi Section */}
          <div>
            <h3 
              className="text-xs mb-3 uppercase tracking-wider"
              style={{ color: 'rgba(251, 237, 224, 0.6)' }}
            >
              Say hi
            </h3>
            <a 
              href="mailto:info@agentmarket.com"
              className="text-base font-semibold block transition-colors hover:opacity-80"
              style={{ color: '#FBede0' }}
            >
              info@intellitrade.com
            </a>
          </div>

          {/* Links Section */}
          <div>
            <h3 
              className="text-xs mb-3 uppercase tracking-wider"
              style={{ color: 'rgba(251, 237, 224, 0.6)' }}
            >
              Links
            </h3>
            <nav className="flex flex-col gap-2">
              <Link 
                href="#faq"
                className="text-base font-semibold transition-colors hover:opacity-80"
                style={{ color: '#FBede0' }}
              >
                FAQ
              </Link>
              <Link 
                href="#contact"
                className="text-base font-semibold transition-colors hover:opacity-80"
                style={{ color: '#FBede0' }}
              >
                Contact
              </Link>
              <Link 
                href="#license"
                className="text-base font-semibold transition-colors hover:opacity-80"
                style={{ color: '#FBede0' }}
              >
                License
              </Link>
            </nav>
          </div>

          {/* Follow Us Section */}
          <div>
            <h3 
              className="text-xs mb-3 uppercase tracking-wider"
              style={{ color: 'rgba(251, 237, 224, 0.6)' }}
            >
              Follow us
            </h3>
            <div className="flex flex-col gap-2">
              <a 
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-semibold flex items-center gap-2 transition-colors hover:opacity-80"
                style={{ color: '#FBede0' }}
              >
                Linkedin
              </a>
              <a 
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-semibold flex items-center gap-2 transition-colors hover:opacity-80"
                style={{ color: '#FBede0' }}
              >
                Instagram
              </a>
                            <a 
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-semibold flex items-center gap-2 transition-colors hover:opacity-80"
                style={{ color: '#FBede0' }}
              >
                Github
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Large Brand Name - Full Width */}
      <div className="w-full px-8 text-center">
        <h2 
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight inline-block"
          style={{ 
            color: '#FBede0',
            letterSpacing: '0.07em',
            transform: 'scaleX(1.5)',
            transformOrigin: 'center'
          }}
        >
          INTELLITRADE
        </h2>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-[1440px] mx-auto px-8">
        <div 
          className="mt-8 text-sm text-center"
          style={{ color: 'rgba(251, 237, 224, 0.5)' }}
        >
          © {new Date().getFullYear()} IntelliTrade. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
