'use client';

import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import MarketplacePreview from '@/components/sections/MarketplacePreview';
import QuickAccessSection from '@/components/sections/QuickAccessSection';
import FinalCTASection from '@/components/sections/FinalCTASection';

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#161823' }}>
      <HeroSection />
      <FeaturesSection />
      <MarketplacePreview />
      <QuickAccessSection />
      <FinalCTASection />
    </div>
  );
}