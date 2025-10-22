'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface SmoothScrollWrapperProps {
  children: ReactNode;
}

export default function SmoothScrollWrapper({ children }: SmoothScrollWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Optional: Add any global scroll initialization here if needed
  }, []);
  
  return (
    <div ref={containerRef} className="smooth-scroll-container">
      {children}
    </div>
  );
}