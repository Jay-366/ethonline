'use client';

import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useState } from 'react';

export default function WalletPage() {
  const [balance] = useState(1250.75);
  const [transactions] = useState([
    {
      id: 1,
      type: 'credit',
      amount: 500.00,
      description: 'Agent usage payment',
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: 2,
      type: 'debit',
      amount: 25.50,
      description: 'Market Analyst Pro - 51 queries',
      date: '2024-01-14',
      status: 'completed'
    },
    {
      id: 3,
      type: 'credit',
      amount: 100.00,
      description: 'Wallet top-up',
      date: '2024-01-13',
      status: 'completed'
    },
    {
      id: 4,
      type: 'debit',
      amount: 15.75,
      description: 'Code Assistant - 35 queries',
      date: '2024-01-12',
      status: 'completed'
    },
  ]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#161823' }}>
      <div className="max-w-[1440px] mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2" style={{ color: '#FBede0', fontSize: '36px' }}>
          Wallet
        </h1>
        <p style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
          Manage your credits and view transaction history
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Balance Card */}
        <div className="col-span-1">
          <div
            className="p-8 rounded-3xl"
            style={{
              backgroundColor: '#1C1F2B',
              border: '1px solid rgba(80, 96, 108, 0.4)',
              boxShadow: '0 0 20px rgba(251, 237, 224, 0.1)',
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: '#FBede0' }}
              >
                <Wallet className="w-6 h-6" style={{ color: '#161823' }} />
              </div>
              <div>
                <h2 style={{ color: '#FBede0', fontSize: '20px' }}>Total Balance</h2>
                <p className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                  Available credits
                </p>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-4xl mb-2" style={{ color: '#FBede0' }}>
                ${balance.toFixed(2)}
              </div>
              <div className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                ≈ 2,501 COIN
              </div>
            </div>

            <div className="space-y-3">
              <button
                className="w-full px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
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
                <ArrowUpRight className="w-5 h-5" />
                Add Credits
              </button>
              
              <button
                className="w-full px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #FBede0',
                  color: '#FBede0',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#50606C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <CreditCard className="w-5 h-5" />
                Payment Methods
              </button>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="col-span-2">
          <div
            className="p-6 rounded-3xl"
            style={{
              backgroundColor: '#1C1F2B',
              border: '1px solid rgba(80, 96, 108, 0.4)',
              boxShadow: '0 0 20px rgba(251, 237, 224, 0.1)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ color: '#FBede0', fontSize: '20px' }}>Recent Transactions</h2>
              <button
                className="text-sm px-4 py-2 rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(80, 96, 108, 0.3)',
                  color: '#FBede0',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(80, 96, 108, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(80, 96, 108, 0.3)';
                }}
              >
                View All
              </button>
            </div>

            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{
                    backgroundColor: '#161823',
                    border: '1px solid rgba(80, 96, 108, 0.2)',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: transaction.type === 'credit' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      }}
                    >
                      {transaction.type === 'credit' ? (
                        <ArrowDownLeft className="w-5 h-5" style={{ color: '#22c55e' }} />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" style={{ color: '#ef4444' }} />
                      )}
                    </div>
                    
                    <div>
                      <div style={{ color: '#FBede0' }}>{transaction.description}</div>
                      <div className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className="font-medium"
                      style={{
                        color: transaction.type === 'credit' ? '#22c55e' : '#ef4444',
                      }}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </div>
                    <div
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: transaction.status === 'completed' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                        color: transaction.status === 'completed' ? '#22c55e' : '#fbbf24',
                      }}
                    >
                      {transaction.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
