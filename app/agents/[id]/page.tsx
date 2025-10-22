'use client';

import { Star, TrendingUp, ArrowLeft, MessageCircle, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AgentDetailsPage() {
  const params = useParams();
  const agentId = params.id;

  // Mock agent data - in a real app, this would come from an API
  const agent = {
    id: agentId,
    name: 'Market Analyst Pro',
    category: 'Finance',
    rating: 4.9,
    reviews: 1240,
    price: '0.5 COIN/query',
    description: 'Advanced financial analysis and market predictions with real-time data processing and AI-powered insights.',
    longDescription: 'Market Analyst Pro is a sophisticated AI agent designed to provide comprehensive financial analysis and market predictions. It leverages advanced machine learning algorithms to process real-time market data, analyze trends, and generate actionable insights for traders, investors, and financial professionals.',
    trending: true,
    features: [
      'Real-time market data analysis',
      'Technical indicator calculations',
      'Risk assessment and portfolio optimization',
      'News sentiment analysis',
      'Custom alert systems',
      'Historical data backtesting'
    ],
    creator: 'FinanceAI Labs',
    lastUpdated: '2 days ago',
    totalQueries: '15,420',
    successRate: '98.5%'
  };

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-8">
      {/* Back Button */}
      <Link
        href="/marketplace"
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
        Back to Marketplace
      </Link>

      <div className="grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2">
          {/* Header */}
          <div className="mb-8">
            {agent.trending && (
              <div className="flex justify-start mb-4">
                <div
                  className="px-3 py-1 rounded-lg flex items-center gap-1"
                  style={{
                    backgroundColor: 'rgba(80, 96, 108, 0.5)',
                    color: '#FBede0',
                  }}
                >
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs">Trending</span>
                </div>
              </div>
            )}

            <h1 className="mb-4" style={{ color: '#FBede0', fontSize: '36px' }}>
              {agent.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-current" style={{ color: '#FBede0' }} />
                <span style={{ color: '#FBede0' }}>{agent.rating}</span>
                <span className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.5)' }}>
                  ({agent.reviews} reviews)
                </span>
              </div>
              <div
                className="px-3 py-1 rounded-lg"
                style={{
                  backgroundColor: 'rgba(80, 96, 108, 0.3)',
                  color: '#FBede0',
                }}
              >
                {agent.category}
              </div>
            </div>

            <p className="text-lg" style={{ color: 'rgba(251, 237, 224, 0.8)' }}>
              {agent.description}
            </p>
          </div>

          {/* Long Description */}
          <div className="mb-8">
            <h2 className="mb-4" style={{ color: '#FBede0', fontSize: '24px' }}>
              About This Agent
            </h2>
            <p style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
              {agent.longDescription}
            </p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h2 className="mb-4" style={{ color: '#FBede0', fontSize: '24px' }}>
              Key Features
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {agent.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{
                    backgroundColor: '#1C1F2B',
                    border: '1px solid rgba(80, 96, 108, 0.4)',
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: '#FBede0' }}
                  />
                  <span style={{ color: 'rgba(251, 237, 224, 0.8)' }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8">
            <h2 className="mb-4" style={{ color: '#FBede0', fontSize: '24px' }}>
              Performance Stats
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div
                className="p-6 rounded-xl text-center"
                style={{
                  backgroundColor: '#1C1F2B',
                  border: '1px solid rgba(80, 96, 108, 0.4)',
                }}
              >
                <div className="text-2xl mb-2" style={{ color: '#FBede0' }}>
                  {agent.totalQueries}
                </div>
                <div className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                  Total Queries
                </div>
              </div>
              <div
                className="p-6 rounded-xl text-center"
                style={{
                  backgroundColor: '#1C1F2B',
                  border: '1px solid rgba(80, 96, 108, 0.4)',
                }}
              >
                <div className="text-2xl mb-2" style={{ color: '#FBede0' }}>
                  {agent.successRate}
                </div>
                <div className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                  Success Rate
                </div>
              </div>
              <div
                className="p-6 rounded-xl text-center"
                style={{
                  backgroundColor: '#1C1F2B',
                  border: '1px solid rgba(80, 96, 108, 0.4)',
                }}
              >
                <div className="text-2xl mb-2" style={{ color: '#FBede0' }}>
                  {agent.lastUpdated}
                </div>
                <div className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                  Last Updated
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-1">
          <div
            className="p-6 rounded-3xl sticky top-8"
            style={{
              backgroundColor: '#1C1F2B',
              border: '1px solid rgba(80, 96, 108, 0.4)',
              boxShadow: '0 0 20px rgba(251, 237, 224, 0.1)',
            }}
          >
            <div className="text-center mb-6">
              <div className="mb-2" style={{ color: '#FBede0', fontSize: '32px' }}>
                {agent.price}
              </div>
              <div className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                per query
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span style={{ color: 'rgba(251, 237, 224, 0.7)' }}>Creator</span>
                <span style={{ color: '#FBede0' }}>{agent.creator}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'rgba(251, 237, 224, 0.7)' }}>Category</span>
                <span style={{ color: '#FBede0' }}>{agent.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'rgba(251, 237, 224, 0.7)' }}>Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" style={{ color: '#FBede0' }} />
                  <span style={{ color: '#FBede0' }}>{agent.rating}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href={`/chat?agent=${agent.id}`}
                className="w-full px-6 py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
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
                <MessageCircle className="w-5 h-5" />
                Start Chat
              </Link>
              
              <button
                className="w-full px-6 py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
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
                <DollarSign className="w-5 h-5" />
                Buy Credits
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




