'use client';

import { CreditCard, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CheckoutPage() {
  const plan = 'monthly'; // Default plan
  const [paymentMethod, setPaymentMethod] = useState('card');

  const planDetails = {
    monthly: {
      name: 'Monthly Subscription',
      price: '$19',
      period: '/month',
      features: [
        'Unlimited chat sessions',
        'Priority response times',
        'Access to premium agents',
        'Advanced analytics dashboard',
        'Email support',
        'Cancel anytime'
      ]
    },
    payperuse: {
      name: 'Pay Per Use',
      price: '$0.50',
      period: '/session',
      features: [
        'On-demand usage',
        'Only pay when you chat',
        'No commitment required',
        'Basic analytics',
        'Standard support',
        'Prepaid credits available'
      ]
    }
  };

  const currentPlan = planDetails[plan as keyof typeof planDetails];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#161823' }}>
    <div className="max-w-4xl mx-auto px-8 py-8">
      {/* Back Button */}
      <Link
        href="/subscribe"
        className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-xl transition-all duration-200"
        style={{
          backgroundColor: '#1C1F2B',
          border: '1px solid rgba(80, 96, 108, 0.4)',
          color: '#FBede0',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#50606C';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#1C1F2B';
        }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Plans
      </Link>

      <div className="grid grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <h1 className="mb-6" style={{ color: '#FBede0', fontSize: '32px' }}>
            Complete Your Order
          </h1>

          <div
            className="p-6 rounded-3xl mb-6"
            style={{
              backgroundColor: '#1C1F2B',
              border: '1px solid rgba(80, 96, 108, 0.4)',
            }}
          >
            <h2 className="mb-4" style={{ color: '#FBede0', fontSize: '20px' }}>
              Order Summary
            </h2>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <div style={{ color: '#FBede0' }}>{currentPlan.name}</div>
                <div className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                  Billed {plan === 'monthly' ? 'monthly' : 'per session'}
                </div>
              </div>
              <div style={{ color: '#FBede0', fontSize: '20px' }}>
                {currentPlan.price}
                <span className="text-sm" style={{ opacity: 0.7 }}>
                  {currentPlan.period}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4" style={{ color: '#FBede0' }} />
                  <span className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div
            className="p-6 rounded-3xl"
            style={{
              backgroundColor: '#1C1F2B',
              border: '1px solid rgba(80, 96, 108, 0.4)',
            }}
          >
            <h2 className="mb-4" style={{ color: '#FBede0', fontSize: '20px' }}>
              Payment Method
            </h2>

            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer"
                style={{
                  backgroundColor: paymentMethod === 'card' ? 'rgba(251, 237, 224, 0.1)' : 'transparent',
                  border: '1px solid rgba(80, 96, 108, 0.4)',
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="sr-only"
                />
                <CreditCard className="w-5 h-5" style={{ color: '#FBede0' }} />
                <span style={{ color: '#FBede0' }}>Credit Card</span>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer"
                style={{
                  backgroundColor: paymentMethod === 'crypto' ? 'rgba(251, 237, 224, 0.1)' : 'transparent',
                  border: '1px solid rgba(80, 96, 108, 0.4)',
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  value="crypto"
                  checked={paymentMethod === 'crypto'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="sr-only"
                />
                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#FBede0' }} />
                <span style={{ color: '#FBede0' }}>Cryptocurrency</span>
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                    style={{
                      backgroundColor: '#161823',
                      border: '1px solid rgba(80, 96, 108, 0.4)',
                      color: '#FBede0',
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                      style={{
                        backgroundColor: '#161823',
                        border: '1px solid rgba(80, 96, 108, 0.4)',
                        color: '#FBede0',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                      style={{
                        backgroundColor: '#161823',
                        border: '1px solid rgba(80, 96, 108, 0.4)',
                        color: '#FBede0',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="text-center py-8">
                <div className="mb-4" style={{ color: '#FBede0' }}>
                  Connect your wallet to pay with cryptocurrency
                </div>
                <button
                  className="px-6 py-3 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: '#FBede0',
                    color: '#161823',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e8d4c5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FBede0';
                  }}
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Checkout Button */}
        <div className="flex flex-col justify-end">
          <div
            className="p-6 rounded-3xl mb-6"
            style={{
              backgroundColor: '#1C1F2B',
              border: '1px solid rgba(80, 96, 108, 0.4)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span style={{ color: 'rgba(251, 237, 224, 0.7)' }}>Subtotal</span>
              <span style={{ color: '#FBede0' }}>{currentPlan.price}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span style={{ color: 'rgba(251, 237, 224, 0.7)' }}>Tax</span>
              <span style={{ color: '#FBede0' }}>$0.00</span>
            </div>
            <div className="border-t pt-4" style={{ borderColor: 'rgba(80, 96, 108, 0.4)' }}>
              <div className="flex items-center justify-between">
                <span style={{ color: '#FBede0', fontSize: '18px' }}>Total</span>
                <span style={{ color: '#FBede0', fontSize: '18px' }}>{currentPlan.price}</span>
              </div>
            </div>
          </div>

          <Link
            href="/marketplace"
            className="w-full px-8 py-4 rounded-3xl transition-all duration-200 text-center"
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
            Complete Purchase
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
