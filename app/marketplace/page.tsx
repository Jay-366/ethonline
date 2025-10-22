'use client';

import { Search, Filter, TrendingUp, Star } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AgentCard } from '@/components/marketplace/AgentCard';
import AgentFilters from '@/components/marketplace/AgentFilters';
import { CategoryHeader } from '@/components/marketplace/CategoryHeader';

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
    name: 'Jotform AI',
    category: 'Customer Service',
    rating: 4.3,
    reviews: 2236,
    price: 0.012,
    description: 'Jotform AI Agents revolutionize customer service by automating support across multiple channels. These dynamic AI agents can instantly engage with customers and resolve queries.',
    trending: true,
  },
  {
    id: "2",
    name: 'Phala Network',
    category: 'Infrastructure',
    rating: 4.3,
    reviews: 2236,
    price: 0.009,
    description: 'Secure, trustless AI computing without compromise. Deploy AI agents on decentralized infrastructure with built-in privacy protection.',
    trending: true,
  },
  {
    id: "3",
    name: 'AgentOps',
    category: 'Development',
    rating: 4.3,
    reviews: 2236,
    price: 0.012,
    description: 'Unleash reliable AI agents with comprehensive testing and optimization. Monitor, debug, and improve your AI agent performance in production.',
    trending: true,
  },
  {
    id: "4",
    name: 'Dify',
    category: 'Workflow',
    rating: 4.3,
    reviews: 2236,
    price: 0.012,
    description: 'Build powerful AI agents and workflows in minutes. Visual agent builder with pre-built templates and integrations.',
    trending: true,
  },
  {
    id: "5",
    name: 'Oovol',
    category: 'Testing',
    rating: 4.3,
    reviews: 2236,
    price: 0.012,
    description: 'Ship reliable AI agents faster with comprehensive simulation and testing environments before deployment.',
    trending: false,
  },
  {
    id: "6",
    name: 'Neets.ai',
    category: 'Voice',
    rating: 4.3,
    reviews: 2236,
    price: 0.018,
    description: 'Build powerful voice AI agents with natural conversations. Real-time speech processing and multi-language support.',
    trending: false,
  },
  {
    id: "7",
    name: 'Potpie AI',
    category: 'Code Assistant',
    rating: 4.3,
    reviews: 2239,
    price: 0.012,
    description: 'Build custom AI coding agents that understand your entire codebase. Automated code review, bug detection, and documentation.',
    trending: false,
  },
  {
    id: "8",
    name: 'Jasper AI',
    category: 'Content',
    rating: 4.3,
    reviews: 2236,
    price: 0.012,
    description: 'AI-powered content agents that transform how teams create and execute marketing content at scale.',
    trending: false,
  },
  {
    id: "9",
    name: 'PrivateAI',
    category: 'Security',
    rating: 4.3,
    reviews: 2236,
    price: 0.018,
    description: 'Secure AI-powered privacy protection agents for sensitive data. Enterprise-grade encryption and compliance.',
    trending: false,
  },
  {
    id: "10",
    name: 'HyperWrite AI',
    category: 'Writing',
    rating: 4.3,
    reviews: 2239,
    price: 0.012,
    description: 'Build custom writing AI agents with your brand voice. Automated content generation, editing, and optimization.',
    trending: false,
  },
  {
    id: "11",
    name: 'Nelima',
    category: 'Analytics',
    rating: 4.3,
    reviews: 2236,
    price: 0.012,
    description: 'Intelligent AI analytics agents transforming data into strategic insights with automated reporting and predictions.',
    trending: false,
  },
  {
    id: "12",
    name: 'Vapi',
    category: 'Voice',
    rating: 4.3,
    reviews: 2236,
    price: 0.018,
    description: 'Ship reliable voice AI agents faster with comprehensive simulation and testing for conversational interfaces.',
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
    <div className="min-h-screen" style={{ backgroundColor: '#161823' }}>
      {/* Category Header */}
      <CategoryHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onFiltersChange={handleFiltersChange}
        activeFilters={activeFilters}
      />

      <div className="max-w-[1400px] mx-auto px-6 py-8">
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

          {/* Agent Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {(filteredAgents.length > 0 ? filteredAgents : AGENTS_DATA).map((agent: Agent) => (
              <AgentCard
                key={agent.id}
                name={agent.name}
                description={agent.description}
                rating={agent.rating}
                reviews={agent.reviews || 0}
                tags={
                  agent.id === '1' ? ['Customer Service', '+2'] :
                  agent.id === '2' ? ['Infrastructure', '+2'] :
                  agent.id === '3' ? ['Development', '+2'] :
                  agent.id === '4' ? ['Workflow', '+2'] :
                  agent.id === '5' ? ['Testing', '+2'] :
                  agent.id === '6' ? ['Voice', '+2'] :
                  agent.id === '7' ? ['Code Assistant', '+2'] :
                  agent.id === '8' ? ['Content', '+2'] :
                  agent.id === '9' ? ['Security', '+2'] :
                  agent.id === '10' ? ['Writing', '+2'] :
                  agent.id === '11' ? ['Analytics', '+2'] :
                  ['Voice', '+2']
                }
                price={typeof agent.price === 'number' ? `${agent.price} ETH/mon` : agent.price}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
