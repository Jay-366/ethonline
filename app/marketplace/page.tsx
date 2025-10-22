'use client';

import { Search, Filter, TrendingUp, Star } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AgentCard from '@/components/marketplace/AgentCard';
import AgentFilters from '@/components/marketplace/AgentFilters';
import PricingBadge from '@/components/marketplace/PricingBadge';

// Define Agent interface that works with both the page and components
interface Agent {
  id: string | number;
  name: string;
  description: string;
  price: number | string;
  rating: number;
  category: string;
  image?: string;
  reviews?: number;
  trending?: boolean;
}

// Move agents data outside component to prevent recreation
const AGENTS_DATA: Agent[] = [
  {
    id: "1",
    name: 'Market Analyst Pro',
    category: 'Finance',
    rating: 4.9,
    reviews: 1240,
    price: 0.5,
    description: 'Advanced financial analysis and market predictions',
    trending: true,
  },
  {
    id: "2",
    name: 'Code Assistant',
    category: 'Development',
    rating: 4.8,
    reviews: 2100,
    price: 0.3,
    description: 'Expert code review and debugging assistance',
    trending: true,
  },
  {
    id: "3",
    name: 'Content Writer',
    category: 'Creative',
    rating: 4.7,
    reviews: 890,
    price: 0.4,
    description: 'Professional content creation and editing',
    trending: true,
  },
  {
    id: "4",
    name: 'Data Scientist',
    category: 'Analytics',
    rating: 4.9,
    reviews: 1500,
    price: 0.6,
    description: 'Statistical analysis and data visualization',
    trending: true,
  },
  {
    id: "5",
    name: 'Legal Advisor',
    category: 'Legal',
    rating: 4.6,
    reviews: 450,
    price: 0.8,
    description: 'Legal document review and compliance',
    trending: false,
  },
  {
    id: "6",
    name: 'SEO Optimizer',
    category: 'Marketing',
    rating: 4.8,
    reviews: 1100,
    price: 0.5,
    description: 'Search engine optimization and growth',
    trending: false,
  },
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    priceRange: [0, 1000] as [number, number],
    rating: 0,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter agents based on search query and filters using useMemo
  const filteredAgents = useMemo(() => {
    let result = AGENTS_DATA;
    
    // Apply search query filter
    if (searchQuery) {
      result = result.filter((agent: Agent) => 
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (activeFilters.category) {
      result = result.filter((agent: Agent) => agent.category === activeFilters.category);
    }
    
    // Apply rating filter
    if (activeFilters.rating > 0) {
      result = result.filter((agent: Agent) => agent.rating >= activeFilters.rating);
    }
    
    return result;
  }, [searchQuery, activeFilters]);

  // Handle agent selection
  const handleSelectAgent = (agent: Agent) => {
    // Navigate to agent details page or handle selection
    window.location.href = `/agents/${agent.id}`;
  };

  // Handle filter changes
  const handleFiltersChange = (filters: {
    category: string;
    priceRange: [number, number];
    rating: number;
  }) => {
    setActiveFilters(filters);
  };

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

      <div className="flex gap-6">
        {/* Sidebar with Filters */}
        {showFilters && (
          <div className="w-1/4 transition-all duration-300">
            <div 
              className="rounded-2xl p-6"
              style={{
                backgroundColor: '#1C1F2B',
                border: '1px solid rgba(80, 96, 108, 0.4)',
              }}
            >
              <h3 className="text-xl mb-6" style={{ color: '#FBede0' }}>Filters</h3>
              <AgentFilters onFiltersChange={handleFiltersChange} />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={showFilters ? "w-3/4" : "w-full"}>
          {/* Search Bar */}
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
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-4 rounded-2xl flex items-center gap-2 transition-all duration-200"
              style={{
                backgroundColor: showFilters ? '#50606C' : '#1C1F2B',
                border: '1px solid rgba(80, 96, 108, 0.4)',
                color: '#FBede0',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#50606C';
              }}
              onMouseLeave={(e) => {
                if (!showFilters) {
                  e.currentTarget.style.backgroundColor = '#1C1F2B';
                }
              }}
            >
              <Filter className="w-5 h-5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Category Tags */}
          <div className="mb-8 flex gap-3 flex-wrap">
            {['All', 'Finance', 'Development', 'Creative', 'Analytics', 'Marketing', 'Legal'].map((category) => (
              <button
                key={category}
                onClick={() => handleFiltersChange({ 
                  ...activeFilters, 
                  category: category === 'All' ? '' : category 
                })}
                className="px-5 py-2 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: 
                    (category === 'All' && !activeFilters.category) || 
                    category === activeFilters.category ? '#50606C' : '#1C1F2B',
                  border: '1px solid rgba(80, 96, 108, 0.4)',
                  color: 
                    (category === 'All' && !activeFilters.category) || 
                    category === activeFilters.category ? '#FBede0' : 'rgba(251, 237, 224, 0.8)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#50606C';
                  e.currentTarget.style.color = '#FBede0';
                }}
                onMouseLeave={(e) => {
                  if ((category !== 'All' || activeFilters.category) && 
                      category !== activeFilters.category) {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(filteredAgents.length > 0 ? filteredAgents : AGENTS_DATA).map((agent: Agent) => (
              <div
                key={agent.id}
                className="p-6 rounded-3xl transition-all duration-200"
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
                  <Star className="w-4 h-4 fill-current text-yellow-500" />
                  <span style={{ color: '#FBede0' }}>
                    {agent.rating}
                  </span>
                  {agent.reviews && (
                    <span className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.5)' }}>
                      ({agent.reviews} reviews)
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'rgba(80, 96, 108, 0.4)' }}>
                  <div>
                    <div className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                      Price
                    </div>
                    <div style={{ color: '#FBede0' }}>
                      {typeof agent.price === 'number' ? 
                        `${agent.price} COIN/query` : 
                        agent.price}
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
      </div>
    </div>
  );
}
