'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Bot, User, Search, Plus, Settings, Info, Paperclip, Copy, MoreVertical } from 'lucide-react';
import { useAgentChat } from '@/lib/useAgentChat';
import { useAccount } from 'wagmi';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import SplitText from '@/components/SplitText';

// 👇 helper to create a stable session id per tab (and persist across reloads)
function useStableSessionId(key = 'agent_session_id') {
  const ref = useRef<string | null>(null);
  if (ref.current === null) {
    if (typeof window !== 'undefined') {
      const fromStore = window.sessionStorage.getItem(key);
      if (fromStore) {
        ref.current = fromStore;
      } else {
        const id = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
          ? crypto.randomUUID()
          : String(Date.now()) + '-' + Math.random().toString(36).slice(2);
        window.sessionStorage.setItem(key, id);
        ref.current = id;
      }
    } else {
      ref.current = 'server-' + Date.now();
    }
  }
  return ref.current!;
}

export default function ChatPage() {
  const sessionId = useStableSessionId();
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('crypto-agent');
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const { messages, send, pending, error } = useAgentChat();
  const { address } = useAccount();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  console.log('ChatPage - Session ID:', sessionId, 'Wallet:', address, 'Messages Count:', messages.length);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      setShowScrollToBottom(false);
    }
  };

  // Handle scroll events to show/hide scroll-to-bottom button
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollToBottom(!isNearBottom && messages.length > 0);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current && messages.length > 0) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      if (isNearBottom) {
        scrollToBottom();
      }
    }
  }, [messages]);


  if (!isMounted) {
    return null;
  }

  const agents = [
    {
      id: 'crypto-agent',
      name: 'CryptoAgent',
      tag: 'Blockchain & Crypto Operations',
    },
    {
      id: 'master-agent',
      name: 'Master Agent',
      tag: 'Development',
    },
  ];

  // Dropdown menu options for agent selection
  const handleDropdownAgentSelect = (agentId: string, agentName: string) => {
    console.log('Selected agent:', agentId, '-', agentName);
    setSelectedAgent(agentId);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('Selected file:', file.name, 'Size:', file.size, 'Type:', file.type);
    }
  };

  const handleAttachClick = () => {
    document.getElementById('file-input')?.click();
  };

  const dropdownOptions = [
    {
      label: 'Crypto Agent',
      onClick: () => handleDropdownAgentSelect('crypto-agent', 'Crypto Agent'),
    },
    {
      label: 'Master Agent', 
      onClick: () => handleDropdownAgentSelect('master-agent', 'Master Agent'),
    },
  ];


  const currentAgent = agents.find(a => a.id === selectedAgent) || agents[0];

  const handleSend = () => {
    if (message.trim()) {
      const userMessage = message;
      setMessage('');
      send(userMessage, { sessionId, agent: selectedAgent, wallet: address });
      // Scroll to bottom after sending message
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  return (
    <div className="flex" style={{ backgroundColor: '#161823', height: 'calc(100vh - 60px)', position: 'fixed', top: '60px', left: 0, right: 0, bottom: 0 }}>
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
        <div className="p-4">
          <h2 className="mb-3" style={{ color: '#FBede0', fontSize: '16px', fontWeight: 600 }}>
            Agents
          </h2>
          
          {/* Search Bar */}
          <div className="relative mb-3">
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
          
          {/* Agent Selection Dropdown */}
          <div className="mb-3">
            <div className="w-full">
              <DropdownMenu options={dropdownOptions}>
                Select Agent
              </DropdownMenu>
            </div>
          </div>
          
          {/* New Chat Button */}
          <div className="mb-3">
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
          
          {/* Horizontal Line */}
          <div style={{ height: '1px', backgroundColor: 'rgba(80, 96, 108, 0.4)' }} />
        </div>

        {/* Agent List */}
        <div className="flex-1 overflow-y-auto p-2">
          {/* Recent Chats Section */}
          <div className="p-2">
            <h3 className="mb-3 mt-2" style={{ color: 'rgba(251, 237, 224, 0.6)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Recent Chats
            </h3>
            
            {/* Recent Chat Items */}
            <div className="space-y-1">
              <button className="w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-200 text-left" 
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(80, 96, 108, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(251, 237, 224, 0.3)' }} />
                <div className="flex-1 min-w-0">
                  <div style={{ color: 'rgba(251, 237, 224, 0.9)', fontSize: '14px' }} className="truncate">
                    ETH Pricing...
                  </div>
                </div>
              </button>
              
              <button className="w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-200 text-left" 
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(80, 96, 108, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(251, 237, 224, 0.3)' }} />
                <div className="flex-1 min-w-0">
                  <div style={{ color: 'rgba(251, 237, 224, 0.9)', fontSize: '14px' }} className="truncate">
                    Bitcoin market...
                  </div>
                </div>
              </button>
              
              <button className="w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-200 text-left" 
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(80, 96, 108, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(251, 237, 224, 0.3)' }} />
                <div className="flex-1 min-w-0">
                  <div style={{ color: 'rgba(251, 237, 224, 0.9)', fontSize: '14px' }} className="truncate">
                    Crypto investment suggestio...
                  </div>
                </div>
              </button>
            </div>
          </div>
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
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-6 flex items-center justify-center relative"
        >
          <div className="max-w-4xl mx-auto space-y-4 w-full">
            {/* Welcome Message with SplitText Animation - Only show when no messages */}
            {messages.length === 0 && (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div style={{ 
                  color: '#FBede0', 
                  fontSize: '48px', 
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textAlign: 'center'
                }}>
                  <SplitText 
                    text="Hello, Are You Ready?"
                    className="text-center"
                    tag="h2"
                    delay={100}
                    duration={0.8}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 50 }}
                    to={{ opacity: 1, y: 0 }}
                    onLetterAnimationComplete={() => {}}
                  />
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex flex-col" style={{ maxWidth: '70%' }}>
                  <div
                    className="px-4 py-3 transition-all duration-200"
                    style={{
                      backgroundColor: msg.role === 'user' ? '#50606C' : '#1C1F2B',
                      border: msg.role === 'assistant' ? '1px solid #50606C' : 'none',
                      color: '#FBede0',
                      borderRadius:
                        msg.role === 'user'
                          ? '16px 0 16px 16px'
                          : '0 16px 16px 16px',
                      fontSize: '14px',
                      lineHeight: '1.6',
                    }}
                  >
                    {msg.content}
                  </div>
                  <div
                    className="mt-1 text-right"
                    style={{ color: 'rgba(251, 237, 224, 0.5)', fontSize: '12px' }}
                  >
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {pending && (
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

            {/* Error Display */}
            {error && (
              <div className="flex justify-start">
                <div
                  className="px-4 py-3 rounded-2xl"
                  style={{
                    backgroundColor: '#dc2626',
                    color: '#FBede0',
                    maxWidth: '70%',
                    fontSize: '14px',
                  }}
                >
                  Error: {error}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scroll to Bottom Button */}
        {showScrollToBottom && (
          <div className="absolute bottom-48 left-1/2 transform translate-x-8 z-20" style={{ marginLeft: '1cm' }}>
            <button
              onClick={scrollToBottom}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <svg 
                width="32px" 
                height="32px" 
                viewBox="0 0 24 24" 
                strokeWidth="1.5" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12C1.25 6.06294 6.06294 1.25 12 1.25ZM9.03033 10.4697C8.73744 10.1768 8.26256 10.1768 7.96967 10.4697C7.67678 10.7626 7.67678 11.2374 7.96967 11.5303L11.4697 15.0303C11.7626 15.3232 12.2374 15.3232 12.5303 15.0303L16.0303 11.5303C16.3232 11.2374 16.3232 10.7626 16.0303 10.4697C15.7374 10.1768 15.2626 10.1768 14.9697 10.4697L12 13.4393L9.03033 10.4697Z" 
                  fill="#FBede0"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Input Bar (Fixed Bottom) */}
        <div
          className="px-6"
          style={{
            backgroundColor: '#161823',
            height: '80px',
            paddingTop: '16px',
            paddingBottom: '16px',
            marginBottom: '3cm',
          }}
        >
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            {/* Hidden File Input */}
            <input
              id="file-input"
              type="file"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              accept="/"
            />
            
            {/* Upload Button */}
            <button
              onClick={handleAttachClick}
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
              {/* Agent Info */}
              <div className="flex flex-col items-center text-center">
                <div style={{ color: '#FBede0', fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
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