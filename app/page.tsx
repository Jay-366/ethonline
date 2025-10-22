'use client';

import HeroSection from '@/components/sections/HeroSection';
import QuickAccessSection from '@/components/sections/QuickAccessSection';
import Footer from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#161823' }}>
      <HeroSection />
      <QuickAccessSection />
      <Footer />
    </div>
  );
}