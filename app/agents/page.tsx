'use client';

import { Star, TrendingUp, Users, MessageSquare, Plus } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import PricingCard from '@/components/cards/PricingCard';

export default function MyAgentsPage() {
  const [activeTab, setActiveTab] = useState<'subscribed' | 'created'>('subscribed');

  // Mock data for subscribed agents
  const subscribedAgents = [
    {
      id: 1,
      name: 'Trading Oracle',
      category: 'Trading',
      description: 'Advanced market analysis and trading strategies',
      rating: 4.8,
      users: 12500,
      price: '$19/month',
      color: '#FBede0',
      trending: true,
    },
    {
      id: 2,
      name: 'Research Assistant',
      category: 'Research',
      description: 'AI-powered research and data analysis',
      rating: 4.9,
      users: 8300,
      price: '$0.50/session',
      color: '#FBede0',
      trending: true,
    },
    {
      id: 3,
      name: 'Content Writer Pro',
      category: 'Writing',
      description: 'Professional content creation and editing',
      rating: 4.7,
      users: 15200,
      price: '$19/month',
      color: '#FBede0',
      trending: true,
    },
  ];

  // Mock data for created agents
  const createdAgents = [
    {
      id: 4,
      name: 'Data Analytics Bot',
      category: 'Analytics',
      description: 'Custom analytics agent for business intelligence',
      rating: 4.6,
      users: 340,
      revenue: '$1,240',
      status: 'Active',
      color: '#FBede0',
      trending: true,
    },
    {
      id: 5,
      name: 'Crypto Tracker',
      category: 'Trading',
      description: 'Real-time cryptocurrency monitoring and alerts',
      rating: 4.5,
      users: 520,
      revenue: '$890',
      status: 'Active',
      color: '#FBede0',
      trending: true,
    },
  ];

  const handleAgentSelect = (agent: any) => {
    // Handle agent selection - could navigate to agent details or start chat
    console.log('Selected agent:', agent);
  };

  const handleCreateAgent = () => {
    // Navigate to create agent page
    window.location.href = '/agents/create';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#161823' }}>
      <div className="max-w-[1440px] mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2" style={{ color: '#FBede0', fontSize: '36px' }}>
          My Agents
        </h1>
        <p style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
          Manage your subscribed and created AI agents
        </p>
      </div>

      {/* Tab Selector */}
      <div className="mb-8">
        <div
          className="inline-flex p-2 rounded-2xl"
          style={{ backgroundColor: '#1C1F2B', border: '1px solid rgba(80, 96, 108, 0.4)' }}
        >
          <button
            onClick={() => setActiveTab('subscribed')}
            className="px-8 py-3 rounded-xl transition-all duration-200"
            style={{
              backgroundColor: activeTab === 'subscribed' ? '#50606C' : 'transparent',
              color: activeTab === 'subscribed' ? '#FBede0' : 'rgba(251, 237, 224, 0.7)',
            }}
          >
            Subscribed Agents
          </button>
          <button
            onClick={() => setActiveTab('created')}
            className="px-8 py-3 rounded-xl transition-all duration-200"
            style={{
              backgroundColor: activeTab === 'created' ? '#50606C' : 'transparent',
              color: activeTab === 'created' ? '#FBede0' : 'rgba(251, 237, 224, 0.7)',
            }}
          >
            Created Agents
          </button>
        </div>
      </div>

      {/* Subscribed Agents Section */}
      {activeTab === 'subscribed' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 style={{ color: '#FBede0', fontSize: '24px' }}>
                Your Subscriptions
              </h2>
              <p className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                {subscribedAgents.length} active subscriptions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {subscribedAgents.map((agent) => (
              <PricingCard
                key={agent.id}
                title={agent.name}
                description={agent.description}
                price={agent.price}
                category={agent.category}
                rating={agent.rating}
                users={agent.users}
                trending={agent.trending}
                badge={agent.category}
                onViewDetails={() => handleAgentSelect(agent)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Created Agents Section */}
      {activeTab === 'created' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 style={{ color: '#FBede0', fontSize: '24px' }}>
                Agents You Created
              </h2>
              <p className="text-sm" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                {createdAgents.length} published agents
              </p>
            </div>
            <button
              onClick={handleCreateAgent}
              className="px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200"
              style={{
                backgroundColor: '#FBede0',
                color: '#161823',
                boxShadow: '0 0 12px rgba(251, 237, 224, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(251, 237, 224, 0.3)';
                e.currentTarget.style.backgroundColor = '#e8d4c5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(251, 237, 224, 0.2)';
                e.currentTarget.style.backgroundColor = '#FBede0';
              }}
            >
              <Plus className="w-4 h-4" />
              Create New Agent
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {createdAgents.map((agent) => (
              <PricingCard
                key={agent.id}
                title={agent.name}
                description={agent.description}
                price={agent.revenue}
                category={agent.category}
                status={agent.status}
                rating={agent.rating}
                users={agent.users}
                revenue={agent.revenue}
                trending={agent.trending}
                isCreated={true}
                badge={agent.status}
                onViewDetails={() => handleAgentSelect(agent)}
                onEdit={() => console.log('Edit agent:', agent.id)}
              />
            ))}
          </div>

          {/* Empty State for Created Agents */}
          {createdAgents.length === 0 && (
            <div
              className="rounded-3xl p-16 text-center"
              style={{
                backgroundColor: '#1C1F2B',
                border: '2px dashed rgba(80, 96, 108, 0.4)',
              }}
            >
              <div className="mb-4">
                <div
                  className="w-24 h-24 rounded-full mx-auto flex items-center justify-center"
                  style={{ backgroundColor: '#161823' }}
                >
                  <Plus className="w-12 h-12" style={{ color: '#FBede0' }} />
                </div>
              </div>
              <h3 className="mb-2" style={{ color: '#FBede0', fontSize: '24px' }}>
                No Agents Created Yet
              </h3>
              <p className="mb-6" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                Start monetizing your AI by creating and uploading your first agent
              </p>
              <button
                onClick={handleCreateAgent}
                className="px-8 py-3 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: '#FBede0',
                  color: '#161823',
                  boxShadow: '0 0 12px rgba(251, 237, 224, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(251, 237, 224, 0.3)';
                  e.currentTarget.style.backgroundColor = '#e8d4c5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(251, 237, 224, 0.2)';
                  e.currentTarget.style.backgroundColor = '#FBede0';
                }}
              >
                Create Your First Agent
              </button>
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  );
}
