'use client';

import Link from 'next/link';
import { MessageSquare, ShoppingCart, Bot, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import CurvedLoop from '../curved-loop';

export default function QuickAccessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut" as const,
      },
    },
  };

  const subtextVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.2,
        ease: "easeOut" as const,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut" as const,
      },
    },
  };

  const cards = [
    {
      href: '/chat',
      icon: MessageSquare,
      title: 'Start Chatting',
      description: 'Begin conversations with AI agents',
      color: '#fbede0',
      gradient: 'from-transparent to-transparent',
    },
    {
      href: '/marketplace',
      icon: ShoppingCart,
      title: 'Browse Agents',
      description: 'Explore the marketplace',
      color: '#fbede0',
      gradient: 'from-transparent to-transparent',
    },
    {
      href: '/agents',
      icon: Bot,
      title: 'Create Agent',
      description: 'Build your own AI agent',
      color: '#fbede0',
      gradient: 'from-transparent to-transparent',
    },
    {
      href: '/wallet',
      icon: Wallet,
      title: 'Manage Wallet',
      description: 'Handle your transactions',
      color: '#fbede0',
      gradient: 'from-transparent to-transparent',
    },
  ];

  return (
    <section className="px-6 pt-12 pb-4 relative overflow-hidden" ref={ref}>
      {/* Subtle background glow effect */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1), transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Animated Heading with CurvedLoop */}
        <div className="mb-16">
          <CurvedLoop 
            marqueeText="Build, Trade, and Evolve!" 
            speed={1.5}
            className="fill-[#FBede0]"
            curveAmount={0}
            direction="left"
            interactive={false}
          />
          <motion.p
            className="text-xl max-w-3xl mx-auto text-center mt-0"
            style={{ color: 'rgba(251, 237, 224, 0.8)' }}
            variants={subtextVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            Start your AI agent adventure today and unlock the next era of digital collaboration.
          </motion.p>
        </div>

        {/* Animated Cards Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.href}
                variants={cardVariants}
                className="[perspective:1000px]"
              >
                <Link href={card.href} className="block">
                  <div className="group h-[320px] w-[280px]">
                    <div className={`relative h-full rounded-[40px] bg-gradient-to-br ${card.gradient} shadow-2xl transition-all duration-500 ease-in-out [transform-style:preserve-3d] group-hover:[box-shadow:rgba(0,0,0,0.3)_30px_50px_25px_-40px,rgba(0,0,0,0.1)_0px_25px_30px_0px] group-hover:[transform:rotate3d(1,1,0,15deg)]`}>
                      {/* Glass layer */}
                      <div className="absolute inset-2 rounded-[45px] border-b border-l border-white/20 bg-gradient-to-b from-white/30 to-white/10 backdrop-blur-sm [transform-style:preserve-3d] [transform:translate3d(0,0,25px)]"></div>
                      
                      {/* Content */}
                      <div className="absolute inset-0 [transform:translate3d(0,0,26px)]">
                        <div className="flex flex-col items-center justify-center h-full px-6 py-8">
                          {/* Icon with 3D effect */}
                          <motion.div
                            className="mb-6"
                            whileHover={{ 
                              rotate: [0, -10, 10, -10, 0],
                              scale: 1.1,
                              transition: { duration: 0.5 }
                            }}
                          >
                            <div className="relative">
                              {/* Icon glow circles */}
                              {[60, 50, 40].map((size, i) => (
                                <div
                                  key={i}
                                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out"
                                  style={{
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    backgroundColor: `${card.color}20`,
                                    transform: `translate(-50%, -50%) translate3d(0, 0, ${(i + 1) * -5}px)`,
                                    transitionDelay: `${i * 100}ms`,
                                  }}
                                ></div>
                              ))}
                              <Icon 
                                className="h-16 w-16 relative z-10 transition-all duration-300" 
                                style={{ 
                                  color: '#FBede0',
                                  filter: 'drop-shadow(0 0 10px rgba(251, 237, 224, 0.3))',
                                }}
                              />
                            </div>
                          </motion.div>
                          
                          {/* Title */}
                          <h3 className="text-2xl font-bold text-center mb-3" style={{ color: '#FBede0' }}>
                            {card.title}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-sm text-center leading-relaxed" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                            {card.description}
                          </p>
                        </div>
                      </div>

                      {/* Decorative circles in corner */}
                      <div className="absolute top-0 right-0 [transform-style:preserve-3d]">
                        {[
                          { size: "80px", pos: "5px", z: "20px", delay: "0s" },
                          { size: "60px", pos: "10px", z: "40px", delay: "0.2s" },
                          { size: "40px", pos: "15px", z: "60px", delay: "0.4s" },
                        ].map((circle, i) => (
                          <div
                            key={i}
                            className="absolute aspect-square rounded-full bg-white/10 shadow-[rgba(100,100,111,0.2)_-10px_10px_20px_0px] transition-all duration-500 ease-in-out"
                            style={{
                              width: circle.size,
                              top: circle.pos,
                              right: circle.pos,
                              transform: `translate3d(0, 0, ${circle.z})`,
                              transitionDelay: circle.delay,
                            }}
                          ></div>
                        ))}
                      </div>

                      {/* Bottom accent indicator */}
                      <div 
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full transition-all duration-500 [transform:translate3d(-50%,0,26px)]"
                        style={{ 
                          backgroundColor: card.color,
                          boxShadow: `0 0 20px ${card.color}`,
                        }}
                      ></div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}