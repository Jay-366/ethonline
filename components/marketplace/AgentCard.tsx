import { Star, TrendingUp } from 'lucide-react';
import PricingBadge from './PricingBadge';

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

interface AgentCardProps {
  agent: Agent;
  onSelect: (agent: Agent) => void;
}

export default function AgentCard({ agent, onSelect }: AgentCardProps) {
  return (
    <div 
      className="p-6 rounded-3xl transition-all duration-200 cursor-pointer"
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
      <div className="flex justify-between mb-4">
        {agent.trending && (
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
        )}
        <span 
          className="text-sm px-3 py-1 rounded-lg"
          style={{
            backgroundColor: 'rgba(80, 96, 108, 0.3)',
            color: '#FBede0',
          }}
        >
          {agent.category}
        </span>
      </div>
      
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
        <button
          onClick={() => onSelect(agent)}
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
        </button>
      </div>
    </div>
  );
}
