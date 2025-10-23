'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

interface SmoothScrollWrapperProps {
  children: React.ReactNode;
}

export default function SmoothScrollWrapper({ children }: SmoothScrollWrapperProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Register GSAP plugins
      gsap.registerPlugin(ScrollTrigger, ScrollSmoother, DrawSVGPlugin);
      
      let smoother: any;
      
      const ctx = gsap.context(() => {
        // Create ScrollSmoother instance
        smoother = ScrollSmoother.create({
          smooth: 2, 
          effects: true
        });
        
        // Track animation state
        let animationProgress = 0;
        const maxProgress = 1;
        const progressStep = 0.015; // Adjust for sensitivity
        let isAtHeroSection = true;
        let canScrollAway = false;

        // Check if user is at hero section
        const checkHeroPosition = () => {
          const heroSection = document.querySelector('.hero-section');
          if (!heroSection) return false;
          const rect = heroSection.getBoundingClientRect();
          return rect.top >= -100 && rect.top <= 100; // Within tolerance
        };

        const handleScroll = (e: WheelEvent | TouchEvent) => {
          isAtHeroSection = checkHeroPosition();
          
          // Only intercept scroll when at hero section and animation not complete
          if (!isAtHeroSection || canScrollAway) {
            return; // Allow normal scrolling
          }

          let delta = 0;
          if (e instanceof WheelEvent) {
            delta = e.deltaY > 0 ? 1 : -1;
          } else if (e instanceof TouchEvent && e.touches.length === 1) {
            delta = 1;
          }

          // Only prevent default if we're intercepting the scroll
          if (delta > 0 || (delta < 0 && animationProgress > 0)) {
            e.preventDefault();
            e.stopPropagation();
          }

          // Update animation progress
          if (delta > 0 && animationProgress < maxProgress) {
            animationProgress = Math.min(maxProgress, animationProgress + progressStep);
          } else if (delta < 0 && animationProgress > 0) {
            animationProgress = Math.max(0, animationProgress - progressStep);
          }

          // Animate the SVG circle
          gsap.to('.draw', {
            drawSVG: `0% ${animationProgress * 100}%`,
            duration: 0.1,
            ease: "none"
          });

          // Check if animation is complete
          if (animationProgress >= maxProgress && !canScrollAway) {
            canScrollAway = true;
            
            // Allow scrolling away after completion
            setTimeout(() => {
              const nextSection = document.querySelector('.hero-section')?.nextElementSibling;
              if (nextSection && delta > 0) {
                window.scrollBy({ top: window.innerHeight * 0.3, behavior: 'smooth' });
              }
            }, 300);
          }

          // Reset if scrolling back up and progress is low
          if (delta < 0 && animationProgress < 0.1) {
            canScrollAway = false;
          }
        };

        // Add scroll handler
        const scrollHandler = (e: Event) => handleScroll(e as WheelEvent | TouchEvent);
        document.addEventListener('wheel', scrollHandler, { passive: false });
        document.addEventListener('touchmove', scrollHandler, { passive: false });
        
        // Refresh ScrollTrigger on resize
        const handleResize = () => {
          ScrollTrigger.refresh();
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
          // Cleanup scroll listeners
          document.removeEventListener('wheel', scrollHandler);
          document.removeEventListener('touchmove', scrollHandler);
        };
      });

      return () => {
        ctx.revert();
        if (smoother) smoother.kill();
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }
  }, []);

  return (
    <div id="smooth-wrapper" className="smooth-wrapper">
      <div id="smooth-content" className="smooth-content">
        {children}
      </div>
    </div>
  );
}