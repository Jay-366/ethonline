'use client';

import { Star, MessageCircle, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect, useId, useRef } from 'react';
import SubscribeModal from '@/components/agents/SubscribeModal';
import VaultBridgeModal from '@/components/vault/VaultBridgeModal';
import { InitNexusOnConnect } from '@/components/nexus/InitNexusOnConnect';
import CountUp from '@/components/ui/count-up';
import { useAccount } from 'wagmi';
import lighthouse from '@lighthouse-web3/sdk';

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

const GridPattern = ({ width, height, x, y, squares, ...props }: {
  width: number;
  height: number;
  x: string;
  y: string;
  squares?: number[][];
  [key: string]: unknown;
}) => {
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
          {squares.map((square, index: number) => {
            const [x, y] = square;
            return (
            <rect
              strokeWidth="0"
              key={`${x}-${y}-${index}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          )})}
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
  "bafybeidvv4y7gqpbrxlsmrueldzxipwkfz3v6xmtwpis4lu44feeggtyjm": {
    id: "bafybeidvv4y7gqpbrxlsmrueldzxipwkfz3v6xmtwpis4lu44feeggtyjm",
    name: 'Crypto Agent',
    category: 'Agent',
    rating: 4.3,
    reviews: 2236,
    price: '3 USDC/Sub',
    description: "I'm providing advanced cryptocurrency analysis and trading strategies quickly and professionally. I'll be happy to help you with your crypto trading.",
    longDescription: 'Crypto Agent providing advanced cryptocurrency analysis and trading strategies quickly and professionally ,agents represent the next generation of customer service automation. Built on advanced natural language processing, these agents can understand context, sentiment, and intent to provide personalized support across chat, email, and social media platforms. The system learns from each interaction to continuously improve response quality and customer satisfaction.',
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
  "bafybeig3k52cgqhvaatvstf7jhqmkxnpuqqme9cwjrmhs4x8de2qp9s7ei": {
    id: "bafybeig3k52cgqhvaatvstf7jhqmkxnpuqqme9cwjrmhs4x8de2qp9s7ei",
    name: 'Phala Network',
    category: 'Infrastructure',
    rating: 4.3,
    reviews: 2236,
    price: '15 USDC/Sub',
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
  "bafybeifh7vn89xk2pqlwrtc3mbf9g8sjkxnp6qqme8rwjrmh4sx8de2qp9": {
    id: "bafybeifh7vn89xk2pqlwrtc3mbf9g8sjkxnp6qqme8rwjrmh4sx8de2qp9",
    name: 'AgentOps',
    category: 'Development',
    rating: 4.3,
    reviews: 2236,
    price: '5 USDC/Sub',
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
  "bafybeiq9m3kx7p2vwrtf5jhqnpuqqme7cwjrmhs4x8de2qp9s7eifh7vn8": {
    id: "bafybeiq9m3kx7p2vwrtf5jhqnpuqqme7cwjrmhs4x8de2qp9s7eifh7vn8",
    name: 'Dify',
    category: 'Workflow',
    rating: 4.3,
    reviews: 2236,
    price: '8 USDC/Sub',
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
  "bafybeir2p9s7eifh7vn89xk2pqlwrtc3mbf9g8sjkxnpuqqme8rwjrmh4s": {
    id: "bafybeir2p9s7eifh7vn89xk2pqlwrtc3mbf9g8sjkxnpuqqme8rwjrmh4s",
    name: 'Oovol',
    category: 'Testing',
    rating: 4.3,
    reviews: 2236,
    price: '12 USDC/Sub',
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
  "bafybeisk2cgqhvaatvstf7jhqmkxnpuqqme9cwjrmhs4x8de2qp9s7eifh7": {
    id: "bafybeisk2cgqhvaatvstf7jhqmkxnpuqqme9cwjrmhs4x8de2qp9s7eifh7",
    name: 'Neets.ai',
    category: 'Voice',
    rating: 4.3,
    reviews: 2236,
    price: '7 USDC/Sub',
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
  "bafybeit7jhqmkxnpuqqme9cwjrmhs4x8de2qp9s7eifh7vn89xk2pqlwrt": {
    id: "bafybeit7jhqmkxnpuqqme9cwjrmhs4x8de2qp9s7eifh7vn89xk2pqlwrt",
    name: 'Potpie AI',
    category: 'Code Assistant',
    rating: 4.3,
    reviews: 2239,
    price: '9 USDC/Sub',
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
  "bafybeiu3mbf9g8sjkxnp6qqme8rwjrmh4sx8de2qp9s7eifh7vn89xk2pq": {
    id: "bafybeiu3mbf9g8sjkxnp6qqme8rwjrmh4sx8de2qp9s7eifh7vn89xk2pq",
    name: 'Jasper AI',
    category: 'Content',
    rating: 4.3,
    reviews: 2236,
    price: '12 USDC/Sub',
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
  "bafybeiv5jhqnpuqqme7cwjrmhs4x8de2qp9s7eifh7vn89xk2pqlwrtc3m": {
    id: "bafybeiv5jhqnpuqqme7cwjrmhs4x8de2qp9s7eifh7vn89xk2pqlwrtc3m",
    name: 'PrivateAI',
    category: 'Security',
    rating: 4.3,
    reviews: 2236,
    price: '6 USDC/Sub',
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
  "bafybeiw8sjkxnpuqqme9cwjrmhs4x8de2qp9s7eifh7vn89xk2pqlwrtc3": {
    id: "bafybeiw8sjkxnpuqqme9cwjrmhs4x8de2qp9s7eifh7vn89xk2pqlwrtc3",
    name: 'HyperWrite AI',
    category: 'Writing',
    rating: 4.3,
    reviews: 2239,
    price: '10 USDC/Sub',
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
  "bafybeix6qqme8rwjrmh4sx8de2qp9s7eifh7vn89xk2pqlwrtc3mbf9g8s": {
    id: "bafybeix6qqme8rwjrmh4sx8de2qp9s7eifh7vn89xk2pqlwrtc3mbf9g8s",
    name: 'Nelima',
    category: 'Analytics',
    rating: 4.3,
    reviews: 2236,
    price: '20 USDC/Sub',
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
  "bafybeiy9cwjrmhs4x8de2qp9s7eifh7vn89xk2pqlwrtc3mbf9g8sjkxnp": {
    id: "bafybeiy9cwjrmhs4x8de2qp9s7eifh7vn89xk2pqlwrtc3mbf9g8sjkxnp",
    name: 'Vapi',
    category: 'Voice',
    rating: 4.3,
    reviews: 2236,
    price: '12 USDC/Sub',
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
  const { address, connector } = useAccount();
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [decrypting, setDecrypting] = useState(false);
  const [decryptedFileUrl, setDecryptedFileUrl] = useState<string | null>(null);
  const [decryptedFileName, setDecryptedFileName] = useState<string | null>(null);
  const [decryptError, setDecryptError] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [statsBottom, setStatsBottom] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // Check if user has already subscribed (from sessionStorage - clears on refresh)
  useEffect(() => {
    const subscriptionKey = `subscribed_${agentId}`;
    
    // Detect if page was refreshed (F5, Ctrl+R, or browser refresh button)
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation && navigation.type === 'reload') {
      // Page was refreshed - clear subscription state
      sessionStorage.removeItem(subscriptionKey);
      setHasSubscribed(false);
    } else {
      // Normal navigation - check subscription state
      const isSubscribed = sessionStorage.getItem(subscriptionKey) === 'true';
      setHasSubscribed(isSubscribed);
    }
  }, [agentId]);

  // Handle successful subscription
  const handleSubscriptionSuccess = (txHash?: string) => {
    console.log('🎯 handleSubscriptionSuccess called with txHash:', txHash);
    
    const subscriptionKey = `subscribed_${agentId}`;
    sessionStorage.setItem(subscriptionKey, 'true');
    setHasSubscribed(true);
    setShowVaultModal(false); // Close the modal
    
    // Store transaction hash
    if (txHash) {
      console.log('💾 Storing transaction hash:', txHash);
      setTransactionHash(txHash);
    } else {
      console.warn('⚠️ No transaction hash provided to handleSubscriptionSuccess');
    }
    
    // Show success toast
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      setTransactionHash(null); // Clear hash when toast disappears
    }, 8000); // Hide after 8 seconds
    
    // Optional: Show success message
    console.log('🎉 Successfully subscribed to agent!', { txHash, hasTransactionHash: !!txHash });
  };

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
                subscribed
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
                <span className="text-sm" style={{ color: '#5d606c' }}>CID</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(String(agent.id));
                      // Optional: Add visual feedback here
                    }}
                    className="flex items-center justify-center w-5 h-5 rounded hover:bg-[#5d606c] transition-colors duration-200"
                    title="Copy CID"
                  >
                    <svg width="14px" height="14px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#5d606c' }}>
                      <path d="M19.4 20H9.6C9.26863 20 9 19.7314 9 19.4V9.6C9 9.26863 9.26863 9 9.6 9H19.4C19.7314 9 20 9.26863 20 9.6V19.4C20 19.7314 19.7314 20 19.4 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                      <path d="M15 9V4.6C15 4.26863 14.7314 4 14.4 4H4.6C4.26863 4 4 4.26863 4 4.6V14.4C4 14.7314 4.26863 15 4.6 15H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </button>
                  <span className="text-xs font-mono bg-gradient-to-r from-[#1C1F2B] to-[#161823] px-2 py-1 rounded border border-[#5d606c] max-w-[200px] truncate" style={{ color: '#f8ede0' }} title={String(agent.id)}>
                    {String(agent.id).slice(0, 12)}...{String(agent.id).slice(-8)}
                  </span>
                </div>
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
                href="/chat"
                className={`w-full px-6 py-3 rounded-md transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium relative overflow-hidden group ${
                  !hasSubscribed ? 'cursor-not-allowed opacity-50' : ''
                }`}
                style={{
                  backgroundColor: hasSubscribed ? '#f8ede0' : '#5d606c',
                  color: hasSubscribed ? '#161823' : '#9ca3af',
                  pointerEvents: hasSubscribed ? 'auto' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (hasSubscribed) {
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(248, 237, 224, 0.5), 0 10px 30px rgba(248, 237, 224, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (hasSubscribed) {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  }
                }}
                onClick={(e) => {
                  if (!hasSubscribed) {
                    e.preventDefault();
                  }
                }}
              >
                {hasSubscribed && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 group-hover:animate-shimmer transition-opacity duration-500" 
                    style={{ transform: 'translateX(-100%)', animation: 'shimmer 2s infinite' }} 
                  />
                )}
                <MessageCircle className={`w-4 h-4 ${hasSubscribed ? 'group-hover:rotate-12' : ''} transition-transform duration-300`} />
                {hasSubscribed ? 'Start Chat' : 'Subscribe to Chat'}
              </Link>
              
              <button
                onClick={() => setShowVaultModal(true)}
                disabled={hasSubscribed}
                className="w-full px-6 py-3 rounded-md transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium relative overflow-hidden group"
                style={{
                  backgroundColor: hasSubscribed ? '#10b981' : 'transparent',
                  border: hasSubscribed ? '1px solid #10b981' : '1px solid #5d606c',
                  color: hasSubscribed ? '#fff' : '#f8ede0',
                  cursor: hasSubscribed ? 'not-allowed' : 'pointer',
                  opacity: hasSubscribed ? 0.8 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!hasSubscribed) {
                    e.currentTarget.style.borderColor = '#f8ede0';
                    e.currentTarget.style.backgroundColor = 'rgba(93, 96, 108, 0.3)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(248, 237, 224, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!hasSubscribed) {
                    e.currentTarget.style.borderColor = '#5d606c';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  }
                }}
              >
                <DollarSign className={`w-4 h-4 ${!hasSubscribed ? 'group-hover:rotate-180' : ''} transition-transform duration-500`} />
                {hasSubscribed ? '✓ Subscribed' : 'Subscribe'}
              </button>
              {/* Decrypt button - calls server to get signed message, encryption key and attempt decrypt */}
              <button
                onClick={async () => {
                  // prevent double actions
                  if (decrypting || !hasSubscribed) return;
                  
                  // Check if wallet is connected
                  if (!address || !connector) {
                    setDecryptError('Please connect your wallet first');
                    return;
                  }
                  
                  setDecryptError(null);
                  setDecrypting(true);
                  
                  try {
                    console.log('🔐 Starting decrypt process...');
                    console.log('User address:', address);
                    
                    // Get auth message and sign it
                    const authResponse = await lighthouse.getAuthMessage(address);
                    if (!authResponse || !authResponse.data || !authResponse.data.message) {
                      throw new Error('Failed to get auth message from Lighthouse');
                    }
                    
                    console.log('📝 Auth message received, requesting signature...');
                    
                    // Request signature from user's wallet
                    const provider = await connector.getProvider() as { request?: (args: { method: string; params: string[] }) => Promise<string> };
                    if (!provider || !provider.request) {
                      throw new Error('Wallet provider not available');
                    }
                    
                    const userSignature = await provider.request({
                      method: 'personal_sign',
                      params: [authResponse.data.message, address],
                    });
                    
                    console.log('✍️ Signature obtained, calling decrypt API...');
                    
                    // Call decrypt API with user address and signature
                    const res = await fetch('/api/lighthouse', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        cid: String(agent.id), 
                        fileName: `${agent.name}.bin`,
                        userAddress: address,
                        userSignature: userSignature
                      }),
                    });
                    
                    const data = await res.json();
                    console.log('Decrypt API response:', data);
                    
                    if (!res.ok) {
                      // Provide more helpful error messages
                      let errorMsg = data?.error || 'Decrypt request failed';
                      
                      if (errorMsg.includes('Failed to get encryption key')) {
                        errorMsg = 'Access denied. You need at least 0.5 FormDataCoin tokens on Sepolia to decrypt this file. Subscribe to the agent first!';
                      }
                      
                      throw new Error(errorMsg);
                    }

                    if (data.fileBase64) {
                      console.log('✅ File decrypted successfully!');
                      // convert base64 to blob and create object URL
                      const b64 = data.fileBase64 as string;
                      const binary = atob(b64);
                      const len = binary.length;
                      const bytes = new Uint8Array(len);
                      for (let i = 0; i < len; i++) {
                        bytes[i] = binary.charCodeAt(i);
                      }
                      const blob = new Blob([bytes], { type: data.mimeType || 'application/octet-stream' });
                      const url = URL.createObjectURL(blob);
                      setDecryptedFileUrl(url);
                      setDecryptedFileName(data.fileName || `${agent.name}.bin`);
                    } else if (data.encryptionKey) {
                      // Received encryption key but server didn't decrypt file
                      setDecryptError('Encryption key returned (no server-side decrypt available).');
                      // Optionally copy key to clipboard for manual decryption
                      try { await navigator.clipboard.writeText(String(data.encryptionKey)); } catch { /* ignore */ }
                    } else {
                      setDecryptError('Decrypt endpoint returned no file and no key.');
                    }
                  } catch (err: unknown) {
                    console.error('❌ Decrypt error:', err);
                    setDecryptError(err instanceof Error ? err.message : String(err));
                  } finally {
                    setDecrypting(false);
                  }
                }}
                disabled={!hasSubscribed || !address || decrypting}
                className={`w-full mt-2 px-6 py-3 rounded-md transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium relative overflow-hidden group ${
                  !hasSubscribed ? 'cursor-not-allowed opacity-50' : ''
                }`}
                style={{
                  backgroundColor: hasSubscribed ? 'transparent' : '#5d606c',
                  border: hasSubscribed ? '1px solid #5d606c' : '1px solid #5d606c',
                  color: hasSubscribed ? '#f8ede0' : '#9ca3af',
                }}
                onMouseEnter={(e) => {
                  if (hasSubscribed && !decrypting) {
                    e.currentTarget.style.borderColor = '#f8ede0';
                    e.currentTarget.style.backgroundColor = 'rgba(93, 96, 108, 0.3)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(248, 237, 224, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (hasSubscribed && !decrypting) {
                    e.currentTarget.style.borderColor = '#5d606c';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  }
                }}
                title={!hasSubscribed ? "Subscribe to decrypt" : !address ? "Connect wallet first" : "Decrypt file"}
              >
                {decrypting ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                )}
                {decrypting ? 'Decrypting...' : !hasSubscribed ? 'Subscribe to Decrypt' : 'Decrypt'}
              </button>

              {/* Download button shown when decrypted file is available */}
              {decryptedFileUrl && (
                <a
                  href={decryptedFileUrl}
                  download={decryptedFileName ?? `${agent.name}.bin`}
                  className="w-full mt-2 inline-block text-center px-6 py-3 rounded-md bg-[#f8ede0] text-[#161823] font-medium"
                >
                  Download Decrypted File
                </a>
              )}

              {decryptError && (
                <div className="text-xs text-red-400 mt-2">{decryptError}</div>
              )}
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

      {/* Vault Bridge Modal */}
      <VaultBridgeModal
        isOpen={showVaultModal}
        onClose={() => setShowVaultModal(false)}
        onSubscriptionSuccess={handleSubscriptionSuccess}
      />

      {/* Success Toast Notification - Top Right */}
      {showSuccessToast && (
        <div 
          className="fixed top-8 right-8 z-50 px-6 py-4 rounded-xl animate-slide-down shadow-2xl max-w-md"
          style={{
            backgroundColor: '#10b981',
            color: '#fff',
            boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
          }}
        >
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-semibold mb-1">Subscription Successful!</div>
              <div className="text-sm opacity-90 mb-2">You can now start chatting with the agent</div>
              {transactionHash ? (
                <a
                  href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-white text-green-600 font-medium hover:bg-opacity-90 transition-all"
                >
                  View on Etherscan →
                </a>
              ) : (
                <div className="text-xs opacity-75">Processing transaction...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Animation CSS */}
      <style jsx global>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}