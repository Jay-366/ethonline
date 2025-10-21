'use client';

import { Search, Filter, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const agents = [
    {
      id: 1,
      name: 'Market Analyst Pro',
      category: 'Finance',
      rating: 4.9,
      reviews: 1240,
      price: '0.5 COIN/query',
      description: 'Advanced financial analysis and market predictions',
      trending: true,
    },
    {
      id: 2,
      name: 'Code Assistant',
      category: 'Development',
      rating: 4.8,
      reviews: 2100,
      price: '0.3 COIN/query',
      description: 'Expert code review and debugging assistance',
      trending: true,
    },
    {
      id: 3,
      name: 'Content Writer',
      category: 'Creative',
      rating: 4.7,
      reviews: 890,
      price: '0.4 COIN/query',
      description: 'Professional content creation and editing',
      trending: true,
    },
    {
      id: 4,
      name: 'Data Scientist',
      category: 'Analytics',
      rating: 4.9,
      reviews: 1500,
      price: '0.6 COIN/query',
      description: 'Statistical analysis and data visualization',
      trending: true,
    },
    {
      id: 5,
      name: 'Legal Advisor',
      category: 'Legal',
      rating: 4.6,
      reviews: 450,
      price: '0.8 COIN/query',
      description: 'Legal document review and compliance',
      trending: true,
    },
    {
      id: 6,
      name: 'SEO Optimizer',
      category: 'Marketing',
      rating: 4.8,
      reviews: 1100,
      price: '0.5 COIN/query',
      description: 'Search engine optimization and growth',
      trending: true,
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2" style={{ color: '#FBede0', fontSize: '36px' }}>
          Agent Marketplace
        </h1>
        <p style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
          Discover and deploy specialized AI agents for your needs
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8 flex gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5"
            style={{ color: 'rgba(251, 237, 224, 0.5)' }}
          />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-2xl outline-none transition-all"
            style={{
              backgroundColor: '#1C1F2B',
              border: '1px solid rgba(80, 96, 108, 0.4)',
              color: '#FBede0',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#FBede0';
              e.currentTarget.style.boxShadow = '0 0 10px rgba(251, 237, 224, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(80, 96, 108, 0.4)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
        
        <button
          className="px-6 py-4 rounded-2xl flex items-center gap-2 transition-all duration-200"
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
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {/* Category Tags */}
      <div className="mb-8 flex gap-3">
        {['All', 'Finance', 'Development', 'Creative', 'Analytics', 'Marketing'].map((category) => (
          <button
            key={category}
            className="px-5 py-2 rounded-xl transition-all duration-200"
            style={{
              backgroundColor: category === 'All' ? '#50606C' : '#1C1F2B',
              border: '1px solid rgba(80, 96, 108, 0.4)',
              color: category === 'All' ? '#FBede0' : 'rgba(251, 237, 224, 0.8)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#50606C';
              e.currentTarget.style.color = '#FBede0';
            }}
            onMouseLeave={(e) => {
              if (category !== 'All') {
                e.currentTarget.style.backgroundColor = '#1C1F2B';
                e.currentTarget.style.color = 'rgba(251, 237, 224, 0.8)';
              }
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="p-6 rounded-3xl cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: '#1C1F2B',
              border: '1px solid rgba(80, 96, 108, 0.4)',
              boxShadow: '0 0 10px rgba(251, 237, 224, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(251, 237, 224, 0.2)';
              e.currentTarget.style.borderColor = '#FBede0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 10px rgba(251, 237, 224, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(80, 96, 108, 0.4)';
            }}
          >
            {/* Card Header */}
            {agent.trending && (
              <div className="flex justify-end mb-4">
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

            {/* Card Content */}
            <h3 className="mb-2" style={{ color: '#FBede0', fontSize: '20px' }}>
              {agent.name}
            </h3>
            <p className="mb-4 text-sm" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
              {agent.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 fill-current" style={{ color: '#FBede0' }} />
              <span style={{ color: '#FBede0' }}>
                {agent.rating}
              </span>
              <span className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.5)' }}>
                ({agent.reviews} reviews)
              </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'rgba(80, 96, 108, 0.4)' }}>
              <div>
                <div className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                  Price
                </div>
                <div style={{ color: '#FBede0' }}>
                  {agent.price}
                </div>
              </div>
              <Link
                href={`/agents/${agent.id}`}
                className="px-5 py-2 rounded-xl transition-all duration-200"
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
                Deploy
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
