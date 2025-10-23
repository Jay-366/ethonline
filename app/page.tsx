'use client';

import Link from 'next/link';
// Fast Bridge now lives in the Wallet page
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bot, 
  Zap, 
  Shield, 
  Users, 
  ArrowRight, 
  Star,
  MessageSquare,
  ShoppingCart,
  Wallet,
  Settings
} from 'lucide-react';
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