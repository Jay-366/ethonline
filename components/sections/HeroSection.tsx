import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './HeroSection.module.css';

const PixelBlast = dynamic(() => import('@/components/PixelBlast'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent" />
});

export default function HeroSection() {
  const [isMounted, setIsMounted] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    setIsMounted(true);
    
    if (typeof window !== 'undefined') {
      // Initial setup - make sure text is visible
      gsap.set(headingRef.current, { opacity: 1 });
      
      // Set initial state for SVG - let ScrollSmoother handle the animation
      if (drawRef.current) {
        gsap.set(drawRef.current, {
          drawSVG: "0%"
        });
      }

      // Text fade in animation (independent of scroll)
      if (headingRef.current) {
        gsap.fromTo(headingRef.current, 
          { 
            opacity: 0,
            y: 50
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            delay: 0.3
          }
        );
      }
    }
  }, [isMounted]);

  return (
    <section className="hero-section relative px-6 pt-16 pb-12 lg:pt-10 lg:pb-0 overflow-hidden">
      {/* PixelBlast Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {isMounted && (
          <PixelBlast
            variant="circle"
            pixelSize={2}
            color="#FBede0"
            patternScale={1.5}
            patternDensity={0.8}
            liquid={true}
            liquidStrength={0.15}
            enableRipples={true}
            rippleIntensityScale={0.8}
            rippleThickness={0.12}
            rippleSpeed={0.25}
            speed={0.3}
            edgeFade={0}
            transparent={true}
            className="w-full h-full"
            style={{ minHeight: '100%', minWidth: '100%' }}
          />
        )}
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto text-center min-h-screen flex flex-col justify-center">
        <div className="mb-6">
          <div ref={headingRef} className={`${styles.heading} heading relative z-10`}>
            <h1 className={`${styles.clampHeading} uppercase mb-6 relative`}>
              <span className={`${styles.clamp} relative`}>
                AI Agent
                <svg 
                  className={styles.clamp + " svg"}
                  viewBox="0 0 842.14 500" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    ref={drawRef}
                    className={`${styles.draw} draw`}
                    d="M336.2,130.05C261.69,118,16.52,122,20.65,244.29c4.17,123,484.3,299.8,734.57,108.37,244-186.65-337.91-311-546.54-268.47" 
                    fill="none" 
                    stroke="#FBede0" 
                    strokeMiterlimit="10" 
                    strokeWidth="8"
                  />
                </svg>
              </span>
              <span className={`${styles.yt} block relative z-10`} style={{ color: '#5d606c' }}>
                Marketplace
              </span>
            </h1>
          </div>
          <p className="text-xl lg:text-2xl mb-6 max-w-3xl mx-auto" style={{ color: 'rgba(251, 237, 224, 0.8)' }}>
            Discover, create, and trade intelligent AI agents on INTELLITRADE — building the future of autonomous collaboration.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="px-8 py-4 text-lg"
            style={{ 
              backgroundColor: '#5d606c',
              color: '#fbede0'
            }}
            asChild
          >
            <Link href="/marketplace">
              Explore Marketplace
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 px-8 py-4 text-lg"
            style={{ 
              borderColor: '#fbede0',
              color: '#161823'
            }}
            asChild
          >
            <Link href="/chat">
              Start Chatting
              <MessageSquare className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}