'use client';

import { Check, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function SubscribePage() {
  const [activeView, setActiveView] = useState<'monthly' | 'payperuse'>('monthly');

  const faqs = [
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.',
    },
    {
      question: 'Is my data stored securely?',
      answer: 'Absolutely. All data is encrypted and stored on secure servers. We never share your information with third parties.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, as well as cryptocurrency wallets for Web3 payments.',
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="mb-4" style={{ color: '#FBede0', fontSize: '48px' }}>
          Choose Your Plan
        </h1>
        <p className="text-xl" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
          Pick the best way to interact with your favorite AI agents
        </p>
      </div>

      {/* Toggle Tabs */}
      <div className="flex justify-center mb-12">
        <div
          className="inline-flex p-2 rounded-2xl"
          style={{ backgroundColor: '#1C1F2B', border: '1px solid rgba(80, 96, 108, 0.4)' }}
        >
          <button
            onClick={() => setActiveView('monthly')}
            className="px-8 py-3 rounded-xl transition-all duration-200 relative"
            style={{
              backgroundColor: activeView === 'monthly' ? '#50606C' : 'transparent',
              color: activeView === 'monthly' ? '#FBede0' : 'rgba(251, 237, 224, 0.7)',
            }}
          >
            Monthly
            {activeView === 'monthly' && (
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: '2px',
                  backgroundColor: '#FBede0',
                  boxShadow: '0 0 10px rgba(251, 237, 224, 0.5)',
                }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveView('payperuse')}
            className="px-8 py-3 rounded-xl transition-all duration-200 relative"
            style={{
              backgroundColor: activeView === 'payperuse' ? '#50606C' : 'transparent',
              color: activeView === 'payperuse' ? '#FBede0' : 'rgba(251, 237, 224, 0.7)',
            }}
          >
            Pay Per Use
            {activeView === 'payperuse' && (
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: '2px',
                  backgroundColor: '#FBede0',
                  boxShadow: '0 0 10px rgba(251, 237, 224, 0.5)',
                }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
        {/* Monthly Subscription Plan */}
        <div
          className="rounded-3xl p-8 transition-all duration-200"
          style={{
            backgroundColor: '#1C1F2B',
            border: activeView === 'monthly' ? '1px solid rgba(251, 237, 224, 0.3)' : '1px solid rgba(80, 96, 108, 0.4)',
            boxShadow: activeView === 'monthly' ? '0 0 20px rgba(251, 237, 224, 0.15)' : '0 0 10px rgba(251, 237, 224, 0.1)',
            transform: activeView === 'monthly' ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <div className="text-center mb-8">
            <div className="mb-2" style={{ color: '#FBede0', fontSize: '24px' }}>
              Monthly Subscription
            </div>
            <div className="mb-4" style={{ color: '#FBede0', fontSize: '48px' }}>
              $19
              <span style={{ fontSize: '20px', opacity: 0.7 }}>/month</span>
            </div>
            <div className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
              Unlimited access to all agents
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {[
              'Unlimited chat sessions',
              'Priority response times',
              'Access to premium agents',
              'Advanced analytics dashboard',
              'Email support',
              'Cancel anytime',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#50606C' }}
                >
                  <Check className="w-4 h-4" style={{ color: '#FBede0' }} />
                </div>
                <span style={{ color: 'rgba(251, 237, 224, 0.7)' }}>{feature}</span>
              </div>
            ))}
          </div>

          <Link
            href="/checkout?plan=monthly"
            className="w-full px-8 py-4 rounded-3xl transition-all duration-200 block text-center"
            style={{
              backgroundColor: '#FBede0',
              color: '#161823',
              boxShadow: '0 0 16px rgba(251, 237, 224, 0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 24px rgba(251, 237, 224, 0.3)';
              e.currentTarget.style.backgroundColor = '#e8d4c5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 16px rgba(251, 237, 224, 0.25)';
              e.currentTarget.style.backgroundColor = '#FBede0';
            }}
          >
            Subscribe Now
          </Link>
        </div>

        {/* Pay Per Use Plan */}
        <div
          className="rounded-3xl p-8 transition-all duration-200"
          style={{
            backgroundColor: '#1C1F2B',
            border: activeView === 'payperuse' ? '1px solid rgba(251, 237, 224, 0.3)' : '1px solid rgba(80, 96, 108, 0.4)',
            boxShadow: activeView === 'payperuse' ? '0 0 20px rgba(251, 237, 224, 0.15)' : '0 0 10px rgba(251, 237, 224, 0.1)',
            transform: activeView === 'payperuse' ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <div className="text-center mb-8">
            <div className="mb-2" style={{ color: '#FBede0', fontSize: '24px' }}>
              Pay Per Use
            </div>
            <div className="mb-4" style={{ color: '#FBede0', fontSize: '48px' }}>
              $0.50
              <span style={{ fontSize: '20px', opacity: 0.7 }}>/session</span>
            </div>
            <div className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
              Perfect for occasional users
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {[
              { icon: '⚡', text: 'On-demand usage' },
              { icon: '💬', text: 'Only pay when you chat' },
              { icon: '🔓', text: 'No commitment required' },
              { icon: '📊', text: 'Basic analytics' },
              { icon: '✉️', text: 'Standard support' },
              { icon: '💳', text: 'Prepaid credits available' },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                  style={{ backgroundColor: '#50606C' }}
                >
                  {feature.icon}
                </div>
                <span style={{ color: 'rgba(251, 237, 224, 0.7)' }}>{feature.text}</span>
              </div>
            ))}
          </div>

          <Link
            href="/checkout?plan=payperuse"
            className="w-full px-8 py-4 rounded-3xl transition-all duration-200 block text-center"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #FBede0',
              color: '#FBede0',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#50606C';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Start Now
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-center mb-8" style={{ color: '#FBede0', fontSize: '32px' }}>
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-3xl p-6"
              style={{
                backgroundColor: '#1C1F2B',
                borderBottom: index < faqs.length - 1 ? '1px solid rgba(80, 96, 108, 0.4)' : 'none',
              }}
            >
              <div className="flex items-start gap-3 mb-3">
                <HelpCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#FBede0' }} />
                <div style={{ color: '#FBede0', fontSize: '18px' }}>
                  {faq.question}
                </div>
              </div>
              <p className="pl-8" style={{ color: 'rgba(251, 237, 224, 0.8)' }}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
