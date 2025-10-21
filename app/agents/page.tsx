'use client';

import { Star, TrendingUp, Users, MessageSquare, Plus } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

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
              <div
                key={agent.id}
                onClick={() => handleAgentSelect(agent)}
                className="rounded-3xl p-6 cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: '#1C1F2B',
                  border: '1px solid rgba(80, 96, 108, 0.4)',
                  boxShadow: '0 0 10px rgba(251, 237, 224, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(251, 237, 224, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(251, 237, 224, 0.1)';
                }}
              >
                {/* Trending Badge */}
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

                {/* Agent Info */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 style={{ color: '#FBede0', fontSize: '20px' }}>
                      {agent.name}
                    </h3>
                    <span
                      className="px-3 py-1 rounded-lg text-sm"
                      style={{
                        backgroundColor: '#50606C',
                        color: '#FBede0',
                      }}
                    >
                      {agent.category}
                    </span>
                  </div>
                  <p className="text-sm mb-4" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                    {agent.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b" style={{ borderColor: 'rgba(80, 96, 108, 0.4)' }}>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" style={{ color: '#FBede0', fill: '#FBede0' }} />
                    <span className="text-sm" style={{ color: '#FBede0' }}>
                      {agent.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" style={{ color: '#FBede0' }} />
                    <span className="text-sm" style={{ color: '#FBede0' }}>
                      {agent.users.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <span style={{ color: '#FBede0', fontSize: '18px' }}>
                    {agent.price}
                  </span>
                  <button
                    className="px-4 py-2 rounded-xl text-sm transition-all duration-200"
                    style={{
                      backgroundColor: '#50606C',
                      color: '#FBede0',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FBede0';
                      e.currentTarget.style.color = '#161823';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#50606C';
                      e.currentTarget.style.color = '#FBede0';
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAgentSelect(agent);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
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
              <div
                key={agent.id}
                onClick={() => handleAgentSelect(agent)}
                className="rounded-3xl p-6 cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: '#1C1F2B',
                  border: '1px solid rgba(80, 96, 108, 0.4)',
                  boxShadow: '0 0 10px rgba(251, 237, 224, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(251, 237, 224, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(251, 237, 224, 0.1)';
                }}
              >
                {/* Trending Badge */}
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

                {/* Agent Info */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 style={{ color: '#FBede0', fontSize: '20px' }}>
                      {agent.name}
                    </h3>
                    <span
                      className="px-3 py-1 rounded-lg text-sm"
                      style={{
                        backgroundColor: agent.status === 'Active' ? '#50606C' : '#161823',
                        color: agent.status === 'Active' ? '#FBede0' : 'rgba(251, 237, 224, 0.6)',
                      }}
                    >
                      {agent.status}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        backgroundColor: '#161823',
                        color: '#FBede0',
                      }}
                    >
                      {agent.category}
                    </span>
                  </div>
                  <p className="text-sm mb-4" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                    {agent.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b" style={{ borderColor: 'rgba(80, 96, 108, 0.4)' }}>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-3 h-3" style={{ color: '#FBede0', fill: '#FBede0' }} />
                      <span className="text-xs" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                        Rating
                      </span>
                    </div>
                    <div style={{ color: '#FBede0' }}>{agent.rating}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Users className="w-3 h-3" style={{ color: '#FBede0' }} />
                      <span className="text-xs" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                        Users
                      </span>
                    </div>
                    <div style={{ color: '#FBede0' }}>{agent.users}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingUp className="w-3 h-3" style={{ color: '#FBede0' }} />
                      <span className="text-xs" style={{ color: 'rgba(251, 237, 224, 0.6)' }}>
                        Revenue
                      </span>
                    </div>
                    <div style={{ color: '#FBede0' }}>{agent.revenue}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    className="flex-1 px-4 py-2 rounded-xl text-sm transition-all duration-200"
                    style={{
                      backgroundColor: '#50606C',
                      color: '#FBede0',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FBede0';
                      e.currentTarget.style.color = '#161823';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#50606C';
                      e.currentTarget.style.color = '#FBede0';
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAgentSelect(agent);
                    }}
                  >
                    View Details
                  </button>
                  <button
                    className="flex-1 px-4 py-2 rounded-xl text-sm transition-all duration-200"
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(80, 96, 108, 0.4)',
                      color: '#FBede0',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#161823';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle edit action
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
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
  );
}
