'use client';

import { useState } from 'react';
import { Send, Bot, User, Search, Plus, Settings, Info, Paperclip, Copy, MoreVertical } from 'lucide-react';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('astra-ai');
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const agents = [
    {
      id: 'astra-ai',
      name: 'Astra AI',
      tag: 'Finance Expert',
      avatar: '💼',
    },
    {
      id: 'code-master',
      name: 'Code Master',
      tag: 'Development',
      avatar: '💻',
    },
    {
      id: 'data-sage',
      name: 'Data Sage',
      tag: 'Analytics',
      avatar: '📊',
    },
    {
      id: 'creative-spark',
      name: 'Creative Spark',
      tag: 'Content Writing',
      avatar: '✨',
    },
    {
      id: 'research-pro',
      name: 'Research Pro',
      tag: 'Research',
      avatar: '🔬',
    },
  ];

  const messages = [
    {
      id: 1,
      sender: 'user',
      text: 'Hey, I need help analyzing some market data for crypto trends.',
      time: '2:34 PM',
    },
    {
      id: 2,
      sender: 'agent',
      text: "I'd be happy to help you with that! I can analyze cryptocurrency market trends, provide insights on price movements, and identify potential patterns. What specific cryptocurrencies or timeframe are you interested in?",
      time: '2:34 PM',
    },
    {
      id: 3,
      sender: 'user',
      text: 'Focus on Bitcoin and Ethereum over the last 30 days.',
      time: '2:35 PM',
    },
    {
      id: 4,
      sender: 'agent',
      text: "Perfect! I'll analyze Bitcoin and Ethereum's performance over the last 30 days. Here's what I found:\n\n📈 Bitcoin (BTC):\n- Up 12.5% over the period\n- Current price: $43,250\n- Notable support at $40,000\n\n📊 Ethereum (ETH):\n- Up 18.3% over the period\n- Current price: $2,680\n- Strong momentum above $2,500\n\nBoth assets show bullish sentiment. Would you like a deeper analysis?",
      time: '2:36 PM',
    },
    {
      id: 5,
      sender: 'user',
      text: 'Can you show me a Python code snippet to fetch this data?',
      time: '2:37 PM',
    },
    {
      id: 6,
      sender: 'agent',
      text: "Absolutely! Here's a Python snippet using the CoinGecko API:",
      time: '2:37 PM',
      code: 'import requests\nfrom datetime import datetime, timedelta\n\ndef fetch_crypto_data(crypto_id, days=30):\n    url = f"https://api.coingecko.com/api/v3/coins/{crypto_id}/market_chart"\n    params = {\n        \'vs_currency\': \'usd\',\n        \'days\': days\n    }\n    response = requests.get(url, params=params)\n    return response.json()\n\n# Fetch Bitcoin and Ethereum data\nbtc_data = fetch_crypto_data(\'bitcoin\', 30)\neth_data = fetch_crypto_data(\'ethereum\', 30)\n\nprint(f"BTC Price: ${btc_data[\'prices\'][-1][1]:,.2f}")\nprint(f"ETH Price: ${eth_data[\'prices\'][-1][1]:,.2f}")',
    },
  ];

  const currentAgent = agents.find(a => a.id === selectedAgent) || agents[0];

  const handleSend = () => {
    if (message.trim()) {
      setMessage('');
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="flex" style={{ backgroundColor: '#161823', height: 'calc(100vh - 60px)' }}>
      {/* Sidebar - Agent List */}
      <div
        className="flex flex-col"
        style={{
          width: '280px',
          backgroundColor: '#1C1F2B',
          borderRight: '1px solid rgba(80, 96, 108, 0.4)',
        }}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b" style={{ borderColor: 'rgba(80, 96, 108, 0.4)' }}>
          <h2 className="mb-3" style={{ color: '#FBede0', fontSize: '16px', fontWeight: 600 }}>
            Agents
          </h2>
          
          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              style={{ color: 'rgba(251, 237, 224, 0.5)' }}
            />
            <input
              type="text"
              placeholder="Search agent..."
              className="w-full pl-9 pr-3 py-2 rounded-xl outline-none transition-all"
              style={{
                backgroundColor: '#161823',
                border: '1px solid #50606C',
                color: 'rgba(251, 237, 224, 0.8)',
                fontSize: '14px',
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = '0 0 8px rgba(251, 237, 224, 0.12)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Agent List */}
        <div className="flex-1 overflow-y-auto p-2">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              className="w-full p-3 mb-1 rounded-xl flex items-center gap-3 transition-all duration-200"
              style={{
                backgroundColor: selectedAgent === agent.id ? 'rgba(80, 96, 108, 0.4)' : 'transparent',
                height: '56px',
              }}
              onMouseEnter={(e) => {
                if (selectedAgent !== agent.id) {
                  e.currentTarget.style.backgroundColor = 'rgba(80, 96, 108, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedAgent !== agent.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div
                className="flex items-center justify-center text-lg flex-shrink-0"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#50606C',
                }}
              >
                {agent.avatar}
              </div>
              <div className="flex-1 text-left">
                <div style={{ color: 'rgba(251, 237, 224, 0.9)', fontSize: '14px' }}>
                  {agent.name}
                </div>
                <div style={{ color: 'rgba(251, 237, 224, 0.6)', fontSize: '12px' }}>
                  {agent.tag}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(80, 96, 108, 0.4)' }}>
          <button
            className="w-full px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              border: '1px solid #FBede0',
              backgroundColor: 'transparent',
              color: '#FBede0',
              fontSize: '14px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FBede0';
              e.currentTarget.style.color = '#161823';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#FBede0';
            }}
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div
          className="flex items-center justify-between px-6"
          style={{
            height: '60px',
            backgroundColor: '#161823',
            borderBottom: '1px solid #50606C',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center text-lg"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#50606C',
              }}
            >
              {currentAgent.avatar}
            </div>
            <div>
              <div style={{ color: '#FBede0', fontSize: '15px', fontWeight: 500 }}>
                {currentAgent.name}
              </div>
              <div style={{ color: 'rgba(251, 237, 224, 0.6)', fontSize: '13px' }}>
                Active now
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(80, 96, 108, 0.3)';
                e.currentTarget.style.boxShadow = '0 0 8px rgba(251, 237, 224, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Settings className="w-5 h-5" style={{ color: 'rgba(251, 237, 224, 0.8)' }} />
            </button>
            <button
              onClick={() => setShowInfoDrawer(!showInfoDrawer)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(80, 96, 108, 0.3)';
                e.currentTarget.style.boxShadow = '0 0 8px rgba(251, 237, 224, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Info className="w-5 h-5" style={{ color: 'rgba(251, 237, 224, 0.8)' }} />
            </button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1" style={{ height: '1px', backgroundColor: 'rgba(80, 96, 108, 0.4)' }} />
              <span style={{ color: 'rgba(251, 237, 224, 0.5)', fontSize: '12px' }}>Today</span>
              <div className="flex-1" style={{ height: '1px', backgroundColor: 'rgba(80, 96, 108, 0.4)' }} />
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex flex-col" style={{ maxWidth: '70%' }}>
                  <div
                    className="px-4 py-3 transition-all duration-200"
                    style={{
                      backgroundColor: msg.sender === 'user' ? '#50606C' : '#1C1F2B',
                      border: msg.sender === 'agent' ? '1px solid #50606C' : 'none',
                      color: '#FBede0',
                      borderRadius:
                        msg.sender === 'user'
                          ? '16px 0 16px 16px'
                          : '0 16px 16px 16px',
                      fontSize: '14px',
                      lineHeight: '1.6',
                    }}
                  >
                    {msg.text}
                    
                    {/* Code Block */}
                    {msg.code && (
                      <div
                        className="mt-3 p-3 rounded-lg relative"
                        style={{
                          backgroundColor: '#1C1F2B',
                          borderLeft: '3px solid #FBede0',
                          fontSize: '13px',
                          fontFamily: 'monospace',
                        }}
                      >
                        <button
                          onClick={() => copyCode(msg.code!)}
                          className="absolute top-2 right-2 p-1 rounded transition-all duration-200"
                          style={{
                            border: '1px solid #FBede0',
                            backgroundColor: 'transparent',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(251, 237, 224, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Copy className="w-3 h-3" style={{ color: '#FBede0' }} />
                        </button>
                        <pre style={{ color: 'rgba(251, 237, 224, 0.8)', whiteSpace: 'pre-wrap', marginTop: '20px' }}>
                          {msg.code}
                        </pre>
                      </div>
                    )}
                  </div>
                  <div
                    className="mt-1 text-right"
                    style={{ color: 'rgba(251, 237, 224, 0.5)', fontSize: '12px' }}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div
                  className="px-4 py-3 rounded-2xl flex items-center gap-1"
                  style={{
                    backgroundColor: '#50606C',
                    maxWidth: '80px',
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: 'rgba(251, 237, 224, 0.7)', animationDelay: '0ms' }}
                  />
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: 'rgba(251, 237, 224, 0.7)', animationDelay: '150ms' }}
                  />
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: 'rgba(251, 237, 224, 0.7)', animationDelay: '300ms' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Bar (Fixed Bottom) */}
        <div
          className="px-6 py-3"
          style={{
            backgroundColor: '#1C1F2B',
            borderTop: '1px solid #50606C',
            height: '72px',
          }}
        >
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            {/* Upload Button */}
            <button
              className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(80, 96, 108, 0.3)';
                e.currentTarget.style.boxShadow = '0 0 8px rgba(251, 237, 224, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Paperclip className="w-5 h-5" style={{ color: 'rgba(251, 237, 224, 0.8)' }} />
            </button>

            {/* Message Input */}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message your agent..."
              className="flex-1 px-5 py-3 rounded-3xl outline-none transition-all"
              style={{
                backgroundColor: '#161823',
                border: '1px solid #50606C',
                color: '#FBede0',
                height: '48px',
                fontSize: '14px',
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = '0 0 8px rgba(251, 237, 224, 0.12)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              className="flex-shrink-0 flex items-center justify-center transition-all duration-200"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#FBede0',
                boxShadow: '0 0 8px rgba(251, 237, 224, 0.12)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 16px rgba(251, 237, 224, 0.25)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 8px rgba(251, 237, 224, 0.12)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Send className="w-5 h-5" style={{ color: '#161823' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Info Drawer (Slide-in) */}
      {showInfoDrawer && (
        <div
          className="transition-all duration-300 overflow-y-auto"
          style={{
            width: '360px',
            backgroundColor: '#1C1F2B',
            borderLeft: '1px solid #50606C',
            animation: 'slideIn 300ms ease-out',
          }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ color: '#FBede0', fontSize: '18px', fontWeight: 600 }}>
                Agent Info
              </h3>
              <button
                onClick={() => setShowInfoDrawer(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(80, 96, 108, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Agent Avatar */}
              <div className="flex flex-col items-center text-center">
                <div
                  className="flex items-center justify-center text-4xl mb-3"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: '#50606C',
                  }}
                >
                  {currentAgent.avatar}
                </div>
                <div style={{ color: '#FBede0', fontSize: '20px', fontWeight: 600 }}>
                  {currentAgent.name}
                </div>
                <div style={{ color: 'rgba(251, 237, 224, 0.6)', fontSize: '14px' }}>
                  {currentAgent.tag}
                </div>
              </div>

              {/* Model Version */}
              <div>
                <div className="mb-2" style={{ color: 'rgba(251, 237, 224, 0.7)', fontSize: '13px' }}>
                  Model Version
                </div>
                <div style={{ color: '#FBede0', fontSize: '14px' }}>GPT-4 Turbo</div>
              </div>

              {/* Skills */}
              <div>
                <div className="mb-2" style={{ color: 'rgba(251, 237, 224, 0.7)', fontSize: '13px' }}>
                  Skills
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Analysis', 'Forecasting', 'Strategy', 'Research'].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-lg"
                      style={{
                        backgroundColor: '#50606C',
                        color: '#FBede0',
                        fontSize: '12px',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Data Usage */}
              <div>
                <div className="mb-3" style={{ color: 'rgba(251, 237, 224, 0.7)', fontSize: '13px' }}>
                  Data Usage
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1" style={{ fontSize: '12px' }}>
                      <span style={{ color: 'rgba(251, 237, 224, 0.6)' }}>Queries Used</span>
                      <span style={{ color: '#FBede0' }}>47 / 100</span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: '#161823' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: '47%', backgroundColor: 'rgba(251, 237, 224, 0.5)' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1" style={{ fontSize: '12px' }}>
                      <span style={{ color: 'rgba(251, 237, 224, 0.6)' }}>Storage</span>
                      <span style={{ color: '#FBede0' }}>2.3 GB / 5 GB</span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: '#161823' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: '46%', backgroundColor: 'rgba(251, 237, 224, 0.5)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  className="w-full px-4 py-2 rounded-xl transition-all duration-200"
                  style={{
                    border: '1px solid #FBede0',
                    backgroundColor: 'transparent',
                    color: '#FBede0',
                    fontSize: '14px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FBede0';
                    e.currentTarget.style.color = '#161823';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#FBede0';
                  }}
                >
                  Open in Marketplace
                </button>
                <button
                  className="w-full px-4 py-2 rounded-xl transition-all duration-200"
                  style={{
                    border: '1px solid #FBede0',
                    backgroundColor: 'transparent',
                    color: '#FBede0',
                    fontSize: '14px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FBede0';
                    e.currentTarget.style.color = '#161823';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#FBede0';
                  }}
                >
                  Share Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        input::placeholder,
        textarea::placeholder {
          color: rgba(251, 237, 224, 0.5);
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(80, 96, 108, 0.5);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(80, 96, 108, 0.7);
        }
      `}</style>
    </div>
  );
}
