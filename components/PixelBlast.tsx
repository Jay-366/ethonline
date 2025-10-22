'use client';

import { useRef, useEffect, CSSProperties } from 'react';

interface PixelBlastProps {
  variant?: 'circle' | 'square';
  pixelSize?: number;
  color?: string;
  patternScale?: number;
  patternDensity?: number;
  liquid?: boolean;
  liquidStrength?: number;
  enableRipples?: boolean;
  rippleIntensityScale?: number;
  rippleThickness?: number;
  rippleSpeed?: number;
  speed?: number;
  edgeFade?: number;
  transparent?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function PixelBlast({
  variant = 'circle',
  pixelSize = 2,
  color = '#ffffff',
  patternScale = 1,
  patternDensity = 0.8,
  liquid = true,
  liquidStrength = 0.15,
  enableRipples = true,
  rippleIntensityScale = 0.8,
  rippleThickness = 0.12,
  rippleSpeed = 0.25,
  speed = 0.3,
  edgeFade = 0,
  transparent = false,
  className = '',
  style = {},
}: PixelBlastProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation variables
    let time = 0;
    let animationId: number;

    // Point interface
    interface Point {
      x: number;
      y: number;
      originX: number;
      originY: number;
      offset: number;
    }

    // Create points for the effect
    const points: Point[] = [];
    const gridSize = pixelSize * (5 - patternDensity * 4);
    const cols = Math.floor(canvas.width / gridSize) + 1;
    const rows = Math.floor(canvas.height / gridSize) + 1;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        points.push({
          x: i * gridSize * patternScale,
          y: j * gridSize * patternScale,
          originX: i * gridSize * patternScale,
          originY: j * gridSize * patternScale,
          // Add randomness
          offset: Math.random() * 1000,
        });
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (!transparent) {
        ctx.fillStyle = '#161823'; // Background color matching the theme
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Update and draw points
      points.forEach((point) => {
        if (liquid) {
          // Add wave effect
          point.x = point.originX + Math.sin(time * speed + point.offset) * liquidStrength * 50;
          point.y = point.originY + Math.cos(time * speed + point.offset) * liquidStrength * 50;
        }

        // Draw the pixel
        ctx.fillStyle = color;
        
        if (variant === 'circle') {
          ctx.beginPath();
          ctx.arc(point.x, point.y, pixelSize, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(
            point.x - pixelSize / 2, 
            point.y - pixelSize / 2, 
            pixelSize, 
            pixelSize
          );
        }
        
        // Draw ripples if enabled
        if (enableRipples) {
          const rippleSize = (Math.sin(time * rippleSpeed + point.offset) + 1) * 5 * rippleIntensityScale;
          if (rippleSize > 0) {
            ctx.strokeStyle = color;
            ctx.globalAlpha = Math.max(0, 1 - rippleSize / 5);
            ctx.lineWidth = rippleThickness;
            
            ctx.beginPath();
            if (variant === 'circle') {
              ctx.arc(point.x, point.y, pixelSize + rippleSize, 0, Math.PI * 2);
            } else {
              // Draw square ripple
              const rippleOffset = rippleSize + pixelSize / 2;
              ctx.rect(
                point.x - rippleOffset, 
                point.y - rippleOffset, 
                rippleOffset * 2, 
                rippleOffset * 2
              );
            }
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      });
      
      time += 0.01;
      animationId = requestAnimationFrame(animate);
    };
    
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [
    variant, 
    pixelSize, 
    color, 
    patternScale, 
    patternDensity, 
    liquid, 
    liquidStrength, 
    enableRipples, 
    rippleIntensityScale, 
    rippleThickness, 
    rippleSpeed, 
    speed, 
    transparent
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        ...style,
      }}
    />
  );
}