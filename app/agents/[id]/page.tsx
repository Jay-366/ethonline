'use client';

import { Star, TrendingUp, ArrowLeft, MessageCircle, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect, useId, useRef } from 'react';
import SubscribeModal from '@/components/agents/SubscribeModal';
import { InitNexusOnConnect } from '@/components/nexus/InitNexusOnConnect';
import CountUp from '@/components/ui/count-up';

// Grid Pattern Component from feature-section-with-card-gradient
const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size?: number;
}) => {
  // Generate unique patterns to avoid duplicate keys
  const p = pattern ?? [
    [7, 1],
    [8, 2],
    [9, 3],
    [10, 4],
    [7, 5],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] from-zinc-900/30 to-zinc-900/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full mix-blend-overlay fill-white/10 stroke-white/10"
        />
      </div>
    </div>
  );
};

const GridPattern = ({ width, height, x, y, squares, ...props }: any) => {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any, index: number) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}-${index}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
};

// Agent data matching the marketplace
const AGENTS_DATA: Record<string, {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  price: string;
  description: string;
  longDescription: string;
  trending: boolean;
  features: string[];
  creator: string;
  lastUpdated: string;
  totalQueries: string;
  successRate: string;
}> = {
  "1": {
    id: "1",
    name: 'Jotform AI',
    category: 'Customer Service',
    rating: 4.3,
    reviews: 2236,
    price: '0.012 ETH/query',
    description: 'Jotform AI Agents revolutionize customer service by automating support across multiple channels. These dynamic AI agents can instantly engage with customers and resolve queries.',
    longDescription: 'Jotform AI Agents represent the next generation of customer service automation. Built on advanced natural language processing, these agents can understand context, sentiment, and intent to provide personalized support across chat, email, and social media platforms. The system learns from each interaction to continuously improve response quality and customer satisfaction.',
    trending: true,
    features: [
      'Multi-channel customer support automation',
      'Natural language understanding',
      'Sentiment analysis and emotion detection',
      'Real-time query resolution',
      'Integration with CRM systems',
      'Automated ticket routing and escalation'
    ],
    creator: 'Jotform Labs',
    lastUpdated: '1 day ago',
    totalQueries: '12,340',
    successRate: '97.2%'
  },
  "2": {
    id: "2",
    name: 'Phala Network',
    category: 'Infrastructure',
    rating: 4.3,
    reviews: 2236,
    price: '0.009 ETH/query',
    description: 'Secure, trustless AI computing without compromise. Deploy AI agents on decentralized infrastructure with built-in privacy protection.',
    longDescription: 'Phala Network provides a decentralized cloud computing infrastructure specifically designed for AI agents. Using Trusted Execution Environments (TEE), Phala ensures that your AI computations remain private and secure while maintaining verifiability. This unique approach enables developers to build confidential AI applications without trusting centralized cloud providers.',
    trending: true,
    features: [
      'Decentralized AI computing infrastructure',
      'Built-in privacy with TEE technology',
      'Trustless execution environment',
      'Scalable agent deployment',
      'Cross-chain compatibility',
      'End-to-end encryption'
    ],
    creator: 'Phala Foundation',
    lastUpdated: '2 days ago',
    totalQueries: '15,420',
    successRate: '98.5%'
  },
  "3": {
    id: "3",
    name: 'AgentOps',
    category: 'Development',
    rating: 4.3,
    reviews: 2236,
    price: '0.012 ETH/query',
    description: 'Unleash reliable AI agents with comprehensive testing and optimization. Monitor, debug, and improve your AI agent performance in production.',
    longDescription: 'AgentOps is the complete DevOps platform for AI agents. It provides end-to-end observability, testing frameworks, and optimization tools to ensure your AI agents perform reliably in production. With built-in monitoring, debugging, and A/B testing capabilities, AgentOps helps teams ship better AI products faster.',
    trending: true,
    features: [
      'Real-time agent monitoring and analytics',
      'Comprehensive testing frameworks',
      'Performance optimization tools',
      'A/B testing for agent behaviors',
      'Error tracking and debugging',
      'Cost optimization insights'
    ],
    creator: 'AgentOps Inc',
    lastUpdated: '3 days ago',
    totalQueries: '18,920',
    successRate: '96.8%'
  },
  "4": {
    id: "4",
    name: 'Dify',
    category: 'Workflow',
    rating: 4.3,
    reviews: 2236,
    price: '0.012 ETH/query',
    description: 'Build powerful AI agents and workflows in minutes. Visual agent builder with pre-built templates and integrations.',
    longDescription: 'Dify empowers teams to build sophisticated AI agents without extensive coding. Its visual workflow builder combines the power of large language models with an intuitive interface, enabling rapid prototyping and deployment. With pre-built templates and extensive integrations, Dify accelerates AI agent development from concept to production.',
    trending: true,
    features: [
      'Visual workflow builder',
      'Pre-built agent templates',
      'LLM integration (GPT, Claude, etc)',
      'Custom API connections',
      'Version control and collaboration',
      'One-click deployment'
    ],
    creator: 'Dify AI',
    lastUpdated: '1 day ago',
    totalQueries: '14,560',
    successRate: '95.4%'
  },
  "5": {
    id: "5",
    name: 'Oovol',
    category: 'Testing',
    rating: 4.3,
    reviews: 2236,
    price: '0.012 ETH/query',
    description: 'Ship reliable AI agents faster with comprehensive simulation and testing environments before deployment.',
    longDescription: 'Oovol provides enterprise-grade testing and simulation environments for AI agents. Create realistic test scenarios, simulate edge cases, and validate agent behavior before production deployment. With automated regression testing and performance benchmarking, Oovol ensures your agents meet quality standards consistently.',
    trending: false,
    features: [
      'Comprehensive simulation environments',
      'Automated regression testing',
      'Edge case scenario generation',
      'Performance benchmarking',
      'Load testing capabilities',
      'Test coverage analytics'
    ],
    creator: 'Oovol Systems',
    lastUpdated: '4 days ago',
    totalQueries: '9,840',
    successRate: '98.1%'
  },
  "6": {
    id: "6",
    name: 'Neets.ai',
    category: 'Voice',
    rating: 4.3,
    reviews: 2236,
    price: '0.018 ETH/query',
    description: 'Build powerful voice AI agents with natural conversations. Real-time speech processing and multi-language support.',
    longDescription: 'Neets.ai specializes in voice-enabled AI agents with human-like conversational abilities. Leveraging advanced speech synthesis and recognition technologies, Neets.ai enables developers to create voice agents that understand context, detect emotions, and respond naturally across multiple languages.',
    trending: false,
    features: [
      'Natural speech synthesis',
      'Real-time voice processing',
      'Multi-language support (50+ languages)',
      'Emotion and intent detection',
      'Custom voice cloning',
      'Low-latency conversations'
    ],
    creator: 'Neets Technologies',
    lastUpdated: '2 days ago',
    totalQueries: '11,230',
    successRate: '94.7%'
  },
  "7": {
    id: "7",
    name: 'Potpie AI',
    category: 'Code Assistant',
    rating: 4.3,
    reviews: 2239,
    price: '0.012 ETH/query',
    description: 'Build custom AI coding agents that understand your entire codebase. Automated code review, bug detection, and documentation.',
    longDescription: 'Potpie AI revolutionizes software development with intelligent coding agents that understand your entire codebase. From automated code reviews to intelligent refactoring suggestions, Potpie AI helps development teams maintain code quality while accelerating delivery. The agents learn your coding patterns and best practices to provide personalized assistance.',
    trending: false,
    features: [
      'Full codebase understanding',
      'Automated code review',
      'Intelligent bug detection',
      'Code refactoring suggestions',
      'Auto-generated documentation',
      'Security vulnerability scanning'
    ],
    creator: 'Potpie Labs',
    lastUpdated: '1 day ago',
    totalQueries: '16,720',
    successRate: '96.3%'
  },
  "8": {
    id: "8",
    name: 'Jasper AI',
    category: 'Content',
    rating: 4.3,
    reviews: 2236,
    price: '0.012 ETH/query',
    description: 'AI-powered content agents that transform how teams create and execute marketing content at scale.',
    longDescription: 'Jasper AI empowers marketing teams with AI agents specialized in content creation. From blog posts to social media campaigns, Jasper AI understands brand voice, target audiences, and content strategies to produce engaging, on-brand content at scale. Built-in SEO optimization and multi-platform adaptation ensure maximum content effectiveness.',
    trending: false,
    features: [
      'Multi-format content generation',
      'Brand voice consistency',
      'SEO optimization',
      'Multi-platform adaptation',
      'Content performance analytics',
      'Collaborative editing workflows'
    ],
    creator: 'Jasper Inc',
    lastUpdated: '3 days ago',
    totalQueries: '13,450',
    successRate: '95.8%'
  },
  "9": {
    id: "9",
    name: 'PrivateAI',
    category: 'Security',
    rating: 4.3,
    reviews: 2236,
    price: '0.018 ETH/query',
    description: 'Secure AI-powered privacy protection agents for sensitive data. Enterprise-grade encryption and compliance.',
    longDescription: 'PrivateAI delivers enterprise-grade security for AI agents handling sensitive data. With end-to-end encryption, compliance frameworks (GDPR, HIPAA, SOC2), and advanced threat detection, PrivateAI ensures that your AI operations meet the highest security standards. Ideal for healthcare, finance, and regulated industries.',
    trending: false,
    features: [
      'End-to-end encryption',
      'Compliance framework support',
      'Advanced threat detection',
      'Data anonymization',
      'Audit logging and monitoring',
      'Zero-trust architecture'
    ],
    creator: 'PrivateAI Security',
    lastUpdated: '1 day ago',
    totalQueries: '8,920',
    successRate: '99.2%'
  },
  "10": {
    id: "10",
    name: 'HyperWrite AI',
    category: 'Writing',
    rating: 4.3,
    reviews: 2239,
    price: '0.012 ETH/query',
    description: 'Build custom writing AI agents with your brand voice. Automated content generation, editing, and optimization.',
    longDescription: 'HyperWrite AI provides specialized writing agents that adapt to your unique style and requirements. Whether you need technical documentation, creative writing, or business communications, HyperWrite AI learns your preferences and produces high-quality content that matches your voice. Advanced editing and optimization features ensure polished, professional results.',
    trending: false,
    features: [
      'Custom brand voice training',
      'Multi-genre writing support',
      'Real-time editing suggestions',
      'Grammar and style optimization',
      'Plagiarism detection',
      'Writing analytics and insights'
    ],
    creator: 'HyperWrite Inc',
    lastUpdated: '2 days ago',
    totalQueries: '14,890',
    successRate: '96.5%'
  },
  "11": {
    id: "11",
    name: 'Nelima',
    category: 'Analytics',
    rating: 4.3,
    reviews: 2236,
    price: '0.012 ETH/query',
    description: 'Intelligent AI analytics agents transforming data into strategic insights with automated reporting and predictions.',
    longDescription: 'Nelima transforms raw data into actionable intelligence with AI agents specialized in analytics and business intelligence. From automated data analysis to predictive modeling, Nelima helps organizations make data-driven decisions faster. The platform integrates with popular data sources and provides natural language insights that everyone can understand.',
    trending: false,
    features: [
      'Automated data analysis',
      'Predictive modeling',
      'Natural language insights',
      'Custom dashboard creation',
      'Real-time anomaly detection',
      'Integration with BI tools'
    ],
    creator: 'Nelima Analytics',
    lastUpdated: '3 days ago',
    totalQueries: '10,560',
    successRate: '97.4%'
  },
  "12": {
    id: "12",
    name: 'Vapi',
    category: 'Voice',
    rating: 4.3,
    reviews: 2236,
    price: '0.018 ETH/query',
    description: 'Ship reliable voice AI agents faster with comprehensive simulation and testing for conversational interfaces.',
    longDescription: 'Vapi accelerates voice AI development with comprehensive tools for building, testing, and deploying conversational agents. Its simulation environment lets you test thousands of conversation scenarios before going live, ensuring your voice agents handle real-world interactions gracefully. Built-in analytics help optimize conversation flows for better user experiences.',
    trending: false,
    features: [
      'Voice agent simulation environment',
      'Conversation flow optimization',
      'Multi-language voice testing',
      'Real-time performance monitoring',
      'Automated conversation testing',
      'Voice analytics dashboard'
    ],
    creator: 'Vapi Voice',
    lastUpdated: '4 days ago',
    totalQueries: '12,340',
    successRate: '95.9%'
  },
};

export default function AgentDetailsPage() {
  const params = useParams();
  const agentId = params.id as string;
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [statsBottom, setStatsBottom] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);

  // Track scroll position and direction for animations
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      
      setScrollY(currentScrollY);
      setLastScrollY(currentScrollY);
      
      // Calculate stats section bottom position
      if (statsRef.current) {
        const rect = statsRef.current.getBoundingClientRect();
        setStatsBottom(rect.bottom + currentScrollY);
      }
    };

    handleScroll(); // Initial calculation
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [lastScrollY]);

  // Animate sidebar on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Get agent data or use default
  const agent = AGENTS_DATA[agentId] || {
    id: agentId,
    name: 'AI Agent',
    category: 'General',
    rating: 4.5,
    reviews: 1000,
    price: '0.01 ETH/query',
    description: 'An AI agent available for deployment.',
    longDescription: 'This AI agent provides advanced capabilities for various tasks.',
    trending: false,
    features: [
      'Advanced AI capabilities',
      'Real-time processing',
      'Scalable infrastructure',
      'Easy integration',
      'Comprehensive documentation',
      'Active support community'
    ],
    creator: 'AI Developer',
    lastUpdated: 'Recently',
    totalQueries: '10,000',
    successRate: '95%'
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#161823' }}>
      <InitNexusOnConnect />
      
      {/* Header Section - Similar to CategoryHeader */}
      <section className="max-w-[1400px] mx-auto px-6 pt-24 pb-0 bg-gradient-to-r from-[#161823] to-[#161823] text-[#f8ede0]">
        {/* Breadcrumbs */}
        <nav className="mb-4 text-sm text-[#5d606c]">
          <Link href="/" className="hover:underline cursor-pointer">Home</Link> 
          <span className="mx-1">&gt;</span> 
          <Link href="/marketplace" className="hover:underline cursor-pointer">Marketplace</Link>
          <span className="mx-1">&gt;</span>
          <span className="text-[#f8ede0]">{agent.name}</span>
        </nav>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: '#f8ede0' }}>
              {agent.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-current" style={{ color: '#f8ede0' }} />
                <span style={{ color: '#f8ede0' }}>{agent.rating}</span>
                <span className="text-sm" style={{ color: '#5d606c' }}>
                  ({agent.reviews.toLocaleString()} reviews)
                </span>
              </div>
              <div
                className="px-3 py-1 rounded-lg"
                style={{
                  backgroundColor: 'rgba(93, 96, 108, 0.3)',
                  color: '#f8ede0',
                }}
              >
                {agent.category}
              </div>
            </div>

            <p className="text-base md:text-lg mb-10 leading-relaxed" style={{ color: '#5d606c' }}>
              {agent.description}
            </p>
          </div>

          {/* About Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#f8ede0' }}>
              About This Agent
            </h2>
            <p className="leading-relaxed" style={{ color: '#5d606c' }}>
              {agent.longDescription}
            </p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#f8ede0' }}>
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agent.features.map((feature, index) => (
                <div
                  key={index}
                  className="relative bg-gradient-to-b from-[#1C1F2B] to-[#161823] p-6 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    border: '1px solid #5d606c',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#f8ede0';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(248, 237, 224, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#5d606c';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Grid size={20} />
                  <div className="flex items-start gap-3 relative z-20">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                      style={{ backgroundColor: '#f8ede0' }}
                    />
                    <p className="text-sm font-medium relative z-20" style={{ color: '#f8ede0' }}>
                      {feature}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Stats - Tailark Style */}
          <div className="mb-8 pt-8" ref={statsRef}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#f8ede0' }}>
              {agent.name} in numbers
            </h2>
            <p className="text-base md:text-lg mb-10 leading-relaxed" style={{ color: '#5d606c' }}>
              Our platform continues to grow with developers and businesses using our tools to create innovative solutions and enhance productivity.
            </p>
            
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2" style={{ 
                  background: 'linear-gradient(135deg, #f8ede0 0%, #c9b8a0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  <CountUp 
                    to={parseInt(agent.totalQueries.replace(/,/g, ''))} 
                    duration={2.5}
                    separator=","
                  />
                </div>
                <div className="text-base" style={{ color: '#5d606c' }}>
                  Total Queries
                </div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2" style={{ 
                  background: 'linear-gradient(135deg, #f8ede0 0%, #c9b8a0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  <CountUp 
                    to={parseFloat(agent.successRate.replace('%', ''))} 
                    duration={2.5}
                  />%
                </div>
                <div className="text-base" style={{ color: '#5d606c' }}>
                  Success Rate
                </div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2" style={{ 
                  background: 'linear-gradient(135deg, #f8ede0 0%, #c9b8a0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  <CountUp 
                    to={agent.reviews} 
                    duration={2.5}
                    separator=","
                  />+
                </div>
                <div className="text-base" style={{ color: '#5d606c' }}>
                  Active Users
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Moves with Scroll */}
        <div className="lg:col-span-1">
          <div
            className="p-6 rounded-md sticky transition-all duration-500 ease-out"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #5d606c',
              boxShadow: '0 0 15px rgba(248, 237, 224, 0.05)',
              top: scrollDirection === 'down' && statsBottom > 0
                ? `${Math.min(6 + scrollY * 0.1, Math.max((statsBottom - scrollY - 400) / 16, 6))}rem` 
                : `${Math.max(6 - scrollY * 0.05, 1)}rem`,
              transform: isVisible 
                ? scrollDirection === 'down'
                  ? `translateY(${Math.min(scrollY * 0.25, statsBottom > 0 ? Math.max(0, (statsBottom - scrollY - 600)) : 100)}px)`
                  : `translateY(${Math.max(-scrollY * 0.2, -50)}px)`
                : 'translateY(50px)',
              opacity: isVisible ? 1 : 0,
              borderColor: '#5d606c',
            }}
          >
            <div className="text-center mb-6">
              <div className="text-3xl font-bold mb-2" style={{ 
                color: '#f8ede0',
              }}>
                {agent.price}
              </div>
              <div className="text-sm" style={{ color: '#5d606c' }}>
                per query
              </div>
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b" style={{ 
              borderColor: '#5d606c',
            }}>
              <div className="flex items-center justify-between hover:translate-x-1 transition-transform duration-300">
                <span className="text-sm" style={{ color: '#5d606c' }}>Creator</span>
                <span className="text-sm font-medium" style={{ color: '#f8ede0' }}>{agent.creator}</span>
              </div>
              <div className="flex items-center justify-between hover:translate-x-1 transition-transform duration-300">
                <span className="text-sm" style={{ color: '#5d606c' }}>Category</span>
                <span className="text-sm font-medium" style={{ color: '#f8ede0' }}>{agent.category}</span>
              </div>
              <div className="flex items-center justify-between hover:translate-x-1 transition-transform duration-300">
                <span className="text-sm" style={{ color: '#5d606c' }}>Rating</span>
                <div className="flex items-center gap-1">
                  <Star 
                    className="w-4 h-4 fill-current" 
                    style={{ 
                      color: '#f8ede0',
                    }} 
                  />
                  <span className="text-sm font-medium" style={{ color: '#f8ede0' }}>{agent.rating}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href={`/chat?agent=${agent.id}`}
                className="w-full px-6 py-3 rounded-md transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium relative overflow-hidden group"
                style={{
                  backgroundColor: '#f8ede0',
                  color: '#161823',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(248, 237, 224, 0.5), 0 10px 30px rgba(248, 237, 224, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 group-hover:animate-shimmer transition-opacity duration-500" 
                  style={{ transform: 'translateX(-100%)', animation: 'shimmer 2s infinite' }} 
                />
                <MessageCircle className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                Start Chat
              </Link>
              
              <button
                onClick={() => setShowSubscribeModal(true)}
                className="w-full px-6 py-3 rounded-md transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium relative overflow-hidden group"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #5d606c',
                  color: '#f8ede0',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#f8ede0';
                  e.currentTarget.style.backgroundColor = 'rgba(93, 96, 108, 0.3)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(248, 237, 224, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#5d606c';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}
              >
                <DollarSign className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                Buy Credits
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Custom Keyframes for Shimmer Effect */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Subscribe Modal */}
      <SubscribeModal
        isOpen={showSubscribeModal}
        onClose={() => setShowSubscribeModal(false)}
        agentId={String(agent.id)}
        agentName={agent.name}
        subscriptionPrice={agent.price}
      />
    </div>
  );
}